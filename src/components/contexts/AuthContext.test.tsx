import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";

vi.mock("@/services/api", () => ({
  apiService: {
    login: vi.fn().mockResolvedValue({
      accessToken: "token123",
      refreshToken: "refresh123",
      usuarioId: 1,
    }),
    getUsuario: vi.fn().mockResolvedValue({
      id: 1,
      nombre: "Test",
      rol: "CLIENTE",
    }),
    register: vi.fn().mockResolvedValue({}),
  },
}));

describe('AuthContext - Pruebas de Estado y Funciones', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("52. Debe inicializar con usuario null si no hay token", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });
    expect(result.current.user).toBeNull();
  });

  test("53. Debe cargar usuario desde localStorage si existe token", async () => {
    localStorage.setItem("accessToken", "token123");
    localStorage.setItem("user", JSON.stringify({ id: 1, nombre: "Test" }));

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    expect(result.current.user).toBeTruthy();
  });

  test("54. Debe ejecutar login correctamente", async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      const success = await result.current.login("test@test.com", "password123");
      expect(success).toBe(true);
    });

    expect(localStorage.getItem("accessToken")).toBe("token123");
  });

  test("55. Debe ejecutar logout y limpiar localStorage", async () => {
    localStorage.setItem("accessToken", "token123");
    localStorage.setItem("user", JSON.stringify({ id: 1 }));

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.logout();
    });

    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(result.current.user).toBeNull();
  });
});
