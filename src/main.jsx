const USUARIO_KEY = 'levelupgamer_usuario';

// Email de admin DEFINITIVO (tu correo)
const esEmailAdmin = (email) => {
  const emailsAdmin = [
    'co.admin@tiendagamercony.cl'
  ];
  return emailsAdmin.includes(email);
};

export const authService = {
  registrar: (email, password, nombre) => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

    if (usuarios.find(u => u.email === email)) {
      return { exito: false, error: 'El usuario ya existe' };
    }

    const nuevoUsuario = {
      id: Date.now(),
      email,
      password,
      nombre,
      fechaRegistro: new Date().toISOString(),
      role: esEmailAdmin(email) ? 'admin' : 'user'
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    localStorage.setItem(USUARIO_KEY, JSON.stringify(nuevoUsuario));

    return { exito: true, usuario: nuevoUsuario };
  },

  login: (email, password) => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find(u => u.email === email && u.password === password);

    if (!usuario) {
      return { exito: false, error: 'Credenciales incorrectas' };
    }

    const usuarioConRole = { 
      ...usuario, 
      role: usuario.role || (esEmailAdmin(usuario.email) ? 'admin' : 'user') 
    };

    localStorage.setItem(USUARIO_KEY, JSON.stringify(usuarioConRole));
    return { exito: true, usuario: usuarioConRole };
  },

  logout: () => {
    localStorage.removeItem(USUARIO_KEY);
  },

  obtenerUsuarioActual: () => {
    try {
      const u = JSON.parse(localStorage.getItem(USUARIO_KEY));
      return u ? { ...u, role: u.role || (esEmailAdmin(u.email) ? 'admin' : 'user') } : null;
    } catch {
      return null;
    }
  },

  estaAutenticado: () => {
    return !!localStorage.getItem(USUARIO_KEY);
  }
};
