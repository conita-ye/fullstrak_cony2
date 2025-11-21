// Servicio del carrito por usuario específico
// Funciona usando localStorage para guardar un carrito distinto para cada usuario.

export const carritoUsuarioService = {
  obtenerCarrito: () => {
    const usuario = JSON.parse(localStorage.getItem('tiendagamercony_usuario'));

    // Si no hay usuario, no existe carrito se  devuelve el  arreglo vacío
    if (!usuario) return [];

    // Recuperar todos los carritos de todos los usuarios
    const carritos = JSON.parse(localStorage.getItem('carritos_cony') || '{}');

    // Devolver SOLO el carrito asociado al usuario actual según su ID
    return carritos[usuario.id] || [];
  },

  //  Guardar el carrito del usuario actual
 
  guardarCarrito: (carrito) => {
    // Obtener el usuario logueado
    const usuario = JSON.parse(localStorage.getItem('tiendagamercony_usuario'));

    // Si no hay usuario no se puede guardar nada
    if (!usuario) return;

    // Obtener todos los carritos guardados
    const carritos = JSON.parse(localStorage.getItem('carritos_cony') || '{}');

    // Guardar el carrito SOLO del usuario actual
    carritos[usuario.id] = carrito;

    // Guardar de vuelta en localStorage
    localStorage.setItem('carritos_cony', JSON.stringify(carritos));
  },

  // Agregar un producto al carrito del usuario actual
  
  agregarAlCarrito: (producto) => {
    // Primero obtener el carrito existente
    const carrito = carritoUsuarioService.obtenerCarrito();

    // Verificar si el producto YA existe en el carrito
    const existente = carrito.find(item => item.id === producto.id);

    if (existente) {
      // Si existe, solamente aumentamos la cantidad
      existente.cantidad += 1;
    } else {
      // Si no existe, lo agregamos con cantidad 1
      carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: 1
      });
    }

    // Guardar el carrito actualizado
    carritoUsuarioService.guardarCarrito(carrito);
    // Devolver el carrito final actualizado
    return carrito;
  }
};
