import React from 'react';
import type { Product } from '../../../../types';
import { ProductCard } from '../../3-Cart/Cart/ProductCard';
import { Button } from '../../../ui/button';
import { ArrowRight } from 'lucide-react';
import type { HomePageProps } from '../Interface/HomePageProps';

interface Props {
  productos: Product[];
  titulo: string;
  descripcion: string;
  color: string;
  onNavigate: HomePageProps['onNavigate'];
  addToCart: (productId: string, quantity: number) => void;
}

const SeccionCategoria: React.FC<Props> = ({
  productos,
  titulo,
  descripcion,
  color,
  onNavigate,
  addToCart,
}) => {
  if (productos.length === 0) return null;

  return (
    <section className={`py-12 px-4 bg-${color}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className={`text-3xl md:text-4xl mb-2 text-[var(--neon-${color})]`}>{titulo}</h2>
            <p className="text-gray-400">{descripcion}</p>
          </div>
          <Button
            onClick={() => onNavigate('catalog', { categoria: titulo })}
            variant="outline"
            className={`border-[var(--neon-${color})] text-[var(--neon-${color})] hover:bg-[var(--neon-${color})] hover:text-black hidden md:flex`}
          >
            Ver Más
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.slice(0, 4).map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={() => addToCart(p.id, 1)}
              onViewDetails={(id) => onNavigate('product-detail', { productId: id })}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SeccionCategoria;
