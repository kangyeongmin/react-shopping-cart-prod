import { api } from ".";

const ENDPOINT = "/members";

export const memberApi = {
  getProfile: () => api.get(`${ENDPOINT}/profile`),
};
