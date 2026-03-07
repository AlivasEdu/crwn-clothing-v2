import { CART_ACTION_TYPES } from "./cart.types";
import {
  createAction,
  ActionWithPayload,
  withMatcher,
} from "../../utils/reducer/reducer.utils";
import { CategoryItem } from "../categories/category.reducer";
import { CartItem } from "./cart.types";
import { addCartItem, removeCartItem, clearCartItem } from "./cart.helpers";

export type SetCartItems = ActionWithPayload<
  CART_ACTION_TYPES.SET_CART_ITEMS,
  CartItem[]
>;

export type SetIsCartOpen = ActionWithPayload<
  CART_ACTION_TYPES.SET_IS_CART_OPEN,
  boolean
>;

export const setIsCartOpen = withMatcher((cartOpen: boolean) =>
  createAction(CART_ACTION_TYPES.SET_IS_CART_OPEN, cartOpen),
);

export const setCartItems = withMatcher(
  (cartItems: CartItem[]): SetCartItems =>
    createAction(CART_ACTION_TYPES.SET_CART_ITEMS, cartItems),
);

export const addItemToCart = (
  cartItems: CartItem[],
  productToAdd: CategoryItem,
) => {
  const newCartItems = addCartItem(cartItems, productToAdd);
  return setCartItems(newCartItems);
};

export const removeItemFromCart = (
  cartItems: CartItem[],
  cartItemToRemove: CategoryItem,
) => {
  const newCartItems = removeCartItem(cartItems, cartItemToRemove);
  return setCartItems(newCartItems);
};

export const clearItemFromCart = (
  cartItems: CartItem[],
  cartItemToClear: CategoryItem,
) => {
  const newCartItems = clearCartItem(cartItems, cartItemToClear);
  return setCartItems(newCartItems);
};

export const clearCart = () => {
  return setCartItems([]);
};
