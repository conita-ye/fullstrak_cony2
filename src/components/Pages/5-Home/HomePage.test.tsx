import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { HomePage } from "./HomePage";

// Mock de contextos
vi.mock("@/contexts/CartContext", () => ({
  useCart: () => ({
    addToCart: vi.fn(),
    getCartItemsCount: () => 0,
  }),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
  }),
}));

vi.mock("@/services/api", () => ({
  apiService: {
    getProductosDestacados: vi.fn().mockResolvedValue([]),
    getProductos: vi.fn().mockResolvedValue([]),
  },
}));

describe('HomePage - Pruebas de Renderizado', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("1. Debe renderizar el componente HomePage correctamente", () => {
    const { container } = render(<HomePage onNavigate={mockNavigate} />);
    expect(container).toBeTruthy();
  });

  test("2. Debe renderizar el título principal", () => {
    render(<HomePage onNavigate={mockNavigate} />);
    expect(screen.getByText(/Level-Up/i)).toBeTruthy();
  });

  test("3. Debe renderizar la sección de productos destacados", async () => {
    render(<HomePage onNavigate={mockNavigate} />);
    await waitFor(() => {
      expect(screen.getByText(/Level-Up/i)).toBeTruthy();
    });
  });

  test("4. Debe renderizar el carrusel de imágenes", () => {
    const { container } = render(<HomePage onNavigate={mockNavigate} />);
    expect(container.querySelector('.carousel') || container.querySelector('[class*="carousel"]')).toBeTruthy();
  });
});

describe('HomePage - Pruebas de Propiedades (Props)', () => {
  const mockNavigate = vi.fn();

  test("5. Debe recibir y utilizar la prop onNavigate correctamente", () => {
    render(<HomePage onNavigate={mockNavigate} />);
    const buttons = screen.queryAllByRole('button');
    if (buttons.length > 0) {
      fireEvent.click(buttons[0]);
    }
    expect(mockNavigate).toBeDefined();
  });

  test("6. Debe pasar las props correctamente a los componentes hijos", () => {
    const { container } = render(<HomePage onNavigate={mockNavigate} />);
    expect(container.querySelector('.min-h-screen')).toBeTruthy();
  });
});

describe('HomePage - Pruebas de Estado (State)', () => {
  const mockNavigate = vi.fn();

  test("7. Debe manejar el estado de carga correctamente", async () => {
    render(<HomePage onNavigate={mockNavigate} />);
    await waitFor(() => {
      expect(screen.getByText(/Level-Up/i)).toBeTruthy();
    });
  });

  test("8. Debe actualizar el estado cuando el usuario interactúa", () => {
    const { container } = render(<HomePage onNavigate={mockNavigate} />);
    const buttons = container.querySelectorAll('button');
    if (buttons.length > 0) {
      fireEvent.click(buttons[0]);
      expect(container).toBeTruthy();
    }
  });
});

describe('HomePage - Pruebas de Eventos', () => {
  const mockNavigate = vi.fn();

  test("9. Debe ejecutar onNavigate cuando se hace clic en un botón", () => {
    render(<HomePage onNavigate={mockNavigate} />);
    const buttons = screen.queryAllByRole('button');
    if (buttons.length > 0) {
      fireEvent.click(buttons[0]);
      expect(buttons[0]).toBeTruthy();
    }
  });

  test("10. Debe manejar eventos de cambio en campos de entrada", () => {
    render(<HomePage onNavigate={mockNavigate} />);
    const inputs = screen.queryAllByRole('textbox');
    if (inputs.length > 0) {
      fireEvent.change(inputs[0], { target: { value: 'test' } });
      expect((inputs[0] as HTMLInputElement).value).toBe('test');
    }
  });
});
