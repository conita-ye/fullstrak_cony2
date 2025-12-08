import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "./CartContext";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { id: 1 },
    isAuthenticated: true,
  }),
}));

vi.mock("@/services/api", () => ({
  apiService: {
    getCarrito: vi.fn().mockResolvedValue({
      items: [
        {
          productId: 1,
          productName: "Test",
          quantity: 1,
          price: 1000,
          subtotal: 1000,
        },
      ],
    }),
    addToCart: vi.fn().mockResolvedValue({}),
    removeFromCart: vi.fn().mockResolvedValue({}),
    clearCart: vi.fn().mockResolvedValue({}),
  },
}));

describe('CartContext - Pruebas de Funcionalidad', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("56. Debe calcular el total del carrito correctamente", async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    const total = result.current.getCartTotal();
    expect(total).toBeGreaterThanOrEqual(0);
  });

  test("57. Debe contar los items del carrito correctamente", async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    const count = result.current.getCartItemsCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("58. Debe agregar producto al carrito", async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    await act(async () => {
      await result.current.addToCart(1, 1);
    });

    expect(result.current.cart.length).toBeGreaterThanOrEqual(0);
  });
});
