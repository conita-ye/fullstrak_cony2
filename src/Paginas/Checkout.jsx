import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { localStorageService } from '../Data/localStorage';

const formatCLP = (n) => `$${Number(n).toLocaleString('es-CL')}`;

const Checkout = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(localStorageService.obtenerCarrito());
  }, []);

  const calcularSubtotal = () => (items || []).reduce((t, i) => t + ((i.precio || 0) * (i.cantidad || 0)), 0);
  const calcularEnvio = () => calcularSubtotal() > 200000 ? 0 : 3000;
  const calcularTotal = () => calcularSubtotal() + calcularEnvio();

  const handleResultado = (aceptada) => {
    const subtotal = calcularSubtotal();
    const envio = calcularEnvio();
    const total = calcularTotal();

    const orden = {
      id: `ord_${Date.now()}`,
      fecha: new Date().toISOString(),
      items,
      subtotal,
      envio,
      total,
      estado: aceptada ? 'accepted' : 'rejected'
    };

    // Guardamos la orden (registro) y vaciamos carrito si fue aceptada
    localStorageService.crearOrden(orden);

    if (aceptada) {
      localStorageService.vaciarCarrito();
      window.dispatchEvent(new Event('storage')); // actualizar otras vistas
    }

    // Navegar a pantalla de resultado con datos básicos
    navigate('/order-result', { state: { ordenId: orden.id, estado: orden.estado } });
  };

  if (!items || items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2 style={{ color: '#7a2ebc' }}>No hay productos en tu carrito 💗</h2>
        <p className="text-muted">Agrega juegos, consolas o tarjetas y vuelve para finalizar tu compra.</p>
        <div className="mt-3">
          <button className="btn btn-cony" onClick={() => navigate('/productos')}>Ver Productos</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4" style={{ color: '#7a2ebc' }}>Finalizar Compra — La Tienda Gamer de Cony</h1>

      <div className="card mb-4" style={{ borderRadius: 12 }}>
        <div className="card-body">
          <h5 className="mb-3">Resumen de tu pedido</h5>

          <ul className="list-unstyled mb-3">
            {items.map(it => (
              <li key={it.id} className="d-flex justify-content-between py-2 border-bottom">
                <span>{it.nombre} x {it.cantidad}</span>
                <strong>{formatCLP((it.precio || 0) * (it.cantidad || 0))}</strong>
              </li>
            ))}
          </ul>

          <div className="d-flex justify-content-between mb-2">
            <span>Subtotal</span>
            <strong>{formatCLP(calcularSubtotal())}</strong>
          </div>

          <div className="d-flex justify-content-between mb-3">
            <span>Envío</span>
            <strong>{calcularEnvio() === 0 ? 'Gratis' : formatCLP(calcularEnvio())}</strong>
          </div>

          <hr />

          <div className="d-flex justify-content-between mb-0 fw-bold fs-5">
            <span>Total</span>
            <span>{formatCLP(calcularTotal())}</span>
          </div>
        </div>
      </div>

      <div className="d-flex gap-3">
        <button className="btn btn-cony" onClick={() => handleResultado(true)}>
          Aceptar pago (simular éxito)
        </button>

        <button className="btn btn-outline-danger" onClick={() => handleResultado(false)}>
          Rechazar pago (simular fallo)
        </button>
      </div>

      <div className="mt-4 text-muted small">
        <p style={{ margin: 0 }}>
          ¿Dudas? Escribe a <strong>soporte@tiendagamercony.cl</strong> y te ayudamos con tu pedido.
        </p>
      </div>
    </div>
  );
};

export default Checkout;
