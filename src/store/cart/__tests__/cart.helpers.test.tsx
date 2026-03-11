import { addCartItem, clearCartItem, removeCartItem } from "../cart.helpers";

const mockData = [
  { id: 1, imageUrl: "test", name: "Product 1", price: 10, quantity: 2 },
  { id: 2, imageUrl: "test", name: "Product 2", price: 10, quantity: 1 },
];

describe("Cart Helpers", () => {
  test("addCartItem adds item to cart if it does not exist already in cart", () => {
    const mockProduct = {id: 3, imageUrl: "test", name: "Product 3", price: 10};
    const expectedCart = [...mockData, {...mockProduct, quantity: 1}];

    const result = addCartItem(mockData, mockProduct);
    expect(result).toEqual(expectedCart);
  });

  test("addCartItem adds increases quantity if item already exists in cart", () => {
    const mockProduct = {id: 1, imageUrl: "test", name: "Product 3", price: 10};
    const expectedCart = mockData.map(item => 
        item.id === mockProduct.id 
            ? {...item, quantity: item.quantity+1}
            : item
    );

    const result = addCartItem(mockData, mockProduct);
    expect(result).toEqual(expectedCart);
  });

  test("removeCartItem does nothing if item doesn't exist", () => {
    const mockProduct = {id: 4, imageUrl: "test", name: "Product 3", price: 10};
    const expectedCart = mockData;

    const result = removeCartItem(mockData, mockProduct);
    expect(result).toEqual(expectedCart);
  });

  test("removeCartItem removes item from cart if quantity is 1", () => {
    const mockProduct = {id: 2, imageUrl: "test", name: "Product 3", price: 10};
    const expectedCart = mockData.filter(item => 
        item.id !== mockProduct.id
    );

    const result = removeCartItem(mockData, mockProduct);
    expect(result).toEqual(expectedCart);
  });

  test("removeCartItem decreases quantity by 1 if item quantity greater than 1", () => {
    const mockProduct = {id: 1, imageUrl: "test", name: "Product 3", price: 10};
    const expectedCart = mockData.map(item => 
        item.id === mockProduct.id 
            ? {...item, quantity: item.quantity-1}
            : item
    );
    const result = removeCartItem(mockData, mockProduct);
    expect(result).toEqual(expectedCart);
  });

  test("clearCartItem does nothing if item is not in cart", () => {
    const mockProduct = {id: 4, imageUrl: "test", name: "Product 3", price: 10};
    const expectedCart = mockData;

    const result = clearCartItem(mockData, mockProduct);
    expect(result).toEqual(expectedCart);
  });

  test("clearCartItem removes item from cart if item in cart regardless of quantity", () => {
    const mockProduct = {id: 2, imageUrl: "test", name: "Product 3", price: 10};
    const expectedCart = mockData.filter(item => 
        item.id !== mockProduct.id
    );

    const result = clearCartItem(mockData, mockProduct);
    expect(result).toEqual(expectedCart);

    const mockProduct2 = {id: 1, imageUrl: "test", name: "Product 3", price: 10};
    const expectedCart2 = mockData.filter(item => 
        item.id !== mockProduct2.id
    );

    const result2 = clearCartItem(mockData, mockProduct2);
    expect(result2).toEqual(expectedCart2);
  });
});
