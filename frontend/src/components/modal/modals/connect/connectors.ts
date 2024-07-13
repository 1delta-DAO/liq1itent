import { AbstractConnector } from "@web3-react/abstract-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import XDCPay from "../../../../../public/assets/images/svg/blockchains/xdc-network.svg";
import MathWallet from "../../../../../public/assets/images/svg/wallets/math-wallet.svg";
import Metamask from "../../../../../public/assets/images/svg/wallets/meta-mask.svg";
import PocketWallet from "../../../../../public/assets/images/svg/wallets/pocket-wallet.png";
import TrustWallet from "../../../../../public/assets/images/svg/wallets/twt.svg";
import WalletConnect from "../../../../../public/assets/images/svg/wallets/wallet-connect.svg";
import { chainIds, networks } from "../../../../config/networks.config";

export type ConnectorNames = "injected" | "walletConnect";

interface ConnectorConfig {
  title: string;
  icon: string;
  connector: ConnectorNames;
  mobile: boolean;
  desktop: boolean;
}

export const connectors: { [key in ConnectorNames]: AbstractConnector } = {
  injected: new InjectedConnector({
    supportedChainIds: chainIds,
  }),

  walletConnect: new WalletConnectConnector({
    qrcode: true,
    rpc: networks.reduce(
      (acc, network) => ({ ...acc, [network.chainId]: network.rpc }),
      {}
    ),
  }),
};

export const walletConfigs: ConnectorConfig[] = [
  {
    connector: "injected",
    icon: Metamask,
    title: "Metamask",
    mobile: true,
    desktop: true,
  },
  {
    connector: "walletConnect",
    icon: WalletConnect,
    title: "WalletConnect",
    mobile: false,
    desktop: true,
  },
  {
    connector: "injected",
    icon: TrustWallet,
    title: "TrustWallet",
    mobile: true,
    desktop: false,
  },
  {
    connector: "injected",
    icon: MathWallet,
    title: "MathWallet",
    mobile: false,
    desktop: false,
  },
  {
    connector: "injected",
    icon: PocketWallet,
    title: "PocketWallet",
    mobile: false,
    desktop: false,
  },
  {
    connector: "injected",
    icon: XDCPay,
    title: "XDC Pay",
    mobile: true,
    desktop: true,
  },
];
