import React from 'react';
import { Zap, Shield, Truck } from 'lucide-react';

const Beneficios: React.FC = () => {
  return (
    <section className="py-8 px-4 bg-[#0a0a0a] border-b border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Compra Rápida */}
          <div className="flex items-center gap-4 p-4 border border-[var(--neon-green)]/30 rounded-lg bg-[#111] hover:border-[var(--neon-green)] transition-all">
            <div className="bg-[var(--neon-green)] w-12 h-12 rounded-full flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="text-[var(--neon-green)] mb-1">Compra Rápida</h3>
              <p className="text-gray-400 text-sm">
                Proceso optimizado en minutos
              </p>
            </div>
          </div>

          {/* Compra Segura */}
          <div className="flex items-center gap-4 p-4 border border-[var(--neon-purple)]/30 rounded-lg bg-[#111] hover:border-[var(--neon-purple)] transition-all">
            <div className="bg-[var(--neon-purple)] w-12 h-12 rounded-full flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-[var(--neon-purple)] mb-1">Compra Segura</h3>
              <p className="text-gray-400 text-sm">
                Productos garantizados de calidad
              </p>
            </div>
          </div>

          {/* Envío a Todo Chile */}
          <div className="flex items-center gap-4 p-4 border border-[var(--neon-blue)]/30 rounded-lg bg-[#111] hover:border-[var(--neon-blue)] transition-all">
            <div className="bg-[var(--neon-blue)] w-12 h-12 rounded-full flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6 text-black" />
            </div>
            <div>
              <h3 className="text-[var(--neon-blue)] mb-1">Envío a Todo Chile</h3>
              <p className="text-gray-400 text-sm">
                Despacho rápido a todas las regiones
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Beneficios;
