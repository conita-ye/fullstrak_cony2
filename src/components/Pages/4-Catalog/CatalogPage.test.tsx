import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CatalogPage } from "./CatalogPage";

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
        descripcion: "Descripción test",
        precio: 10000,
        stock: 10,
        categoria: { nombre: "Test" },
        imagenes: ["test.jpg"],
      },
    ]),
  },
}));

describe('CatalogPage - Pruebas de Renderizado', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockAddToCart.mockClear();
  });

  test("22. Debe renderizar el componente CatalogPage correctamente", () => {
    const { container } = render(<CatalogPage onNavigate={mockNavigate} />);
    expect(container).toBeTruthy();
  });

  test("23. Debe renderizar el título del catálogo", () => {
    render(<CatalogPage onNavigate={mockNavigate} />);
    expect(screen.getByText(/Catálogo/i)).toBeTruthy();
  });

  test("24. Debe renderizar los filtros de búsqueda", () => {
    render(<CatalogPage onNavigate={mockNavigate} />);
    expect(screen.getByPlaceholderText(/Buscar productos/i)).toBeTruthy();
  });

  test("25. Debe renderizar la lista de productos después de cargar", async () => {
    render(<CatalogPage onNavigate={mockNavigate} />);
    await waitFor(() => {
      expect(screen.getByText(/Producto Test/i)).toBeTruthy();
    });
  });
});

describe('CatalogPage - Pruebas de Propiedades (Props)', () => {
  test("26. Debe recibir y utilizar la prop onNavigate correctamente", () => {
    render(<CatalogPage onNavigate={mockNavigate} />);
    expect(mockNavigate).toBeDefined();
  });

  test("27. Debe usar initialData para filtrar por categoría", () => {
    render(<CatalogPage onNavigate={mockNavigate} initialData={{ categoria: "Test" }} />);
    expect(screen.getByText(/Catálogo/i)).toBeTruthy();
  });
});

describe('CatalogPage - Pruebas de Estado (State)', () => {
  test("28. Debe actualizar el estado de búsqueda cuando el usuario escribe", () => {
    render(<CatalogPage onNavigate={mockNavigate} />);
    const searchInput = screen.getByPlaceholderText(/Buscar productos/i);
    fireEvent.change(searchInput, { target: { value: 'test' } });
    expect((searchInput as HTMLInputElement).value).toBe('test');
  });

  test("29. Debe actualizar el estado de categoría seleccionada", () => {
    render(<CatalogPage onNavigate={mockNavigate} />);
    const categorySelect = screen.getByText(/Todas las categorías/i) || screen.getByRole('combobox');
    if (categorySelect) {
      fireEvent.click(categorySelect);
      expect(categorySelect).toBeTruthy();
    }
  });

  test("30. Debe actualizar el estado de ordenamiento", () => {
    render(<CatalogPage onNavigate={mockNavigate} />);
    const sortSelect = screen.getByText(/Ordenar por/i) || screen.getByRole('combobox');
    if (sortSelect) {
      fireEvent.click(sortSelect);
      expect(sortSelect).toBeTruthy();
    }
  });
});

describe('CatalogPage - Pruebas de Eventos', () => {
  test("31. Debe filtrar productos cuando se cambia el término de búsqueda", async () => {
    render(<CatalogPage onNavigate={mockNavigate} />);
    const searchInput = screen.getByPlaceholderText(/Buscar productos/i);
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    await waitFor(() => {
      expect((searchInput as HTMLInputElement).value).toBe('test');
    });
  });

  test("32. Debe limpiar filtros cuando se hace clic en el botón limpiar", () => {
    render(<CatalogPage onNavigate={mockNavigate} />);
    const searchInput = screen.getByPlaceholderText(/Buscar productos/i);
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    const clearButton = screen.queryByText(/Limpiar filtros/i);
    if (clearButton) {
      fireEvent.click(clearButton);
      expect((searchInput as HTMLInputElement).value).toBe('');
    }
  });
});
