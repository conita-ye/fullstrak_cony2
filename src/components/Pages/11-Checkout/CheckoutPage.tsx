import React, { useState, useEffect } from 'react';
import { MapPin, CreditCard, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { formatPrice } from '@/utils/validations';
import { toast } from 'sonner';

interface CheckoutPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export const CheckoutPage = ({ onNavigate }: CheckoutPageProps) => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [regiones, setRegiones] = useState<any[]>([]);
  const [comunas, setComunas] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    apellidos: user?.apellidos || '',
    correo: user?.correo || '',
    telefono: '',
    direccion: user?.direccion || '',
    region: user?.region || '',
    comuna: user?.comuna || '',
    codigoPostal: '',
    metodoPago: 'tarjeta',
    numeroTarjeta: '',
    nombreTarjeta: '',
    fechaVencimiento: '',
    cvv: '',
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData({
        ...formData,
        nombre: user.nombre || '',
        apellidos: user.apellidos || '',
        correo: user.correo || '',
        direccion: user.direccion || '',
        region: user.region || '',
        comuna: user.comuna || '',
      });
    }
    cargarRegiones();
  }, [user]);

  const cargarRegiones = async () => {
    try {
      const regionesData = await apiService.getRegiones();
      setRegiones(regionesData);
    } catch (error) {
      console.error('Error al cargar regiones:', error);
    }
  };

  const handleRegionChange = (region: string) => {
    setFormData({ ...formData, region, comuna: '' });
    // Simular comunas según región
    setComunas(['Santiago', 'Providencia', 'Las Condes', 'Ñuñoa']);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para continuar');
      onNavigate('login');
      return;
    }

    if (cart.length === 0) {
      toast.error('El carrito está vacío');
      onNavigate('cart');
      return;
    }

    setLoading(true);
    try {
      // Simular procesamiento de pago
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Aquí iría la lógica real de crear la boleta/orden
      // await apiService.crearBoleta({ ...formData, items: cart });
      
      await clearCart();
      onNavigate('purchase-success', { orderId: Math.random().toString(36).substr(2, 9) });
    } catch (error) {
      toast.error('Error al procesar el pago');
      onNavigate('purchase-failed');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const envio = 0; // Gratis
  const total = subtotal + envio;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Button
          onClick={() => onNavigate('cart')}
          variant="ghost"
          className="mb-6 text-[var(--neon-green)] hover:text-[var(--neon-purple)]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al carrito
        </Button>

        <h1 className="text-4xl mb-8 text-[var(--neon-green)]">Checkout</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información de envío */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#111] border border-[var(--neon-green)] rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5 text-[var(--neon-green)]" />
                <h2 className="text-2xl text-[var(--neon-green)]">Información de Envío</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 mb-2 block">Nombre *</label>
                  <Input
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                    className="bg-[#1a1a1a] border-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-gray-300 mb-2 block">Apellidos *</label>
                  <Input
                    value={formData.apellidos}
                    onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                    required
                    className="bg-[#1a1a1a] border-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-gray-300 mb-2 block">Correo Electrónico *</label>
                  <Input
                    type="email"
                    value={formData.correo}
                    onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                    required
                    className="bg-[#1a1a1a] border-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-gray-300 mb-2 block">Teléfono *</label>
                  <Input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    required
                    className="bg-[#1a1a1a] border-gray-700 text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-gray-300 mb-2 block">Dirección *</label>
                  <Input
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    required
                    className="bg-[#1a1a1a] border-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-gray-300 mb-2 block">Región *</label>
                  <Select value={formData.region} onValueChange={handleRegionChange}>
                    <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
                      <SelectValue placeholder="Selecciona una región" />
                    </SelectTrigger>
                    <SelectContent>
                      {regiones.map((region) => (
                        <SelectItem key={region.id || region} value={region.nombre || region}>
                          {region.nombre || region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-gray-300 mb-2 block">Comuna *</label>
                  <Select
                    value={formData.comuna}
                    onValueChange={(value) => setFormData({ ...formData, comuna: value })}
                    disabled={!formData.region}
                  >
                    <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
                      <SelectValue placeholder="Selecciona una comuna" />
                    </SelectTrigger>
                    <SelectContent>
                      {comunas.map((comuna) => (
                        <SelectItem key={comuna} value={comuna}>
                          {comuna}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Método de pago */}
            <div className="bg-[#111] border border-[var(--neon-green)] rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="w-5 h-5 text-[var(--neon-green)]" />
                <h2 className="text-2xl text-[var(--neon-green)]">Método de Pago</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-gray-300 mb-2 block">Método de Pago *</label>
                  <Select
                    value={formData.metodoPago}
                    onValueChange={(value) => setFormData({ ...formData, metodoPago: value })}
                  >
                    <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tarjeta">Tarjeta de Crédito/Débito</SelectItem>
                      <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.metodoPago === 'tarjeta' && (
                  <>
                    <div>
                      <label className="text-gray-300 mb-2 block">Número de Tarjeta *</label>
                      <Input
                        value={formData.numeroTarjeta}
                        onChange={(e) => setFormData({ ...formData, numeroTarjeta: e.target.value })}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="bg-[#1a1a1a] border-gray-700 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-gray-300 mb-2 block">Nombre en la Tarjeta *</label>
                      <Input
                        value={formData.nombreTarjeta}
                        onChange={(e) => setFormData({ ...formData, nombreTarjeta: e.target.value })}
                        className="bg-[#1a1a1a] border-gray-700 text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-300 mb-2 block">Fecha Vencimiento *</label>
                        <Input
                          value={formData.fechaVencimiento}
                          onChange={(e) => setFormData({ ...formData, fechaVencimiento: e.target.value })}
                          placeholder="MM/AA"
                          maxLength={5}
                          className="bg-[#1a1a1a] border-gray-700 text-white"
                        />
                      </div>

                      <div>
                        <label className="text-gray-300 mb-2 block">CVV *</label>
                        <Input
                          type="password"
                          value={formData.cvv}
                          onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                          placeholder="123"
                          maxLength={3}
                          className="bg-[#1a1a1a] border-gray-700 text-white"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-[#111] border border-[var(--neon-green)] rounded-lg p-6 sticky top-24">
              <h2 className="text-2xl mb-6 text-[var(--neon-green)]">Resumen del Pedido</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-800">
                {cart.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-gray-300">{item.productName} x{item.quantity}</span>
                    <span className="text-white">{formatPrice(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-800">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
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
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--neon-green)] text-black hover:bg-[var(--neon-purple)] hover:text-white"
              >
                {loading ? 'Procesando...' : 'Confirmar Pedido'}
                <CheckCircle className="ml-2 w-5 h-5" />
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                *Este es un checkout simulado para fines educativos
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
