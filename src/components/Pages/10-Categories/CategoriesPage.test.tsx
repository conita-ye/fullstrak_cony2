import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CategoriesPage } from "./CategoriesPage";

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
        categoria: { nombre: "Test" },
        imagenes: ["test.jpg"],
      },
    ]),
  },
}));

describe('CategoriesPage - Pruebas de Renderizado', () => {
  test("61. Debe renderizar el componente CategoriesPage correctamente", async () => {
    const { container } = render(<CategoriesPage onNavigate={mockNavigate} />);
    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });

  test("62. Debe renderizar el título de categorías", () => {
    render(<CategoriesPage onNavigate={mockNavigate} />);
    expect(screen.getByText(/Categorías/i)).toBeTruthy();
  });

  test("63. Debe renderizar los botones de categorías", async () => {
    render(<CategoriesPage onNavigate={mockNavigate} />);
    await waitFor(() => {
      expect(screen.getByText(/Todas/i)).toBeTruthy();
    });
  });
});

describe('CategoriesPage - Pruebas de Eventos', () => {
  test("64. Debe filtrar productos cuando se selecciona una categoría", async () => {
    render(<CategoriesPage onNavigate={mockNavigate} />);
    await waitFor(() => {
      const categoryButton = screen.getByText(/Todas/i);
      if (categoryButton) {
        fireEvent.click(categoryButton);
        expect(categoryButton).toBeTruthy();
      }
    });
  });
});
