import { CartItem } from "./cart.types";
import { CategoryItem } from "../categories/category.reducer";

export const addCartItem = (
  cartItems: CartItem[],
  productToAdd: CategoryItem,
): CartItem[] => {
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

export const removeCartItem = (
  cartItems: CartItem[],
  cartItemToRemove: CategoryItem,
): CartItem[] => {
  const existingCartItem = cartItems.find(
    (cartItem) => cartItem.id === cartItemToRemove.id,
  );
  if (existingCartItem && existingCartItem.quantity === 1) {
    return cartItems.filter((cartItem) => cartItem.id !== cartItemToRemove.id);
  }
  return cartItems.map((cartItem) => {
    if (cartItem.id === cartItemToRemove.id) {
      return { ...cartItem, quantity: cartItem.quantity - 1 };
    }
    return cartItem;
  });
};

export const clearCartItem = (cartItems: CartItem[], cartItemToClear: CategoryItem): CartItem[] =>
  cartItems.filter((cartItem) => cartItem.id !== cartItemToClear.id);
