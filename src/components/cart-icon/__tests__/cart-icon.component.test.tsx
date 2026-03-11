import React from "react";
import { screen } from "@testing-library/react";

import { renderWithProviders } from "../../../utils/test/test.utils";
import CartIcon from "../cart-icon.component";

jest.mock("../cart-icon.styles", () => ({
  CartIconContainer: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
  }) => <div {...props}>{children}</div>,
  ShoppingIcon: (props: React.SVGProps<SVGSVGElement>) => <svg {...props} />,
  ItemCount: ({ children, ...props }: { children: React.ReactNode }) => (
    <span {...props}>{children}</span>
  ),
}));

describe("Cart Icon Tests", () => {
  test("Uses preloaded state to render", () => {
    const initialCartItems = [
      { id: 1, name: "Item A", imageUrl: "test", price: 10, quantity: 1 },
      { id: 2, name: "Item B", imageUrl: "test", price: 10, quantity: 2 },
    ];

    renderWithProviders(<CartIcon />, {
      preloadedState: {
        cart: {
          isCartOpen: false,
          cartItems: initialCartItems,
        },
      },
    });

    const cartIconElement = screen.getByText("3");
    expect(cartIconElement).toBeInTheDocument();
  });
});
