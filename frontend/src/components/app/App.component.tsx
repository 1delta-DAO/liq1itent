/* eslint-disable */
import React from "react";
import { HeaderComponent } from "../header/Header.component";
import styles from "./swap.module.scss";

import { useEffect, useState } from "react";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { web3AuthConfig, openloginAdapterConfig } from "../../config/web3auth";

import Web3 from "web3";

import EthereumRPC from "../../RPC/ethRPC-web3"; // for using web3.js 
import SolanaRPC from "../../RPC/solanaRPC"; // for using solana
import { TradeComponent } from "../trade/trade.component";

export const AppComponent = (): JSX.Element => {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    const init = async (): Promise<void> => {
      try {
        const web3auth = new Web3AuthNoModal(web3AuthConfig);
        setWeb3auth(web3auth);

        const openloginAdapter = new OpenloginAdapter(openloginAdapterConfig);
        web3auth.configureAdapter(openloginAdapter);

        await web3auth.init();

        setProvider(web3auth.provider);
        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    void init();
  }, []);

  const getAllAccounts = async (): Promise<void> => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    // EVM chains
    //const polygon_address = await getPolygonAddress();
    const bnb_address = await getBnbAddress();
    
    const rpcETH = new EthereumRPC(provider);
    const privateKey: any = await rpcETH.getPrivateKey();

    const solanaRPC = new SolanaRPC(privateKey);

    let solana_address = await solanaRPC.getAccounts();

    uiConsole(
      //"Polygon Address: " + polygon_address,
      "BNB Address: " + bnb_address,
      "Solana Address: " + solana_address,
    );
  };

  const getAllBalances = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }

    const ethRPC = new EthereumRPC(provider!);
    const privateKey = await ethRPC.getPrivateKey();

    const solanaRPC = new SolanaRPC(privateKey);

    const eth_balance = await ethRPC.getBalance();
    const solana_balance = await solanaRPC.getBalance();

    uiConsole(
      "Ethereum Balance: " + eth_balance,
      "Solana Balance: " + solana_balance,
    );
  };

  const login = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(WALLET_ADAPTERS.OPENLOGIN, {
      loginProvider: "google",
    });
    setProvider(web3authProvider);
    setLoggedIn(true);
    setId((await web3auth.authenticateUser()).idToken); 
    uiConsole("Logged in Successfully!");
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    if (!web3auth) {
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
  };

  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new EthereumRPC(provider);
    const address = await rpc.getAccounts();
    uiConsole("ETH Address: " + address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
  
    const rpc = new EthereumRPC(provider);
    const balance = await rpc.getBalance();
    const finalString = "ETH Balance: " + balance ;
    uiConsole(finalString);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new EthereumRPC(provider);
    const receipt = await rpc.sendTransaction();
    uiConsole(receipt);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new EthereumRPC(provider);
    const signedMessage = await rpc.signMessage();
    uiConsole(signedMessage);
  };

  const getWeb3Provider = async (chainId: number) => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new EthereumRPC(provider);
    const privateKey = await rpc.getPrivateKey();

    if (chainId == 5000) {
      const polygonPrivateKeyProvider = new EthereumPrivateKeyProvider({
        config: {
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x1388",
            rpcTarget: "https://mantle.drpc.org",
            displayName: "Mantle",
            blockExplorerUrl: "",
            ticker: "MNT",
            tickerName: "MNT",
            logo: "",
          },
        },
      });
      await polygonPrivateKeyProvider.setupProvider(privateKey);
      const web3 = new Web3(polygonPrivateKeyProvider);
      return web3;
    } else {
      const polygonPrivateKeyProvider = new EthereumPrivateKeyProvider({
        config: {
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x13882",
            rpcTarget: "https://rpc.ankr.com/polygon_amoy",
            displayName: "Polygon Amoy Testnet",
            blockExplorerUrl: "https://amoy.polygonscan.com",
            ticker: "MATIC",
            tickerName: "MATIC",
            logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
          },
        },
      });
      await polygonPrivateKeyProvider.setupProvider(privateKey);
      const web3 = new Web3(polygonPrivateKeyProvider);
      return web3;
    }
  };

  const getBnbAddress = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const rpc = new EthereumRPC(provider);
    const privateKey = await rpc.getPrivateKey();

    const bnbPrivateKeyProvider = new EthereumPrivateKeyProvider({
      config: {
        chainConfig: {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: "0x38",
          rpcTarget: "https://rpc.ankr.com/bsc",
          displayName: "Binance SmartChain Mainnet",
          blockExplorerUrl: "https://bscscan.com/",
          ticker: "BNB",
          tickerName: "BNB",
          logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
        },
      },
    });
    await bnbPrivateKeyProvider.setupProvider(privateKey);
    const web3 = new Web3(bnbPrivateKeyProvider);
    const address = (await web3.eth.getAccounts())[0];
    return address;
  };

  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  }

  return (
    <main>
      <HeaderComponent title="Liqu1tent" subTitle="by 1delta" login={login} logout={logout} loggedIn={loggedIn} />
      <div className={styles["swap"]}>
        <TradeComponent getWeb3Provider={getWeb3Provider} />
      </div>
    </main>
  );
};
