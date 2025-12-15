import { useState, useEffect } from 'react';
import { Package, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/Pages/3-Cart/Cart/ProductCard';
import { apiService } from '@/services/api';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface Product {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  stockCritico?: number;
  categoria: string | { id?: number; codigo?: string; nombre?: string; descripcion?: string; activo?: boolean };
  imagenes: string[];
  puntosLevelUp?: number;
}

interface CategoriesPageProps {
  onNavigate: (page: string, data?: any) => void;
  initialData?: { categoria?: string };
}

export const CategoriesPage = ({ onNavigate, initialData }: CategoriesPageProps) => {
  const { addToCart } = useCart();
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialData?.categoria || 'all');

  useEffect(() => {
    cargarProductos();
  }, []);

  useEffect(() => {
    if (initialData?.categoria) {
      setSelectedCategory(initialData.categoria);
    }
  }, [initialData]);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const productosData = await apiService.getProductos();
      setProductos(productosData);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const getCategoriaNombre = (categoria: any): string => {
    if (typeof categoria === 'string') return categoria;
    if (categoria && typeof categoria === 'object') {
      return categoria.nombre || categoria.codigo || 'Sin categoría';
    }
    return 'Sin categoría';
  };

  const categories = Array.from(new Set(productos.map((p) => getCategoriaNombre(p.categoria))));

  const filteredProducts = selectedCategory === 'all'
    ? productos
    : productos.filter((p) => getCategoriaNombre(p.categoria) === selectedCategory);

  const handleAddToCart = (productId: string) => {
    addToCart(Number(productId), 1);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Button
          onClick={() => onNavigate('catalog')}
          variant="ghost"
          className="mb-6 text-[var(--neon-green)] hover:text-[var(--neon-purple)]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al catálogo
        </Button>

        <h1 className="text-4xl mb-2 text-[var(--neon-green)]">Categorías</h1>
        <p className="text-gray-400 mb-8">Explora productos por categoría</p>

        {/* Filtro de categorías */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-3 rounded-lg transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[var(--neon-green)] text-black'
                : 'bg-[#111] border border-[var(--neon-green)] text-[var(--neon-green)] hover:bg-[var(--neon-green)] hover:text-black'
            }`}
          >
            Todas
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-lg transition-colors ${
                selectedCategory === category
                  ? 'bg-[var(--neon-green)] text-black'
                  : 'bg-[#111] border border-[var(--neon-green)] text-[var(--neon-green)] hover:bg-[var(--neon-green)] hover:text-black'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid de productos */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Cargando productos...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const categoriaNombre = getCategoriaNombre(product.categoria);
              return (
                <ProductCard
                  key={product.id}
                  product={{
                    id: String(product.id),
                    codigo: product.codigo,
                    nombre: product.nombre,
                    descripcion: product.descripcion,
                    precio: product.precio,
                    stock: product.stock,
                    stockCritico: product.stockCritico,
                    categoria: categoriaNombre,
                    imagen: product.imagenes && product.imagenes.length > 0 ? product.imagenes[0] : '',
                    featured: (product.puntosLevelUp || 0) >= 500
                  }}
                  onAddToCart={handleAddToCart}
                  onViewDetails={(id) => onNavigate('product-detail', { productId: id })}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="w-24 h-24 mx-auto mb-6 text-gray-600" />
            <p className="text-gray-400 text-lg mb-4">No hay productos en esta categoría</p>
            <Button
              onClick={() => setSelectedCategory('all')}
              className="bg-[var(--neon-green)] text-black"
            >
              Ver todas las categorías
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
