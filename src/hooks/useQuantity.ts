import { useRecoilValue } from "recoil";
import { localProductsState } from "../recoil/atom";
import React, { useEffect, useState } from "react";
import { MAX_LENGTH_QUANTITY, MAX_QUANTITY, MIN_QUANTITY } from "../constants";
import { api } from "../apis/api";
import { LocalProductType } from "../types/domain";
import { useLocalProducts } from "./useLocalProducts";
import { cartApi } from "../apis/cart";

export const useQuantity = (productId: number) => {
  const { updateLocalProducts } = useLocalProducts();
  const localProducts = useRecoilValue(localProductsState);
  const [quantity, setQuantity] = useState<string | undefined>("0");
  const currentLocalProduct = localProducts.find(
    (product: LocalProductType) => product.id === productId
  );

  useEffect(() => {
    setQuantity(currentLocalProduct?.quantity.toString());
  }, [currentLocalProduct]);

  const setNewQuantity = async (newQuantity: number) => {
    if (!currentLocalProduct) return;
    if (newQuantity > MAX_QUANTITY || newQuantity < MIN_QUANTITY) return;

    try {
      if (newQuantity === 0) {
        await cartApi.deleteCartItem(currentLocalProduct.cartItemId);
      } else {
        await cartApi.updateQuantity(
          currentLocalProduct.cartItemId,
          Number(newQuantity)
        );
      }
      setQuantity(newQuantity.toString());
      await updateLocalProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleQuantityChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > MAX_LENGTH_QUANTITY) return;
    setQuantity(e.target.value);
  };

  const handleQuantityBlured = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      e.target.value === "" ||
      e.target.value === "-0" ||
      Number(quantity) < MIN_QUANTITY
    ) {
      e.target.value = MIN_QUANTITY.toString();
    }
    setNewQuantity(Number(e.target.value));
  };

  return {
    quantity,
    setNewQuantity,
    handleQuantityChanged,
    handleQuantityBlured,
  } as const;
};
