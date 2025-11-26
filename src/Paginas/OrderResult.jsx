import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { localStorageService } from '../Data/localStorage';

const OrderResult = () => {
  const location = useLocation();
  const state = location.state || {};
  const { ordenId, estado } = state;

  let orden = null;
  if (ordenId) {
    const ordenes = localStorageService.obtenerOrdenes();
    orden = ordenes.find(o => o.id === ordenId) || null;
  }

  const titulo =
    estado === 'accepted'
      ? '🎉 ¡Pago Completado!'
      : '❌ Pago Rechazado';

  const descripcion =
    estado === 'accepted'
      ? 'Tu compra fue realizada con éxito. ¡Bienvenid@ al mundo gamer de Cony!'
      : 'Tu pago no pudo ser procesado. Puedes intentarlo de nuevo o pedir ayuda.';

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0">
        <div className="card-body text-center">

          <h2 className="mb-3 fw-bold">{titulo}</h2>
          <p className="mb-4">{descripcion}</p>

          {orden && (
            <div className="mb-4">
              <h5 className="fw-semibold">📦 Detalles de tu Orden</h5>
              <p><strong>ID:</strong> {orden.id}</p>
              <p><strong>Fecha:</strong> {new Date(orden.fecha).toLocaleString()}</p>
              <p><strong>Total:</strong> ${orden.total.toLocaleString('es-CL')}</p>
            </div>
          )}

          <div className="d-flex justify-content-center gap-3">
            <Link to="/productos" className="btn btn-primary">
              🛒 Seguir comprando
            </Link>
            <Link to="/carrito" className="btn btn-outline-secondary">
              🧺 Ver carrito
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderResult;
