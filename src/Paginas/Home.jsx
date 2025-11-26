import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShippingFast, FaShieldAlt, FaHeadset, FaArrowRight } from 'react-icons/fa';
import ProductoCard from '../Componentes/ProductoCard';
import { obtenerProductos } from '../Data/productos';

const Home = () => {
  const [productosDestacados, setProductosDestacados] = useState([]);

  useEffect(() => {
    const productos = obtenerProductos();
    setProductosDestacados(productos.slice(0, 3));
  }, []);

  const caracteristicas = [
    { icono: <FaShippingFast />, titulo: 'Envío Gratis', descripcion: 'En compras sobre $200.000' },
    { icono: <FaShieldAlt />, titulo: 'Garantía', descripcion: 'Hasta 2 años de garantía' },
    { icono: <FaHeadset />, titulo: 'Soporte', descripcion: 'Asistencia técnica especializada' }
  ];

  return (
    <div className="home-page">
      {/* HERO */}
      <section className="hero-section-cony hero-large">
        <div className="container-fluid hero-inner">
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-6 hero-left d-flex flex-column justify-content-center">
              <h1 className="display-3 fw-bold hero-title-cony">
                Eleva tu <span className="text-accent-cony">Experiencia</span> Gaming
              </h1>

              <p className="lead hero-sub-cony">
                Encuentra periféricos y accesorios de alto rendimiento. Potencia tu juego con equipo pensado para ganar.
              </p>

              <div className="d-flex gap-3 hero-actions">
                <Link to="/productos" className="btn btn-cony btn-lg">
                  Explorar Productos <FaArrowRight className="ms-2" />
                </Link>

                <div className="d-flex gap-2 hero-quick-links">
                  <Link to="/contacto" className="btn btn-outline-light btn-sm">Contáctanos</Link>
                  <Link to="/nosotros" className="btn btn-outline-light btn-sm">Conócenos</Link>
                </div>
              </div>
            </div>

            <div className="col-lg-6 hero-right text-center position-relative">
              <img
                src="https://i.pinimg.com/736x/47/13/e7/4713e77f23a55b5d954c0788a94a5334.jpg"
                alt="Setup Gaming"
                className="hero-image-cony"
              />

              <div className="hero-stripe hero-stripe-1" />
              <div className="hero-stripe hero-stripe-2" />
            </div>
          </div>
        </div>
      </section>

      {/* CARACTERÍSTICAS */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {caracteristicas.map((c, i) => (
              <div key={i} className="col-md-4">
                <div className="card feature-card-cony border-0 shadow-sm h-100 text-center">
                  <div className="card-body p-4">
                    <div className="feature-icon-cony mb-3">{c.icono}</div>
                    <h4>{c.titulo}</h4>
                    <p className="text-muted">{c.descripcion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <section className="py-5 bg-dark-section-cony">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold neon-glow-cony">Productos Destacados</h2>
            <p className="lead text-muted">Los productos más populares de nuestra tienda</p>
          </div>

          <div className="row g-4 featured-grid">
            {productosDestacados.map(producto => (
              <div key={producto.id} className="col-md-4">
                <ProductoCard producto={producto} />
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <Link to="/productos" className="btn btn-outline-primary btn-lg">
              Ver Todos los Productos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
