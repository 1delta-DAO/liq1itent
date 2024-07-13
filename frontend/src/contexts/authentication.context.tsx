import React, { useCallback, useContext } from "react";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from "@web3-react/walletconnect-connector";
import { toast } from "react-toastify";
import { Web3Provider } from "@ethersproject/providers";

import { connectorNameStorageKey } from "../config/storage.config";
import {
  ConnectorNames,
  connectors,
} from "../components/modal/modals/connect/connectors";

interface AuthenticationContextValue {
  login: (connectorName: ConnectorNames) => void;
  logout: () => void;
}

const AuthenticationContext = React.createContext<AuthenticationContextValue>({
  login: () => {
    void 0;
  },
  logout: () => {
    void 0;
  },
});

type LpStakingProviderProps = {
  children: React.ReactNode;
};

export const AuthenticationProvider: React.FC<LpStakingProviderProps> = (
  props: LpStakingProviderProps
) => {
  const { library, activate, deactivate } = useWeb3React<Web3Provider>();

  if (library) {
    library.pollingInterval = 6000;
  }

  const logout = useCallback(() => {
    console.log(`Logging out`);
    localStorage.removeItem(connectorNameStorageKey);
    deactivate();
  }, [deactivate]);

  const login = useCallback(
    (connectorName: ConnectorNames) => {
      localStorage.setItem(connectorNameStorageKey, connectorName);

      const toastError = (error: Error): void => {
        logout();
        toast.error(error.message);
        throw new Error(error.message);
      };

      if (connectors[connectorName]) {
        void activate(connectors[connectorName], undefined, true).catch(
          (error: Error) => {
            if (error instanceof UnsupportedChainIdError) {
              deactivate();
              toastError(
                new Error("This chain is unsupported. " + error.message)
              );
            } else {
              localStorage.removeItem(connectorNameStorageKey);
              if (error instanceof NoEthereumProviderError) {
                toastError(new Error("No blockchain provider was found"));
              } else if (
                error instanceof UserRejectedRequestErrorInjected ||
                error instanceof UserRejectedRequestErrorWalletConnect
              ) {
                if (
                  connectors[connectorName] instanceof WalletConnectConnector
                ) {
                  const walletConnector = connectors[
                    connectorName
                  ] as WalletConnectConnector;
                  walletConnector.walletConnectProvider = undefined;
                }
                toastError(
                  new Error("Please authorize to access your account")
                );
              } else {
                toastError(new Error(error.message));
              }
            }
          }
        );
      }
    },
    [activate, deactivate, logout]
  );

  return (
    <AuthenticationContext.Provider
      value={{
        login,
        logout,
      }}>
      {props.children}
    </AuthenticationContext.Provider>
  );
};

export const useAuth = (): AuthenticationContextValue =>
  useContext(AuthenticationContext);
