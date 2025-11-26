import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('authService (Utils/Auth.js)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('registrar asigna role admin para co.admin@tiendagamercony.cl', async () => {
    const mod = await import('../../Utils/Auth.js');
    const { authService } = mod;

    const res = authService.registrar('co.admin@tiendagamercony.cl', 'adminpass', 'Admin');
    expect(res.exito).toBe(true);

    const usuarios = JSON.parse(localStorage.getItem('usuarios'));
    const u = usuarios.find(x => x.email === 'co.admin@tiendagamercony.cl');

    expect(u).toBeTruthy();
    expect(u.role).toBe('admin');
  });

  it('login retorna exito para usuario registrado', async () => {
    const mod = await import('../../Utils/Auth.js');
    const { authService } = mod;

    authService.registrar('user@example.com', 'pwd', 'User');

    const res = authService.login('user@example.com', 'pwd');
    expect(res.exito).toBe(true);

    const current = authService.obtenerUsuarioActual();
    expect(current.email).toBe('user@example.com');
    expect(current.role).toBe('user');
  });
});
