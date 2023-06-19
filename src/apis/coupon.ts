import { api } from "./api";

const ENDPOINT = "/coupons";

export const couponApi = {
  getCoupons: () => api.get(ENDPOINT),

  publishCoupon: (couponId: number, expiredAt: Date) =>
    api.post(`${ENDPOINT}/${couponId}`),
};
