export const validarEmail = (email) => {
  // Valida emails estándar (ejemplo: algo@tiendagamercony.cl / .com )
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validarTelefono = (telefono) => {
  // Remueve espacios y valida formatos internacionales
  const limpio = telefono.replace(/\s/g, '');
  const regex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
  return regex.test(limpio);
};

export const validarFormularioContacto = (datos) => {
  const errores = {};

  // Validación nombre
  if (!datos.nombre.trim()) {
    errores.nombre = 'El nombre es obligatorio';
  } else if (datos.nombre.trim().length < 2) {
    errores.nombre = 'El nombre debe tener al menos 2 caracteres';
  }

  // Validación email
  if (!datos.email.trim()) {
    errores.email = 'El email es obligatorio';
  } else if (!validarEmail(datos.email)) {
    errores.email = 'El email no es válido';
  }

  // Teléfono opcional pero válido si se incluye
  if (datos.telefono && !validarTelefono(datos.telefono)) {
    errores.telefono = 'El teléfono no es válido';
  }

  // Asunto
  if (!datos.asunto) {
    errores.asunto = 'Debes seleccionar un asunto';
  }

  // Mensaje
  if (!datos.mensaje.trim()) {
    errores.mensaje = 'El mensaje es obligatorio';
  } else if (datos.mensaje.trim().length < 10) {
    errores.mensaje = 'El mensaje debe tener al menos 10 caracteres';
  }

  return {
    esValido: Object.keys(errores).length === 0,
    errores
  };
};
