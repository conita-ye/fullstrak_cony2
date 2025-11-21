import React from 'react';

const QuickAdminModal = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="quick-admin-modal">
      <div className="quick-admin-backdrop" onClick={onClose} />
      <div className="quick-admin-dialog card shadow-sm p-3">

        <h5 className="mb-2">Entrar como administradora</h5>

        <p className="small">
          Vas a iniciar sesión como
          <strong> co.admin@tiendagamercony.cl </strong>.
          ¿Deseas continuar?
        </p>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <button className="btn btn-sm btn-cancelar" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-sm btn-confirmar" onClick={onConfirm}>
            Iniciar
          </button>
        </div>
      </div>

      <style>{`
        .quick-admin-modal { 
          position: fixed; 
          inset: 0; 
          z-index: 3000; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          padding: 20px;
        }

        .quick-admin-backdrop { 
          position: absolute; 
          inset: 0; 
          background: rgba(0,0,0,0.6); 
          backdrop-filter: blur(6px);
        }

        /* 🌸 Caja principal */
        .quick-admin-dialog {
          position: relative;
          width: 380px;
          max-width: 90vw;
          z-index: 3100;
          background: linear-gradient(145deg, #ffd6ec, #e4b3ff); /* rosado pastel + morado suave */
          color: #5a2a6f;
          border-radius: 1.2rem;
          padding: 1.6rem !important;
          text-align: center;
          border: 2px solid rgba(255, 182, 245, 0.5);
          box-shadow:
            0 15px 35px rgba(0,0,0,0.4),
            0 0 25px rgba(255, 182, 245, 0.4);
        }

        .quick-admin-dialog h5 { 
          color: #8a2ea8; /* morado fuerte */
          font-weight: 700;
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }

        .quick-admin-dialog p { 
          color: #6b347d; 
          margin-bottom: 1.5rem;
        }

        .quick-admin-dialog strong {
          color: #b30089; /* fucsia elegante */
        }
    
        /* 🌸 Botón Cancelar */
        .btn-cancelar {
          background: #f7c9e3;
          color: #6b347d;
          border-radius: 0.8rem;
          border: none;
          font-weight: 600;
          padding: 0.5rem 1rem;
          transition: all 0.3s ease;
        }
        .btn-cancelar:hover {
          background: #f0b3d6;
          transform: translateY(-1px);
        }

        /* 💜 Botón Confirmar */
        .btn-confirmar {
          background: linear-gradient(135deg, #c084fc, #a855f7); /* morado */
          color: white;
          border-radius: 0.8rem;
          border: none;
          font-weight: 600;
          padding: 0.5rem 1rem;
          box-shadow: 0 4px 14px rgba(168, 85, 247, 0.3);
          transition: all 0.3s ease;
        }
        .btn-confirmar:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(168, 85, 247, 0.4);
        }
      `}</style>
    </div>
  );
};

export default QuickAdminModal;
