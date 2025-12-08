import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginPage } from "./LoginPage";

const mockNavigate = vi.fn();
const mockLogin = vi.fn().mockResolvedValue(true);

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
    user: null,
    isAuthenticated: false,
  }),
}));

describe('LoginPage - Pruebas de Renderizado', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockLogin.mockClear();
  });

  test("11. Debe renderizar el componente LoginPage correctamente", () => {
    const { container } = render(<LoginPage onNavigate={mockNavigate} />);
    expect(container).toBeTruthy();
  });

  test("12. Debe renderizar el formulario de login", () => {
    render(<LoginPage onNavigate={mockNavigate} />);
    expect(screen.getByText(/Iniciar Sesión/i)).toBeTruthy();
  });

  test("13. Debe renderizar los campos de email y contraseña", () => {
    render(<LoginPage onNavigate={mockNavigate} />);
    expect(screen.getByPlaceholderText(/email/i) || screen.getByLabelText(/correo/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/••••/i) || screen.getByLabelText(/contraseña/i)).toBeTruthy();
  });

  test("14. Debe renderizar el botón de iniciar sesión", () => {
    render(<LoginPage onNavigate={mockNavigate} />);
    expect(screen.getByText(/Iniciar Sesión/i) || screen.getByRole('button', { name: /iniciar/i })).toBeTruthy();
  });

  test("15. Debe renderizar el botón de registrarse", () => {
    render(<LoginPage onNavigate={mockNavigate} />);
    expect(screen.getByText(/Registrarse/i) || screen.getByText(/Regístrate/i)).toBeTruthy();
  });
});

describe('LoginPage - Pruebas de Propiedades (Props)', () => {
  test("16. Debe recibir la prop onNavigate y ejecutarla al hacer clic en registrarse", () => {
    render(<LoginPage onNavigate={mockNavigate} />);
    const registerButton = screen.getByText(/Registrarse/i) || screen.getByText(/Regístrate/i);
    if (registerButton) {
      fireEvent.click(registerButton);
      expect(mockNavigate).toHaveBeenCalledWith('register');
    }
  });
});

describe('LoginPage - Pruebas de Estado (State)', () => {
  test("17. Debe actualizar el estado del email cuando el usuario escribe", () => {
    render(<LoginPage onNavigate={mockNavigate} />);
    const emailInput = screen.getByPlaceholderText(/email/i) || screen.getByLabelText(/correo/i);
    if (emailInput) {
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      expect((emailInput as HTMLInputElement).value).toBe('test@test.com');
    }
  });

  test("18. Debe actualizar el estado de la contraseña cuando el usuario escribe", () => {
    render(<LoginPage onNavigate={mockNavigate} />);
    const passwordInput = screen.getByPlaceholderText(/••••/i) || screen.getByLabelText(/contraseña/i);
    if (passwordInput) {
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      expect((passwordInput as HTMLInputElement).value).toBe('password123');
    }
  });

  test("19. Debe mostrar errores de validación cuando los campos están vacíos", async () => {
    render(<LoginPage onNavigate={mockNavigate} />);
    const submitButton = screen.getByRole('button', { name: /iniciar/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      const errorMessages = screen.queryAllByText(/obligatorio|requerido/i);
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });
});

describe('LoginPage - Pruebas de Eventos', () => {
  test("20. Debe ejecutar login cuando se envía el formulario con datos válidos", async () => {
    render(<LoginPage onNavigate={mockNavigate} />);
    const emailInput = screen.getByPlaceholderText(/email/i) || screen.getByLabelText(/correo/i);
    const passwordInput = screen.getByPlaceholderText(/••••/i) || screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /iniciar/i });

    if (emailInput && passwordInput) {
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });
    }
  });

  test("21. Debe validar el formato del email", async () => {
    render(<LoginPage onNavigate={mockNavigate} />);
    const emailInput = screen.getByPlaceholderText(/email/i) || screen.getByLabelText(/correo/i);
    const submitButton = screen.getByRole('button', { name: /iniciar/i });

    if (emailInput) {
      fireEvent.change(emailInput, { target: { value: 'email-invalido' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const errorMessage = screen.queryByText(/inválido|válido/i);
        expect(errorMessage).toBeTruthy();
      });
    }
  });
});
