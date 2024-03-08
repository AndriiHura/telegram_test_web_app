import {
  Dispatch,
  FC,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Redirect, useParams } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";

import FormItem from "@components/FormItem";
import ExchangeToken from "@components/ExchangeToken";
import AmountInput from "@components/AmountInput";
import ExchangeSwitch from "@components/ExchangeSwitch";
import PrimaryButton from "@components/PrimaryButton";
import PageTitle from "@components/PageTitle";
import PlatformsSwapper from "@components/PlatformsSwapper";
import { buyToken, sellToken } from "@apis/swaps";
import { getBuySettings, getSellSettings } from "@apis/settings";
import { getSOLBalance, getTokenById } from "@apis/wallet";

import classes from "./styles.module.css";

const Exchange: FC = () => {
  const { tokenId } = useParams();
  const [isSelling, setIsSelling] = useState(false);
  const [isAutoPlatforms, setIsAutoPlatforms] = useState(true);
  const [swapPlatforms, setSwapPlatforms] = useState<string[]>([]);
  const { data: token, isLoading: isTokenLoading } = useQuery({
    queryKey: ["wallet"],
    queryFn: () => getTokenById(tokenId!),
  });
  const { data: solBalance, isLoading: isSolLoading } = useQuery({
    queryKey: ["balance", "sol"],
    queryFn: getSOLBalance,
  });
  const { data: buySettings, isLoading: areBuySettingsLoading } = useQuery({
    queryKey: ["settings", "buy"],
    queryFn: getBuySettings,
  });
  const { data: sellSettings, isLoading: areSellSettingsLoading } = useQuery({
    queryKey: ["settings", "sell"],
    queryFn: getSellSettings,
  });
  const settings = isSelling ? sellSettings : buySettings;
  const { mutateAsync: mutateBuyToken, isPending: isBuyingPending } =
    useMutation({
      mutationKey: ["balance", "tokens"],
      mutationFn: buyToken,
    });
  const { mutateAsync: mutateSellToken, isPending: isSellingPending } =
    useMutation({
      mutationKey: ["balance", "tokens"],
      mutationFn: sellToken,
    });
  const isLoading = isTokenLoading || isSolLoading || areBuySettingsLoading || areSellSettingsLoading;
  const mutateExchange = isSelling ? mutateSellToken : mutateBuyToken;
  const isExchangePending = isSelling ? isSellingPending : isBuyingPending;

  const [slippage, setSlippage] = useState(settings?.slippage ?? 0);
  const [amount, setAmount] = useState(0);

  const [computeUnitLimit, setComputeUnitLimit] = useState(
    settings?.computeUnitLimit ?? 0,
  );
  const [allowAutoComputeLimit, setAllowAutoComputeLimit] = useState(true);

  useEffect(() => {
    if (allowAutoComputeLimit) {
      setComputeUnitLimit(settings?.computeUnitLimit ?? 0);
    }
  }, [allowAutoComputeLimit]);

  const [computeUnitPrice, setComputeUnitPrice] = useState(
    settings?.computeUnitPrice ?? 0,
  );
  const [allowAutoComputePrice, setAllowAutoComputePrice] = useState(true);

  useEffect(() => {
    if (allowAutoComputePrice) {
      setComputeUnitPrice(settings?.computeUnitPrice ?? 0);
    }
  }, [allowAutoComputePrice]);

  const [retryValue, setRetryValue] = useState(
    settings?.repeatTransaction ?? 0,
  );

  if (!tokenId) {
    Redirect({
      href: "/wallet",
    });
  }

  useEffect(() => {
    setSlippage(settings?.slippage ?? 0);
    setRetryValue(settings?.repeatTransaction ?? 0);

    setAllowAutoComputeLimit(true);
    setComputeUnitLimit(settings?.computeUnitLimit ?? 0);

    setAllowAutoComputePrice(true);
    setComputeUnitPrice(settings?.computeUnitPrice ?? 0);

    setSwapPlatforms(settings?.swapPlatforms ?? []);
  }, [isSelling, isLoading]);

  useEffect(() => {
    if (isAutoPlatforms) {
      setSwapPlatforms(settings?.swapPlatforms ?? []);
    }
  }, [isAutoPlatforms]);

  const handleSetNumber =
    (setter: Dispatch<SetStateAction<number>>) => (value: string) =>
      setter(Number(value));

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      await mutateExchange({
        tokenId: token!.id,
        amount,
        slippage,
        computeUnitLimit,
        computeUnitPrice,
        swapPlatforms,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <div className={classes.exchange}>
      {token && <ExchangeToken token={token} />}
      <form className={classes.exchange_form} onSubmit={onSubmit}>
        <ExchangeSwitch checked={isSelling} onChange={setIsSelling} />

        <AmountInput
          value={amount}
          onChange={setAmount}
          balance={!isSelling ? solBalance ?? 0 : token?.amount ?? 0}
          type={!isSelling ? "SOL" : "ROCK"}
          masks={["sol"]}
        />

        <FormItem
          id={"slippage"}
          value={String(slippage)}
          onChange={handleSetNumber(setSlippage)}
          label={"Slippage"}
          description={
            "Difference between expected and actual results amounts of token"
          }
          inputMode={"decimal"}
          placeholder={"Enter value"}
          masks={["empty", "percent"]}
        />

        <PrimaryButton type={"submit"} disabled={isExchangePending}>
          {isSelling ? "Sell" : "Buy"} ROCK
        </PrimaryButton>

        <PageTitle title={"Swap settings"} />

        <PlatformsSwapper
          isAutoPlatforms={isAutoPlatforms}
          setIsAutoPlatforms={setIsAutoPlatforms}
          platforms={swapPlatforms}
          setPlatforms={setSwapPlatforms}
        />

        <FormItem
          id={"computeLimit"}
          value={String(computeUnitLimit)}
          onChange={handleSetNumber(setComputeUnitLimit)}
          label={"Compute Unit Limit"}
          description={
            "The compute budget roughly determines how much a computing machine can consume for your transaction. Will not affect the success rate of your transaction since it still executes the same code, but if there are not enough funds the transaction will fail."
          }
          switchProps={{
            subLabel: "Auto",
            checked: allowAutoComputeLimit,
            onChange: setAllowAutoComputeLimit,
          }}
          inputMode={"decimal"}
          placeholder={"Enter value"}
          masks={["empty", "decimal"]}
        />
        <FormItem
          id={"computePrice"}
          value={String(computeUnitPrice)}
          onChange={handleSetNumber(setComputeUnitPrice)}
          label={"Compute Unit Price (priority)"}
          description={
            "Increasing the transaction fee increases its priority, but it only competes within the same slot, without guaranteeing inclusion in others."
          }
          switchProps={{
            subLabel: "Auto",
            checked: allowAutoComputePrice,
            onChange: setAllowAutoComputePrice,
          }}
          inputMode={"decimal"}
          placeholder={"Enter value"}
          masks={["empty", "sol"]}
        />
        <FormItem
          id={"retryValue"}
          value={String(retryValue)}
          onChange={handleSetNumber(setRetryValue)}
          label={"Retry value"}
          description={
            "Number of retry transaction in node if transaction fail"
          }
          inputMode={"decimal"}
          placeholder={"Enter value"}
          masks={["empty", "decimal"]}
        />
      </form>
    </div>
  );
};

export default Exchange;
