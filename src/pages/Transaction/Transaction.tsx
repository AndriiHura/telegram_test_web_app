import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useParams } from "wouter";
import useRootStore from "@hooks/useRootStore";
import WalletTransactionItem from "@components/WalletTransactionItem";
import TransactionAction from "@components/TransactionAction";
import FormItem from "@components/FormItem";

import classes from "./styles.module.css";
import TransactionButton from "@components/TransactionButton";
import SwapPlatforms from "@components/SwapPlatforms";
import PageTitle from "@components/PageTitle";
import Divider from "@components/Divider";
import { createBuyTransaction, createSellTransaction } from "@apis/swaps";

const handleChangePlatforms = () => {
  /* do nothing */
};

const Transaction = () => {
  const { id } = useParams<{ id: string }>();

  const {
    walletStore: { currentTransaction, getToken, getBalance, balance },
    authStore: { isAuthSucceed },
    settingsStore: { lastSellSettings, lastBuySettings },
  } = useRootStore();

  const [action, setAction] = useState<"buy" | "sell">("buy");
  const actionPascal = `${action[0].toUpperCase()}${action.slice(1, action.length)}`;

  const currentSettings = action === "buy" ? lastBuySettings : lastSellSettings;
  const actionFunction =
    action === "buy" ? createBuyTransaction : createSellTransaction;

  const {
    amount,
    setAmount,
    slippage,
    setSlippage,
    mevProtection,
    setMevProtection,
    isMevProtectionEnabled,
    setIsMevProtectionEnabled,
    computeLimit,
    setComputeLimit,
    setAllowAutoComputeLimit,
    allowAutoComputeLimit,
    computePrice,
    setComputePrice,
    allowAutoComputePrice,
    setAllowAutoComputePrice,
    swapPlatforms,
    retryValue,
    setRetryValue,
  } = currentSettings;

  const handleClick = () =>
    actionFunction({
      tokenAddress: currentTransaction?.id ?? "",
      amount: amount ?? 0,
      slippage: slippage ?? 0,
      computeUnitLimit: computeLimit ?? 0,
      computeUnitPrice: computePrice ?? 0,
      swapPlatforms: swapPlatforms.map((platform) => platform.title),
    });

  useEffect(() => {
    if (isAuthSucceed) {
      getToken(id);
      getBalance();
    }
  }, [id, isAuthSucceed]);

  return (
    <section className={classes.transaction}>
      {currentTransaction && (
        <WalletTransactionItem transaction={currentTransaction} isOutOfList />
      )}

      <TransactionAction action={action} onChange={setAction} />

      <FormItem
        id="amount"
        value={amount ?? 0}
        onChange={setAmount}
        label="Amount"
        description={`Balance: ${balance ?? 0}`}
        inputMode="decimal"
        placeholder="Enter value"
        masks={["empty", "float"]}
        sliderProps={{
          max: balance ?? 0,
        }}
      />

      <FormItem
        id="slippage"
        value={slippage ?? 0}
        onChange={setSlippage}
        label="Slippage"
        description="Difference between expected and actual results amounts of token"
        inputMode="decimal"
        placeholder="Enter value"
        masks={["empty", "percent"]}
      />

      <TransactionButton
        type={"button"}
        onClick={handleClick}
      >{`${actionPascal} ROCK`}</TransactionButton>

      <PageTitle title={"Swap settings"} />

      <SwapPlatforms
        onChange={handleChangePlatforms}
        settings={currentSettings}
      />

      <Divider />

      <FormItem
        id="mevProtection"
        value={mevProtection ?? 0}
        onChange={setMevProtection}
        label="SMART-MEV PROTECTION"
        description="Set an additional bribe amount on top of your priority fee for the Jito validators to place your transaction as soon as possible."
        inputMode="decimal"
        placeholder="Enter value"
        masks={["empty", "decimal", "sol"]}
        switchProps={{
          checked: isMevProtectionEnabled,
          onChange: setIsMevProtectionEnabled,
        }}
      />

      <FormItem
        id="computeLimit"
        value={computeLimit ?? 0}
        onChange={setComputeLimit}
        label="Compute Unit Limit"
        description="The compute budget roughly determines how much a computing machine can consume for your transaction. Will not affect the success rate of your transaction since it still executes the same code, but if there are not enough funds the transaction will fail."
        inputMode="decimal"
        placeholder="Enter value"
        masks={["decimal"]}
        switchProps={{
          subLabel: "Auto",
          checked: allowAutoComputeLimit,
          onChange: setAllowAutoComputeLimit,
        }}
      />

      <FormItem
        id="computePrice"
        value={computePrice ?? 0}
        onChange={setComputePrice}
        label="Compute Unit Price (priority)"
        description="Increasing the transaction fee increases its priority, but it only competes within the same slot, without guaranteeing inclusion in others."
        inputMode="decimal"
        placeholder="Enter value"
        masks={["empty", "float", "sol"]}
        switchProps={{
          subLabel: "Auto",
          checked: allowAutoComputePrice,
          onChange: setAllowAutoComputePrice,
        }}
      />

      <FormItem
        id="retryValue"
        value={retryValue ?? 0}
        onChange={setRetryValue}
        label="Retry value"
        description="Number of retry transaction in node if transaction fail."
        inputMode="decimal"
        placeholder="Enter value"
        masks={["float"]}
      />
    </section>
  );
};

export default observer(Transaction);
