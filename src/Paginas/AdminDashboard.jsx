import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="container py-4 admin-panel-cony">
      <h1 className="mb-4 titulo-cony">Panel de Administración - La Tienda Gamer de Cony</h1>

      <div className="row g-3">
        
        {/* Gestión de Productos */}
        <div className="col-md-4">
          <div className="card p-3 card-cony">
            <h5 className="text-cony">Productos</h5>
            <p className="text-muted">
              Administra todos los videojuegos, consolas, accesorios y tarjetas digitales que vendes en tu tienda.
            </p>
            <Link to="/admin/products" className="btn btn-cony">Ir a Productos</Link>
          </div>
        </div>

        {/* Gestión de Usuarios */}
        <div className="col-md-4">
          <div className="card p-3 card-cony">
            <h5 className="text-cony">Usuarios</h5>
            <p className="text-muted">
              Visualiza y gestiona los usuarios registrados en La Tienda Gamer de Cony.
            </p>
            <Link to="/admin/users" className="btn btn-cony">Ir a Usuarios</Link>
          </div>
        </div>

        {/* Órdenes */}
        <div className="col-md-4">
          <div className="card p-3 card-cony">
            <h5 className="text-cony">Órdenes</h5>
            <p className="text-muted">
              Revisa las órdenes realizadas (modo demostración).
            </p>
            <Link to="/admin/orders" className="btn btn-cony">Ir a Órdenes</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
