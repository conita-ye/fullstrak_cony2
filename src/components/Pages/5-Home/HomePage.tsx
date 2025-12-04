import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useCart } from '@/contexts/CartContext';
import HomeCarousel from './HomeComponents/Carrusel';
import Beneficios from './HomeComponents/Beneficios';
import ProductosDestacados from './HomeComponents/ProductosDestacados';
import SeccionCategoria from './HomeComponents/SeccionCategoria';
import type { HomePageProps } from './Interface/HomePageProps';

interface Product {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  imagenes: string[];
  puntosLevelUp?: number;
}

export const HomePage = ({ onNavigate }: HomePageProps) => {
  const { addToCart } = useCart();
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const productosData = await apiService.getProductos();
      setProductos(productosData);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper para obtener el nombre de la categoría
  const getCategoriaNombre = (categoria: any): string => {
    if (typeof categoria === 'string') return categoria;
    if (categoria && typeof categoria === 'object') {
      return categoria.nombre || categoria.codigo || 'Sin categoría';
    }
    return 'Sin categoría';
  };

  // Filtra productos destacados (puntosLevelUp >= 500)
  const featuredProducts = productos
    .filter((p) => (p.puntosLevelUp || 0) >= 500)
    .map(p => ({
      id: String(p.id),
      codigo: p.codigo,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      stock: p.stock,
      categoria: getCategoriaNombre(p.categoria),
      imagen: p.imagenes && p.imagenes.length > 0 ? p.imagenes[0] : '',
      featured: true
    }));

  // Filtra productos por categorías
  const computadores = productos
    .filter((p) => getCategoriaNombre(p.categoria) === 'Computadores Gamers')
    .map(p => ({
      id: String(p.id),
      codigo: p.codigo,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      stock: p.stock,
      categoria: getCategoriaNombre(p.categoria),
      imagen: p.imagenes && p.imagenes.length > 0 ? p.imagenes[0] : '',
      featured: false
    }));
  
  const perifericos = productos
    .filter((p) => getCategoriaNombre(p.categoria) === 'Periféricos')
    .map(p => ({
      id: String(p.id),
      codigo: p.codigo,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      stock: p.stock,
      categoria: getCategoriaNombre(p.categoria),
      imagen: p.imagenes && p.imagenes.length > 0 ? p.imagenes[0] : '',
      featured: false
    }));
  
  const monitores = productos
    .filter((p) => getCategoriaNombre(p.categoria) === 'Monitores')
    .map(p => ({
      id: String(p.id),
      codigo: p.codigo,
      nombre: p.nombre,
      descripcion: p.descripcion,
      precio: p.precio,
      stock: p.stock,
      categoria: getCategoriaNombre(p.categoria),
      imagen: p.imagenes && p.imagenes.length > 0 ? p.imagenes[0] : '',
      featured: false
    }));

  return (
    <div className="min-h-screen">
      {/* Carrusel */}
      <HomeCarousel onNavigate={onNavigate} />

      {/* Beneficios */}
      <Beneficios />

      {/* Productos Destacados */}
      <ProductosDestacados
        productos={featuredProducts}
        onNavigate={onNavigate}
        addToCart={addToCart}
      />

      {/* Secciones por Categoría */}
      <SeccionCategoria
        productos={computadores}
        titulo="Computadores Gamer"
        descripcion="Potencia para tus juegos favoritos"
        color="purple"
        onNavigate={onNavigate}
        addToCart={addToCart}
      />

      <SeccionCategoria
        productos={perifericos}
        titulo="Periféricos Gaming"
        descripcion="Mejora tu experiencia de juego"
        color="green"
        onNavigate={onNavigate}
        addToCart={addToCart}
      />

      <SeccionCategoria
        productos={monitores}
        titulo="Monitores Gaming"
        descripcion="Alta resolución y velocidad"
        color="blue"
        onNavigate={onNavigate}
        addToCart={addToCart}
      />

      {/* Sobre Level-Up Gamer */}
      <section className="py-16 px-4 bg-black border-t-2 border-[var(--neon-green)]">
        <div className="max-w-4xl mx-auto text-gray-300">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl mb-4 text-[var(--neon-green)]">Sobre Level-Up Gamer</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-purple)] mx-auto mb-8"></div>
          </div>
          <p className="mb-6 text-justify leading-relaxed">
            Level-Up Gamer es una tienda online creada en 2022, dedicada a la comercialización de
            productos gamer como consolas, accesorios, sillas y computadores. Aunque no contamos
            con locales físicos, realizamos envíos a todo Chile, garantizando una experiencia de
            compra rápida y confiable.
          </p>
          <div className="grid md:grid-cols-2 gap-6 pt-4">
            <div className="p-6 border border-[var(--neon-green)]/30 rounded-lg bg-[#0a0a0a]">
              <h3 className="text-[var(--neon-green)] mb-3">Nuestra Misión</h3>
              <p className="text-gray-400">
                Entregar productos gamer de alta calidad en todo Chile, ofreciendo una experiencia
                personalizada, rápida y confiable.
              </p>
            </div>
            <div className="p-6 border border-[var(--neon-purple)]/30 rounded-lg bg-[#0a0a0a]">
              <h3 className="text-[var(--neon-purple)] mb-3">Nuestra Visión</h3>
              <p className="text-gray-400">
                Convertirnos en la tienda online gamer líder del país, destacando por la innovación,
                fidelización y atención al cliente excepcional.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
