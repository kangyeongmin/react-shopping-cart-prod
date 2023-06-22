import { rest } from "msw";
import { KEY_LOCALSTORAGE_CART } from "../constants";
import mockProductsData from "../mockProductsData.json";
import mockProfileData from "../mockProfileData.json";
import { LocalProductType, ProductType } from "../types/domain";
import { getLocalStorage, setLocalStorage } from "../utils";

export const handlers = [
  // products
  rest.get("/products", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockProductsData));
  }),

  // cart-items
  rest.get("/cart-items", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(getLocalStorage<LocalProductType[]>(KEY_LOCALSTORAGE_CART, []))
    );
  }),

  rest.post("/cart-items", async (req, res, ctx) => {
    const { productId } = await req.json();

    const products = structuredClone(mockProductsData);
    const cartItems = getLocalStorage<LocalProductType[]>(
      KEY_LOCALSTORAGE_CART,
      []
    );

    const cartItemId = cartItems.length + 1;

    setLocalStorage(KEY_LOCALSTORAGE_CART, [
      ...cartItems,
      {
        id: cartItemId,
        quantity: 1,
        product: products.find(
          (product: ProductType) => product.id === productId
        ),
      },
    ]);

    return res(
      ctx.status(201),
      ctx.set("Location", "/cart-items/{cartItemId}")
    );
  }),

  rest.patch("/cart-items/:cartItemId", async (req, res, ctx) => {
    const { cartItemId } = req.params;
    const { quantity } = await req.json();

    const cartItems = getLocalStorage<LocalProductType[]>(
      KEY_LOCALSTORAGE_CART,
      []
    );
    const newCartItems = cartItems.map((cartItem) =>
      cartItem.id === Number(cartItemId)
        ? { ...cartItem, quantity: quantity }
        : cartItem
    );

    setLocalStorage(KEY_LOCALSTORAGE_CART, newCartItems);
    return res(ctx.status(200));
  }),

  rest.delete("/cart-items/:cartItemId", (req, res, ctx) => {
    const { cartItemId } = req.params;

    const cartItems = getLocalStorage<LocalProductType[]>(
      KEY_LOCALSTORAGE_CART,
      []
    );

    setLocalStorage(
      KEY_LOCALSTORAGE_CART,
      cartItems.filter((cartItem) => cartItem.id !== Number(cartItemId))
    );
    return res(ctx.status(204));
  }),

  // members

  rest.get("/members/profile", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockProfileData));
  }),

  // auth
  rest.post("/auth/login", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
