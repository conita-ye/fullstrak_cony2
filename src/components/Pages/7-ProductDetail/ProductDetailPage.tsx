import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, AlertCircle, ArrowLeft, Package, Share2, Facebook, Twitter, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { apiService } from '@/services/api';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/utils/validations';
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
  fabricante?: string;
  distribuidor?: string;
}

interface Review {
  id: number;
  calificacion: number;
  texto: string;
  fechaCreacion: string;
  usuarioNombre?: string;
}

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (page: string, data?: any) => void;
}

export const ProductDetailPage = ({ productId, onNavigate }: ProductDetailPageProps) => {
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ calificacion: 5, comentario: '' });

  useEffect(() => {
    cargarProducto();
    cargarResenas();
  }, [productId]);

  const cargarProducto = async () => {
    try {
      setLoading(true);
      const productoData = await apiService.getProducto(productId);
      setProduct(productoData);
    } catch (error) {
      console.error('Error al cargar producto:', error);
      toast.error('Error al cargar el producto');
    } finally {
      setLoading(false);
    }
  };

  const cargarResenas = async () => {
    try {
      const resenasData = await apiService.getResenas(productId);
      setReviews(resenasData);
    } catch (error) {
      console.error('Error al cargar reseñas:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Cargando producto...</p>
      </div>
    );
  }

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
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.calificacion, 0) / reviews.length
      : 0;

  // Helper para obtener el nombre de la categoría
  const getCategoriaNombre = (categoria: string | { nombre?: string; codigo?: string }): string => {
    if (typeof categoria === 'string') return categoria;
    if (categoria && typeof categoria === 'object') {
      return categoria.nombre || categoria.codigo || 'Sin categoría';
    }
    return 'Sin categoría';
  };

  const categoriaNombre = getCategoriaNombre(product.categoria);

  const handleAddToCart = async () => {
    if (quantity > product.stock) {
      toast.error('Cantidad no disponible en stock');
      return;
    }
    await addToCart(product.id, quantity);
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Debes iniciar sesión para dejar una reseña');
      return;
    }
    if (!newReview.comentario.trim()) {
      toast.error('Por favor escribe un comentario');
      return;
    }

    try {
      await apiService.crearResena({
        productoId: product.id,
        texto: newReview.comentario,
        calificacion: newReview.calificacion
      });
      toast.success('Reseña enviada correctamente');
      setNewReview({ calificacion: 5, comentario: '' });
      await cargarResenas();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Error al enviar la reseña';
      toast.error(errorMessage);
    }
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'instagram') => {
    const url = window.location.href;
    const text = `¡Mira este producto en Level-Up Gamer: ${product.nombre}!`;
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'instagram':
        toast.info('Para compartir en Instagram, copia el enlace y pégalo en tu historia');
        navigator.clipboard.writeText(url);
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
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
              src={product.imagenes && product.imagenes.length > 0 ? product.imagenes[0] : ''}
              alt={product.nombre}
              className="w-full rounded-lg border-2 border-[var(--neon-green)]"
            />
            {(product.puntosLevelUp || 0) >= 500 && (
              <Badge className="absolute top-4 right-4 bg-[var(--neon-purple)] text-white border-0">
                Destacado
              </Badge>
            )}
          </div>

          {/* Información */}
          <div>
            <Badge className="mb-4 bg-black border-[var(--neon-green)] text-[var(--neon-green)]">
              {categoriaNombre}
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
                  {avgRating.toFixed(1)} ({reviews.length} reseñas)
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
            <div className="text-sm text-gray-500 mb-4">
              Código: <span className="text-[var(--neon-green)]">{product.codigo}</span>
            </div>

            {/* Origen del producto - Siempre visible */}
            <div className="bg-[#111] border border-[var(--neon-blue)] rounded-lg p-4 mb-6">
              <h3 className="text-[var(--neon-blue)] mb-3 text-sm font-semibold flex items-center gap-2">
                <Package className="w-4 h-4" />
                Origen del Producto
              </h3>
              <div className="space-y-2 text-sm">
                {product.fabricante ? (
                  <div>
                    <span className="text-gray-500">Fabricante: </span>
                    <span className="text-white font-semibold">{product.fabricante}</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-gray-500">Fabricante: </span>
                    <span className="text-gray-400 italic">No especificado</span>
                  </div>
                )}
                {product.distribuidor ? (
                  <div>
                    <span className="text-gray-500">Distribuidor: </span>
                    <span className="text-white font-semibold">{product.distribuidor}</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-gray-500">Distribuidor: </span>
                    <span className="text-gray-400 italic">No especificado</span>
                  </div>
                )}
              </div>
            </div>

            {/* Botones de compartir */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Share2 className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Compartir:</span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleShare('facebook')}
                  size="sm"
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  <Facebook className="w-4 h-4 mr-1" />
                  Facebook
                </Button>
                <Button
                  onClick={() => handleShare('twitter')}
                  size="sm"
                  variant="outline"
                  className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                >
                  <Twitter className="w-4 h-4 mr-1" />
                  Twitter
                </Button>
                <Button
                  onClick={() => handleShare('instagram')}
                  size="sm"
                  variant="outline"
                  className="border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
                >
                  <Instagram className="w-4 h-4 mr-1" />
                  Instagram
                </Button>
              </div>
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
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-[#111] border border-gray-800 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-white mb-1">{review.usuarioNombre || 'Usuario'}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(review.fechaCreacion).toLocaleDateString('es-CL')}
                      </div>
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
                  <p className="text-gray-300">{review.texto}</p>
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
