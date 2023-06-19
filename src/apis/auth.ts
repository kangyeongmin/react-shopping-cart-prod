import { api } from "./api";

const ENDPOINT = "/auth";

export const authApi = {
  login: () => api.post(`${ENDPOINT}/login`),
};
