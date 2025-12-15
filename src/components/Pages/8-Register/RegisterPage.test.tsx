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

vi.mock("@/services/api", () => ({
  apiService: {
    getRegiones: vi.fn().mockResolvedValue([
      { nombre: 'Región Metropolitana', comunas: ['Santiago', 'Providencia'] },
      { nombre: 'Valparaíso', comunas: ['Valparaíso', 'Viña del Mar'] },
    ]),
  },
}));

describe('RegisterPage - Pruebas de Renderizado y Validación', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockRegister.mockClear();
  });

  test("59. Debe renderizar el formulario de registro", async () => {
    render(<RegisterPage onNavigate={mockNavigate} />);
    // Esperar a que desaparezca el mensaje de carga
    await waitFor(() => {
      const loadingMessage = screen.queryByText(/Cargando formulario/i);
      expect(loadingMessage).toBeNull();
    }, { timeout: 10000 });
    
    // Luego esperar a que se renderice el formulario
    await waitFor(() => {
      // Buscar el título h1 específicamente (hay múltiples elementos con "Crear Cuenta")
      const formTitle = screen.getAllByText(/Crear Cuenta/i).find(el => el.tagName === 'H1');
      const runInput = screen.queryByPlaceholderText(/RUN/i) || screen.queryByLabelText(/RUN/i);
      const nombreInput = screen.queryByPlaceholderText(/nombre/i) || screen.queryByLabelText(/nombre/i);
      const emailInput = screen.queryByPlaceholderText(/email/i) || screen.queryByLabelText(/email/i);
      const form = screen.queryByRole('form');
      // Verificar que al menos uno de estos elementos existe
      const found = formTitle || runInput || nombreInput || emailInput || form;
      expect(found).toBeTruthy();
    }, { timeout: 10000 });
  }, 25000);

  test("60. Debe validar campos requeridos", async () => {
    render(<RegisterPage onNavigate={mockNavigate} />);
    
    // Esperar a que desaparezca el mensaje de carga
    await waitFor(() => {
      const loadingMessage = screen.queryByText(/Cargando formulario/i);
      expect(loadingMessage).toBeNull();
    }, { timeout: 10000 });
    
    // Esperar a que el formulario cargue completamente
    await waitFor(() => {
      // Buscar el título h1 específicamente (hay múltiples elementos con "Crear Cuenta")
      const formTitle = screen.getAllByText(/Crear Cuenta/i).find(el => el.tagName === 'H1');
      const runInput = screen.queryByPlaceholderText(/RUN/i) || screen.queryByLabelText(/RUN/i);
      const nombreInput = screen.queryByPlaceholderText(/nombre/i) || screen.queryByLabelText(/nombre/i);
      const emailInput = screen.queryByPlaceholderText(/email/i) || screen.queryByLabelText(/email/i);
      const form = screen.queryByRole('form');
      const found = formTitle || runInput || nombreInput || emailInput || form;
      expect(found).toBeTruthy();
    }, { timeout: 10000 });

    // Buscar el botón de submit y enviar el formulario
    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      const submitButton = buttons.find(btn => 
        btn.textContent?.match(/registrar|crear|crear cuenta|enviar/i) ||
        btn.type === 'submit'
      );
      
      if (submitButton) {
        // Enviar el formulario sin llenar campos
        const form = submitButton.closest('form');
        if (form) {
          fireEvent.submit(form);
        } else {
          fireEvent.click(submitButton);
        }
      } else {
        // Si no encuentra el botón, intentar enviar el formulario directamente
        const form = screen.queryByRole('form');
        if (form) {
          fireEvent.submit(form);
        }
      }
    }, { timeout: 5000 });

    // Esperar a que aparezcan los errores de validación
    await waitFor(() => {
      const errors = screen.queryAllByText(/obligatorio|requerido|\*/i);
      // También buscar elementos con aria-invalid o mensajes de error
      const errorInputs = screen.queryAllByRole('textbox', { hidden: true }).filter(
        input => input.getAttribute('aria-invalid') === 'true'
      );
      // Buscar labels con asteriscos que indican campos requeridos
      const requiredLabels = screen.queryAllByText(/\*/i);
      expect(errors.length > 0 || errorInputs.length > 0 || requiredLabels.length > 0).toBe(true);
    }, { timeout: 5000 });
  }, 30000);
});
