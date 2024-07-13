import { AbiCoder, MaxUint256, parseEther, solidityPacked, ZeroAddress } from "ethers"
import { ethers } from 'hardhat';

import { LZEndpointMock, LZEndpointMock__factory, MockERC20, MockERC20__factory, OFTV2, OFTV2__factory, ProxyOFTV2, ProxyOFTV2__factory } from "../types"
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers"
import { expect } from "chai";

describe("OFT v2: ", function () {
    const localChainId = 1
    const remoteChainId = 2
    const name = "OmnichainFungibleToken"
    const symbol = "OFT"
    const sharedDecimals = 5
    // const globalSupply = parseUnits("1000000", 18)

    let localEndpoint: LZEndpointMock
    let remoteEndpoint: LZEndpointMock
    let remotePath, localPath
    let owner: SignerWithAddress;
    let alice: SignerWithAddress;
    let bob: SignerWithAddress
    let ownerAddress: string;
    let aliceAddress: string;
    let bobAddress: string
    let localOFT: ProxyOFTV2
    let remoteOFT: OFTV2
    let erc20: MockERC20

    let localOFTAddress: string
    let remoteOFTAddress: string
    let erc20Address: string
    let abiCoder: AbiCoder
    let localEndpointAddress: string
    let remoteEndpointAddress: string

    let defaultAdapterParams = solidityPacked(["uint16", "uint256"], [1, 200000])

    before(async function () {
        [owner, alice, bob] = await ethers.getSigners();
        ownerAddress = await owner.getAddress();
        aliceAddress = await alice.getAddress();
        bobAddress = await bob.getAddress()
        abiCoder = (new ethers.AbiCoder())
    })

    beforeEach(async function () {
        localEndpoint = await new LZEndpointMock__factory(owner).deploy(localChainId)
        remoteEndpoint = await new LZEndpointMock__factory(owner).deploy(remoteChainId)
        localEndpointAddress = await localEndpoint.getAddress()
        remoteEndpointAddress = await remoteEndpoint.getAddress()

        // create two OmnichainFungibleToken instances
        erc20 = await new MockERC20__factory(owner).deploy("ERC20", "ERC20", 18)
        erc20Address = await erc20.getAddress()
        localOFT = await new ProxyOFTV2__factory(owner).deploy(erc20Address, sharedDecimals, localEndpointAddress)
        remoteOFT = await new OFTV2__factory(owner).deploy(name, symbol, sharedDecimals, remoteEndpointAddress)
        localOFTAddress = await localOFT.getAddress()
        remoteOFTAddress = await remoteOFT.getAddress()

        // internal bookkeeping for endpoints (not part of a real deploy, just for this test)
        await localEndpoint.setDestLzEndpoint(remoteOFTAddress, remoteEndpointAddress)
        await remoteEndpoint.setDestLzEndpoint(localOFTAddress, localEndpointAddress)

        // set each contracts source address so it can send to each other
        remotePath = solidityPacked(["address", "address"], [remoteOFTAddress, localOFTAddress])
        localPath = solidityPacked(["address", "address"], [localOFTAddress, remoteOFTAddress])

        await localOFT.setMinDstGas(remoteChainId, 0, 200000)
        await localOFT.setMinDstGas(remoteChainId, 1, 200000)
        await remoteOFT.setMinDstGas(localChainId, 0, 200000)
        await remoteOFT.setMinDstGas(localChainId, 1, 200000)

        await localOFT.setTrustedRemote(remoteChainId, remotePath) // for A, set B
        await remoteOFT.setTrustedRemote(localChainId, localPath) // for B, set A
    })

    it("send tokens from proxy oft and receive them back", async function () {
        const initialAmount = parseEther("1.00000001") // 1 ether
        const amount = parseEther("1.00000000")
        const dust = parseEther("0.00000001")
        await erc20.mint(aliceAddress, initialAmount)

        // verify alice has tokens and bob has no tokens on remote chain
        expect(await erc20.balanceOf(aliceAddress)).to.be.equal(initialAmount)
        expect(await remoteOFT.balanceOf(bobAddress)).to.be.equal(0)

        // alice sends tokens to bob on remote chain
        // approve the proxy to swap your tokens
        await erc20.connect(alice).approve(localOFTAddress, initialAmount)

        // swaps token to remote chain
        const bobAddressBytes32 = (new ethers.AbiCoder()).encode(["address"], [bobAddress])
        let nativeFee = (await localOFT.estimateSendFee(remoteChainId, bobAddressBytes32, initialAmount, false, defaultAdapterParams)).nativeFee
        await localOFT
            .connect(alice)
            .sendFrom(
                aliceAddress,
                remoteChainId,
                bobAddressBytes32,
                initialAmount,
                [aliceAddress, ZeroAddress, defaultAdapterParams] as any,
                { value: nativeFee }
            )

        // tokens are now owned by the proxy contract, because this is the original oft chain
        expect(await erc20.balanceOf(localOFTAddress)).to.equal(amount)
        expect(await erc20.balanceOf(aliceAddress)).to.equal(dust)

        // tokens received on the remote chain
        expect(await remoteOFT.totalSupply()).to.equal(amount)
        expect(await remoteOFT.balanceOf(bobAddress)).to.be.equal(amount)

        // bob send tokens back to alice from remote chain
        const aliceAddressBytes32 = abiCoder.encode(["address"], [aliceAddress])
        const halfAmount = amount / 2n
        nativeFee = (await remoteOFT.estimateSendFee(localChainId, aliceAddressBytes32, halfAmount, false, defaultAdapterParams)).nativeFee
        await remoteOFT
            .connect(bob)
            .sendFrom(
                bobAddress,
                localChainId,
                aliceAddressBytes32,
                halfAmount,
                [bobAddress, ZeroAddress, defaultAdapterParams] as any,
                { value: nativeFee }
            )

        // half tokens are burned on the remote chain
        expect(await remoteOFT.totalSupply()).to.equal(halfAmount)
        expect(await remoteOFT.balanceOf(bobAddress)).to.be.equal(halfAmount)

        // tokens received on the local chain and unlocked from the proxy
        expect(await erc20.balanceOf(localOFTAddress)).to.be.equal(halfAmount)
        // console.log(halfAmount, dust, typeof halfAmount, typeof dust)
        // console.log(halfAmount.add(dust), typeof halfAmount.add(dust))
        expect(await erc20.balanceOf(aliceAddress)).to.be.equal(halfAmount + dust)
    })

    it("total outbound amount overflow", async function () {
        // alice try sending a huge amount of tokens to bob on remote chain
        await erc20.mint(aliceAddress, MaxUint256)

        const maxUint64 = 2n ** 64n - 1n // BigNumber.from(2).pow(64).sub(1)
        let amount = maxUint64 * (10n ** (18n - BigInt(sharedDecimals))) //.mul(BigNumber.from(10).pow(18 - sharedDecimals)) // sd to ld

        // swaps max amount of token to remote chain
        await erc20.connect(alice).approve(localOFTAddress, MaxUint256)
        const bobAddressBytes32 = abiCoder.encode(["address"], [bobAddress])
        let nativeFee = (await localOFT.estimateSendFee(remoteChainId, bobAddressBytes32, amount, false, defaultAdapterParams)).nativeFee
        await localOFT
            .connect(alice)
            .sendFrom(
                aliceAddress,
                remoteChainId,
                bobAddressBytes32,
                amount,
                [aliceAddress, ZeroAddress, defaultAdapterParams] as any,
                { value: nativeFee }
            )

        amount = 10n ** (18n - BigInt(sharedDecimals)) // min amount without dust

        // fails to send more for cap overflow
        nativeFee = (await localOFT.estimateSendFee(remoteChainId, bobAddressBytes32, amount, false, defaultAdapterParams)).nativeFee

        try {
            await localOFT
                .connect(alice)
                .sendFrom(
                    aliceAddress,
                    remoteChainId,
                    bobAddressBytes32,
                    amount,
                    [aliceAddress, ZeroAddress, defaultAdapterParams] as any,
                    { value: nativeFee }
                )
            expect(false).to.be.true
        } catch (e: any) {
            expect(e.message).to.match(/ProxyOFT: outboundAmount overflow/)
        }
    })
})
