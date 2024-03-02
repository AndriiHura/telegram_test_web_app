import camelcaseKeys from "camelcase-keys";

// import { mockResponse } from "@mocks/swaps";
import baseInstance from "./baseInstance";

type Address = {
  address: string;
  amount: number;
  name?: string;
  uri?: string;
};

export type Swap = {
  type: "swapped" | "send" | "received";
  datetime: string;
  from_address: Address;
  to_address: Address;
};

export const getSwaps = async (params: { page: number; size: number }) => {
  const response = await baseInstance.get<{
    swaps: Swap[];
  }>(`/swaps`, { params });

  // const responseMock = await mockResponse;

  return camelcaseKeys(response.data, { deep: true });
};