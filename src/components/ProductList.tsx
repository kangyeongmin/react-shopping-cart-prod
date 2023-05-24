import styled from "styled-components";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { productsState, localProductsState } from "../recoil/atom";
import type { LocalProductType } from "../types/domain";
import { CartGrayIcon } from "../assets";
import { Counter } from "./Counter";
import { MIN_QUANTITY } from "../constants";
import { addCartItem } from "../api";
import { makeLocalProducts } from "../utils/domain";

export const ProductList = () => {
  const products = useRecoilValue(localProductsState);

  return (
    <Wrapper>
      {products.map((product: LocalProductType) => (
        <Product key={product.id} {...product} />
      ))}
    </Wrapper>
  );
};

const Product = ({ id, name, price, imageUrl, quantity }: LocalProductType) => {
  const products = useRecoilValue(productsState);
  const setLocalProducts = useSetRecoilState(localProductsState);

  const handleCartClicked = async () => {
    await addCartItem(id);

    const newProducts = await makeLocalProducts(products);
    setLocalProducts(newProducts);
  };

  return (
    <ProductWrapper>
      <img src={imageUrl} alt="상품이미지" />
      <NameBox>{name}</NameBox>
      <PriceBox>{price.toLocaleString()}원</PriceBox>
      <IconContainer>
        {quantity === MIN_QUANTITY ? (
          <img src={CartGrayIcon} alt={"카트"} onClick={handleCartClicked} />
        ) : (
          <Counter itemId={id} deleteable />
        )}
      </IconContainer>
    </ProductWrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  place-items: center;
  grid-template-columns: repeat(4, 1fr);

  width: 100%;
  grid-gap: 60px 20px;

  @media screen and (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media screen and (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ProductWrapper = styled.div`
  display: flex;
  flex-direction: column;

  position: relative;

  & > img {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    object-fit: cover;

    &:hover {
      background-color: var(--shadow-gray);
      box-shadow: 0 10px 10px -3px var(--shadow-gray);
      transition: all 0.3s ease;
    }
  }
`;

const NameBox = styled.div`
  width: 190px;
  margin: 15px 0 10px 10px;

  font-size: 16px;
  white-space: nowrap;

  word-break: break-all;
  text-overflow: ellipsis;
  overflow: hidden;

  @media screen and (max-width: 800px) {
    font-size: 13px;
  }
`;

const PriceBox = styled.p`
  margin-left: 10px;

  font-size: 20px;

  @media screen and (max-width: 800px) {
    font-size: 16px;
  }
`;

const IconContainer = styled.div`
  position: absolute;
  right: 10px;
  bottom: 20px;

  cursor: pointer;

  & > img {
    width: 24px;
    height: 24px;

    transition: all 0.4s ease-out;

    &:hover {
      transform: scale(1.12);
      opacity: 60%;
    }
  }

  @media screen and (max-width: 1200px) {
    bottom: -5px;
  }
`;
