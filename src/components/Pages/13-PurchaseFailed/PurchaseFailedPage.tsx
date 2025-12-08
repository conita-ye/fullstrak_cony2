import React from 'react';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PurchaseFailedPageProps {
  onNavigate: (page: string, data?: any) => void;
  error?: string;
}

export const PurchaseFailedPage = ({ onNavigate, error }: PurchaseFailedPageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-[#111] border-2 border-red-500 rounded-lg p-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center">
              <XCircle className="w-16 h-16 text-white" />
            </div>
          </div>

          <h1 className="text-4xl mb-4 text-red-500">Pago No Procesado</h1>
          <p className="text-gray-300 text-lg mb-6">
            No se pudo completar tu compra. Por favor, intenta nuevamente.
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-8">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6 mb-8 text-left">
            <h3 className="text-red-500 mb-4">Posibles Causas:</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Datos de tarjeta incorrectos o inválidos</li>
              <li>• Fondos insuficientes</li>
              <li>• Problemas de conexión</li>
              <li>• Tarjeta bloqueada o expirada</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => onNavigate('cart')}
              className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-purple)] hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver al Carrito
            </Button>
            <Button
              onClick={() => onNavigate('checkout')}
              variant="outline"
              className="border-[var(--neon-green)] text-[var(--neon-green)] hover:bg-[var(--neon-green)] hover:text-black"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Intentar Nuevamente
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
