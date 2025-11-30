import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../contexts/AuthContext';
import { formatPrice } from '../../../utils/validations';
import { toast } from 'sonner';

interface CartPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export const CartPage = ({ onNavigate }: CartPageProps) => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, getProductById, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [codigoReferido, setCodigoReferido] = useState('');
  const [descuento, setDescuento] = useState(0);

  const subtotal = getCartTotal();
  const total = subtotal - descuento;

  const handleApplyCode = () => {
    if (codigoReferido.toUpperCase() === 'GAMER2024') {
      const descuentoAplicado = subtotal * 0.1; // 10% descuento
      setDescuento(descuentoAplicado);
      toast.success('¡Código aplicado! 10% de descuento');
    } else if (codigoReferido.toUpperCase() === 'ADMIN2024') {
      const descuentoAplicado = subtotal * 0.15; // 15% descuento
      setDescuento(descuentoAplicado);
      toast.success('¡Código aplicado! 15% de descuento');
    } else {
      toast.error('Código de referido inválido');
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para continuar');
      onNavigate('login');
      return;
    }

    if (cart.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    toast.success('Pedido procesado correctamente (simulado)');
    clearCart();
    setCodigoReferido('');
    setDescuento(0);
    onNavigate('home');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-600" />
          <h2 className="text-3xl mb-4 text-gray-400">Tu carrito está vacío</h2>
          <p className="text-gray-500 mb-8">
            Agrega productos a tu carrito para continuar comprando
          </p>
          <Button
            onClick={() => onNavigate('catalog')}
            className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-purple)] hover:text-white"
          >
            Ir a la tienda
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl mb-8 text-[var(--neon-green)]">Carrito de Compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const product = getProductById(item.productId);
              if (!product) return null;

              return (
                <div
                  key={item.productId}
                  className="bg-[#111] border border-[var(--neon-green)] rounded-lg p-4 flex gap-4"
                >
                  <img
                    src={product.imagen}
                    alt={product.nombre}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3
                      className="text-white mb-2 cursor-pointer hover:text-[var(--neon-green)] transition-colors"
                      onClick={() => onNavigate('product-detail', { productId: product.id })}
                    >
                      {product.nombre}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">{product.categoria}</p>
                    <div className="text-[var(--neon-green)] text-xl">
                      {formatPrice(product.precio)}
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-2 bg-[#1a1a1a] rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.productId, item.cantidad - 1)}
                        className="p-2 text-gray-400 hover:text-[var(--neon-green)] transition-colors"
                        disabled={item.cantidad <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-white min-w-[2rem] text-center">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.cantidad + 1)}
                        className="p-2 text-gray-400 hover:text-[var(--neon-green)] transition-colors"
                        disabled={item.cantidad >= product.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Subtotal y eliminar */}
                    <div className="text-right">
                      <div className="text-white mb-2">
                        Subtotal: {formatPrice(product.precio * item.cantidad)}
                      </div>
                      <button
                        onClick={() => {
                          removeFromCart(item.productId);
                          toast.success('Producto eliminado del carrito');
                        }}
                        className="text-red-500 hover:text-red-400 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-[#111] border border-[var(--neon-green)] rounded-lg p-6 sticky top-24">
              <h2 className="text-2xl mb-6 text-[var(--neon-green)]">Resumen del Pedido</h2>

              {/* Código de referido */}
              <div className="mb-6">
                <label className="text-gray-300 mb-2 block">Código de Referido</label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Ej: GAMER2024"
                    value={codigoReferido}
                    onChange={(e) => setCodigoReferido(e.target.value)}
                    className="flex-1 bg-[#1a1a1a] border-gray-700 text-white"
                  />
                  <Button
                    onClick={handleApplyCode}
                    variant="outline"
                    className="border-[var(--neon-green)] text-[var(--neon-green)]"
                  >
                    Aplicar
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Códigos disponibles: GAMER2024 (10%), ADMIN2024 (15%)
                </p>
              </div>

              {/* Totales */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-800">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {descuento > 0 && (
                  <div className="flex justify-between text-[var(--neon-green)]">
                    <span>Descuento:</span>
                    <span>-{formatPrice(descuento)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-300">
                  <span>Envío:</span>
                  <span className="text-[var(--neon-green)]">GRATIS</span>
                </div>
              </div>

              <div className="flex justify-between text-2xl mb-6">
                <span className="text-white">Total:</span>
                <span className="text-[var(--neon-green)]">{formatPrice(total)}</span>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full bg-[var(--neon-green)] text-black hover:bg-[var(--neon-purple)] hover:text-white"
              >
                Proceder al Pago
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                *Checkout simulado - No se procesarán pagos reales
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
