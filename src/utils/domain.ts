import { cartApi } from "../apis/cart";
import { productApi } from "../apis/product";
import { MIN_QUANTITY } from "../constants";
import { CartItemType, LocalProductType, ProductType } from "../types/domain";

export const makeLocalProducts = async (): Promise<LocalProductType[]> => {
  try {
    const products = await productApi.getProducts();
    const cartItems = await cartApi.getCartItems();

    return products.map((product: ProductType) => {
      const cartItem = cartItems.find(
        (cartItem: CartItemType) => cartItem.product.id === product.id
      );
      return {
        ...product,
        quantity: cartItem ? cartItem.quantity : MIN_QUANTITY,
        cartItemId: cartItem ? cartItem.id : null,
      };
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const makeProducts = async (): Promise<LocalProductType[]> => {
  try {
    const products = await productApi.getProducts();

    return products.map((product: ProductType) => {
      return {
        ...product,
        quantity: MIN_QUANTITY,
        cartItemId: null,
      };
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};
