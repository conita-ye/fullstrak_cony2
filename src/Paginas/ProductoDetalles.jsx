import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaArrowLeft, FaUser } from 'react-icons/fa';
import { obtenerProductoPorId } from '../Data/productos';
import { localStorageService } from '../Data/localStorage';
import { reviewsService } from '../Data/reviews';
import { authService } from '../Utils/Auth';

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [reseñas, setReseñas] = useState([]);
  const [estadisticas, setEstadisticas] = useState({ total: 0, promedio: 0, distribucion: {} });
  const [mostrarFormReseña, setMostrarFormReseña] = useState(false);
  const [nuevaReseña, setNuevaReseña] = useState({ rating: 5, comentario: '' });

  useEffect(() => {
    const productoData = obtenerProductoPorId(id);
    if (!productoData) {
      navigate('/productos');
      return;
    }
    setProducto(productoData);

    // Cargar reseñas y estadísticas
    const reseñasProducto = reviewsService.obtenerReseñas(parseInt(id));
    const stats = reviewsService.obtenerEstadisticas(parseInt(id));
    setReseñas(reseñasProducto);
    setEstadisticas(stats);
  }, [id, navigate]);

  const mostrarToast = (msg, tiempo = 3000) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: '' }), tiempo);
  };

  const manejarAgregarCarrito = () => {
    for (let i = 0; i < cantidad; i++) {
      localStorageService.agregarAlCarrito(producto);
    }
    window.dispatchEvent(new Event('storage'));
    mostrarToast(`¡${cantidad} ${producto.nombre} agregado(s) al carrito!`);
  };

  const manejarEnviarReseña = () => {
    const usuario = authService.obtenerUsuarioActual();

    if (!usuario) {
      mostrarToast('Debes iniciar sesión para dejar una reseña');
      return;
    }

    const resultado = reviewsService.agregarReseña(parseInt(id), {
      usuarioNombre: usuario.nombre,
      usuarioEmail: usuario.email,
      rating: nuevaReseña.rating,
      comentario: nuevaReseña.comentario
    });

    if (resultado.exito) {
      const reseñasActualizadas = reviewsService.obtenerReseñas(parseInt(id));
      const statsActualizadas = reviewsService.obtenerEstadisticas(parseInt(id));
      setReseñas(reseñasActualizadas);
      setEstadisticas(statsActualizadas);

      setNuevaReseña({ rating: 5, comentario: '' });
      setMostrarFormReseña(false);
      mostrarToast('¡Reseña agregada exitosamente!');
    } else {
      mostrarToast('Error al agregar la reseña');
    }
  };

  const renderizarEstrellas = (rating, tamaño = 16) => (
    <div className="d-flex align-items-center">
      {[1, 2, 3, 4, 5].map(estrella => (
        <FaStar
          key={estrella}
          size={tamaño}
          color={estrella <= rating ? '#ffc107' : '#e4e5e9'}
          className="me-1"
        />
      ))}
    </div>
  );

  if (!producto) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item"><Link to="/productos">Productos</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{producto.nombre}</li>
        </ol>
      </nav>

      <div className="row">
        <div className="col-12">
          <div className="detalle-flex d-flex flex-column flex-md-row">
            <div className="detalle-left pe-md-3 mb-3 mb-md-0">
              <div className="detalle-imagen-contenedor rounded shadow-sm">
                <img
                  src={producto.imagen || '/placeholder-image.png'}
                  alt={producto.nombre}
                  className="img-fluid"
                  onError={(e) => { e.target.src = '/placeholder-image.png'; }}
                />
              </div>
            </div>

            <div className="detalle-right ps-md-3 d-flex flex-column">
              <div className="detalle-contenido">
                <h1 className="display-6 fw-bold mb-3">{producto.nombre}</h1>

                <div className="d-flex align-items-center mb-3">
                  <div className="me-3 d-flex align-items-center gap-2">
                    {renderizarEstrellas(producto.rating, 18)}
                    <span className="fw-semibold">{producto.rating}</span>
                  </div>
                  <span className="text-muted">({estadisticas.total || 0} reseñas)</span>
                </div>

                <h2 className="text-primary mb-4">${producto.precio.toLocaleString('es-CL')}</h2>

                <p className="lead mb-4">{producto.descripcion}</p>

                <div className="mb-4">
                  <span className={`badge ${producto.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                    {producto.stock > 0 ? 'En Stock' : 'Agotado'}
                  </span>
                </div>

                <div className="row g-3 align-items-center mb-4">
                  <div className="col-auto">
                    <label className="form-label fw-bold">Cantidad:</label>
                  </div>
                  <div className="col-auto">
                    <div className="input-group" style={{ width: '140px' }}>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                        disabled={cantidad <= 1}
                        type="button"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className="form-control text-center fw-bold"
                        value={cantidad}
                        readOnly
                        style={{ minWidth: '60px' }}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                        disabled={cantidad >= producto.stock}
                        type="button"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="col-auto">
                    <small className="text-muted">Stock disponible: {producto.stock} unidades</small>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <button
                    className="btn btn-cony btn-lg flex-fill"
                    onClick={manejarAgregarCarrito}
                    disabled={producto.stock === 0}
                  >
                    <FaShoppingCart className="me-2" /> Agregar al Carrito
                  </button>

                  <button className="btn btn-outline-primary btn-lg" onClick={() => mostrarToast('Función de comprar ahora no implementada')}>
                    Comprar Ahora
                  </button>
                </div>
              </div>

              <div className="mt-3 mt-md-4 mt-auto">
                <Link to="/productos" className="btn btn-outline-secondary">
                  <FaArrowLeft className="me-2" /> Volver a Productos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reseñas */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">Reseñas y Calificaciones</h5>
                <div className="d-flex align-items-center gap-2">
                  {renderizarEstrellas(estadisticas.promedio, 20)}
                  <span className="fw-bold">{estadisticas.promedio}</span>
                  <span className="text-muted">({estadisticas.total} reseñas)</span>
                </div>
              </div>

              <button
                className="btn btn-outline-cony"
                onClick={() => setMostrarFormReseña(v => !v)}
              >
                Escribir Reseña
              </button>
            </div>

            <div className="card-body">
              {/* Form de reseña (usa clases del tema, no estilos inline) */}
              {mostrarFormReseña && (
                <div className="border rounded p-3 mb-4 bg-card-soft">
                  <h6 className="mb-3">Escribir una reseña</h6>

                  <div className="mb-3">
                    <label className="form-label">Calificación</label>
                    <div className="d-flex gap-1">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          type="button"
                          className="btn btn-link p-0"
                          onClick={() => setNuevaReseña({ ...nuevaReseña, rating })}
                        >
                          <FaStar size={24} color={rating <= nuevaReseña.rating ? '#ffc107' : '#e4e5e9'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Comentario</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={nuevaReseña.comentario}
                      onChange={(e) => setNuevaReseña({ ...nuevaReseña, comentario: e.target.value })}
                      placeholder="Comparte tu experiencia con este producto..."
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-cony"
                      onClick={manejarEnviarReseña}
                      disabled={!nuevaReseña.comentario.trim()}
                    >
                      Enviar Reseña
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setMostrarFormReseña(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* Lista de reseñas */}
              <div className="reseñas-list">
                {reseñas.length === 0 ? (
                  <div className="text-center text-muted py-4">
                    <p>No hay reseñas aún. ¡Sé el primero en dejar una reseña!</p>
                  </div>
                ) : (
                  reseñas.map(reseña => (
                    <div key={reseña.id} className="border-bottom py-3">
                      <div className="d-flex align-items-start gap-3">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle bg-avatar"
                          style={{ width: '40px', height: '40px' }}
                        >
                          <FaUser className="text-white" />
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="fw-semibold">{reseña.usuarioNombre}</span>
                            {renderizarEstrellas(reseña.rating, 14)}
                          </div>
                          <p className="mb-1 text-muted">{reseña.comentario}</p>
                          <small className="text-muted">
                            {new Date(reseña.fecha).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast.visible && (
        <div className="toast-notification">
          <div className="toast-card shadow-sm">
            <div className="toast-body d-flex align-items-center small">
              <div className="toast-icon d-inline-flex align-items-center justify-content-center me-3">
                <FaShoppingCart />
              </div>
              <div className="toast-text">{toast.message}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductoDetalle;
