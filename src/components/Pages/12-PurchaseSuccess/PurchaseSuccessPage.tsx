import React from 'react';
import { CheckCircle, Home, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PurchaseSuccessPageProps {
  onNavigate: (page: string, data?: any) => void;
  orderId?: string;
}

export const PurchaseSuccessPage = ({ onNavigate, orderId }: PurchaseSuccessPageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-[#111] border-2 border-[var(--neon-green)] rounded-lg p-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-[var(--neon-green)] rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-black" />
            </div>
          </div>

          <h1 className="text-4xl mb-4 text-[var(--neon-green)]">¡Compra Exitosa!</h1>
          <p className="text-gray-300 text-lg mb-6">
            Tu pedido ha sido procesado correctamente
          </p>

          {orderId && (
            <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 mb-8">
              <p className="text-gray-400 text-sm mb-2">Número de Orden:</p>
              <p className="text-[var(--neon-green)] text-xl font-bold">{orderId}</p>
            </div>
          )}

          <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 mb-8 text-left">
            <h3 className="text-[var(--neon-green)] mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Próximos Pasos
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Recibirás un correo de confirmación en breve</li>
              <li>• Tu pedido será procesado y enviado en 2-3 días hábiles</li>
              <li>• Podrás rastrear tu pedido desde tu cuenta</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => onNavigate('home')}
              className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-purple)] hover:text-white"
            >
              <Home className="w-5 h-5 mr-2" />
              Volver al Inicio
            </Button>
            <Button
              onClick={() => onNavigate('catalog')}
              variant="outline"
              className="border-[var(--neon-green)] text-[var(--neon-green)] hover:bg-[var(--neon-green)] hover:text-black"
            >
              Seguir Comprando
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
