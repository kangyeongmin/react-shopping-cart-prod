import { api } from "./api";

const ENDPOINT = "/products";

export const productApi = {
  getProducts: () => api.get(ENDPOINT),
};
