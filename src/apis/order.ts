import { api } from "./api";
import { LocalProductType } from "../types/domain";

const ENDPOINT = "/orders";

export const orderApi = {
  getOrders: () => api.get(ENDPOINT),

  getOrderDetail: (orderId: string) => api.get(`${ENDPOINT}/${orderId}`),

  getMyCoupons: (cartItems: LocalProductType[]) => {
    const cartItemIdsQuery = cartItems
      .map((product) => "cartItemId=" + product.cartItemId.toString())
      .join("&");

    return api.get(`${ENDPOINT}/coupons/${cartItemIdsQuery}`);
  },

  order: (selectedProducts: LocalProductType[], couponId: number | null) => {
    const products: Omit<LocalProductType, "id">[] = selectedProducts.map(
      (product) => {
        const newProduct = structuredClone(product);
        delete newProduct.id;
        return newProduct;
      }
    );

    return api.post(ENDPOINT, {
      products,
      couponId,
    });
  },
};
