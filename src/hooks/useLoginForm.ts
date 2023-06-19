import { useState, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { authApi } from "../apis/auth";
import { KEY_LOCALSTORAGE_LOGIN_TOKEN } from "../constants";
import { loginState } from "../recoil/atom";
import { setLocalStorage } from "../utils";
import { useLocalProducts } from "./useLocalProducts";
import { useNavigatePage } from "./useNavigatePage";
import { useToast } from "./useToast";

export const useLoginForm = () => {
  const { showToast } = useToast();
  const { updateLocalProducts } = useLocalProducts();
  const { goMain } = useNavigatePage();
  const setIsLogined = useSetRecoilState(loginState);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const usernameRef = useRef<HTMLInputElement>(null);

  const handleUsernameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePasswordKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" && usernameRef.current instanceof HTMLInputElement)
      usernameRef.current.focus();
  };

  const handleFormSubmitted = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const base64 = btoa(username + ":" + password);
      setLocalStorage(KEY_LOCALSTORAGE_LOGIN_TOKEN, base64);
      await authApi.login();
      setIsLogined(true);
      await updateLocalProducts();
      goMain();
    } catch (error) {
      localStorage.clear();
      console.error(error);
    }
  };

  const logout = async () => {
    localStorage.clear();
    setIsLogined(false);
    goMain();
    showToast("success", `로그아웃 되었습니다. ✅`);
  };

  return {
    username,
    password,
    usernameRef,
    handleUsernameChanged,
    handlePasswordChanged,
    handlePasswordKey,
    handleFormSubmitted,
    logout,
  } as const;
};
