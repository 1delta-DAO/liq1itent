/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable max-len */
import React, {
  ReactNode,
  useEffect,
  useMemo,
  useState,
  FunctionComponent,
} from "react";
import styles from "./trade.module.scss";
import { formatNumbersWithDotDelimiter } from "../../utils/utils";
import { SelectComponent } from "../select/Select.component";
import { SpinnerComponent } from "../spinner/Spinner.component";
import selectStyles from "../../components/select/Select.module.scss";
import { useApprove } from "../../hooks/useApprove";
import { JsonRpcProvider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { parseUnits } from "@ethersproject/units";
import { ethers } from "ethers";
import { ArrowDownCircle } from "react-feather";
import Web3 from "web3";
import { RegisteredSubscription } from "web3-eth";

import {
  ALL_COINS,
} from "../../config/coins.config";
import { useSignOrder } from "../../hooks/useSignOrder";

interface TradeProps {
  getWeb3Provider: (chainId: number) => Promise<Web3<RegisteredSubscription> | undefined>;
}

const defaultSettlementAddress = ''

export const TradeComponent: FunctionComponent<TradeProps> = (
  props: TradeProps
) => {
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0);
  const [selectedTokenOutIndex, setSelectedTokenOutIndex] = useState<number>(1);
  const [selectedChain, setChain] = useState<number>(5000);
  const [selectedChainOut, setChainOut] = useState<number>(137);
  const [provider, setProvider] = useState<Web3<RegisteredSubscription> | undefined>(undefined);

  const [input, setInput] = useState("0");
  const [amountApproved, setAmountApproved] = useState("0");
  const { account } = useWeb3React<JsonRpcProvider>();
  const { approveTokenTo, getAmountApprovedFor } = useApprove();
  const { signOrder, constructOrder } = useSignOrder();

  useEffect(() => {
    const fetchProvider = async (): Promise<void> => {
      const web3Provider = await props.getWeb3Provider(selectedChain);
      setProvider(web3Provider);
    };
    fetchProvider();
  }, [selectedChain]);

  const tokens = useMemo(
    () =>
      ALL_COINS.map((token, index) => ({
        icon: token.icon,
        key: index,
        label: token.name,
        value: token.address,
      })),
    []
  );

  const selectedCoinMemo = useMemo(
    () =>
      ALL_COINS.find((x) => x?.name === tokens?.[selectedTokenIndex]?.label),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedTokenIndex]
  );

  const selectedCoinMemoOut = useMemo(
    () =>
      ALL_COINS.find((x) => x?.name === tokens?.[selectedTokenOutIndex]?.label),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedTokenOutIndex]
  );

  const balance = 3214;

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (
        selectedTokenIndex &&
        account &&
        defaultSettlementAddress &&
        tokens[selectedTokenIndex]
      ) {
        const amount = await getAmountApprovedFor(
          account,
          defaultSettlementAddress,
          tokens[selectedTokenIndex]!.value
        );
        setAmountApproved(amount);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, selectedTokenIndex, getAmountApprovedFor, defaultSettlementAddress]);


  const onTokenChange = (option: number): void => {
    setSelectedTokenIndex(option);
  };

  const onTokenOutChange = (option: number): void => {
    setSelectedTokenOutIndex(option);
  };


  const output = input


  const onActionButtonClickedApprove = (): void => {
    if (defaultSettlementAddress) {
      approveTokenTo(
        ethers.constants.MaxUint256.toString(),
        defaultSettlementAddress,
        tokens[selectedTokenIndex]!.value
      );
    }
  };

  const onActionButtonClicked = async () => {
    const userAddress = provider ? (await provider.eth.getAccounts())[0] ?? "" : "";
    const amountIn = amountApproved;
    const amountOut = amountApproved;
    const tokenIn = selectedCoinMemo?.address ?? "";
    const tokenOut = selectedCoinMemoOut?.address ?? "";
    const chainIn = selectedChain.toString();
    const chainOut = selectedChainOut.toString();
    const order = constructOrder(userAddress, amountIn, amountOut, tokenIn, tokenOut, chainIn, chainOut);
  }

  function onTypeInput(e:any) {
    setInput(e.target.value);
}
  const renderButton = (): React.ReactNode => {
    if (parseUnits(input, selectedCoinMemo?.decimals).gte(amountApproved)) {
      return (
        <div
          className={styles["action"]}
          onClick={onActionButtonClickedApprove}
          onKeyDown={onActionButtonClickedApprove}>
          Approve {tokens[selectedTokenIndex]?.label}
        </div>
      );
    }

    return (
      <div
        className={styles["action"]}
        onClick={onActionButtonClicked}
        onKeyDown={onActionButtonClicked}>
        Buy / Long {tokens[selectedTokenIndex]?.label}
      </div>
    );
  };

  return (
    <div className={styles["trade"]}>
      <div className={styles["panel"]}>
        <div className={styles["collateral-balance"]}>
          <div className={styles["balance"]}>Balance: {balance}</div>
        </div>
        <div className={styles["collateral"]}>
          <div className={styles["collateral-left"]}>
            <input
              onChange={onTypeInput}
              type="text"
              value={input}
              disabled={false}
              inputMode="decimal"
              autoComplete="off"
              autoCorrect="off"
              // text-specific options
              pattern="^[0-9]*[.,]?[0-9]*$"
              placeholder={"0.0"}
              minLength={1}
              maxLength={79}
              spellCheck="false"
            />
            <div className={styles["max"]}>MAX</div>
          </div>
          <div className={styles["collateral-right"]}>
            <SelectComponent
              options={tokens}
              onOptionChange={onTokenChange}
              selectedValue={selectedTokenIndex}
              renderOption={(option): ReactNode => (
                <>
                  {option.icon && (
                    <img
                      className={selectStyles["select-option-icon"]}
                      src={option.icon}
                      alt={option.label || option.value}
                    />
                  )}
                  <span className={selectStyles["select-option-label"]}>
                    {option.label || option.value}
                  </span>
                  <span className={styles["option-amount"]}>
                    {!balance && <SpinnerComponent size="small" />}
                    {balance && formatNumbersWithDotDelimiter(balance)}
                  </span>
                </>
              )}
            />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: 'center', justifyContent: "center", padding: "5px" }}>
          <ArrowDownCircle />
        </div>
        <div className={styles["long"]}>
          <input
            type="string"
            value={output}
            className={styles["long-left"]}
            disabled={false}
          />
          <div className={styles["collateral-right"]} style={{ zIndex: 0 }}>
            <SelectComponent
              options={tokens}
              onOptionChange={onTokenOutChange}
              selectedValue={selectedTokenOutIndex}
              renderOption={(option): ReactNode => (
                <>
                  {option.icon && (
                    <img
                      className={selectStyles["select-option-icon"]}
                      src={option.icon}
                      alt={option.label || option.value}
                    />
                  )}
                  <span className={selectStyles["select-option-label"]}>
                    {option.label || option.value}
                  </span>
                  <span className={styles["option-amount"]}>
                    {!balance && <SpinnerComponent size="small" />}
                    {balance && formatNumbersWithDotDelimiter(balance)}
                  </span>
                </>
              )}
            />
          </div>
        </div>
        {renderButton()}
      </div>
    </div>
  );
};
