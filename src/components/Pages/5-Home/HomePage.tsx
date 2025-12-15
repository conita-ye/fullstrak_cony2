import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getLevelByPoints, getNextLevel, getPointsToNextLevel, getProgressToNextLevel } from '@/utils/pointsSystem';
import { toast } from 'sonner';
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
  const { user, isAuthenticated } = useAuth();
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

      {/* Sistema de Puntos - Solo si está autenticado */}
      {isAuthenticated && user && (
        <section className="py-12 px-4 bg-gradient-to-br from-[#111] to-black border-y border-[var(--neon-green)]/30">
          <div className="max-w-7xl mx-auto">
            <div className="bg-[#111] border border-[var(--neon-green)] rounded-lg p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold"
                    style={{ 
                      backgroundColor: getLevelByPoints(user.puntosLevelUp || 0).color, 
                      color: '#000' 
                    }}
                  >
                    {getLevelByPoints(user.puntosLevelUp || 0).nombre.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl text-white mb-1">
                      Nivel {getLevelByPoints(user.puntosLevelUp || 0).nombre}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {user.puntosLevelUp || 0} puntos LevelUp
                    </p>
                    {getNextLevel(user.puntosLevelUp || 0) && (
                      <p className="text-[var(--neon-green)] text-xs mt-1">
                        {getPointsToNextLevel(user.puntosLevelUp || 0)} puntos para {getNextLevel(user.puntosLevelUp || 0)?.nombre}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => toast.info('Próximamente: Sistema de puntos en desarrollo', { duration: 2000 })}
                  className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-purple)] hover:text-white"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Ver Mis Puntos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              {getNextLevel(user.puntosLevelUp || 0) && (
                <div className="mt-4">
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-[var(--neon-green)] h-2 rounded-full transition-all"
                      style={{ width: `${getProgressToNextLevel(user.puntosLevelUp || 0)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

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

      {/* Impacto Comunitario */}
      <section className="py-16 px-4 bg-gradient-to-br from-[#111] to-black border-t-2 border-[var(--neon-purple)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-[var(--neon-purple)]">Impacto en la Comunidad Gamer</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-green)] mx-auto mb-8"></div>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Cada compra que realizas en Level-Up Gamer contribuye directamente al crecimiento y desarrollo de la comunidad gamer en Chile
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#111] border border-[var(--neon-green)]/30 rounded-lg p-6 hover:border-[var(--neon-green)] transition-all">
              <div className="text-4xl mb-4 text-[var(--neon-green)]">🎮</div>
              <h3 className="text-xl text-white mb-3">Eventos y Torneos</h3>
              <p className="text-gray-400 text-sm mb-4">
                Parte de nuestras ganancias se destina a organizar eventos gaming gratuitos y torneos locales, 
                creando espacios para que los gamers se conecten y compitan.
              </p>
              <div className="text-[var(--neon-green)] text-sm font-semibold">
                +15 eventos anuales
              </div>
            </div>

            <div className="bg-[#111] border border-[var(--neon-blue)]/30 rounded-lg p-6 hover:border-[var(--neon-blue)] transition-all">
              <div className="text-4xl mb-4 text-[var(--neon-blue)]">🎓</div>
              <h3 className="text-xl text-white mb-3">Educación Gaming</h3>
              <p className="text-gray-400 text-sm mb-4">
                Apoyamos programas educativos en colegios y universidades, donando equipos y organizando 
                talleres sobre desarrollo de videojuegos y tecnología.
              </p>
              <div className="text-[var(--neon-blue)] text-sm font-semibold">
                +500 estudiantes beneficiados
              </div>
            </div>

            <div className="bg-[#111] border border-[var(--neon-purple)]/30 rounded-lg p-6 hover:border-[var(--neon-purple)] transition-all">
              <div className="text-4xl mb-4 text-[var(--neon-purple)]">🤝</div>
              <h3 className="text-xl text-white mb-3">Streamers y Creadores</h3>
              <p className="text-gray-400 text-sm mb-4">
                Colaboramos con streamers y creadores de contenido chilenos, proporcionando equipos 
                y patrocinios para impulsar el ecosistema gaming nacional.
              </p>
              <div className="text-[var(--neon-purple)] text-sm font-semibold">
                +30 creadores apoyados
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[var(--neon-green)]/20 to-[var(--neon-purple)]/20 border border-[var(--neon-green)] rounded-lg p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl text-[var(--neon-green)] mb-4">Tu Compra Hace la Diferencia</h3>
                <p className="text-gray-300 mb-4">
                  Cuando compras en Level-Up Gamer, no solo adquieres productos de calidad, sino que también 
                  estás invirtiendo en el futuro de la comunidad gamer chilena.
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--neon-green)]">✓</span>
                    <span>El 5% de nuestras ganancias se reinvierte en eventos comunitarios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--neon-green)]">✓</span>
                    <span>Programas de becas para estudiantes de carreras relacionadas con gaming</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--neon-green)]">✓</span>
                    <span>Donaciones de equipos a centros comunitarios y ONGs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--neon-green)]">✓</span>
                    <span>Apoyo a equipos de esports nacionales</span>
                  </li>
                </ul>
              </div>
              <div className="bg-[#1a1a1a] border border-[var(--neon-purple)]/30 rounded-lg p-6">
                <h4 className="text-xl text-[var(--neon-purple)] mb-4">Impacto 2024</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Eventos organizados</span>
                    <span className="text-white font-bold">15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Equipos donados</span>
                    <span className="text-white font-bold">45</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Estudiantes beneficiados</span>
                    <span className="text-white font-bold">500+</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Creadores apoyados</span>
                    <span className="text-white font-bold">30+</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="text-[var(--neon-green)] font-semibold">Total invertido</span>
                      <span className="text-[var(--neon-green)] font-bold text-xl">$2.5M CLP</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
