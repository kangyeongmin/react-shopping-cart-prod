import { generatePath, useNavigate } from "react-router-dom";
import { ROUTER_PATH } from "../router";

export const useNavigatePage = () => {
  const navigate = useNavigate();

  const goMain = () => {
    navigate(ROUTER_PATH.Main);
  };

  const goLogin = () => {
    navigate(ROUTER_PATH.Login);
  };

  const goCart = () => {
    navigate(ROUTER_PATH.Cart);
  };

  const goOrder = () => {
    navigate(ROUTER_PATH.Order);
  };

  const goOrderHistory = () => {
    navigate(ROUTER_PATH.OrderHistory);
  };

  const goOrderDetail = (orderId: number) => () => {
    navigate(generatePath(ROUTER_PATH.OrderDetail, { orderId }));
  };

  const goMyPage = () => {
    navigate(ROUTER_PATH.MyPage);
  };

  return {
    goMain,
    goLogin,
    goCart,
    goOrder,
    goOrderHistory,
    goOrderDetail,
    goMyPage,
  };
};
