import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PurchaseFailedPage } from "./PurchaseFailedPage";

const mockNavigate = vi.fn();

describe('PurchaseFailedPage - Pruebas de Renderizado', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("73. Debe renderizar el componente PurchaseFailedPage correctamente", () => {
    const { container } = render(<PurchaseFailedPage onNavigate={mockNavigate} />);
    expect(container).toBeTruthy();
  });

  test("74. Debe mostrar el mensaje de error", () => {
    render(<PurchaseFailedPage onNavigate={mockNavigate} />);
    expect(screen.getByText(/Pago No Procesado/i)).toBeTruthy();
  });

  test("75. Debe mostrar el mensaje de error personalizado si se proporciona", () => {
    render(<PurchaseFailedPage onNavigate={mockNavigate} error="Error de tarjeta" />);
    expect(screen.getByText(/Error de tarjeta/i)).toBeTruthy();
  });
});

describe('PurchaseFailedPage - Pruebas de Eventos', () => {
  test("76. Debe navegar al carrito cuando se hace clic en volver", () => {
    render(<PurchaseFailedPage onNavigate={mockNavigate} />);
    const backButton = screen.getByText(/Volver al Carrito/i);
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('cart');
  });
});
