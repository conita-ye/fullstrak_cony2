import React from 'react';
import { FaEdit, FaTrash, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';

const AdminProductCarro = ({ producto, onEdit, onDelete, onToggleStock }) => {
  return (
    <div className="card h-100 shadow-sm">
      <div className="position-relative">
        <img src={producto.imagen || ''} className="card-img-top img-fixed" alt={producto.nombre} style={{height:200, objectFit:'cover'}} />
        <div className="position-absolute top-0 end-0 m-2 d-flex gap-2">
          <button className="btn btn-sm btn-light" title="Editar" onClick={() => onEdit(producto)}><FaEdit /></button>
          <button className="btn btn-sm btn-danger" title="Eliminar" onClick={() => onDelete(producto.id)}><FaTrash /></button>
        </div>
      </div>

        <div className="card-body d-flex flex-column">
        <h6 className="card-title mb-1">{producto.nombre}</h6>
        <p className="card-text text-muted small flex-grow-1">{producto.descripcion}</p>

        <div className="d-flex justify-content-between align-items-center mt-2">
          <div className="small text-muted d-flex align-items-center gap-2">
            <span>Stock: {producto.stock}</span>
            <button className={`btn btn-sm ${producto.stock > 0 ? 'btn-outline-danger' : 'btn-outline-success'}`} title={producto.stock > 0 ? 'Marcar sin stock' : 'Restaurar stock'} onClick={() => onToggleStock && onToggleStock(producto)}>
              {producto.stock > 0 ? <FaTimesCircle /> : <FaCheckCircle />}
            </button>
          </div>
          <div className="h6 text-primary mb-0">${producto.precio.toLocaleString('es-CL')}</div>
        </div>
      </div>
    </div>
  );
};
export default AdminProductCarro;