import { api } from ".";

const ENDPOINT = "/auth";

export const authApi = {
  login: () => api.post(`${ENDPOINT}/login`),
};
