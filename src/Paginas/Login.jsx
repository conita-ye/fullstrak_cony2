import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaArrowLeft } from "react-icons/fa";
import { authService } from "../Utils/Auth";

const Login = () => {
  const [formData, setFormData] = useState({ emailOrPhone: "", password: "", remember: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const manejarCambio = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setError("");
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    
    const resultado = authService.login(formData.emailOrPhone, formData.password);

    if (resultado && resultado.exito) {
      if (resultado.usuario?.role === "admin") {
        // para admin forzamos recarga 
        window.location.href = "/admin";
      } else {
        navigate("/");
        window.location.reload();
      }
    } else {
      setError(resultado?.error || "Error al iniciar sesión");
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-back">
            <FaArrowLeft />
            <span className="ms-2">Volver al inicio</span>
          </Link>

          <h2 className="auth-title">INICIO DE SESIÓN</h2>
          <p className="auth-subtitle">Bienvenida a La Tienda Gamer de Cony</p>
        </div>

        {error && <div className="alert alert-danger auth-alert">{error}</div>}

        <form onSubmit={manejarEnvio} className="auth-form" noValidate>
          <label className="form-label">📧 Correo electrónico o 📱 Número de teléfono</label>
          <div className="input-group custom-input">
            <span className="input-icon"><FaUser /></span>
            <input
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={manejarCambio}
              type="text"
              className="form-control input-primary"
              placeholder="Ingresa tu correo o número"
              required
            />
          </div>

          <label className="form-label mt-3">🔒 Contraseña</label>
          <div className="input-group custom-input">
            <span className="input-icon"><FaLock /></span>
            <input
              name="password"
              value={formData.password}
              onChange={manejarCambio}
              type="password"
              className="form-control input-primary"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          <div className="form-check remember-row">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="form-check-input"
              checked={formData.remember}
              onChange={manejarCambio}
            />
            <label htmlFor="remember" className="form-check-label">💖 Recordarme en este dispositivo</label>
          </div>

          <button type="submit" className="btn btn-cony w-100 mt-3" disabled={loading}>
            {loading ? "Ingresando..." : "🚀 Ingresar"}
          </button>

          <div className="auth-links mt-3">
            <p className="mb-1">¿No tienes cuenta? <Link to="/register" className="link-primary">Regístrate aquí</Link></p>
            <p className="mb-0">¿Olvidaste tu contraseña? <Link to="/recover" className="link-primary">Recuperar aquí</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
