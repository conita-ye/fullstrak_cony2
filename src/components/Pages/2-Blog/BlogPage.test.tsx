import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { BlogPage } from "./BlogPage";

const mockNavigate = vi.fn();

vi.mock("@/services/api", () => ({
  apiService: {
    getBlogPosts: vi.fn().mockResolvedValue([
      {
        id: 1,
        titulo: "Blog Test",
        descripcionCorta: "Descripción test",
        fechaPublicacion: "2025-01-01",
      },
    ]),
  },
}));

describe('BlogPage - Pruebas de Renderizado', () => {
  test("87. Debe renderizar el componente BlogPage correctamente", async () => {
    const { container } = render(<BlogPage onNavigate={mockNavigate} />);
    await waitFor(() => {
      expect(container).toBeTruthy();
    });
  });

  test("88. Debe renderizar la lista de blogs", async () => {
    render(<BlogPage onNavigate={mockNavigate} />);
    await waitFor(() => {
      expect(screen.getByText(/Blog Test/i)).toBeTruthy();
    });
  });
});
