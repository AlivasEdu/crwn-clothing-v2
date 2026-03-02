import { CART_ACTION_TYPES } from "./cart.types";
import { createAction } from "../../utils/reducer/reducer.utils";

const addCartItem = (cartItems, productToAdd) => {
  if (cartItems.find((cartItem) => cartItem.id === productToAdd.id)) {
    return cartItems.map((cartItem) => {
      if (cartItem.id === productToAdd.id) {
        return { ...cartItem, quantity: cartItem.quantity + 1 };
      }
      return cartItem;
    });
  } else {
    return [...cartItems, { ...productToAdd, quantity: 1 }];
  }
};

const removeCartItem = (cartItems, cartItemToRemove) => {
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.id === cartItemToRemove.id,
  );
  if (existingCartItem.quantity === 1) {
    return cartItems.filter((cartItem) => cartItem.id !== cartItemToRemove.id);
  }
  return cartItems.map((cartItem) => {
    if (cartItem.id === cartItemToRemove.id) {
      return { ...cartItem, quantity: cartItem.quantity - 1 };
    }
    return cartItem;
  });
};

const clearCartItem = (cartItems, cartItemToClear) =>
  cartItems.filter((cartItem) => cartItem.id !== cartItemToClear.id);

export const setIsCartOpen = (cartOpen) =>
  createAction(CART_ACTION_TYPES.SET_IS_CART_OPEN, cartOpen);

export const addItemToCart = (cartItems, productToAdd) =>
  createAction(
    CART_ACTION_TYPES.SET_CART_ITEMS,
    addCartItem(cartItems, productToAdd),
  );

export const removeItemFromCart = (cartItems, cartItemToRemove) =>
  createAction(
    CART_ACTION_TYPES.SET_CART_ITEMS,
    removeCartItem(cartItems, cartItemToRemove),
  );

export const clearItemFromCart = (cartItems, cartItemToClear) =>
  createAction(
    CART_ACTION_TYPES.SET_CART_ITEMS,
    clearCartItem(cartItems, cartItemToClear),
  );

export const clearCart = () =>
  createAction(CART_ACTION_TYPES.SET_CART_ITEMS, []);
