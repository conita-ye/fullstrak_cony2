
// La Tienda Gamer de Cony - Servicio LocalStorage  Manejo de carrito y órdenes del usuario

// Claves personalizadas para esta tienda
const CARRITO_KEY = 'cony_tienda_gamer_carrito';
const ORDERS_KEY = 'cony_tienda_gamer_ordenes_v1';

// Servicio principal
export const localStorageService = {

  
  // Obtiene el carrito guardado en el navegador-
  obtenerCarrito: () => {
    try {
      return JSON.parse(localStorage.getItem(CARRITO_KEY)) || [];
    } catch {
      return [];
    }
  },

  
  // Guarda el carrito actualizado
  guardarCarrito: (carrito) => {
    localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
  },

  
  // Agregar un producto al carrito  Si ya existe aumenta cantidad
  // Si no existe se agrega como nuevo
  
  agregarAlCarrito: (producto) => {
    const carrito = localStorageService.obtenerCarrito();
    const existente = carrito.find(item => item.id === producto.id);
    
    if (existente) {
      existente.cantidad += 1; // aumenta
    } else {
      carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: 1
      });
    }
    
    localStorageService.guardarCarrito(carrito);
    return carrito;
  },

  // Eliminar un producto por su ID
  eliminarDelCarrito: (productoId) => {
    const carrito = localStorageService
      .obtenerCarrito()
      .filter(item => item.id !== productoId);

    localStorageService.guardarCarrito(carrito);
    return carrito;
  },

  
  // Actualizar cantidad de un producto Si cantidad <= 0 se elimina el producto
  actualizarCantidad: (productoId, cantidad) => {
    const carrito = localStorageService.obtenerCarrito();
    const item = carrito.find(item => item.id === productoId);
    
    if (item) {
      if (cantidad <= 0) {
        return localStorageService.eliminarDelCarrito(productoId);
      }

      item.cantidad = cantidad;
      localStorageService.guardarCarrito(carrito);
    }
    
    return carrito;
  }
};


//  metodos para comprar 

// Crear una nueva orden y guardarla
localStorageService.crearOrden = (orden) => {
  try {
    const ordenes = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    ordenes.push(orden);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(ordenes));
    return orden;
  } catch (e) {
    console.error('Error creando orden', e);
    return null;
  }
};

// Obtener todas las órdenes registradas
localStorageService.obtenerOrdenes = () => {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  } catch {
    return [];
  }
};

// Vaciar completamente el carrito
localStorageService.vaciarCarrito = () => {
  localStorageService.guardarCarrito([]);
  return [];
};
