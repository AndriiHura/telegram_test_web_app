import camelcaseKeys from "camelcase-keys";
import baseInstance from "./baseInstance";

export type TokenResponse = {
  id: string;
  market_cap?: number;
  value?: number;
  amount: number | null;
  pnl: {
    value: number;
    rate: number;
  } | null;
  metadata: {
    name: string;
    symbol: string;
    description: string | null;
    image_url: string | null;
  };
};

export type Token = Awaited<ReturnType<typeof getTokenById>>;

export const getTokens = async (params: { page: number; size: number }) => {
  const { data } = await baseInstance.get<{
    total_value: number;
    tokens: TokenResponse[];
  }>(`/wallet/tokens`, {
    params,
  });

  return camelcaseKeys(data, { deep: true });
};

export const getTokenById = async (id: string) => {
  const { data } = await baseInstance.get<TokenResponse>(`/wallet/tokens/${id}`);
  return camelcaseKeys(data, { deep: true });
};

export const getSOLBalance = async () => {
  const { data } = await baseInstance.get<number>("/wallet/balance/SOL");
  return data;
};
