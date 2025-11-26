import { validarEmail } from '../../Utils/Validaciones.js';

describe('validarEmail', () => {

  test('debe considerar válidos correos con dominios conocidos (.cl, .com, .ar)', () => {
    expect(validarEmail('persona@ejemplo.cl')).toBe(true);
    expect(validarEmail('mi.correo@sub.ejemplo.com')).toBe(true);
    expect(validarEmail('alguien@correo.ar')).toBe(true);
  });

  test('debe marcar como inválidos los correos con formato incorrecto', () => {
    expect(validarEmail('sin_arroba.com')).toBe(false);
    expect(validarEmail('correo@dominio')).toBe(false);
    expect(validarEmail('nombre@dominio.')).toBe(false);
    expect(validarEmail('nombre@.com')).toBe(false);
  });

});
