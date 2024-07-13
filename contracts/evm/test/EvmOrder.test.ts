import { AbiCoder, parseEther, solidityPacked, ZeroAddress } from "ethers"
import { ethers } from 'hardhat';

import {
    LZEndpointMock,
    LZEndpointMock__factory,
    MockERC20,
    MockERC20__factory,
    MockSettlement,
    MockSettlement__factory
} from "../types"
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers"
import { expect } from "chai";
import { CrossChainOrder, getHash, getOrder, padAddress } from "./utils";
import { getPackedSig } from "./utils/signature_utils";

describe("EvmOrder: ", function () {
    const localChainId = 1
    const remoteChainId = 2

    let localEndpoint: LZEndpointMock
    let remoteEndpoint: LZEndpointMock
    let remotePath, localPath
    let owner: SignerWithAddress;
    let swapper: SignerWithAddress;
    let solver: SignerWithAddress
    let fakeSolver: SignerWithAddress
    let thief: SignerWithAddress
    let fakeSolverAddress: string
    let ownerAddress: string;
    let thiefAddress: string;
    let swapperAddress: string;
    let solverAddress: string
    let localErc20: MockERC20
    let remoteErc20: MockERC20

    let localSettlement: MockSettlement
    let remoteSettlement: MockSettlement

    let localSettlementAddress: string
    let remoteSettlementAddress: string

    let localErc20Address: string
    let remoteErc20Address: string
    let abiCoder: AbiCoder
    let localEndpointAddress: string
    let remoteEndpointAddress: string

    let defaultAdapterParams = solidityPacked(["uint16", "uint256"], [1, 200000])

    before(async function () {
        [owner, swapper, solver, fakeSolver, thief] = await ethers.getSigners();
        ownerAddress = await owner.getAddress();
        swapperAddress = await swapper.getAddress();
        solverAddress = await solver.getAddress()
        fakeSolverAddress = await fakeSolver.getAddress()
        thiefAddress = await thief.getAddress()
        abiCoder = (new ethers.AbiCoder())
    })

    beforeEach(async function () {
        localEndpoint = await new LZEndpointMock__factory(owner).deploy(localChainId)
        remoteEndpoint = await new LZEndpointMock__factory(owner).deploy(remoteChainId)
        localEndpointAddress = await localEndpoint.getAddress()
        remoteEndpointAddress = await remoteEndpoint.getAddress()


        localSettlement = await new MockSettlement__factory(owner).deploy(localEndpoint)
        remoteSettlement = await new MockSettlement__factory(owner).deploy(remoteEndpoint)
        await localSettlement.mockSetChainId(localChainId)
        await remoteSettlement.mockSetChainId(remoteChainId)
        localSettlementAddress = await localSettlement.getAddress()
        remoteSettlementAddress = await remoteSettlement.getAddress()

        // create two OmnichainFungibleToken instances
        localErc20 = await new MockERC20__factory(owner).deploy("ERC20", "ERC20", 18)
        localErc20Address = await localErc20.getAddress()
        remoteErc20 = await new MockERC20__factory(owner).deploy("ERC20", "ERC20", 18)
        remoteErc20Address = await remoteErc20.getAddress()

        // internal bookkeeping for endpoints (not part of a real deploy, just for this test)
        await localEndpoint.setDestLzEndpoint(remoteSettlementAddress, remoteEndpointAddress)
        await remoteEndpoint.setDestLzEndpoint(localSettlementAddress, localEndpointAddress)

        // set each contracts source address so it can send to each other
        remotePath = solidityPacked(["address", "address"], [remoteSettlementAddress, localSettlementAddress])
        localPath = solidityPacked(["address", "address"], [localSettlementAddress, remoteSettlementAddress])

        await localSettlement.setMinDstGas(remoteChainId, 0, 200000)
        await localSettlement.setMinDstGas(remoteChainId, 1, 200000)
        await remoteSettlement.setMinDstGas(localChainId, 0, 200000)
        await remoteSettlement.setMinDstGas(localChainId, 1, 200000)

        await localSettlement.setTrustedRemote(remoteChainId, remotePath) // for A, set B
        await remoteSettlement.setTrustedRemote(localChainId, localPath) // for B, set A
    })


    it("verify order hash", async function () {
        const order: CrossChainOrder = getOrder()
        const hash = getHash(order)
        const onChainHash = await localSettlement.getOrderHash(order)
        expect(hash).to.equal(onChainHash)
    })

    it("verify order signature succeeds", async function () {
        const order: CrossChainOrder = getOrder({
            swapper: padAddress(swapperAddress),
            originChainId: localChainId
        })
        const hash = getHash(order)
        const vrsSig = await getPackedSig(hash, swapper)

        await localSettlement.verifySignature(
            hash,
            order.swapper,
            vrsSig
        )
    })

    it("verify malicous order signature fails", async function () {
        const order: CrossChainOrder = getOrder({
            swapper: padAddress(swapperAddress),
            originChainId: localChainId
        })
        const hash = getHash(order)
        const vrsSig = await getPackedSig(hash, swapper)

        try {
            // amend something in the order
            const falseHash = getHash({ ...order, originChainId: 99 })
            await localSettlement.verifySignature(
                falseHash,
                order.swapper,
                vrsSig
            )
            expect(true).to.equals(false, "did not revert")
        } catch (e: any) { }
    })

    it("fill x-chain order converntionally", async function () {
        const sellAmount = parseEther("1.00000001") // 1 ether
        const userBalance = sellAmount * 2n
        const buyAmount = parseEther("0.50000001") // 1 ether


        await localErc20.mint(swapperAddress, userBalance)
        await remoteErc20.mint(solverAddress, buyAmount)

        // verify alice has tokens and bob has no tokens on remote chain
        expect(await localErc20.balanceOf(swapperAddress)).to.be.equal(userBalance)
        expect(await remoteErc20.balanceOf(solverAddress)).to.be.equal(buyAmount)

        // define order
        const order: CrossChainOrder = getOrder({
            swapper: padAddress(swapperAddress),
            originChainId: localChainId,
            originToken: padAddress(localErc20Address),
            destinationToken: padAddress(remoteErc20Address),
            destinationReceiver: padAddress(swapperAddress),
            originAmount: sellAmount,
            destinationAmount: buyAmount,
            destinationChainId: remoteChainId
        })
        const hash = getHash(order)

        // swapper signs order on origin chai
        const signature = await getPackedSig(hash, swapper)

        // swapper needs to approve settlement
        localErc20.connect(swapper).approve(
            localSettlementAddress,
            userBalance
        )
        console.log("initiate")
        // solver initiates solving
        await localSettlement.connect(solver).initiate(
            order,
            signature,
            '0x'
        )
        // we test that it cannot be initaited twice
        try {
            await localSettlement.connect(fakeSolver).initiate(
                order,
                signature,
                '0x'
            )
            expect(true).to.equal(false, "should have reverted")
        } catch (e: any) { }

        // solver needs to approve remote settlement
        remoteErc20.connect(solver).approve(
            remoteSettlementAddress,
            buyAmount
        )

        let nativeFee = (await localSettlement.estimateSendFee(
            remoteChainId,
            padAddress(solverAddress),
            hash,
            false,
            defaultAdapterParams
        )
        ).nativeFee

        console.log("settle")
        await remoteSettlement.connect(solver).settle(
            padAddress(solverAddress),
            order,
            defaultAdapterParams,
            { value: nativeFee }
        )

        const balanceSwapperDestination = await remoteErc20.balanceOf(swapperAddress)
        const balanceSolverOrigin = await localErc20.balanceOf(solverAddress)

        // verify that the swapper receives their amount
        expect(balanceSwapperDestination).to.equal(buyAmount)
        // verify that the solver receives the amount from the swapper
        expect(balanceSolverOrigin).to.equal(sellAmount)

        // test that it cannot be filled twice
        try {
            await remoteErc20.mint(fakeSolverAddress, buyAmount)
            remoteErc20.connect(fakeSolver).approve(
                remoteSettlementAddress,
                buyAmount
            )
            await remoteSettlement.connect(fakeSolver).settle(
                padAddress(fakeSolverAddress),
                order,
                defaultAdapterParams
            )
            expect(true).to.equal(false, "should have reverted")
        } catch (e: any) { }

    })
})
