import { api } from ".";

const ENDPOINT = "/products";

export const productApi = {
  getProducts: () => api.get(ENDPOINT),
};
