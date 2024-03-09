import { makeAutoObservable } from "mobx";
import { nanoid } from "nanoid";

import { getSettings } from "@apis/settings";

type SettingValues = Awaited<ReturnType<typeof getSettings>>["buyingInfoAuto"];

const computeLimitAutoValue = "1400000";
const computePriceAutoValue = "0.000005";

export type SettingKeys =
  | "slippage"
  | "amount"
  | "computeLimit"
  | "computePrice"
  | "retryValue"
  | "mevProtection";

class GenericSettingsStore {
  // slippage: number | null = null;
  // amount: number | null = null;
  // computeLimit: number | null = null;
  // allowAutoComputeLimit = true;
  // computePrice: number | null = null;
  // allowAutoComputePrice = true;
  // mevProtection: number | null = null;
  // isMevProtectionEnabled = true;
  // retryValue: number | null = null;
  // fromToken: string | null = null;
  // swapPlatforms: { title: string; id: string }[] = [];

  slippage: number | null = 0.3;
  amount: number | null = 120;
  computeLimit: number | null = 14000000;
  allowAutoComputeLimit = true;
  computePrice: number | null = 0.005;
  allowAutoComputePrice = true;
  mevProtection: number | null = 0.1;
  isMevProtectionEnabled = true;
  retryValue: number | null = 1;
  fromToken: string | null = null;
  allowAutoPlatforms = true;
  swapPlatforms: { title: string; id: string }[] = [
    {
      id: "1",
      title: "Jupiter",
    },
    {
      id: "2",
      title: "Radyum",
    },
    {
      id: "3",
      title: "Radyum",
    },
  ];

  constructor() {
    makeAutoObservable(this);
  }

  setSlippage = (value: number) => {
    this.slippage = value;
  };

  setAmount = (value: number) => {
    this.amount = value;
  };

  setComputeLimit = (value: number) => {
    this.computeLimit = value;
  };

  setAllowAutoComputeLimit = (value: boolean) => {
    this.allowAutoComputeLimit = value;
  };

  setComputePrice = (value: number) => {
    this.computePrice = value;
  };

  setAllowAutoComputePrice = (value: boolean) => {
    this.allowAutoComputePrice = value;
  };

  setMevProtection = (value: number) => {
    this.mevProtection = value;
  };

  setIsMevProtectionEnabled = (value: boolean) => {
    this.isMevProtectionEnabled = value;
  };

  setRetryValue = (value: number) => {
    this.retryValue = value;
  };

  setAllowAutoPlatforms = (value: boolean) => {
    this.allowAutoPlatforms = value;
  };

  changeSwapPlatformsOrder = (startIndex: number, endIndex: number) => {
    const dragItem = this.swapPlatforms[startIndex];
    this.swapPlatforms.splice(startIndex, 1);
    this.swapPlatforms.splice(endIndex, 0, dragItem);
  };

  setComputeLimitToDefault = (value: boolean) => {
    if (value) {
      this.computeLimit = Number(computeLimitAutoValue);
      this.allowAutoComputeLimit = true;
    }
  };

  setComputePriceToDefault = (value: boolean) => {
    if (value) {
      this.computePrice = Number(computePriceAutoValue);
      this.allowAutoComputePrice = true;
    }
  };

  setValues = (values: SettingValues) => {
    const {
      slippage,
      amount,
      computeUnitLimit,
      computeUnitPrice,
      repeatTransaction,
      fromToken,
      swapPlatforms,
      mevProtection,
    } = values || {};

    this.slippage = slippage || null;
    this.amount = amount || null;
    this.mevProtection = mevProtection || null;
    this.computeLimit = computeUnitLimit || null;
    this.computePrice = computeUnitPrice || null;
    this.retryValue = repeatTransaction || null;
    this.fromToken = fromToken || null;

    this.allowAutoComputeLimit =
      computeUnitLimit === Number(computeLimitAutoValue);
    this.allowAutoComputePrice =
      computeUnitPrice === Number(computePriceAutoValue);
    this.isMevProtectionEnabled = mevProtection !== 0;

    this.swapPlatforms = swapPlatforms.map((title) => ({
      title,
      id: nanoid(8),
    }));
  };
}

export default GenericSettingsStore;
