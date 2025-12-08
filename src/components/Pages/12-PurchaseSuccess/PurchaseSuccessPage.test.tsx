import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PurchaseSuccessPage } from "./PurchaseSuccessPage";

const mockNavigate = vi.fn();

describe('PurchaseSuccessPage - Pruebas de Renderizado', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("69. Debe renderizar el componente PurchaseSuccessPage correctamente", () => {
    const { container } = render(<PurchaseSuccessPage onNavigate={mockNavigate} />);
    expect(container).toBeTruthy();
  });

  test("70. Debe mostrar el mensaje de compra exitosa", () => {
    render(<PurchaseSuccessPage onNavigate={mockNavigate} />);
    expect(screen.getByText(/Compra Exitosa/i)).toBeTruthy();
  });

  test("71. Debe mostrar el número de orden si se proporciona", () => {
    render(<PurchaseSuccessPage onNavigate={mockNavigate} orderId="ORD123" />);
    expect(screen.getByText(/ORD123/i)).toBeTruthy();
  });
});

describe('PurchaseSuccessPage - Pruebas de Eventos', () => {
  test("72. Debe navegar al inicio cuando se hace clic en el botón", () => {
    render(<PurchaseSuccessPage onNavigate={mockNavigate} />);
    const homeButton = screen.getByText(/Volver al Inicio/i);
    fireEvent.click(homeButton);
    expect(mockNavigate).toHaveBeenCalledWith('home');
  });
});
