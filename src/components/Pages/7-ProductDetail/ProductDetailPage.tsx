import React, { useState } from 'react';
import { ShoppingCart, Star, AlertCircle, ArrowLeft, Package } from 'lucide-react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { productos } from '../../../data/mockProductos';
import {reviews as allReviews} from '../../../data/mockResenia';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../contexts/AuthContext';
import { formatPrice } from '../../../utils/validations';
import { toast } from 'sonner';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (page: string, data?: any) => void;
}

export const ProductDetailPage = ({ productId, onNavigate }: ProductDetailPageProps) => {
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ calificacion: 5, comentario: '' });

  const product = productos.find((p) => p.id === productId);
  const productReviews = allReviews.filter((r) => r.productId === productId);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Producto no encontrado</p>
          <Button
            onClick={() => onNavigate('catalog')}
            className="bg-[var(--neon-green)] text-black"
          >
            Volver al catálogo
          </Button>
        </div>
      </div>
    );
  }

  const isLowStock = product.stockCritico && product.stock <= product.stockCritico;
  const isOutOfStock = product.stock === 0;
  const avgRating =
    productReviews.length > 0
      ? productReviews.reduce((sum, r) => sum + r.calificacion, 0) / productReviews.length
      : 0;

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      toast.error('Cantidad no disponible en stock');
      return;
    }
    addToCart(product.id, quantity);
    toast.success(`${quantity} unidad(es) agregada(s) al carrito`);
  };

  const handleSubmitReview = () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para dejar una reseña');
      return;
    }
    if (!newReview.comentario.trim()) {
      toast.error('Por favor escribe un comentario');
      return;
    }

    toast.success('Reseña enviada correctamente');
    setNewReview({ calificacion: 5, comentario: '' });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Botón volver */}
        <Button
          onClick={() => onNavigate('catalog')}
          variant="ghost"
          className="mb-6 text-[var(--neon-green)] hover:text-[var(--neon-purple)]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al catálogo
        </Button>

        {/* Producto principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Imagen */}
          <div className="relative">
            <img
              src={product.imagen}
              alt={product.nombre}
              className="w-full rounded-lg border-2 border-[var(--neon-green)]"
            />
            {product.featured && (
              <Badge className="absolute top-4 right-4 bg-[var(--neon-purple)] text-white border-0">
                Destacado
              </Badge>
            )}
          </div>

          {/* Información */}
          <div>
            <Badge className="mb-4 bg-black border-[var(--neon-green)] text-[var(--neon-green)]">
              {product.categoria}
            </Badge>

            <h1 className="text-4xl mb-4 text-white">{product.nombre}</h1>

            {/* Calificación */}
            {avgRating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(avgRating)
                          ? 'fill-[var(--neon-green)] text-[var(--neon-green)]'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[var(--neon-green)]">
                  {avgRating.toFixed(1)} ({productReviews.length} reseñas)
                </span>
              </div>
            )}

            <div className="text-5xl text-[var(--neon-green)] mb-6">
              {formatPrice(product.precio)}
            </div>

            <div className="bg-[#111] border border-gray-800 rounded-lg p-4 mb-6">
              <h3 className="text-[var(--neon-green)] mb-2">Descripción</h3>
              <p className="text-gray-300">{product.descripcion}</p>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-[var(--neon-green)]" />
              <span className="text-gray-300">
                Stock disponible: {product.stock} unidades
              </span>
              {isLowStock && !isOutOfStock && (
                <Badge className="bg-orange-500 text-white border-0">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Últimas unidades
                </Badge>
              )}
            </div>

            {/* Código del producto */}
            <div className="text-sm text-gray-500 mb-6">
              Código: <span className="text-[var(--neon-green)]">{product.codigo}</span>
            </div>

            {/* Cantidad y agregar al carrito */}
            {!isOutOfStock && (
              <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <label className="text-gray-300">Cantidad:</label>
                  <Input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 bg-[#1a1a1a] border-gray-700 text-white"
                  />
                </div>
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[var(--neon-green)] text-black hover:bg-[var(--neon-purple)] hover:text-white"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Agregar al Carrito
                </Button>
              </div>
            )}

            {isOutOfStock && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
                <p className="text-red-500">Producto sin stock</p>
              </div>
            )}
          </div>
        </div>

        {/* Reseñas */}
        <div className="border-t-2 border-[var(--neon-green)] pt-12">
          <h2 className="text-3xl mb-8 text-[var(--neon-green)]">Reseñas de Clientes</h2>

          {/* Formulario nueva reseña */}
          <div className="bg-[#111] border border-[var(--neon-green)] rounded-lg p-6 mb-8">
            <h3 className="text-xl mb-4 text-white">Deja tu reseña</h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 mb-2 block">Calificación</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setNewReview({ ...newReview, calificacion: rating })}
                      className="transition-colors"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          rating <= newReview.calificacion
                            ? 'fill-[var(--neon-green)] text-[var(--neon-green)]'
                            : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-300 mb-2 block">Comentario</label>
                <Textarea
                  value={newReview.comentario}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comentario: e.target.value })
                  }
                  placeholder="Cuéntanos tu experiencia con este producto..."
                  className="bg-[#1a1a1a] border-gray-700 text-white min-h-[100px]"
                />
              </div>

              <Button
                onClick={handleSubmitReview}
                className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-purple)] hover:text-white"
              >
                Enviar Reseña
              </Button>
            </div>
          </div>

          {/* Listado de reseñas */}
          <div className="space-y-6">
            {productReviews.length > 0 ? (
              productReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-[#111] border border-gray-800 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-white mb-1">{review.userName}</div>
                      <div className="text-sm text-gray-500">{review.fecha}</div>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.calificacion
                              ? 'fill-[var(--neon-green)] text-[var(--neon-green)]'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300">{review.comentario}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                Sé el primero en dejar una reseña para este producto
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
