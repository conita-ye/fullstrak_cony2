import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShippingFast, FaShieldAlt, FaHeadset, FaArrowRight } from 'react-icons/fa';
import ProductoCard from '../Componentes/ProductoCard';
import { obtenerProductos } from '../Data/productos';

const Home = () => {
  const [productosDestacados, setProductosDestacados] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchProductos = async () => {
      try {
        // soporta tanto funciones síncronas como promesas
        const productos = await Promise.resolve(obtenerProductos());
        if (mounted && Array.isArray(productos)) {
          setProductosDestacados(productos.slice(0, 3));
        }
      } catch (error) {
        // registro simple de errores para facilitar debugging
        // en producción se puede mostrar UI de error o usar un logger
        console.error('Error cargando productos:', error);
      }
    };

    fetchProductos();

    return () => {
      mounted = false;
    };
  }, []);

  const caracteristicas = [
    { icono: <FaShippingFast />, titulo: 'Envío Gratis', descripcion: 'En pedidos sobre $50.000' },
    { icono: <FaShieldAlt />, titulo: 'Garantía', descripcion: 'Hasta 3 años de garantía en productos seleccionados' },
    { icono: <FaHeadset />, titulo: 'Soporte', descripcion: 'Atención personalizada para gamers' }
  ];

  return (
    <div>
      {/* HERO */}
      <section className="hero-section position-relative py-5 hero-cony">
        <div className="container-fluid py-5 px-5">
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-6 d-flex flex-column justify-content-center align-items-start" style={{ height: '100%' }}>
              <h1 className="display-3 fw-bold mb-3 hero-title-cony">
                Eleva tu <span className="text-accent-cony">experiencia</span> gaming
              </h1>
              <p className="lead mb-4 hero-sub-cony">
                Accesorios y tarjetas digitales pensadas para ti. Setup rosado, poder competitivo — todo en un solo lugar.
              </p>

              <div className="d-flex gap-3">
                <Link to="/productos" className="btn btn-cony btn-lg">
                  Explorar Productos <FaArrowRight className="ms-2" />
                </Link>

                <Link to="/contacto" className="btn btn-outline-light btn-sm align-self-center">
                  Contáctanos
                </Link>
              </div>
            </div>

            <div className="col-lg-6 text-center position-relative">
              <img
                src="https://images.unsplash.com/photo-1601758003122-3c5b5d9a8b4b?w=1400&auto=format&fit=crop&q=80"
                alt="Setup rosa gamer"
                className="img-fluid hero-image-cony"
                style={{
                  maxHeight: '640px',
                  width: '70%',
                  minWidth: '160px',
                  borderRadius: '20px',
                  boxShadow: '0 20px 60px rgba(122,46,188,0.18)',
                  transform: 'perspective(1000px) rotateY(-6deg)',
                  objectFit: 'cover',
                  margin: '0 auto'
                }}
              />

              {/* decoración sutil */}
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
                <div className="card border-0 shadow-sm h-100 text-center feature-card-cony">
                  <div className="card-body p-4">
                    <div className="mb-3 feature-icon">{c.icono}</div>
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
            <p className="lead text-muted">Los favoritos de la comunidad Cony</p>
          </div>

          <div className="row g-4">
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
