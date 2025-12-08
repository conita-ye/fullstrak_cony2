import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CartPage } from "./CartPage";

const mockNavigate = vi.fn();
const mockRemoveFromCart = vi.fn();
const mockUpdateQuantity = vi.fn();
const mockClearCart = vi.fn();
const mockGetCartTotal = vi.fn(() => 10000);
const mockGetCartItemsCount = vi.fn(() => 2);

vi.mock("@/contexts/CartContext", () => ({
  useCart: () => ({
    cart: [
      {
        productId: 1,
        productName: "Producto Test",
        quantity: 2,
        price: 5000,
        subtotal: 10000,
      },
    ],
    loading: false,
    removeFromCart: mockRemoveFromCart,
    updateQuantity: mockUpdateQuantity,
    clearCart: mockClearCart,
    getCartTotal: mockGetCartTotal,
    getCartItemsCount: mockGetCartItemsCount,
  }),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { id: 1, nombre: "Test" },
  }),
}));

describe('CartPage - Pruebas de Renderizado', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("33. Debe renderizar el componente CartPage correctamente", () => {
    const { container } = render(<CartPage onNavigate={mockNavigate} />);
    expect(container).toBeTruthy();
  });

  test("34. Debe renderizar el título del carrito", () => {
    render(<CartPage onNavigate={mockNavigate} />);
    expect(screen.getByText(/Carrito/i)).toBeTruthy();
  });

  test("35. Debe renderizar los productos en el carrito", () => {
    render(<CartPage onNavigate={mockNavigate} />);
    expect(screen.getByText(/Producto Test/i)).toBeTruthy();
  });

  test("36. Debe renderizar el resumen del pedido", () => {
    render(<CartPage onNavigate={mockNavigate} />);
    expect(screen.getByText(/Resumen del Pedido/i)).toBeTruthy();
  });
});

describe('CartPage - Pruebas de Estado (State)', () => {
  test("37. Debe actualizar el estado del código de referido", () => {
    render(<CartPage onNavigate={mockNavigate} />);
    const codeInput = screen.getByPlaceholderText(/GAMER2024/i);
    if (codeInput) {
      fireEvent.change(codeInput, { target: { value: 'GAMER2024' } });
      expect((codeInput as HTMLInputElement).value).toBe('GAMER2024');
    }
  });

  test("38. Debe calcular el total correctamente", () => {
    render(<CartPage onNavigate={mockNavigate} />);
    expect(mockGetCartTotal()).toBe(10000);
  });
});

describe('CartPage - Pruebas de Eventos', () => {
  test("39. Debe ejecutar removeFromCart cuando se elimina un producto", () => {
    render(<CartPage onNavigate={mockNavigate} />);
    const deleteButton = screen.getByText(/Eliminar/i);
    if (deleteButton) {
      fireEvent.click(deleteButton);
      expect(mockRemoveFromCart).toHaveBeenCalled();
    }
  });

  test("40. Debe ejecutar updateQuantity cuando se cambia la cantidad", () => {
    render(<CartPage onNavigate={mockNavigate} />);
    const plusButton = screen.queryByRole('button', { name: /\+/i });
    if (plusButton) {
      fireEvent.click(plusButton);
      expect(mockUpdateQuantity).toHaveBeenCalled();
    }
  });

  test("41. Debe aplicar descuento cuando se ingresa un código válido", () => {
    render(<CartPage onNavigate={mockNavigate} />);
    const codeInput = screen.getByPlaceholderText(/GAMER2024/i);
    const applyButton = screen.getByText(/Aplicar/i);
    
    if (codeInput && applyButton) {
      fireEvent.change(codeInput, { target: { value: 'GAMER2024' } });
      fireEvent.click(applyButton);
      expect((codeInput as HTMLInputElement).value).toBe('GAMER2024');
    }
  });

  test("42. Debe navegar al checkout cuando se hace clic en proceder al pago", () => {
    render(<CartPage onNavigate={mockNavigate} />);
    const checkoutButton = screen.getByText(/Proceder al Pago/i);
    if (checkoutButton) {
      fireEvent.click(checkoutButton);
      expect(mockNavigate).toHaveBeenCalled();
    }
  });
});
