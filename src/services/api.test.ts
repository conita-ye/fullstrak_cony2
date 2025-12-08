import { describe, test, expect, vi, beforeEach } from "vitest";
import { apiService } from "./api";

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    })),
    post: vi.fn(),
  },
}));

describe('ApiService - Pruebas de Funcionalidad', () => {
  test("96. Debe tener método login definido", () => {
    expect(typeof apiService.login).toBe("function");
  });

  test("97. Debe tener método getProductos definido", () => {
    expect(typeof apiService.getProductos).toBe("function");
  });

  test("98. Debe tener método addToCart definido", () => {
    expect(typeof apiService.addToCart).toBe("function");
  });

  test("99. Debe tener método register definido", () => {
    expect(typeof apiService.register).toBe("function");
  });

  test("100. Debe tener método getUsuario definido", () => {
    expect(typeof apiService.getUsuario).toBe("function");
  });
});
