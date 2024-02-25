import axios from "axios";

const baseInstance = axios.create({
  baseURL: "https://rockbotstaging.com/api",
});

export const updateBearer = (bearerToken: string) => {
  baseInstance.defaults.headers.common["Authorization"] =
    `Bearer ${bearerToken}`;
};

export default baseInstance;
