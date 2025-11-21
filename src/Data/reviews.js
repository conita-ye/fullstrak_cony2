// Servicio para manejar las reseñas de productos 

// Clave personalizada en localStorage para reseñas
const REVIEWS_KEY = 'cony_tienda_gamer_reviews_v1';

export const reviewsService = {
  
  // Obtener todas las reseñas de un producto Devuelve si no hay reseñas o si ocurre un error
  
  obtenerReseñas: (productoId) => {
    try {
      const todasLasReseñas = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '{}');
      return todasLasReseñas[productoId] || [];
    } catch {
      return [];
    }
  },

  
  // Agregar nueva reseña a un producto 
  
  agregarReseña: (productoId, reseña) => {
    try {
      const todasLasReseñas = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '{}');

      if (!todasLasReseñas[productoId]) {
        todasLasReseñas[productoId] = [];
      }

      const nuevaReseña = {
        id: Date.now(),
        usuarioNombre: reseña.usuarioNombre,
        usuarioEmail: reseña.usuarioEmail,
        rating: Number(reseña.rating) || 0,
        comentario: reseña.comentario || '',
        fecha: new Date().toISOString()
      };

      todasLasReseñas[productoId].push(nuevaReseña);
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(todasLasReseñas));

      return { exito: true, reseña: nuevaReseña };
    } catch (error) {
      return { exito: false, error: 'Error al guardar la reseña' };
    }
  },

  
  // Calcular rating promedio de un producto (1 decimal)
  calcularRatingPromedio: (productoId) => {
    const reseñas = reviewsService.obtenerReseñas(productoId);
    if (reseñas.length === 0) return 0;

    const suma = reseñas.reduce((acc, reseña) => acc + (Number(reseña.rating) || 0), 0);
    return Number((suma / reseñas.length).toFixed(1));
  },


  // Obtener estadísticas de reseñas: total, promedio y distribución por estrellas
  obtenerEstadisticas: (productoId) => {
    const reseñas = reviewsService.obtenerReseñas(productoId);
    const total = reseñas.length;

    if (total === 0) return { total: 0, promedio: 0, distribucion: {} };

    const distribucion = {
      5: reseñas.filter(r => Number(r.rating) === 5).length,
      4: reseñas.filter(r => Number(r.rating) === 4).length,
      3: reseñas.filter(r => Number(r.rating) === 3).length,
      2: reseñas.filter(r => Number(r.rating) === 2).length,
      1: reseñas.filter(r => Number(r.rating) === 1).length
    };

    return {
      total,
      promedio: reviewsService.calcularRatingPromedio(productoId),
      distribucion
    };
  }
};
