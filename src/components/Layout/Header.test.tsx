import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "./Header";

const mockNavigate = vi.fn();

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    logout: vi.fn(),
    isAuthenticated: false,
  }),
}));

vi.mock("@/contexts/CartContext", () => ({
  useCart: () => ({
    getCartItemsCount: () => 0,
  }),
}));

describe('Header - Pruebas de Renderizado', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("80. Debe renderizar el componente Header correctamente", () => {
    const { container } = render(<Header onNavigate={mockNavigate} currentPage="home" />);
    expect(container).toBeTruthy();
  });

  test("81. Debe renderizar el logo o título", () => {
    render(<Header onNavigate={mockNavigate} currentPage="home" />);
    expect(screen.getByText(/LEVEL-UP/i)).toBeTruthy();
  });

  test("82. Debe renderizar los elementos de navegación", () => {
    render(<Header onNavigate={mockNavigate} currentPage="home" />);
    expect(screen.getByText(/Inicio/i) || screen.getByText(/Tienda/i)).toBeTruthy();
  });
});

describe('Header - Pruebas de Propiedades', () => {
  test("83. Debe recibir y usar la prop onNavigate correctamente", () => {
    render(<Header onNavigate={mockNavigate} currentPage="home" />);
    const logo = screen.getByText(/LEVEL-UP/i);
    if (logo) {
      fireEvent.click(logo);
      expect(mockNavigate).toHaveBeenCalled();
    }
  });

  test("84. Debe mostrar el botón de login cuando el usuario no está autenticado", () => {
    render(<Header onNavigate={mockNavigate} currentPage="home" />);
    expect(screen.getByText(/Ingresar/i)).toBeTruthy();
  });
});

describe('Header - Pruebas de Eventos', () => {
  test("85. Debe navegar cuando se hace clic en el logo", () => {
    render(<Header onNavigate={mockNavigate} currentPage="home" />);
    const logo = screen.getByText(/LEVEL-UP/i);
    fireEvent.click(logo);
    expect(mockNavigate).toHaveBeenCalledWith('home');
  });

  test("86. Debe navegar cuando se hace clic en un elemento del menú", () => {
    render(<Header onNavigate={mockNavigate} currentPage="home" />);
    const catalogButton = screen.getByText(/Tienda/i);
    if (catalogButton) {
      fireEvent.click(catalogButton);
      expect(mockNavigate).toHaveBeenCalledWith('catalog');
    }
  });
});
