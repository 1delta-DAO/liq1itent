import { AbiCoder, MaxUint256, parseEther, solidityPacked, ZeroAddress } from "ethers"
import { ethers } from 'hardhat';

import { FillerOracle, FillerOracle__factory, LZEndpointMock, LZEndpointMock__factory, MockERC20, MockERC20__factory, OFTV2, OFTV2__factory, ProxyOFTV2, ProxyOFTV2__factory, Settlement, Settlement__factory } from "../types"
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers"
import { expect } from "chai";

describe("EvmOrder: ", function () {
    const localChainId = 1
    const remoteChainId = 2

    let localEndpoint: LZEndpointMock
    let remoteEndpoint: LZEndpointMock
    let remotePath, localPath
    let owner: SignerWithAddress;
    let swapper: SignerWithAddress;
    let solver: SignerWithAddress
    let ownerAddress: string;
    let swapperAddress: string;
    let solverAddress: string
    let localErc20: MockERC20
    let remoteErc20: MockERC20

    let localSettlement: Settlement
    let remoteSettlement: Settlement

    let localFillerOracle: FillerOracle
    let remoteFillerOracle: FillerOracle

    let localSettlementAddress: string
    let remoteSettlementAddress: string

    let localFillerOracleAddress: string
    let remoteFillerOracleAddress: string

    let localErc20Address: string
    let remoteErc20Address: string
    let abiCoder: AbiCoder
    let localEndpointAddress: string
    let remoteEndpointAddress: string

    let defaultAdapterParams = solidityPacked(["uint16", "uint256"], [1, 200000])

    before(async function () {
        [owner, swapper, solver] = await ethers.getSigners();
        ownerAddress = await owner.getAddress();
        swapperAddress = await swapper.getAddress();
        solverAddress = await solver.getAddress()
        abiCoder = (new ethers.AbiCoder())
    })

    beforeEach(async function () {
        localEndpoint = await new LZEndpointMock__factory(owner).deploy(localChainId)
        remoteEndpoint = await new LZEndpointMock__factory(owner).deploy(remoteChainId)
        localEndpointAddress = await localEndpoint.getAddress()
        remoteEndpointAddress = await remoteEndpoint.getAddress()


        localSettlement = await new Settlement__factory(owner).deploy(localEndpoint)
        remoteSettlement = await new Settlement__factory(owner).deploy(remoteEndpoint)
        localSettlementAddress = await localSettlement.getAddress()
        remoteSettlementAddress = await remoteSettlement.getAddress()

        localFillerOracle = await new FillerOracle__factory(owner).deploy(localSettlementAddress, localEndpointAddress)
        remoteFillerOracle = await new FillerOracle__factory(owner).deploy(remoteSettlementAddress, remoteEndpointAddress)

        localFillerOracleAddress = await localFillerOracle.getAddress()
        remoteFillerOracleAddress = await remoteFillerOracle.getAddress()

        await localSettlement.inititalize(localFillerOracleAddress, ownerAddress)
        await remoteSettlement.inititalize(remoteFillerOracleAddress, ownerAddress)

        // create two OmnichainFungibleToken instances
        localErc20 = await new MockERC20__factory(owner).deploy("ERC20", "ERC20", 18)
        localErc20Address = await localErc20.getAddress()
        remoteErc20 = await new MockERC20__factory(owner).deploy("ERC20", "ERC20", 18)
        remoteErc20Address = await remoteErc20.getAddress()

        // internal bookkeeping for endpoints (not part of a real deploy, just for this test)
        await localEndpoint.setDestLzEndpoint(remoteFillerOracleAddress, remoteEndpointAddress)
        await remoteEndpoint.setDestLzEndpoint(localFillerOracleAddress, localEndpointAddress)

        // set each contracts source address so it can send to each other
        remotePath = solidityPacked(["address", "address"], [remoteSettlementAddress, localFillerOracleAddress])
        localPath = solidityPacked(["address", "address"], [localSettlementAddress, remoteFillerOracleAddress])

        await localSettlement.setMinDstGas(remoteChainId, 0, 200000)
        await localSettlement.setMinDstGas(remoteChainId, 1, 200000)
        await remoteSettlement.setMinDstGas(localChainId, 0, 200000)
        await remoteSettlement.setMinDstGas(localChainId, 1, 200000)

        await localSettlement.setTrustedRemote(remoteChainId, remotePath) // for A, set B
        await remoteSettlement.setTrustedRemote(localChainId, localPath) // for B, set A
    })

    it("verify order signature succeeds", async function () {

    })

    it("verify malicous order signature fails", async function () {

    })

    it("fill x-chain order converntionally", async function () {
        const sellAmount = parseEther("1.00000001") // 1 ether

        await localErc20.mint(swapperAddress, sellAmount)

        // verify alice has tokens and bob has no tokens on remote chain
        expect(await localErc20.balanceOf(swapperAddress)).to.be.equal(sellAmount)
        expect(await remoteErc20.balanceOf(solverAddress)).to.be.equal(0)

        // // alice sends tokens to bob on remote chain
        // // approve the proxy to swap your tokens
        // await localErc20.connect(swapper).approve(localOFTAddress, initialAmount)

        // // swaps token to remote chain
        // const bobAddressBytes32 = (new ethers.AbiCoder()).encode(["address"], [solverAddress])
        // let nativeFee = (await localOFT.estimateSendFee(remoteChainId, bobAddressBytes32, initialAmount, false, defaultAdapterParams)).nativeFee
        // await localOFT
        //     .connect(swapper)
        //     .sendFrom(
        //         swapperAddress,
        //         remoteChainId,
        //         bobAddressBytes32,
        //         initialAmount,
        //         [swapperAddress, ZeroAddress, defaultAdapterParams] as any,
        //         { value: nativeFee }
        //     )

        // // tokens are now owned by the proxy contract, because this is the original oft chain
        // expect(await localErc20.balanceOf(localOFTAddress)).to.equal(amount)
        // expect(await localErc20.balanceOf(swapperAddress)).to.equal(dust)

        // // tokens received on the remote chain
        // expect(await remoteOFT.totalSupply()).to.equal(amount)
        // expect(await remoteOFT.balanceOf(solverAddress)).to.be.equal(amount)

        // // bob send tokens back to alice from remote chain
        // const aliceAddressBytes32 = abiCoder.encode(["address"], [swapperAddress])
        // const halfAmount = amount / 2n
        // nativeFee = (await remoteOFT.estimateSendFee(localChainId, aliceAddressBytes32, halfAmount, false, defaultAdapterParams)).nativeFee
        // await remoteOFT
        //     .connect(solver)
        //     .sendFrom(
        //         solverAddress,
        //         localChainId,
        //         aliceAddressBytes32,
        //         halfAmount,
        //         [solverAddress, ZeroAddress, defaultAdapterParams] as any,
        //         { value: nativeFee }
        //     )

        // // half tokens are burned on the remote chain
        // expect(await remoteOFT.totalSupply()).to.equal(halfAmount)
        // expect(await remoteOFT.balanceOf(solverAddress)).to.be.equal(halfAmount)

        // // tokens received on the local chain and unlocked from the proxy
        // expect(await localErc20.balanceOf(localOFTAddress)).to.be.equal(halfAmount)
        // // console.log(halfAmount, dust, typeof halfAmount, typeof dust)
        // // console.log(halfAmount.add(dust), typeof halfAmount.add(dust))
        // expect(await localErc20.balanceOf(swapperAddress)).to.be.equal(halfAmount + dust)
    })
})
