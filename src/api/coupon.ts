import { api } from ".";

const ENDPOINT = "/coupons";

export const couponApi = {
  getCoupons: () => api.get(ENDPOINT),

  publishCoupon: (couponId: number, expiredAt: Date) =>
    api.post(`${ENDPOINT}/${couponId}`),
};
