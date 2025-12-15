import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

vi.mock("@/services/api", () => {
  const mockGetUsuario = vi.fn().mockResolvedValue({
    id: 1,
    nombre: "Test",
    rol: "CLIENTE",
  });

  return {
    apiService: {
      login: vi.fn().mockResolvedValue({
        accessToken: "token123",
        refreshToken: "refresh123",
        usuarioId: 1,
      }),
      getUsuario: mockGetUsuario,
      register: vi.fn().mockResolvedValue({}),
    },
  };
});

describe('AuthContext - Pruebas de Estado y Funciones', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("52. Debe inicializar con usuario null si no hay token", async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 3000 });
    
    expect(result.current.user).toBeNull();
  });

  test("53. Debe cargar usuario desde localStorage si existe token", async () => {
    localStorage.setItem("accessToken", "token123");
    localStorage.setItem("user", JSON.stringify({ id: 1, nombre: "Test" }));

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 3000 });

    await waitFor(() => {
      expect(result.current.user).toBeTruthy();
    }, { timeout: 3000 });
  });

  test("54. Debe ejecutar login correctamente", async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 3000 });

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

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 3000 });

    act(() => {
      result.current.logout();
    });

    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(result.current.user).toBeNull();
  });
});
