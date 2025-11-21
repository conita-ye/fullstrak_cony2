import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import { validarFormularioContacto } from '../Utils/Validaciones';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '', email: '', telefono: '', asunto: '', mensaje: ''
  });
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    //limpiar error al cambiar campo
    
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    
    const validacion = validarFormularioContacto(formData);
    
    if (!validacion.esValido) {
      setErrores(validacion.errores);
      return;
    }

    // Simular envío
    console.log('Formulario válido:', formData);
    setEnviado(true);
    setErrores({});
    
    // Resetear después de 3 segundos
    setTimeout(() => {
      setEnviado(false);
      setFormData({ nombre: '', email: '', telefono: '', asunto: '', mensaje: '' });
    }, 3000);
  };

  // Info de contacto personalizado para "La Tienda Gamer de Cony"
  const infoContacto = [
    { icono: <FaMapMarkerAlt />, titulo: 'Dirección', contenido: 'Av. Brasil 2021, Valparaíso' },
    { icono: <FaPhone />, titulo: 'Teléfono', contenido: '+56 9 1234 5678' },
    { icono: <FaEnvelope />, titulo: 'Email', contenido: 'soporte@tiendagamercony.cl' },
    { icono: <FaClock />, titulo: 'Horario', contenido: 'Lun-Vie: 10:00 - 19:00' }
  ];

  if (enviado) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <FaCheckCircle className="mb-3" style={{fontSize: '4rem', color: '#b784ff'}} />
            <h2 style={{ color: '#7a2ebc' }}>¡Mensaje enviado!</h2>
            <p className="text-muted">Gracias por escribir a <strong>La Tienda Gamer de Cony</strong>. Te contactaremos dentro de 24 horas.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold" style={{ color: '#7a2ebc' }}>Contáctanos</h1>
        <p className="lead text-muted">¿Tienes dudas sobre productos, envíos o pagos? Estamos para ayudarte 💗</p>
      </div>

      <div className="row g-4">
        {/* Información de Contacto */}
        <div className="col-lg-6">
          <h3 className="mb-4" style={{ color: '#8b00b9' }}>Información de Contacto</h3>
          <div className="row g-3">
            {infoContacto.map((item, index) => (
              <div key={index} className="col-12 col-sm-6">
                <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: 12 }}>
                  <div className="card-body text-center p-3">
                    <div className="mb-2" style={{fontSize: '1.5rem', color: '#d36bff'}}>
                      {item.icono}
                    </div>
                    <h6 className="card-title mb-1">{item.titulo}</h6>
                    <p className="card-text text-muted small mb-0">{item.contenido}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulario */}
        <div className="col-lg-6">
          <div className="card border-0 shadow contact-card" style={{ borderRadius: 12 }}>
            <div className="card-body p-4">
              <h3 className="card-title mb-4" style={{ color: '#7a2ebc' }}>Envíanos un mensaje</h3>
              <form onSubmit={manejarEnvio} noValidate>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label">Nombre Completo *</label>
                    <input
                      type="text"
                      name="nombre"
                      className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                      value={formData.nombre}
                      onChange={manejarCambio}
                    />
                    {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
                  </div>
                  
                  <div className="col-12 col-md-6">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      name="email"
                      className={`form-control ${errores.email ? 'is-invalid' : ''}`}
                      value={formData.email}
                      onChange={manejarCambio}
                    />
                    {errores.email && <div className="invalid-feedback">{errores.email}</div>}
                  </div>
                  
                  <div className="col-12 col-md-6">
                    <label className="form-label">Teléfono</label>
                    <input
                      type="tel"
                      name="telefono"
                      className={`form-control ${errores.telefono ? 'is-invalid' : ''}`}
                      value={formData.telefono}
                      onChange={manejarCambio}
                      placeholder="+56 9 1234 5678"
                    />
                    {errores.telefono && <div className="invalid-feedback">{errores.telefono}</div>}
                  </div>
                  
                  <div className="col-12 col-md-6">
                    <label className="form-label">Asunto *</label>
                    <select
                      name="asunto"
                      className={`form-select ${errores.asunto ? 'is-invalid' : ''}`}
                      value={formData.asunto}
                      onChange={manejarCambio}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="consulta">Consulta General</option>
                      <option value="soporte">Soporte Técnico</option>
                      <option value="ventas">Información de Ventas</option>
                      <option value="devolucion">Devolución o Garantía</option>
                    </select>
                    {errores.asunto && <div className="invalid-feedback">{errores.asunto}</div>}
                  </div>
                  
                  <div className="col-12">
                    <label className="form-label">Mensaje *</label>
                    <textarea
                      name="mensaje"
                      className={`form-control ${errores.mensaje ? 'is-invalid' : ''}`}
                      rows="5"
                      value={formData.mensaje}
                      onChange={manejarCambio}
                      placeholder="Describe tu consulta..."
                    ></textarea>
                    {errores.mensaje && <div className="invalid-feedback">{errores.mensaje}</div>}
                  </div>
                  
                  <div className="col-12">
                    <button type="submit" className="btn btn-cony btn-lg w-100">
                      <FaPaperPlane className="me-2" />
                      Enviar Mensaje
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
