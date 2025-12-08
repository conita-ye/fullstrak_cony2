import { describe, test, expect } from "vitest";
import { validateEmail, validateRut, formatPrice, validateProductCode, validatePrice, validateStock } from "./validations";

describe('Validations - Pruebas de Funciones de Validación', () => {
  test("91. Debe validar emails correctamente", () => {
    expect(validateEmail("test@duoc.cl")).toBe(true);
    expect(validateEmail("test@gmail.com")).toBe(true);
    expect(validateEmail("invalid-email")).toBe(false);
  });

  test("92. Debe formatear precios correctamente", () => {
    expect(formatPrice(10000)).toContain("$10.000");
    expect(formatPrice(1000000)).toContain("$1.000.000");
  });

  test("93. Debe validar códigos de producto", () => {
    expect(validateProductCode("ABC123")).toBe(true);
    expect(validateProductCode("AB")).toBe(false);
  });

  test("94. Debe validar precios", () => {
    expect(validatePrice(1000)).toBe(true);
    expect(validatePrice(-100)).toBe(false);
  });

  test("95. Debe validar stock", () => {
    expect(validateStock(10)).toBe(true);
    expect(validateStock(-5)).toBe(false);
  });
});
