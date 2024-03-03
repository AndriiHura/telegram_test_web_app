/* eslint-disable sonarjs/no-identical-functions */
import camelcaseKeys, { CamelCaseKeys } from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

import {
  buildMockResponse,
  // mockSettingsValue,
  // mockProfileSettingsValue,
} from "@mocks/settings";
// import { mockValue, buildMockResponse } from "@mocks/sniper";
import baseInstance from "./baseInstance";

export type Settings = {
  notification: boolean;
  buying_info_auto: ExchangeSettingsResponse & { amount: number };
  buying_info_sniper: ExchangeSettingsResponse & { amount: number };
};

export type ProfileSettings = {
  public_address: string;
  create_at: string;
  referral: {
    url: string;
    invitees_count: number;
    reward: number;
  };
};

export type ExchangeSettingsResponse = {
  repeat_transaction: number;
  slippage: number;
  from_token: string;
  swap_platforms: string[];
  compute_unit_limit: number;
  compute_unit_price: number;
};

export type Channel = {
  id: number;
  telegram_channel_tag: string;
  title: string;
  image_url: string;
};

export const getSettings = async () => {
  const { data } = await baseInstance.get<Settings>(`/settings/all`);
  return camelcaseKeys(data, { deep: true });
};

export const updateSettings = async (
  settings: CamelCaseKeys<Settings, true>,
) => {
  await baseInstance.post<void>(
    "/settings/update",
    snakecaseKeys(settings, { deep: true }),
  );

  return true;
};

export const getProfileSettings = async () => {
  const response = await baseInstance.get<ProfileSettings>(`/settings/profile`);
  return camelcaseKeys(response.data, { deep: true });
};

export const getPrivateKey = async () => {
  const { data } = await baseInstance.get<string>(`/settings/private_key`);
  return data;
};

const buyMock = {
  repeat_transaction: 0,
  slippage: 0.9999,
  from_token: "So11111111111111111111111111111111111111112",
  swap_platforms: ["jupiter", "raydium"],
  compute_unit_limit: 1400000,
  compute_unit_price: 0.000005,
};

export const getBuySettings = async () => {
  // const { data } =
  //   await baseInstance.get<ExchangeSettingsResponse>(`/settings/buy`);

  const { data } = await buildMockResponse(buyMock);

  return camelcaseKeys(data);
};

export const getSellSettings = async () => {
  // const { data } =
  //   await baseInstance.get<ExchangeSettingsResponse>(`/settings/sell`);

  const { data } = await buildMockResponse(buyMock);

  return camelcaseKeys(data);
};

export const getSnipedChannels = async () => {
  const response = await baseInstance.get<{ channels: Channel[] }>(
    `/settings/sniped_channels`,
  );

  // const mockResponse = await buildMockResponse(mockValue);

  return camelcaseKeys(response.data, { deep: true });
};

export const addSnipedChannel = async (channelTag: string) => {
  const response = await baseInstance.post<{ channels: Channel[] }>(
    "/settings/add_sniped_channel",
    {
      channel_tag: channelTag,
    },
  );

  return camelcaseKeys(response.data, { deep: true });
};

export const removeSnipedChannel = async (channel: CamelCaseKeys<Channel>) => {
  await baseInstance.post<void>(
    "/settings/remove_sniped_channel",
    snakecaseKeys(channel),
  );

  return true;
};
