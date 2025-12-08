import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AdminPage } from "./AdminPage";

const mockNavigate = vi.fn();

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { id: 1, rol: "ADMINISTRADOR", nombre: "Admin" },
    isAuthenticated: true,
  }),
}));

vi.mock("@/services/api", () => ({
  apiService: {
    getProductos: vi.fn().mockResolvedValue([
      {
        id: 1,
        codigo: "TEST001",
        nombre: "Producto Test",
        precio: 10000,
        stock: 10,
        categoria: { nombre: "Test" },
        imagenes: ["test.jpg"],
      },
    ]),
    createProducto: vi.fn().mockResolvedValue({}),
    updateProducto: vi.fn().mockResolvedValue({}),
    deleteProducto: vi.fn().mockResolvedValue({}),
  },
}));

describe('AdminPage - Pruebas de Renderizado', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("49. Debe renderizar el componente AdminPage correctamente", async () => {
    const { container } = render(<AdminPage onNavigate={mockNavigate} />);
    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });

  test("50. Debe renderizar el panel de administración solo para administradores", async () => {
    render(<AdminPage onNavigate={mockNavigate} />);
    await waitFor(() => {
      expect(screen.getByText(/Panel de Administración/i)).toBeTruthy();
    });
  });

  test("51. Debe mostrar acceso denegado para usuarios no administradores", () => {
    vi.mock("@/contexts/AuthContext", () => ({
      useAuth: () => ({
        user: { id: 1, rol: "CLIENTE" },
        isAuthenticated: true,
      }),
    }));

    render(<AdminPage onNavigate={mockNavigate} />);
    expect(screen.getByText(/Acceso Denegado/i)).toBeTruthy();
  });
});
