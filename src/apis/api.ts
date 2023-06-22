import { getLocalStorage } from "../utils";
import {
  DEFAULT_VALUE_LOGIN_TOKEN,
  DEFAULT_VALUE_SERVER_OWNER,
  KEY_LOCALSTORAGE_LOGIN_TOKEN,
  KEY_LOCALSTORAGE_SERVER_OWNER,
  SERVERS,
} from "../constants";
import { worker } from "../mocks/browser";

const request = async (path: string, init?: RequestInit) => {
  const baseServerUrl =
    SERVERS[
      getLocalStorage(KEY_LOCALSTORAGE_SERVER_OWNER, DEFAULT_VALUE_SERVER_OWNER)
    ];

  if (baseServerUrl === "") {
    worker.start({ onUnhandledRequest: "bypass" });
  }

  const token = getLocalStorage(
    KEY_LOCALSTORAGE_LOGIN_TOKEN,
    DEFAULT_VALUE_LOGIN_TOKEN
  );

  const response = await fetch(`${baseServerUrl}${path}`, {
    ...init,
    headers: {
      Authorization: `Basic ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) throw new Error(response.status.toString());
  return response;
};

export const api = {
  get: (path: string) => request(path).then((response) => response.json()),

  patch: (path: string, payload?: unknown) =>
    request(path, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  post: (path: string, payload?: unknown) =>
    request(path, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  delete: (path: string) =>
    request(path, {
      method: "DELETE",
    }),
};
