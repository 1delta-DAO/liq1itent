/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable max-len */
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
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

import {
  ALL_COINS,
  SUPPORTED_STABLES_DOLLAR,
} from "../../config/coins.config";

export const TradeComponent: React.FC = () => {
  const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0);
  const [selectedTokenOutIndex, setSelectedTokenOutIndex] = useState<number>(1);

  const [input, setInput] = useState("0");
  const [projectedAddress, setProjectedAddress] = useState("");
  const [amountApproved, setAmountApproved] = useState("0");
  const { account } = useWeb3React<JsonRpcProvider>();
  const { approveTokenTo, getAmountApprovedFor } = useApprove();

  const tokens = useMemo(
    () =>
      SUPPORTED_STABLES_DOLLAR.map((token, index) => ({
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

  const balance = 3214;

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (
        selectedTokenIndex &&
        account &&
        projectedAddress &&
        tokens[selectedTokenIndex]
      ) {
        const amount = await getAmountApprovedFor(
          account,
          projectedAddress,
          tokens[selectedTokenIndex]!.value
        );
        setAmountApproved(amount);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, selectedTokenIndex, getAmountApprovedFor, projectedAddress]);


  const onTokenChange = (option: number): void => {
    setSelectedTokenIndex(option);
  };

  const onTokenOutChange = (option: number): void => {
    setSelectedTokenOutIndex(option);
  };


  const output = input


  const onActionButtonClickedApprove = (): void => {
    if (projectedAddress) {
      approveTokenTo(
        ethers.constants.MaxUint256.toString(),
        projectedAddress,
        tokens[selectedTokenIndex]!.value
      );
    }
  };

  const onActionButtonClicked = () => {

  }

  const onTypeInput = () => { }

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
        <div className={styles["buysell"]}>
          <div className={styles["buy"]}>Buy/Long</div>
          <div className={styles["sell"]}>Sell/Short</div>
        </div>
        <div className={styles["collateral-balance"]}>
          <div className={styles["collateral-amount"]}>
            Pay: ${(Number(input) * 0.9998).toLocaleString()}
          </div>
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

        <div className={styles["long"]}>
          <input
            type="string"
            value={output}
            className={styles["long-left"]}
            disabled={false}
          />
          <div className={styles["collateral-right"]}>
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
