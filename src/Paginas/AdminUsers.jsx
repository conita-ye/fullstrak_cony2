import React, { useEffect, useState } from 'react';
import { FaTrashAlt, FaExclamationTriangle, FaUser } from 'react-icons/fa';


// Emails que consideramos administradores 
const emailsAdmin = [
  'co.admin@tiendagamercony.cl',
  'cony.admin@tiendagamercony.cl',
  'soporte.admin@tiendagamercony.cl'
];

// Determina si un email está en la lista de admins
const esEmailAdmin = (email) => emailsAdmin.includes(email);

// Clave personalizada en localStorage para usuarios (tu tienda)
const USUARIOS_KEY = 'cony_tienda_gamer_usuarios';

// Componente AdminUsers

const AdminUsers = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  // Cargar usuarios desde localStorage al iniciar
  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem(USUARIOS_KEY) || '[]');
      setUsuarios(Array.isArray(list) ? list : []);
    } catch {
      setUsuarios([]);
    }
  }, []);

  // Pedir confirmación (abrir)
  const confirmarEliminacion = (usuario) => {
    setUsuarioAEliminar(usuario);
    setShowDeleteModal(true);
  };

  // Eliminar usuario confirmado
  const eliminar = () => {
    if (!usuarioAEliminar) return;
    const list = usuarios.filter(u => u.id !== usuarioAEliminar.id);
    localStorage.setItem(USUARIOS_KEY, JSON.stringify(list));
    setUsuarios(list);
    setShowDeleteModal(false);
    setUsuarioAEliminar(null);
  };

  const cancelarEliminacion = () => {
    setShowDeleteModal(false);
    setUsuarioAEliminar(null);
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0">Gestión de Usuarios — La Tienda Gamer de Cony</h2>
        <div className="small text-muted">Total: {usuarios.length}</div>
      </div>

      <div className="row g-4">
        {usuarios.map(u => (
          <div key={u.id} className="col-sm-6 col-md-4 col-lg-3">
            <div className="card h-100 shadow-sm" style={{ borderRadius: 12 }}>
              <div className="card-body d-flex flex-column">
                <div className="d-flex align-items-center gap-3 mb-2">
                  <div>
                    <div className="fw-semibold" style={{ color: '#b30089' }}>{u.nombre}</div>
                    <div className="small text-muted">{u.email}</div>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="small text-muted">Registrado: {u.fechaRegistro ? new Date(u.fechaRegistro).toLocaleDateString() : '-'}</div>
                  <div className="small text-muted">
                    Rol: {u.role || (esEmailAdmin(u.email) ? 'admin' : 'user')}
                  </div>

                  <div className="d-flex gap-2 mt-2">
                    {/* Evitar eliminar administradores por accidente */}
                    {esEmailAdmin(u.email) ? (
                      <button className="btn btn-sm" style={{
                        background: 'linear-gradient(90deg,#ffd6ec,#e5b3ff)',
                        color: '#7a2ebc',
                        borderRadius: 8,
                        border: '1px solid rgba(122,46,188,0.12)'
                      }} title="No puedes eliminar a un administrador">
                        <FaUser className="me-1" /> Admin
                      </button>
                    ) : (
                      <button className="btn btn-sm btn-outline-danger" onClick={() => confirmarEliminacion(u)}>
                        <FaTrashAlt className="me-1" />
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {usuarios.length === 0 && (
        <div className="text-center py-5">
          <h5>No hay usuarios registrados</h5>
          <p className="text-muted">Cuando alguien se registre, aparecerá aquí.</p>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && usuarioAEliminar && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 3000 }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content border-0" style={{
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #fff0f8 0%, #f2e6ff 100%)',
              boxShadow: '0 10px 30px rgba(130, 0, 150, 0.12)',
              border: '1px solid rgba(183,125,255,0.25)'
            }}>
              <div className="modal-header border-0 pb-2">
                <h6 className="modal-title d-flex align-items-center" style={{ color: '#b30089' }}>
                  <FaExclamationTriangle className="me-2" />
                  Confirmar eliminación
                </h6>
                <button type="button" className="btn-close" onClick={cancelarEliminacion}></button>
              </div>

              <div className="modal-body py-2">
                <p className="mb-3 text-dark small">¿Eliminar este usuario de <strong>La Tienda Gamer de Cony</strong>?</p>

                <div className="p-2 mb-3" style={{ borderRadius: '10px', background: 'rgba(255,255,255,0.95)' }}>
                  <div className="d-flex align-items-center gap-2">
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: '#ffd6ec',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#7a2ebc',
                      fontWeight: '700'
                    }}>
                      <FaUser />
                    </div>

                    <div>
                      <div style={{ fontWeight: 700, color: '#4b1066' }}>{usuarioAEliminar.nombre}</div>
                      <div className="text-muted" style={{ fontSize: 12 }}>{usuarioAEliminar.email}</div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <small className="text-danger">
                    <FaExclamationTriangle className="me-1" />
                    Acción irreversible
                  </small>
                </div>
              </div>

              <div className="modal-footer border-0 pt-2">
                <button type="button"
                        className="btn btn-sm btn-light"
                        onClick={cancelarEliminacion}
                        style={{ borderRadius: '20px' }}>
                  Cancelar
                </button>

                <button type="button"
                        className="btn btn-sm"
                        onClick={eliminar}
                        style={{
                          borderRadius: '20px',
                          background: 'linear-gradient(90deg,#ff92d0,#b784ff)',
                          color: '#fff',
                          border: 'none'
                        }}>
                  <FaTrashAlt className="me-1" />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
