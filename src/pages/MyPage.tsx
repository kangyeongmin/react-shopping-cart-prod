import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { couponApi } from "../apis/coupon";
import {
  Button,
  CouponSelectBox,
  ErrorBoundary,
  Header,
  Page,
} from "../components";
import { useNavigatePage } from "../hooks/useNavigatePage";
import { useToast } from "../hooks/useToast";
import { memberState } from "../recoil/atom";
import { MyCouponType } from "../types/domain";

const MyPage = () => {
  const { goOrderHistory } = useNavigatePage();
  const { showToast } = useToast();
  const member = useRecoilValue(memberState);
  const [coupons, setCoupons] = useState<MyCouponType[]>([]);
  const [selectedCouponIndex, setSelectedCouponIndex] = useState<number>(-1);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const data = await couponApi.getCoupons();
        setCoupons(data.coupons);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCoupons();
  }, []);

  const handleCouponSelected = (index: number) => {
    setSelectedCouponIndex(index);
  };

  const handleButtonClicked = async () => {
    const expiredDate = new Date();
    expiredDate.setMonth(expiredDate.getMonth() + 1);

    try {
      await couponApi.publishCoupon(
        coupons[selectedCouponIndex].id,
        expiredDate
      );

      showToast("success", "쿠폰이 발급되었습니다!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ErrorBoundary>
      <Header />
      <Page>
        <ProfileBox>
          <p>🖐🏻 {member.nickname}</p> 님, 즐거운 쇼핑 되세요!
        </ProfileBox>
        <OptionsContainer>
          <OptionBox onClick={goOrderHistory}>주문 내역 보러가기</OptionBox>
          <CouponOptionContainer>
            <CouponSelectBox
              type="get"
              coupons={coupons}
              onSelect={handleCouponSelected}
            />
            {selectedCouponIndex !== -1 && (
              <Button onClick={handleButtonClicked}>발급 받기</Button>
            )}
          </CouponOptionContainer>
        </OptionsContainer>
      </Page>
    </ErrorBoundary>
  );
};

const ProfileBox = styled.div`
  display: flex;
  align-items: flex-end;
  padding: 30px 0 0 30px;
  color: var(--dark-gray);
  font-size: 15px;
  font-weight: 500;

  & > p {
    font-size: 25px;
    font-weight: 700;
    margin-right: 3px;
  }
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px;
  gap: 10px;
  height: 100vh;
  max-width: 380px;
`;

const OptionBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid #dddddd;
  border-bottom: 3px solid #dddddd;
  padding: 0 20px;
  width: 100%;
  height: 55px;
  color: var(--dark-gray);
  font-size: 17px;
  cursor: pointer;

  &:hover {
    opacity: 50%;
  }
`;

const CouponOptionContainer = styled.div`
  display: flex;
  align-items: center;

  width: 100%;
  height: auto;
  gap: 20px;
`;

export default MyPage;
