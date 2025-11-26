// src/Pages/Nosotros.jsx
import React from 'react';

const fundadores = [
  { clave: 'alexis', nombre: 'Alexis Castro', rol: 'CEO & Estrategia de Negocio' },
  { clave: 'constanza', nombre: 'Constanza Yevenes', rol: 'Directora de Marketing' },
  { clave: 'wington', nombre: 'Wington Yevenes', rol: 'Jefe de Tecnología' },
  { clave: 'ignacio', nombre: 'Ignacio Yevenes', rol: 'Director de Operaciones' },
  { clave: 'luis', nombre: 'Luis Yevenes', rol: 'Experiencia del Cliente' }
];

const Nosotros = () => {
  return (
    <div className="nosotros-page">
      <section className="hero-section-cony text-white py-5">
        <div className="container text-center py-5">
          <h1 className="display-4 fw-bold mb-4 neon-glow-cony">Sobre Nosotros</h1>
          <p className="lead">
            En La Tienda Gamer de Cony, nos apasiona conectar a los gamers con los mejores equipos y accesorios para llevar su experiencia de juego al siguiente nivel.
          </p>
          <p className="small text-primary-cony-opacity">
            Desde 2020, hemos estado comprometidos con la calidad y la satisfacción de nuestros clientes.
          </p>
        </div>
      </section>

      <section className="py-5 bg-dark-section-cony">
        <div className="container">
          <h2 className="display-6 fw-bold mb-3 neon-glow-cony">🎮 Nuestra Historia</h2>

          <p className="text-primary-cony">
            Todo comenzó cuando cinco amigos apasionados por los videojuegos (Alexis, Constanza, Wington, Ignacio y Luis) identificaron la necesidad de una tienda especializada que realmente entendiera las necesidades de la comunidad gaming. Unidos por su pasión, transformaron su amor por los videojuegos en un negocio próspero que hoy sirve a miles de clientes.
          </p>

          <p className="text-primary-cony">
            Lo que empezó como una idea entre sesiones de juego, hoy es una de las tiendas gaming más reconocidas, conocida por su excelente servicio al cliente, su amplio catálogo de productos de alta calidad y su ambiente inclusivo para todos los gamers.
          </p>
        </div>
      </section>

      <section className="py-5 bg-hero-soft-cony">
        <div className="container">
          <h2 className="text-center display-5 fw-bold mb-4 neon-glow-cony">🌟 Misión y Visión</h2>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="card card-plain h-100">
                <div className="card-body">
                  <h5 className="fw-bold">Misión</h5>
                  <p className="text-primary-cony">
                    Proporcionar a la comunidad gamer productos de la más alta calidad, con un servicio excepcional y precios competitivos, creando un espacio inclusivo donde todos los gamers se sientan bienvenidos.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card card-plain h-100">
                <div className="card-body">
                  <h5 className="fw-bold">Visión</h5>
                  <p className="text-primary-cony">
                    Ser la tienda gaming de referencia a nivel nacional, reconocida por nuestra innovación, compromiso con la comunidad y por promover la diversidad en el mundo de los videojuegos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-dark-section-cony">
        <div className="container">
          <h2 className="text-center display-5 fw-bold mb-4 neon-glow-cony">💖 Nuestros Valores</h2>

          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="value-card-cony p-3 h-100">
                <h5 className="fw-bold">🎯 Pasión por el Gaming</h5>
                <p className="text-primary-cony">Vivimos y respiramos videojuegos, y eso se refleja en cada producto que seleccionamos.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="value-card-cony p-3 h-100">
                <h5 className="fw-bold">🤝 Comunidad</h5>
                <p className="text-primary-cony">Creemos en construir y apoyar a la comunidad gamer, organizando torneos y eventos.</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="value-card-cony p-3 h-100">
                <h5 className="fw-bold">✨ Calidad</h5>
                <p className="text-primary-cony">Solo trabajamos con las mejores marcas y productos que cumplen con nuestros estándares.</p>
              </div>
            </div>
          </div>

          <h3 className="fw-bold mb-3 neon-glow-cony">👥 Nuestro Equipo Fundador</h3>
          <p className="text-primary-cony mb-4">Conoce al increíble equipo de fundadores que hizo posible La Tienda Gamer de Cony, uniendo sus diferentes talentos y pasiones para crear el paraíso gaming que es hoy.</p>

          <div className="row g-3 founders-grid">
            {fundadores.map(f => (
              <div key={f.clave} className="col-12 col-md-6 col-lg-4">
                <div className="team-card-cony p-3 h-100 d-flex gap-3 align-items-center">
                  <div className="team-avatar-cony">{f.nombre.split(' ').map(n => n[0]).slice(0,2).join('')}</div>
                  <div>
                    <div className="fw-bold">{f.nombre}</div>
                    <div className="small text-muted">{f.rol}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
};

export default Nosotros;
