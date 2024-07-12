/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  DeployContractOptions,
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomicfoundation/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "IERC1155Errors",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC1155Errors__factory>;
    getContractFactory(
      name: "IERC20Errors",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Errors__factory>;
    getContractFactory(
      name: "IERC721Errors",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC721Errors__factory>;
    getContractFactory(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC20__factory>;
    getContractFactory(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Metadata__factory>;
    getContractFactory(
      name: "IERC20Permit",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20Permit__factory>;
    getContractFactory(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC20__factory>;
    getContractFactory(
      name: "SafeERC20",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SafeERC20__factory>;
    getContractFactory(
      name: "Address",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Address__factory>;
    getContractFactory(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ERC165__factory>;
    getContractFactory(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IERC165__factory>;
    getContractFactory(
      name: "ReentrancyGuard",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ReentrancyGuard__factory>;
    getContractFactory(
      name: "OrderSig",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OrderSig__factory>;
    getContractFactory(
      name: "ILayerZeroEndpoint",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ILayerZeroEndpoint__factory>;
    getContractFactory(
      name: "ILayerZeroReceiver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ILayerZeroReceiver__factory>;
    getContractFactory(
      name: "ILayerZeroUserApplicationConfig",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ILayerZeroUserApplicationConfig__factory>;
    getContractFactory(
      name: "LzApp",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LzApp__factory>;
    getContractFactory(
      name: "LZEndpointMock",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LZEndpointMock__factory>;
    getContractFactory(
      name: "NonblockingLzApp",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.NonblockingLzApp__factory>;
    getContractFactory(
      name: "BaseOFTV2",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BaseOFTV2__factory>;
    getContractFactory(
      name: "BaseOFTWithFee",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BaseOFTWithFee__factory>;
    getContractFactory(
      name: "Fee",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Fee__factory>;
    getContractFactory(
      name: "IOFTWithFee",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IOFTWithFee__factory>;
    getContractFactory(
      name: "NativeOFTWithFee",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.NativeOFTWithFee__factory>;
    getContractFactory(
      name: "OFTWithFee",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OFTWithFee__factory>;
    getContractFactory(
      name: "ProxyOFTWithFee",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ProxyOFTWithFee__factory>;
    getContractFactory(
      name: "ICommonOFT",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ICommonOFT__factory>;
    getContractFactory(
      name: "IOFTReceiverV2",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IOFTReceiverV2__factory>;
    getContractFactory(
      name: "IOFTV2",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IOFTV2__factory>;
    getContractFactory(
      name: "OFTStakingMockV2",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OFTStakingMockV2__factory>;
    getContractFactory(
      name: "OFTV2Mock",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OFTV2Mock__factory>;
    getContractFactory(
      name: "NativeOFTV2",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.NativeOFTV2__factory>;
    getContractFactory(
      name: "OFTCoreV2",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OFTCoreV2__factory>;
    getContractFactory(
      name: "OFTV2",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.OFTV2__factory>;
    getContractFactory(
      name: "ProxyOFTV2",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ProxyOFTV2__factory>;

    getContractAt(
      name: "Ownable",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "IERC1155Errors",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC1155Errors>;
    getContractAt(
      name: "IERC20Errors",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Errors>;
    getContractAt(
      name: "IERC721Errors",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC721Errors>;
    getContractAt(
      name: "ERC20",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC20>;
    getContractAt(
      name: "IERC20Metadata",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Metadata>;
    getContractAt(
      name: "IERC20Permit",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20Permit>;
    getContractAt(
      name: "IERC20",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC20>;
    getContractAt(
      name: "SafeERC20",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.SafeERC20>;
    getContractAt(
      name: "Address",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Address>;
    getContractAt(
      name: "ERC165",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ERC165>;
    getContractAt(
      name: "IERC165",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IERC165>;
    getContractAt(
      name: "ReentrancyGuard",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ReentrancyGuard>;
    getContractAt(
      name: "OrderSig",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.OrderSig>;
    getContractAt(
      name: "ILayerZeroEndpoint",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ILayerZeroEndpoint>;
    getContractAt(
      name: "ILayerZeroReceiver",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ILayerZeroReceiver>;
    getContractAt(
      name: "ILayerZeroUserApplicationConfig",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ILayerZeroUserApplicationConfig>;
    getContractAt(
      name: "LzApp",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.LzApp>;
    getContractAt(
      name: "LZEndpointMock",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.LZEndpointMock>;
    getContractAt(
      name: "NonblockingLzApp",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.NonblockingLzApp>;
    getContractAt(
      name: "BaseOFTV2",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.BaseOFTV2>;
    getContractAt(
      name: "BaseOFTWithFee",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.BaseOFTWithFee>;
    getContractAt(
      name: "Fee",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Fee>;
    getContractAt(
      name: "IOFTWithFee",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IOFTWithFee>;
    getContractAt(
      name: "NativeOFTWithFee",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.NativeOFTWithFee>;
    getContractAt(
      name: "OFTWithFee",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.OFTWithFee>;
    getContractAt(
      name: "ProxyOFTWithFee",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ProxyOFTWithFee>;
    getContractAt(
      name: "ICommonOFT",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ICommonOFT>;
    getContractAt(
      name: "IOFTReceiverV2",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IOFTReceiverV2>;
    getContractAt(
      name: "IOFTV2",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.IOFTV2>;
    getContractAt(
      name: "OFTStakingMockV2",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.OFTStakingMockV2>;
    getContractAt(
      name: "OFTV2Mock",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.OFTV2Mock>;
    getContractAt(
      name: "NativeOFTV2",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.NativeOFTV2>;
    getContractAt(
      name: "OFTCoreV2",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.OFTCoreV2>;
    getContractAt(
      name: "OFTV2",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.OFTV2>;
    getContractAt(
      name: "ProxyOFTV2",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ProxyOFTV2>;

    deployContract(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Ownable>;
    deployContract(
      name: "IERC1155Errors",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC1155Errors>;
    deployContract(
      name: "IERC20Errors",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20Errors>;
    deployContract(
      name: "IERC721Errors",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC721Errors>;
    deployContract(
      name: "ERC20",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC20>;
    deployContract(
      name: "IERC20Metadata",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20Metadata>;
    deployContract(
      name: "IERC20Permit",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20Permit>;
    deployContract(
      name: "IERC20",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20>;
    deployContract(
      name: "SafeERC20",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SafeERC20>;
    deployContract(
      name: "Address",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Address>;
    deployContract(
      name: "ERC165",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC165>;
    deployContract(
      name: "IERC165",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC165>;
    deployContract(
      name: "ReentrancyGuard",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ReentrancyGuard>;
    deployContract(
      name: "OrderSig",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OrderSig>;
    deployContract(
      name: "ILayerZeroEndpoint",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ILayerZeroEndpoint>;
    deployContract(
      name: "ILayerZeroReceiver",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ILayerZeroReceiver>;
    deployContract(
      name: "ILayerZeroUserApplicationConfig",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ILayerZeroUserApplicationConfig>;
    deployContract(
      name: "LzApp",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.LzApp>;
    deployContract(
      name: "LZEndpointMock",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.LZEndpointMock>;
    deployContract(
      name: "NonblockingLzApp",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.NonblockingLzApp>;
    deployContract(
      name: "BaseOFTV2",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.BaseOFTV2>;
    deployContract(
      name: "BaseOFTWithFee",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.BaseOFTWithFee>;
    deployContract(
      name: "Fee",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Fee>;
    deployContract(
      name: "IOFTWithFee",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IOFTWithFee>;
    deployContract(
      name: "NativeOFTWithFee",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.NativeOFTWithFee>;
    deployContract(
      name: "OFTWithFee",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OFTWithFee>;
    deployContract(
      name: "ProxyOFTWithFee",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ProxyOFTWithFee>;
    deployContract(
      name: "ICommonOFT",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ICommonOFT>;
    deployContract(
      name: "IOFTReceiverV2",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IOFTReceiverV2>;
    deployContract(
      name: "IOFTV2",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IOFTV2>;
    deployContract(
      name: "OFTStakingMockV2",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OFTStakingMockV2>;
    deployContract(
      name: "OFTV2Mock",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OFTV2Mock>;
    deployContract(
      name: "NativeOFTV2",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.NativeOFTV2>;
    deployContract(
      name: "OFTCoreV2",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OFTCoreV2>;
    deployContract(
      name: "OFTV2",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OFTV2>;
    deployContract(
      name: "ProxyOFTV2",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ProxyOFTV2>;

    deployContract(
      name: "Ownable",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Ownable>;
    deployContract(
      name: "IERC1155Errors",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC1155Errors>;
    deployContract(
      name: "IERC20Errors",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20Errors>;
    deployContract(
      name: "IERC721Errors",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC721Errors>;
    deployContract(
      name: "ERC20",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC20>;
    deployContract(
      name: "IERC20Metadata",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20Metadata>;
    deployContract(
      name: "IERC20Permit",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20Permit>;
    deployContract(
      name: "IERC20",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC20>;
    deployContract(
      name: "SafeERC20",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SafeERC20>;
    deployContract(
      name: "Address",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Address>;
    deployContract(
      name: "ERC165",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ERC165>;
    deployContract(
      name: "IERC165",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IERC165>;
    deployContract(
      name: "ReentrancyGuard",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ReentrancyGuard>;
    deployContract(
      name: "OrderSig",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OrderSig>;
    deployContract(
      name: "ILayerZeroEndpoint",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ILayerZeroEndpoint>;
    deployContract(
      name: "ILayerZeroReceiver",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ILayerZeroReceiver>;
    deployContract(
      name: "ILayerZeroUserApplicationConfig",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ILayerZeroUserApplicationConfig>;
    deployContract(
      name: "LzApp",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.LzApp>;
    deployContract(
      name: "LZEndpointMock",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.LZEndpointMock>;
    deployContract(
      name: "NonblockingLzApp",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.NonblockingLzApp>;
    deployContract(
      name: "BaseOFTV2",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.BaseOFTV2>;
    deployContract(
      name: "BaseOFTWithFee",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.BaseOFTWithFee>;
    deployContract(
      name: "Fee",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Fee>;
    deployContract(
      name: "IOFTWithFee",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IOFTWithFee>;
    deployContract(
      name: "NativeOFTWithFee",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.NativeOFTWithFee>;
    deployContract(
      name: "OFTWithFee",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OFTWithFee>;
    deployContract(
      name: "ProxyOFTWithFee",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ProxyOFTWithFee>;
    deployContract(
      name: "ICommonOFT",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ICommonOFT>;
    deployContract(
      name: "IOFTReceiverV2",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IOFTReceiverV2>;
    deployContract(
      name: "IOFTV2",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.IOFTV2>;
    deployContract(
      name: "OFTStakingMockV2",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OFTStakingMockV2>;
    deployContract(
      name: "OFTV2Mock",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OFTV2Mock>;
    deployContract(
      name: "NativeOFTV2",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.NativeOFTV2>;
    deployContract(
      name: "OFTCoreV2",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OFTCoreV2>;
    deployContract(
      name: "OFTV2",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.OFTV2>;
    deployContract(
      name: "ProxyOFTV2",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ProxyOFTV2>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
  }
}
