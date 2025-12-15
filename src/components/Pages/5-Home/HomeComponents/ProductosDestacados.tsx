import React from 'react';
import { ProductCard } from '../../3-Cart/Cart/ProductCard';
import { Button } from '../../../ui/button';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import type { Props } from '../Interface/Props';


const ProductosDestacados: React.FC<Props> = ({ productos, onNavigate, addToCart }) => {
  const handleAddToCart = async (id: string) => {
    try {
      // Obtener el producto para verificar el stock
      const producto = productos.find(p => p.id === id);
      if (!producto) {
        toast.error('Producto no encontrado');
        return;
      }
      
      // Verificar stock disponible
      if (producto.stock <= 0) {
        toast.error('Producto sin stock disponible');
        return;
      }
      
      // Verificar si ya hay items en el carrito para este producto
      // Por ahora, solo agregamos 1 unidad y el backend validará el stock
      await addToCart(id, 1);
      toast.success('Producto agregado', { duration: 2000 });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Error al agregar producto al carrito';
      toast.error(errorMessage);
    }
  };

  return (
    <section className="py-12 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl text-[var(--neon-green)] mb-2">
              Productos Destacados
            </h2>
            <p className="text-gray-400">Los más vendidos de la semana</p>
          </div>
          <Button
            onClick={() => onNavigate('catalog')}
            variant="outline"
            className="border-[var(--neon-green)] text-[var(--neon-green)] hover:bg-[var(--neon-green)] hover:text-black hidden md:flex"
          >
            Ver Todos
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={() => handleAddToCart(p.id)}
              onViewDetails={(id) => onNavigate('product-detail', { productId: id })}
            />
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Button
            onClick={() => onNavigate('catalog')}
            className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-purple)] hover:text-white w-full"
          >
            Ver Todos los Productos
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductosDestacados;
