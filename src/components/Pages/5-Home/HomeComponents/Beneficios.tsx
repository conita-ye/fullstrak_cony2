import React from 'react';
import { Zap, Shield, Truck, Dices } from 'lucide-react';

const Beneficios: React.FC = () => {
  return (
    // Fondo más oscuro
    <section className="py-12 px-4 bg-gray-950 border-b border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* 1. VELOCIDAD Y ACCIÓN */}
          <div className="flex items-center gap-6 p-6 border-2 border-gray-800 rounded-xl bg-gray-900 shadow-xl hover:border-yellow-400 transition-all duration-300 transform hover:scale-[1.01]">
            {/* Ícono grande en círculo amarillo */}
            <div className="bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center shrink-0 shadow-lg">
              <Zap className="w-8 h-8 text-gray-900" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                JUEGA A LA VELOCIDAD DE LA LUZ
              </h3>
              <p className="text-gray-400 text-sm">
                Despacho express para que tu setup no espere.
              </p>
            </div>
          </div>

          {/* 2. CONFIANZA Y GARANTÍA */}
          <div className="flex items-center gap-6 p-6 border-2 border-gray-800 rounded-xl bg-gray-900 shadow-xl hover:border-yellow-400 transition-all duration-300 transform hover:scale-[1.01]">
            {/* Ícono grande en círculo amarillo */}
            <div className="bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center shrink-0 shadow-lg">
              <Shield className="w-8 h-8 text-gray-900" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                COMPRA PROTEGIDA, WIN GARANTIZADO
              </h3>
              <p className="text-gray-400 text-sm">
                Productos de calidad con respaldo total y garantía.
              </p>
            </div>
          </div>

          {/* 3. COBERTURA TOTAL */}
          <div className="flex items-center gap-6 p-6 border-2 border-gray-800 rounded-xl bg-gray-900 shadow-xl hover:border-yellow-400 transition-all duration-300 transform hover:scale-[1.01]">
            {/* Ícono grande en círculo amarillo */}
            <div className="bg-yellow-400 w-16 h-16 rounded-full flex items-center justify-center shrink-0 shadow-lg">
              <Truck className="w-8 h-8 text-gray-900" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                COBERTURA TOTAL EN EL MAPA
              </h3>
              <p className="text-gray-400 text-sm">
                Envíos a cada rincón de Chile, sin barreras.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Beneficios;