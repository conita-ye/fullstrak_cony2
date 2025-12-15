import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ContactPage } from "./ContactPage";

vi.mock("@/services/api", () => ({
  apiService: {
    enviarContacto: vi.fn().mockResolvedValue({}),
  },
}));

describe('ContactPage - Pruebas de Renderizado', () => {
  test("89. Debe renderizar el componente ContactPage correctamente", () => {
    const { container } = render(<ContactPage />);
    expect(container).toBeTruthy();
  });

  test("90. Debe renderizar el formulario de contacto", () => {
    render(<ContactPage />);
    const contactElements = screen.getAllByText(/Contacto/i);
    expect(contactElements.length).toBeGreaterThan(0);
  });
});
