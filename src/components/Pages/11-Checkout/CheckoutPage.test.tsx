import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CheckoutPage } from "./CheckoutPage";

const mockNavigate = vi.fn();
const mockGetCartTotal = vi.fn(() => 10000);
const mockClearCart = vi.fn();

vi.mock("@/contexts/CartContext", () => ({
  useCart: () => ({
    cart: [{ productId: 1, productName: "Test", quantity: 1, price: 10000, subtotal: 10000 }],
    getCartTotal: mockGetCartTotal,
    clearCart: mockClearCart,
  }),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { id: 1, nombre: "Test" },
    isAuthenticated: true,
  }),
}));

vi.mock("@/services/api", () => ({
  apiService: {
    getRegiones: vi.fn().mockResolvedValue([{ id: 1, nombre: "Región Metropolitana" }]),
  },
}));

describe('CheckoutPage - Pruebas de Renderizado', () => {
  test("65. Debe renderizar el componente CheckoutPage correctamente", () => {
    const { container } = render(<CheckoutPage onNavigate={mockNavigate} />);
    expect(container).toBeTruthy();
  });

  test("66. Debe renderizar el formulario de checkout", () => {
    render(<CheckoutPage onNavigate={mockNavigate} />);
    expect(screen.getByText(/Checkout/i)).toBeTruthy();
  });

  test("67. Debe renderizar los campos del formulario", () => {
    render(<CheckoutPage onNavigate={mockNavigate} />);
    expect(screen.getByLabelText(/Nombre/i) || screen.getByPlaceholderText(/nombre/i)).toBeTruthy();
  });
});

describe('CheckoutPage - Pruebas de Estado', () => {
  test("68. Debe actualizar el estado del formulario cuando el usuario escribe", () => {
    render(<CheckoutPage onNavigate={mockNavigate} />);
    const nombreInput = screen.getByLabelText(/Nombre/i) || screen.getByPlaceholderText(/nombre/i);
    if (nombreInput) {
      fireEvent.change(nombreInput, { target: { value: 'Juan' } });
      expect((nombreInput as HTMLInputElement).value).toBe('Juan');
    }
  });
});
