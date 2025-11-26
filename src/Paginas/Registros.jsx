import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { authService } from '../Utils/Auth';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmarPassword: ''
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const manejarCambio = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');

    // Validaciones básicas
    if (!formData.nombre.trim()) {
      setError('Por favor ingresa tu nombre completo');
      setCargando(false);
      return;
    }

    if (formData.password !== formData.confirmarPassword) {
      setError('Las contraseñas no coinciden');
      setCargando(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setCargando(false);
      return;
    }

    // Registrar usando el servicio simulado
    const resultado = authService.registrar(
      formData.email,
      formData.password,
      formData.nombre
    );

    if (resultado && resultado.exito) {
      // Registro exitoso: redirigir al inicio y recargar para actualizar estado global
      navigate('/');
      window.location.reload();
    } else {
      setError(resultado?.error || 'Error al crear la cuenta');
    }

    setCargando(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header text-center">
          <Link to="/" className="auth-back">
            <FaArrowLeft /> <span className="ms-2">Volver al inicio</span>
          </Link>

          <h3 className="auth-title">Crear Cuenta</h3>
          <p className="auth-subtitle">Únete a La Tienda Gamer de Cony</p>
        </div>

        {error && <div className="alert alert-danger auth-alert">{error}</div>}

        <form onSubmit={manejarEnvio} noValidate>
          <div className="mb-3">
            <label className="form-label">Nombre Completo</label>
            <div className="input-group">
              <span className="input-group-text"><FaUser /></span>
              <input
                type="text"
                name="nombre"
                className="form-control"
                value={formData.nombre}
                onChange={manejarCambio}
                required
                placeholder="Tu nombre completo"
                aria-label="Nombre completo"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <div className="input-group">
              <span className="input-group-text"><FaEnvelope /></span>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={manejarCambio}
                required
                placeholder="tucorreo@ejemplo.com"
                aria-label="Email"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text"><FaLock /></span>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={manejarCambio}
                required
                placeholder="Mínimo 6 caracteres"
                aria-label="Contraseña"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Confirmar Contraseña</label>
            <div className="input-group">
              <span className="input-group-text"><FaLock /></span>
              <input
                type="password"
                name="confirmarPassword"
                className="form-control"
                value={formData.confirmarPassword}
                onChange={manejarCambio}
                required
                placeholder="Repite tu contraseña"
                aria-label="Confirmar contraseña"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-cony w-100 mb-3"
            disabled={cargando}
          >
            {cargando ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>

          <div className="text-center">
            <span className="text-muted">¿Ya tienes cuenta? </span>
            <Link to="/login" className="link-primary">Inicia sesión aquí</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;
