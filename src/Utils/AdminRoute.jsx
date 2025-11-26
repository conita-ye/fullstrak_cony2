import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from './Auth';

// Ruta que detecta si el usuario es administrador y lo envía al panel admin
const AdminRoute = ({ children }) => {
  const currentUser = authService.obtenerUsuarioActual();

  // Si existe un usuario y su rol coincide con "admin", redirige
  if (currentUser?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // Si no es admin, simplemente renderiza el contenido normal
  return <>{children}</>;
};

export default AdminRoute;
