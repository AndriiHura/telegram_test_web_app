import baseInstance from "@apis/baseInstance";
import camelcaseKeys from "camelcase-keys";

export type ExchangeTokenDto = {
  tokenId: string;
  amount: number;
  slippage: number;
  computeUnitLimit: number;
  computeUnitPrice: number;
  swapPlatforms: string[];
};

export type ExchangeTokenResponse = {
  signature: string;
  url_scanner: string;
  // Stringified date
  create_at: string;
};

export const sellToken = async (exchangeTokenDto: ExchangeTokenDto) => {
  const { data } = await baseInstance.post<ExchangeTokenResponse>(
    "/swaps/sell/input",
    {
      token_address: exchangeTokenDto.tokenId,
      amount: exchangeTokenDto.amount,
      slippage: exchangeTokenDto.slippage,
      compute_unit_limit: exchangeTokenDto.computeUnitLimit,
      compute_unit_price: exchangeTokenDto.computeUnitPrice,
      swap_platforms: exchangeTokenDto.swapPlatforms,
    },
  );

  return camelcaseKeys(data, { deep: true });
};

export const buyToken = async (exchangeTokenDto: ExchangeTokenDto) => {
  const { data } = await baseInstance.post<ExchangeTokenResponse>(
    "/swaps/buy/input",
    {
      token_address: exchangeTokenDto.tokenId,
      amount: exchangeTokenDto.amount,
      slippage: exchangeTokenDto.slippage,
      compute_unit_limit: exchangeTokenDto.computeUnitLimit,
      compute_unit_price: exchangeTokenDto.computeUnitPrice,
      swap_platforms: exchangeTokenDto.swapPlatforms,
    },
  );

  return camelcaseKeys(data, { deep: true });
};

type Address = {
  address: string;
  amount: number;
  name?: string;
  symbol?: string;
  image_url?: string;
};

export type Swap = {
  id: string;
  type: "swapped" | "send" | "received";
  datetime: string;
  from_address: Address;
  to_address: Address;
};

export const getSwaps = async (params: { page: number; size: number }) => {
  const response = await baseInstance.get<{
    swaps: Swap[];
  }>(`/swaps/all`, { params });

  return camelcaseKeys(response.data, { deep: true });
};
