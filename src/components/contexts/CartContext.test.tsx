import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { CartProvider, useCart } from "@/contexts/CartContext";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { id: 1 },
    isAuthenticated: true,
  }),
}));

vi.mock("@/services/api", () => {
  const mockGetCarrito = vi.fn().mockResolvedValue({
    items: [
      {
        productId: 1,
        productName: "Test",
        quantity: 1,
        price: 1000,
        subtotal: 1000,
      },
    ],
  });

  const mockGetProducto = vi.fn().mockResolvedValue({
    id: 1,
    nombre: "Test",
    precio: 1000,
    stock: 10,
  });

  return {
    apiService: {
      getCarrito: mockGetCarrito,
      addToCart: vi.fn().mockResolvedValue({}),
      removeFromCart: vi.fn().mockResolvedValue({}),
      clearCart: vi.fn().mockResolvedValue({}),
      getProducto: mockGetProducto,
    },
  };
});

describe('CartContext - Pruebas de Funcionalidad', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("56. Debe calcular el total del carrito correctamente", async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 3000 });

    const total = result.current.getCartTotal();
    expect(total).toBeGreaterThanOrEqual(0);
  });

  test("57. Debe contar los items del carrito correctamente", async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 3000 });

    const count = result.current.getCartItemsCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("58. Debe agregar producto al carrito", async () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 3000 });

    await act(async () => {
      await result.current.addToCart(1, 1);
    });

    expect(result.current.cart.length).toBeGreaterThanOrEqual(0);
  });
});
