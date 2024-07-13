import { JsonRpcProvider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { SlotData, getUserSlots } from "../contracts/fx.contracts";
import { nextAddress } from "../contracts/fx-factory.contract";
import { getBalance } from "../contracts/erc20.contract";
import { bigNumberToNumber } from "../utils/blockchain";
import { Coin } from "../config/networks.config";

export interface Totals {
  rewardTokensTotal: number;
  totalClaimed: number;
  lpTokensTotal: number;
  lpTokensStaked: number;
}

interface UserPositions {
  selectedTVPair: string;
  setSelectedTVPair: (pair: string) => void;
  selectedCoin: Coin | undefined;
  setSelectedCoin: (coin: Coin) => void;
  balance: number;
  setBalance: (balance: number) => void;
  userPositions: SlotData[];
  getNextAddress: () => Promise<string>;
  refresh: () => void;
}

const UserPositionsContext = React.createContext<UserPositions>({
  selectedTVPair: "",
  setSelectedTVPair: () => {
    void 0;
  },
  selectedCoin: undefined,
  setSelectedCoin: () => {
    void 0;
  },
  balance: 0,
  setBalance: () => {
    void 0;
  },
  userPositions: [],
  getNextAddress: () => Promise.resolve(""),
  refresh: () => {
    void 0;
  },
});

type UserPositionsProviderProps = {
  children: React.ReactNode;
};

export const UserPositionsProvider: React.FC<UserPositionsProviderProps> = (
  props: UserPositionsProviderProps
) => {
  const [userPositions, setUserPositions] = useState<SlotData[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<Coin>();
  const [selectedTVPair, setSelectedTVPair] = useState<string>("USDCUSDT");
  const [balance, setBalance] = useState(0);

  const { library, account } = useWeb3React<JsonRpcProvider>();

  const loadUserPositions = useCallback(async () => {
    if (account && library) {
      const [userSlots] = await Promise.all([getUserSlots(account)]);
      setUserPositions(userSlots);
    } else {
      setUserPositions([]);
    }
  }, [account, library]);

  const loadBalance = useCallback(async () => {
    if (account && library && selectedCoin?.address) {
      const balance = await getBalance(account, selectedCoin.address);
      console.log("balance", balance, selectedCoin);
      setBalance(bigNumberToNumber(balance, selectedCoin.decimals));
    } else {
      console.log("balance", 0, selectedCoin);
      setBalance(0);
    }
  }, [account, library, selectedCoin]);

  useEffect(() => {
    const updateBalanceTimer = setInterval(() => {
      void loadUserPositions();
      void loadBalance();
    }, 6000);

    return (): void => clearInterval(updateBalanceTimer);
  }, [loadUserPositions]);

  const refresh = useCallback(() => {
    if (account) {
      void loadUserPositions();
      void loadBalance();
    }
  }, [account, loadUserPositions]);

  const getNextAddress = (): Promise<string> => {
    return nextAddress();
  };

  return (
    <UserPositionsContext.Provider
      value={{
        selectedTVPair,
        setSelectedTVPair,
        selectedCoin,
        setSelectedCoin,
        balance,
        setBalance,
        userPositions: userPositions,
        getNextAddress: getNextAddress,
        refresh,
      }}>
      {props.children}
    </UserPositionsContext.Provider>
  );
};

export const useUserPositions = (): UserPositions =>
  useContext(UserPositionsContext);
