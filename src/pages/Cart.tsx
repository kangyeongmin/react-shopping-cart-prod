import { useRecoilValue } from "recoil";
import { styled } from "styled-components";
import { localProductsSelector } from "../recoil/selector";
import {
  Header,
  Page,
  CartProductList,
  TotalPriceTable,
  GuideBox,
  ErrorBoundary,
} from "../components";
import { LocalProductType } from "../types/domain";
import { selectedProductsState } from "../recoil/atom";
import { useLocalProducts } from "../hooks/useLocalProducts";
import { cartApi } from "../apis/cart";

const Cart = () => {
  const { updateLocalProducts } = useLocalProducts();
  const cartProducts = useRecoilValue<LocalProductType[]>(
    localProductsSelector
  );
  const selectedProducts = useRecoilValue<LocalProductType[]>(
    selectedProductsState
  );

  const deleteSelectedProduct = async () => {
    await Promise.all(
      selectedProducts.map((product) =>
        cartApi.deleteCartItem(product.cartItemId)
      )
    );
    updateLocalProducts();
  };

  const deleteOneProduct = async (cartItemId: number) => {
    await cartApi.deleteCartItem(cartItemId);
    updateLocalProducts();
  };

  if (cartProducts.length === 0)
    return (
      <GuideBox
        icon="🛒"
        message="장바구니가 텅 비었어요"
        guideMessage="상품 담으러 가기"
      />
    );

  return (
    <ErrorBoundary>
      <Header />
      <Page>
        <TitleBox>장바구니</TitleBox>
        <Container>
          <CartProductList
            cartProducts={cartProducts}
            selectedProducts={selectedProducts}
            deleteSelectedProduct={deleteSelectedProduct}
            deleteOneProduct={deleteOneProduct}
          />
          <TotalPriceTable discountPrice={null} />
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

export default Cart;
