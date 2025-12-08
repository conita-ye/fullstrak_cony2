import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { OffersPage } from "./OffersPage";

const mockNavigate = vi.fn();
const mockAddToCart = vi.fn();

vi.mock("@/contexts/CartContext", () => ({
  useCart: () => ({
    addToCart: mockAddToCart,
  }),
}));

vi.mock("@/services/api", () => ({
  apiService: {
    getProductos: vi.fn().mockResolvedValue([
      {
        id: 1,
        codigo: "TEST001",
        nombre: "Producto Test",
        stock: 2,
        stockCritico: 5,
        puntosLevelUp: 600,
        categoria: { nombre: "Test" },
        imagenes: ["test.jpg"],
      },
    ]),
  },
}));

describe('OffersPage - Pruebas de Renderizado', () => {
  test("77. Debe renderizar el componente OffersPage correctamente", async () => {
    const { container } = render(<OffersPage onNavigate={mockNavigate} />);
    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });

  test("78. Debe renderizar el título de ofertas", () => {
    render(<OffersPage onNavigate={mockNavigate} />);
    expect(screen.getByText(/Ofertas Especiales/i)).toBeTruthy();
  });

  test("79. Debe filtrar productos en oferta correctamente", async () => {
    render(<OffersPage onNavigate={mockNavigate} />);
    await waitFor(() => {
      expect(screen.getByText(/Producto Test/i)).toBeTruthy();
    });
  });
});
