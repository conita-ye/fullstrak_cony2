import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';
import { localStorageService } from '../Data/localStorage';
import { obtenerProductoPorId } from '../Data/productos';

const formatCLP = (n) => `$${Number(n).toLocaleString('es-CL')}`;

const Carrito = () => {
  const [itemsCarrito, setItemsCarrito] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarCarrito();
    
    
    const onStorage = () => cargarCarrito();
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const cargarCarrito = () => {
    const carrito = localStorageService.obtenerCarrito();
    const itemsConDetalles = carrito.map(item => ({
      ...item,
      ...obtenerProductoPorId(item.id) || {}
    }));
    setItemsCarrito(itemsConDetalles);
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(productoId);
      return;
    }

    const producto = obtenerProductoPorId(productoId);
    if (producto && nuevaCantidad > producto.stock) {
      // alerta amigable en vez de alert()
      window.alert(`Lo siento, sólo hay ${producto.stock} unidades disponibles de "${producto.nombre}".`);
      return;
    }

    localStorageService.actualizarCantidad(productoId, nuevaCantidad);
    cargarCarrito();
    window.dispatchEvent(new Event('storage'));
  };

  const eliminarDelCarrito = (productoId) => {
    if (!window.confirm('¿Quieres quitar este producto del carrito?')) return;
    localStorageService.eliminarDelCarrito(productoId);
    cargarCarrito();
    window.dispatchEvent(new Event('storage'));
  };

  const calcularSubtotal = () => itemsCarrito.reduce((total, item) => total + ((item.precio || 0) * (item.cantidad || 0)), 0);
  const calcularEnvio = () => calcularSubtotal() > 200000 ? 0 : 3000;
  const calcularTotal = () => calcularSubtotal() + calcularEnvio();

  const handleCheckout = () => {
    // ejemplo: podrías validar sesión aquí antes de navegar
    if (itemsCarrito.length === 0) return;
    navigate('/checkout');
  };

  if (itemsCarrito.length === 0) {
    return (
      <div className="container py-5 text-center">
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <FaShoppingBag className="mb-3" style={{ fontSize: '4rem', color: '#d36bff' }} />
          <h2 style={{ color: '#7a2ebc' }}>Tu carrito está vacío 💗</h2>
          <p className="text-muted mb-4">Agrega juegos, consolas o tarjetas digitales para comenzar tu compra en La Tienda Gamer de Cony.</p>
          <Link to="/productos" className="btn btn-cony btn-lg">
            <FaArrowLeft className="me-2" /> Ver productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="display-5 fw-bold mb-4" style={{ color: '#7a2ebc' }}>Tu Carrito — La Tienda Gamer de Cony</h1>

      <div className="row">
        <div className="col-lg-8">
          {itemsCarrito.map(item => (
            <div key={item.id} className="card mb-3" style={{ borderRadius: 12 }}>
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-2">
                    <img
                      src={item.imagen || '/placeholder-image.png'}
                      alt={item.nombre}
                      className="img-fluid rounded"
                      style={{ height: '80px', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = '/placeholder-image.png'; }}
                    />
                  </div>

                  <div className="col-md-4">
                    <h5 className="card-title mb-1">{item.nombre}</h5>
                    <p className="text-primary fw-bold mb-1">{formatCLP(item.precio)} c/u</p>
                    <small className="text-muted">Stock disponible: {item.stock ?? 0} unidades</small>
                  </div>

                  <div className="col-md-3">
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => actualizarCantidad(item.id, (item.cantidad || 1) - 1)}
                        disabled={(item.cantidad || 1) <= 1}
                        aria-label={`Disminuir cantidad de ${item.nombre}`}
                      >
                        <FaMinus />
                      </button>

                      <div style={{
                        minWidth: 38,
                        textAlign: 'center',
                        fontWeight: 700
                      }}>{item.cantidad}</div>

                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => actualizarCantidad(item.id, (item.cantidad || 1) + 1)}
                        disabled={item.stock != null && (item.cantidad || 1) >= item.stock}
                        aria-label={`Aumentar cantidad de ${item.nombre}`}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>

                  <div className="col-md-2 d-flex align-items-center justify-content-end">
                    <h5 className="text-primary mb-0">{formatCLP((item.precio || 0) * (item.cantidad || 0))}</h5>
                  </div>

                  <div className="col-md-1 d-flex align-items-center justify-content-end">
                    <button
                      onClick={() => eliminarDelCarrito(item.id)}
                      className="btn btn-outline-danger btn-sm"
                      aria-label={`Eliminar ${item.nombre}`}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-lg-4">
          <div className="card shadow" style={{ borderRadius: 12 }}>
            <div className="card-body">
              <h4 className="card-title text-center mb-4" style={{ color: '#7a2ebc' }}>Resumen de compra</h4>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal ({itemsCarrito.reduce((s, i) => s + (i.cantidad || 0), 0)} unidades)</span>
                  <span>{formatCLP(calcularSubtotal())}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span>Envío</span>
                  <span className={calcularEnvio() === 0 ? 'text-success fw-bold' : ''}>
                    {calcularEnvio() === 0 ? 'Gratis' : formatCLP(calcularEnvio())}
                  </span>
                </div>

                <hr />

                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total</span>
                  <span>{formatCLP(calcularTotal())}</span>
                </div>
              </div>

              <button onClick={handleCheckout} className="btn btn-cony btn-lg w-100 mb-2">
                Proceder al pago
              </button>

              <Link to="/productos" className="btn btn-outline-primary w-100">
                <FaArrowLeft className="me-2" /> Seguir comprando
              </Link>
            </div>
          </div>

          <div className="mt-3 text-center text-muted small">
            <p style={{ margin: 0 }}>¿Problemas con tu pedido? Contáctanos en <strong>soporte@tiendagamercony.cl</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrito;
