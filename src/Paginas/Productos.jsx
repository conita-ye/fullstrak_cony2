import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import ProductoCard from '../Componentes/ProductoCard';
import { obtenerProductos, obtenerProductosPorCategoria, categorias } from '../Data/productos';

const Productos = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todos');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [terminoDebounced, setTerminoDebounced] = useState('');
  const [productosVisibles, setProductosVisibles] = useState([]);

  // Debounce simple: actualiza terminoDebounced 350ms después de que el usuario deje de escribir
  useEffect(() => {
    const t = setTimeout(() => setTerminoDebounced(terminoBusqueda.trim()), 350);
    return () => clearTimeout(t);
  }, [terminoBusqueda]);

  // Recalcular la lista visible cuando cambian categoría o término debounced
  useEffect(() => {
    const base = categoriaSeleccionada === 'todos'
      ? obtenerProductos()
      : obtenerProductosPorCategoria(categoriaSeleccionada);

    const filtrados = terminoDebounced
      ? base.filter(p =>
          (p.nombre || '').toLowerCase().includes(terminoDebounced.toLowerCase()) ||
          (p.descripcion || '').toLowerCase().includes(terminoDebounced.toLowerCase())
        )
      : base;

    setProductosVisibles(filtrados);
  }, [categoriaSeleccionada, terminoDebounced]);

  const limpiarBusqueda = () => {
    setTerminoBusqueda('');
    setTerminoDebounced('');
  };

  return (
    <div className="container py-4 productos-page">
      <div className="text-center mb-3">
        <h1 className="display-5 fw-bold">Nuestros Productos</h1>
        <p className="lead text-muted">Encuentra lo mejor en tecnología gaming</p>
      </div>

      <div className="row align-items-center mb-4 gy-3">
        <div className="col-md-6">
          <div className="input-group buscador-productos">
            <span className="input-group-text"><FaSearch /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar productos por nombre o descripción..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              aria-label="Buscar productos"
            />
            {terminoBusqueda && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={limpiarBusqueda}
                aria-label="Limpiar búsqueda"
                title="Limpiar"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            aria-label="Filtrar por categoría"
          >
            {categorias.map(categoria => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-2 text-md-end">
          <div className="small text-muted">
            <strong>{productosVisibles.length}</strong> productos
          </div>
        </div>
      </div>

      <div className="row g-4">
        {productosVisibles.map(producto => (
          <div key={producto.id} className="col-sm-6 col-lg-4">
            <ProductoCard producto={producto} />
          </div>
        ))}
      </div>

      {productosVisibles.length === 0 && (
        <div className="text-center py-5">
          <h5>No se encontraron productos</h5>
          <p className="text-muted">Intenta con otros términos de búsqueda o cambia la categoría</p>
        </div>
      )}
    </div>
  );
};

export default Productos;
