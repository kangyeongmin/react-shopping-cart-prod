import { api } from "./api";

const ENDPOINT = "/members";

export const memberApi = {
  getProfile: () => api.get(`${ENDPOINT}/profile`),
};
