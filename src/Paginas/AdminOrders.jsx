import React from 'react';

const AdminOrders = () => {
  return (
    <div className="container py-4 admin-panel-cony">
      <h2 className="titulo-cony">Órdenes de Compra - La Tienda Gamer de Cony</h2>

      <p className="text-muted">
        Aquí podrás ver todas las órdenes realizadas por tus clientes.  
        Como esta es una versión sin backend, esta sección funciona solo como demostración.
      </p>

      <div className="card p-3 card-cony">
        <p className="text-cony">
          No hay órdenes disponibles en este entorno de prueba 💗.
        </p>
      </div>
    </div>
  );
};

export default AdminOrders;
