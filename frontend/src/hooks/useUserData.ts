import React, { useCallback, useContext, useEffect, useState } from "react";
import { getBalance } from "../contracts/erc20.contract";
import { bigNumberToNumber } from "../utils/blockchain";
import { Coin } from "../config/networks.config";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { web3AuthConfig } from "../config/web3auth";

import EthereumRPC from "../RPC/ethRPC-web3"; // for using web3.js 
import SolanaRPC from "../RPC/solanaRPC"; // for using solana

interface UserData {
  sourceChainId: number;
  destinationChainId: number;
  setSourceChainId: (chainId: number) => void;
  setDestinationChainId: (chainId: number) => void;
  sourceToken: Coin | undefined;
  destinationToken: Coin | undefined;
  setSourceToken: (coin: Coin) => void;
  setDestinationToken: (coin: Coin) => void;
  balance: number;
  setBalance: (balance: number) => void;
  refresh: () => void;
}

// // Default values for chain IDs
// const defaultSourceChainId = 5000;
// const defaultDestinationChainId = 0;

// const UserDataContext = React.createContext<UserData>({
//   sourceChainId: defaultSourceChainId,
//   destinationChainId: defaultDestinationChainId,
//   setSourceChainId: () => {
//     void 0;
//   },
//   setDestinationChainId: () => {
//     void 0;
//   },
//   sourceToken: undefined,
//   destinationToken: undefined,
//   setSourceToken: () => {
//     void 0;
//   },
//   setDestinationToken: () => {
//     void 0;
//   },
//   balance: 0,
//   setBalance: () => {
//     void 0;
//   },
//   refresh: () => {
//     void 0;
//   },
// });

// type UserDataProviderProps = {
//   children: React.ReactNode;
// };

// export const UserDataProvider: React.FC<UserDataProviderProps> = (
//   props: UserDataProviderProps
// ) => {
//   const [sourceChainId, setSourceChainId] = useState<number>(defaultSourceChainId);
//   const [destinationChainId, setDestinationChainId] = useState<number>(defaultDestinationChainId);

//   const [sourceToken, setSourceToken] = useState<Coin>();
//   const [destinationToken, setDestinationToken] = useState<Coin>();

//   const [balance, setBalance] = useState(0);

//   const web3auth = new Web3AuthNoModal(web3AuthConfig);
//   const provider = web3auth.connected ? web3auth.provider : undefined;

//   const loadSourceBalance = useCallback(async () => {
//     if (provider && sourceChainId && sourceToken?.address) {
//       const rpcETH = new EthereumRPC(provider);
//       const privateKey = await rpcETH.getPrivateKey();
//       const rpc = chainIdToRPC(sourceChainId, privateKey);
//       const sourceBalance = await getBalance(await rpc.getAccounts(), sourceToken.address);
//       console.log("sourceBalance", sourceBalance);
//       setBalance(bigNumberToNumber(sourceBalance, sourceToken.decimals));
//     } else {
//       console.log("sourceBalance", 0, sourceToken);
//       setBalance(0);
//     }
//   }, [provider, sourceChainId, sourceToken]);

//   useEffect(() => {
//     const updateBalanceTimer = setInterval(() => {
//       void loadSourceBalance();
//     }, 6000);

//     return () => clearInterval(updateBalanceTimer);
//   }, []);

//   const refresh = useCallback(() => {
//     if (provider) {
//       void loadSourceBalance();
//     }
//   }, [provider, loadSourceBalance]);

//   return (
//     <UserDataContext.Provider 
//         value={{
//             sourceChainId,
//             destinationChainId,
//             setSourceChainId,
//             setDestinationChainId,
//             sourceToken,
//             destinationToken,
//             setSourceToken,
//             setDestinationToken,
//             balance,
//             setBalance,
//             refresh,
//         }}>
//         {props.children}
//     </UserDataContext.Provider>
//   );
// };

// const chainIdToRPC = (chainId: number, privateKey: any) => {
//   switch (chainId) {
//     case 0:
//       return new SolanaRPC(privateKey);
//     case 1:
//       return new EthereumRPC(privateKey);
//     default:
//       throw new Error(`Unsupported chainId: ${chainId}`);
//   }
// };

// export const useUserData = (): UserData => useContext(UserDataContext);
