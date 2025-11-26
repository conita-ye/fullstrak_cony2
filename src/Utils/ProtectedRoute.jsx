import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from './Auth';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const usuario = authService.obtenerUsuarioActual();

  // Si no hay usuario autenticado, redirigir al login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta es solo para admin y el usuario NO es admin
  if (adminOnly && usuario.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Si pasa todas las validaciones, renderizar contenido
  return children;
};

export default ProtectedRoute;
