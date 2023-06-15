import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { selectedProductsState } from "../recoil/atom";
import { localProductsSelector } from "../recoil/selector";
import { LocalProductType } from "../types/domain";

export const useCheckBox = () => {
  const cartProducts = useRecoilValue<LocalProductType[]>(
    localProductsSelector
  );
  const setSelectedProducts = useSetRecoilState(selectedProductsState);
  const [checkedArray, setCheckedArray] = useState(
    [...Array(cartProducts.length)].map(() => true)
  );

  useEffect(() => {
    setSelectedProducts(
      cartProducts.filter((product, index) => checkedArray[index] && product)
    );
  }, [cartProducts, checkedArray, setSelectedProducts]);

  const getAllChecked = () => checkedArray.every((checked) => checked);

  const toggleOne = (changedIndex: number) => () => {
    setCheckedArray((prev) =>
      prev.map((checked, index) =>
        changedIndex === index ? !checked : checked
      )
    );
  };

  const toggleAll = () => {
    setCheckedArray((prev) => prev.map(() => !getAllChecked()));
  };

  const removeSelectedIndex = () => {
    setCheckedArray((prev) => prev.filter((checked) => !checked));
  };

  const removeTargetIndex = (targetIndex: number) => {
    setCheckedArray((prev) => prev.filter((_, index) => index !== targetIndex));
  };

  return {
    checkedArray,
    getAllChecked,
    toggleOne,
    toggleAll,
    removeSelectedIndex,
    removeTargetIndex,
  };
};
