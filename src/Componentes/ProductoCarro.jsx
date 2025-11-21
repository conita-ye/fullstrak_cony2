import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { localStorageService } from '../Data/localStorage';

const ProductoCarro = ({ producto }) => {
  const manejarAgregarCarrito = (e) => {
    e.preventDefault();
    localStorageService.agregarAlCarrito(producto);
    window.dispatchEvent(new Event('storage'));
  };

  const renderEstrellas = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} className={i < rating ? 'text-warning' : 'text-muted'} />
    ));
  };

  return (
    <div className="card h-100 shadow-sm">
      <div className="position-relative">
        <img 
          src={producto.imagen || ''}
          className="card-img-top img-fixed"
          alt={producto.nombre}
        />
        <div className="position-absolute top-0 end-0 m-2">
          <button 
            className="btn btn-primary btn-sm rounded-circle"
            onClick={manejarAgregarCarrito}
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
      
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{producto.nombre}</h5>
        <p className="card-text text-muted flex-grow-1">{producto.descripcion}</p>
        
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="text-warning">
            {renderEstrellas(producto.rating)}
          </div>
          <span className="h5 text-primary mb-0">
            ${producto.precio.toLocaleString('es-CL')}
          </span>
        </div>
        
        <Link to={`/productos/${producto.id}`} className="btn btn-outline-primary w-100">
          Ver Detalles
        </Link>
      </div>
    </div>
  );
};

export default ProductoCarro;