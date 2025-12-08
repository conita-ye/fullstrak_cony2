import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RegisterPage } from "./RegisterPage";

const mockNavigate = vi.fn();
const mockRegister = vi.fn().mockResolvedValue(true);

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    register: mockRegister,
  }),
}));

describe('RegisterPage - Pruebas de Renderizado y Validación', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockRegister.mockClear();
  });

  test("59. Debe renderizar el formulario de registro", () => {
    render(<RegisterPage onNavigate={mockNavigate} />);
    expect(screen.getByText(/Registro|Registrarse/i)).toBeTruthy();
  });

  test("60. Debe validar campos requeridos", async () => {
    render(<RegisterPage onNavigate={mockNavigate} />);
    const submitButton = screen.getByRole('button', { name: /registrar|crear/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errors = screen.queryAllByText(/obligatorio|requerido/i);
      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
