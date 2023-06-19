import { api } from "./api";

const ENDPOINT = "/cart-items";

export const cartApi = {
  getCartItems: () => api.get(ENDPOINT),

  addCartItem: (productId: number) =>
    api.post(ENDPOINT, { productId: productId }),

  deleteCartItem: (cartItemId: number) =>
    api.delete(`${ENDPOINT}/${cartItemId}`),

  updateQuantity: (cartItemId: number, quantity: number) =>
    api.patch(`${ENDPOINT}/${cartItemId}`, { quantity: quantity }),
};
