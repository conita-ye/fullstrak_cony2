import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Componentes/Navbar';
import Home from './Paginas/Home';
import Productos from './Paginas/Productos';
import ProductoDetalle from './Paginas/ProductoDetalle';
import Carrito from './Paginas/Carrito';
import Checkout from './Paginas/Checkout';
import OrderResult from './Paginas/OrderResult';
import Nosotros from './Paginas/Nosotros';
import Contacto from './Paginas/Contacto';
import Login from './Paginas/Login';
import Registro from './Paginas/Registro';

// Admin
import ProtectedRoute from './Utils/ProtectedRoute';
import AdminRoute from './Utils/AdminRoute';
import AdminDashboard from './Paginas/AdminDashboard';
import AdminProducts from './Paginas/AdminProducts';
import AdminUsers from './Paginas/AdminUsers';
import AdminOrders from './Paginas/AdminOrders';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Styles/global.css';
import './Styles/estilos.css';
import './Styles/components.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>

            {/* Rutas públicas y de usuario normal */}
            <Route path="/" element={<AdminRoute><Home /></AdminRoute>} />
            <Route path="/productos" element={<AdminRoute><Productos /></AdminRoute>} />
            <Route path="/productos/:id" element={<AdminRoute><ProductoDetalle /></AdminRoute>} />
            <Route path="/carrito" element={<AdminRoute><Carrito /></AdminRoute>} />
            <Route path="/checkout" element={<AdminRoute><Checkout /></AdminRoute>} />
            <Route path="/order-result" element={<AdminRoute><OrderResult /></AdminRoute>} />
            <Route path="/nosotros" element={<AdminRoute><Nosotros /></AdminRoute>} />
            <Route path="/contacto" element={<AdminRoute><Contacto /></AdminRoute>} />
            <Route path="/login" element={<AdminRoute><Login /></AdminRoute>} />
            <Route path="/registro" element={<AdminRoute><Registro /></AdminRoute>} />

            {/* Rutas protegidas del administrador */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminOrders />
                </ProtectedRoute>
              }
            />
            
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
