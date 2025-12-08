import React, { useState, useEffect } from 'react';
import { Tag, ArrowLeft } from 'lucide-react';
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

interface OffersPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export const OffersPage = ({ onNavigate }: OffersPageProps) => {
  const { addToCart } = useCart();
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarOfertas();
  }, []);

  const cargarOfertas = async () => {
    try {
      setLoading(true);
      const productosData = await apiService.getProductos();
      // Filtrar productos con stock crítico o destacados (simulando ofertas)
      const ofertas = productosData.filter(
        (p: Product) => 
          (p.stockCritico && p.stock <= p.stockCritico) || 
          (p.puntosLevelUp && p.puntosLevelUp >= 500)
      );
      setProductos(ofertas);
    } catch (error) {
      console.error('Error al cargar ofertas:', error);
      toast.error('Error al cargar ofertas');
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

  const handleAddToCart = async (productId: number) => {
    await addToCart(productId, 1);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Button
          onClick={() => onNavigate('home')}
          variant="ghost"
          className="mb-6 text-[var(--neon-green)] hover:text-[var(--neon-purple)]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <Tag className="w-8 h-8 text-[var(--neon-green)]" />
          <h1 className="text-4xl text-[var(--neon-green)]">Ofertas Especiales</h1>
        </div>
        <p className="text-gray-400 mb-8">
          Productos destacados y con stock limitado - ¡Aprovecha estas ofertas!
        </p>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Cargando ofertas...</p>
          </div>
        ) : productos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productos.map((product) => {
              const categoriaNombre = getCategoriaNombre(product.categoria);
              return (
                <div key={product.id} className="relative">
                  {(product.stockCritico && product.stock <= product.stockCritico) && (
                    <div className="absolute top-2 right-2 z-10 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      ¡Últimas unidades!
                    </div>
                  )}
                  <ProductCard
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
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Tag className="w-24 h-24 mx-auto mb-6 text-gray-600" />
            <p className="text-gray-400 text-lg mb-4">No hay ofertas disponibles en este momento</p>
            <Button
              onClick={() => onNavigate('catalog')}
              className="bg-[var(--neon-green)] text-black"
            >
              Ver Catálogo Completo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
