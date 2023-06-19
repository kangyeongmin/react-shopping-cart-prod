import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { styled } from "styled-components";
import { orderApi } from "../apis/order";
import {
  CouponSelectBox,
  ErrorBoundary,
  Header,
  OrderProductList,
  Page,
  TotalPriceTable,
} from "../components";
import { useLocalProducts } from "../hooks/useLocalProducts";
import { useNavigatePage } from "../hooks/useNavigatePage";
import { useToast } from "../hooks/useToast";
import { selectedProductsState } from "../recoil/atom";
import { MyCouponType } from "../types/domain";

const Order = () => {
  const { goMain } = useNavigatePage();
  const { showToast } = useToast();
  const { updateLocalProducts } = useLocalProducts();
  const [coupons, setCoupons] = useState<MyCouponType[]>([]);
  const [discountPrice, setDiscountPrice] = useState<number | null>(null);
  const [selectedCouponIndex, setSelectedCouponIndex] = useState<number>(-1);
  const selectedProducts = useRecoilValue(selectedProductsState);

  useEffect(() => {
    const fetchMyCoupons = async () => {
      try {
        const data = await orderApi.getMyCoupons(selectedProducts);
        setCoupons(data.coupons);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMyCoupons();
  }, []);

  const selectCoupon = (index: number) => {
    setSelectedCouponIndex(index);
    if (index === -1) {
      setDiscountPrice(null);
      return;
    }
    setDiscountPrice(coupons[index].discountPrice);
  };

  const orderAndPay = async () => {
    try {
      const couponId =
        selectedCouponIndex === -1 ? null : coupons[selectedCouponIndex].id;
      orderApi.order(selectedProducts, couponId);

      goMain();
      showToast("success", "결제가 완료되었습니다 👍🏻");
      updateLocalProducts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ErrorBoundary>
      <Header />
      <Page>
        <TitleBox>주문서</TitleBox>
        <Container>
          <OrderProductList />
          <PriceContainer>
            <CouponSelectBox
              type="apply"
              coupons={coupons}
              onSelect={selectCoupon}
            />
            <TotalPriceTable
              discountPrice={discountPrice}
              handlePaymentClicked={orderAndPay}
            />
          </PriceContainer>
        </Container>
      </Page>
    </ErrorBoundary>
  );
};

const TitleBox = styled.div`
  align-self: center;
  width: 85%;
  height: 40px;

  font-weight: 700;
  font-size: 25px;
  text-align: center;
  border-bottom: 4px solid var(--dark-gray);
`;

const Container = styled.section`
  display: flex;
  padding: 40px 8%;
  justify-content: space-between;

  @media screen and (max-width: 850px) {
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;
  }
`;

const PriceContainer = styled.section`
  display: flex;
  flex-direction: column;
  padding-top: 35px;
`;

export default Order;
