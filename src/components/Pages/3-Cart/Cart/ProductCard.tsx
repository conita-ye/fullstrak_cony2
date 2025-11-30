
import { ShoppingCart, AlertCircle, Star } from 'lucide-react';
import type { Product } from '../../../../types';
import { formatPrice } from '../../../../utils/validations';
import { Button } from '../../../ui/button';
import { Badge } from '../../../ui/badge';
import { reviews } from '../../../../data/mockResenia';

// Propiedades del componente ProductCard
interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onViewDetails: (productId: string) => void;
}

export const ProductCard = ({ product, onAddToCart, onViewDetails }: ProductCardProps) => {
  // Verifica si el stock es bajo o está agotado
  const isLowStock = product.stockCritico && product.stock <= product.stockCritico;
  const isOutOfStock = product.stock === 0;
  
  // Calcula calificación promedio del producto
  const productReviews = reviews.filter(r => r.productId === product.id);
  const avgRating = productReviews.length > 0
    ? productReviews.reduce((sum, r) => sum + r.calificacion, 0) / productReviews.length
    : 0;

  return (
    <div className="bg-[#111] border border-[var(--neon-green)] rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] group">
      {/* Imagen del producto */}
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.imagen}
          alt={product.nombre}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          {product.featured && (
            <Badge className="bg-[var(--neon-purple)] text-white border-0">
              Destacado
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="destructive">Sin Stock</Badge>
          )}
          {isLowStock && !isOutOfStock && (
            <Badge className="bg-orange-500 text-white border-0">
              <AlertCircle className="w-3 h-3 mr-1" />
              Últimas Unidades
            </Badge>
          )}
        </div>

        {/* Categoría */}
        <div className="absolute bottom-2 left-2">
          <Badge className="bg-black/70 text-[var(--neon-green)] border-[var(--neon-green)]">
            {product.categoria}
          </Badge>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3
          className="text-white mb-2 line-clamp-2 cursor-pointer hover:text-[var(--neon-green)] transition-colors"
          onClick={() => onViewDetails(product.id)}
        >
          {product.nombre}
        </h3>
        
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.descripcion}</p>

        {/* Calificación */}
        {avgRating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <Star className="w-4 h-4 fill-[var(--neon-green)] text-[var(--neon-green)]" />
            <span className="text-[var(--neon-green)] text-sm">
              {avgRating.toFixed(1)}
            </span>
            <span className="text-gray-500 text-xs">({productReviews.length})</span>
          </div>
        )}

        {/* Precio y Stock */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl text-[var(--neon-green)]">
              {formatPrice(product.precio)}
            </div>
            <div className="text-xs text-gray-500">
              Stock: {product.stock} unidades
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-2">
          <Button
            onClick={() => onViewDetails(product.id)}
            variant="outline"
            className="flex-1 border-[var(--neon-green)] text-[var(--neon-green)] hover:bg-[var(--neon-green)] hover:text-black"
          >
            Ver Detalles
          </Button>
          <Button
            onClick={() => onAddToCart(product.id)}
            disabled={isOutOfStock}
            className="flex-1 bg-[var(--neon-green)] text-black hover:bg-[var(--neon-purple)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Agregar
          </Button>
        </div>
      </div>
    </div>
  );
};
