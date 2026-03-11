import { screen, fireEvent } from "@testing-library/react";
import * as reactRedux from 'react-redux';
import Navigation from "../navigation.component";
import { renderWithProviders } from "../../../utils/test/test.utils";
import { signOutStart } from "../../../store/user/user.action";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"), // keep all the real implementations
  useDispatch: jest.fn(),
}));

describe("Navigation tests", () => {
  test("It should render a Sign In link and not a Sign Out link if there is no currentUser", () => {
    renderWithProviders(<Navigation />, {
      preloadedState: {
        user: {
          currentUser: null,
        } as any,
      },
    });

    const signInLinkElement = screen.getByText(/sign in/i);
    expect(signInLinkElement).toBeInTheDocument();

    const signOutElement = screen.queryByText(/sign out/i);
    expect(signOutElement).toBe(null);
  });

  test("It should render Sign Out and not Sign In if there is a currentUser", () => {
    renderWithProviders(<Navigation />, {
      preloadedState: {
        user: {
          currentUser: {} as any,
        } as any,
      },
    });

    const signOutLinkElement = screen.getByText(/sign out/i);
    expect(signOutLinkElement).toBeInTheDocument();

    const signInElement = screen.queryByText(/sign in/i);
    expect(signInElement).toBe(null);
  });

  test("Cart Dropdown is Open when isCartOpen", () => {
    renderWithProviders(<Navigation />, {
      preloadedState: {
        cart: {
          isCartOpen: true,
          cartItems: [],
        } as any,
      },
    });

    const dropdownTextElement = screen.getByText(/Your cart is empty/i);
    expect(dropdownTextElement).toBeInTheDocument();

    const goToCheckoutElement = screen.getByText(/checkout/i);
    expect(goToCheckoutElement).toBeInTheDocument();
  });
  test("Cart Dropdown is not visible when isCartOpen is false", () => {
    renderWithProviders(<Navigation />, {
      preloadedState: {
        cart: { isCartOpen: false, cartItems: [] } as any,
      },
    });

    const dropdownTextElement = screen.queryByText(/Your cart is empty/i);
    expect(dropdownTextElement).not.toBeInTheDocument();

    const goToCheckoutElement = screen.queryByText(/checkout/i);
    expect(goToCheckoutElement).not.toBeInTheDocument();
  });
  test('it should dispatch signOutStart action when clicking on the Sign Out link', async () => {
    const mockDispatch = jest.fn();
    (reactRedux.useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);

    renderWithProviders(<Navigation/>, {
      preloadedState: {
        user: {
          currentUser: {}
        } as any
      }
    });
    const signOutLinkElement = screen.getByText(/sign out/i);
    expect(signOutLinkElement).toBeInTheDocument();

    await fireEvent.click(signOutLinkElement);
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith(signOutStart());

    mockDispatch.mockClear();
  })
});
