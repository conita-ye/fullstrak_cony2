import React, { useState, useEffect } from 'react';
import { Award, TrendingUp, Gift, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { 
  getLevelByPoints, 
  getNextLevel, 
  getPointsToNextLevel, 
  getProgressToNextLevel,
  type RedeemableProduct,
  REDEEMABLE_ITEMS 
} from '@/utils/pointsSystem';
import { toast } from 'sonner';

interface PointsPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export const PointsPage = ({ onNavigate }: PointsPageProps) => {
  const { user } = useAuth();
  const [selectedItem, setSelectedItem] = useState<RedeemableProduct | null>(null);
  
  const puntos = user?.puntosLevelUp || 0;
  const currentLevel = getLevelByPoints(puntos);
  const nextLevel = getNextLevel(puntos);
  const pointsToNext = getPointsToNextLevel(puntos);
  const progress = getProgressToNextLevel(puntos);

  const handleRedeem = (item: RedeemableProduct) => {
    if (puntos < item.puntosRequeridos) {
      toast.error(`No tienes suficientes puntos. Necesitas ${item.puntosRequeridos} puntos.`);
      return;
    }

    // Aquí se conectaría con el backend para canjear puntos
    toast.success(`¡Has canjeado ${item.nombre}! Se han descontado ${item.puntosRequeridos} puntos de tu cuenta.`);
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-4 text-[var(--neon-green)]">Sistema de Puntos LevelUp</h1>
          <p className="text-gray-400 text-lg">
            Acumula puntos, sube de nivel y canjea recompensas
          </p>
        </div>

        {/* Resumen de puntos y nivel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Puntos actuales */}
          <div className="bg-[#111] border border-[var(--neon-green)] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 text-[var(--neon-green)]" />
              <Badge 
                className="text-lg px-3 py-1"
                style={{ backgroundColor: currentLevel.color, color: '#000' }}
              >
                {currentLevel.nombre}
              </Badge>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{puntos.toLocaleString()}</div>
            <div className="text-gray-400">Puntos LevelUp</div>
          </div>

          {/* Progreso al siguiente nivel */}
          <div className="bg-[#111] border border-[var(--neon-purple)] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-[var(--neon-purple)]" />
              {nextLevel ? (
                <span className="text-gray-400 text-sm">Siguiente: {nextLevel.nombre}</span>
              ) : (
                <span className="text-[var(--neon-green)] text-sm">¡Nivel máximo!</span>
              )}
            </div>
            {nextLevel ? (
              <>
                <div className="text-2xl font-bold text-white mb-2">{pointsToNext}</div>
                <div className="text-gray-400 text-sm mb-2">Puntos para subir de nivel</div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-[var(--neon-purple)] h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </>
            ) : (
              <div className="text-gray-400">Has alcanzado el nivel máximo</div>
            )}
          </div>

          {/* Beneficios del nivel actual */}
          <div className="bg-[#111] border border-[var(--neon-blue)] rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-8 h-8 text-[var(--neon-blue)]" />
              <h3 className="text-xl text-white">Beneficios</h3>
            </div>
            <ul className="space-y-2">
              {currentLevel.beneficios.slice(0, 2).map((beneficio, index) => (
                <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-[var(--neon-green)]">✓</span>
                  <span>{beneficio}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Información del nivel actual */}
        <div className="bg-[#111] border border-[var(--neon-green)] rounded-lg p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold"
              style={{ backgroundColor: currentLevel.color, color: '#000' }}
            >
              {currentLevel.nombre.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl text-white mb-1">Nivel {currentLevel.nombre}</h2>
              <p className="text-gray-400">{currentLevel.descripcion}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <h3 className="text-lg text-[var(--neon-green)] mb-3">Todos tus beneficios:</h3>
              <ul className="space-y-2">
                {currentLevel.beneficios.map((beneficio, index) => (
                  <li key={index} className="text-gray-300 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[var(--neon-green)] mt-0.5 flex-shrink-0" />
                    <span>{beneficio}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {nextLevel && (
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                <h3 className="text-lg text-[var(--neon-purple)] mb-3">Próximo nivel: {nextLevel.nombre}</h3>
                <p className="text-gray-400 text-sm mb-3">{nextLevel.descripcion}</p>
                <div className="text-sm text-gray-500">
                  Beneficios adicionales:
                </div>
                <ul className="space-y-1 mt-2">
                  {nextLevel.beneficios.slice(0, 3).map((beneficio, index) => (
                    <li key={index} className="text-xs text-gray-400 flex items-start gap-2">
                      <span className="text-[var(--neon-purple)]">→</span>
                      <span>{beneficio}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Canje de puntos */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl text-[var(--neon-green)] flex items-center gap-2">
              <Gift className="w-8 h-8" />
              Canjear Puntos
            </h2>
            <Badge className="bg-[var(--neon-green)] text-black px-4 py-2">
              {puntos.toLocaleString()} puntos disponibles
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itemsCanjeables.map((item) => {
              const canAfford = puntos >= item.puntosRequeridos;
              
              return (
                <div
                  key={item.id}
                  className={`bg-[#111] border rounded-lg p-6 transition-all ${
                    canAfford
                      ? 'border-[var(--neon-green)] hover:border-[var(--neon-purple)] cursor-pointer'
                      : 'border-gray-800 opacity-60'
                  }`}
                  onClick={() => canAfford && setSelectedItem(item)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl text-white mb-2">{item.nombre}</h3>
                      <p className="text-gray-400 text-sm mb-4">{item.descripcion}</p>
                    </div>
                    {item.tipo === 'descuento' && (
                      <Badge className="bg-[var(--neon-purple)] text-white">
                        {item.valor}%
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-[var(--neon-green)]" />
                      <span className="text-white font-bold">{item.puntosRequeridos}</span>
                      <span className="text-gray-400 text-sm">puntos</span>
                    </div>
                    
                    {canAfford ? (
                      <Button
                        size="sm"
                        className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-purple)] hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                        }}
                        disabled={loading}
                      >
                        {loading ? 'Procesando...' : 'Canjear'}
                      </Button>
                    ) : (
                      <span className="text-gray-500 text-sm">Insuficientes</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cómo ganar puntos */}
        <div className="bg-[#111] border border-[var(--neon-blue)] rounded-lg p-6">
          <h2 className="text-2xl text-[var(--neon-green)] mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            ¿Cómo ganar puntos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-[var(--neon-green)]/20 p-2 rounded-lg">
                  <Award className="w-5 h-5 text-[var(--neon-green)]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Por compras</h3>
                  <p className="text-gray-400 text-sm">
                    Gana 1 punto por cada $100 CLP gastados en tus compras
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-[var(--neon-purple)]/20 p-2 rounded-lg">
                  <Star className="w-5 h-5 text-[var(--neon-purple)]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Por referidos</h3>
                  <p className="text-gray-400 text-sm">
                    Gana puntos cuando alguien se registra usando tu código de referido
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-[var(--neon-blue)]/20 p-2 rounded-lg">
                  <Gift className="w-5 h-5 text-[var(--neon-blue)]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Por eventos</h3>
                  <p className="text-gray-400 text-sm">
                    Asiste a eventos gaming y reclama puntos LevelUp
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-[var(--neon-green)]/20 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-[var(--neon-green)]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Por reseñas</h3>
                  <p className="text-gray-400 text-sm">
                    Deja reseñas de productos y gana puntos adicionales
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de confirmación de canje */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111] border border-[var(--neon-green)] rounded-lg p-8 max-w-md w-full">
              <h3 className="text-2xl text-[var(--neon-green)] mb-4">Confirmar Canje</h3>
              <div className="mb-6">
                <p className="text-white mb-2">¿Deseas canjear?</p>
                <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                  <div className="text-xl text-white mb-1">{selectedItem.nombre}</div>
                  <div className="text-gray-400 text-sm mb-3">{selectedItem.descripcion}</div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[var(--neon-green)]" />
                    <span className="text-white">
                      Costo: <span className="font-bold">{selectedItem.puntosRequeridos} puntos</span>
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    Puntos restantes: {puntos - selectedItem.puntosRequeridos}
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => handleRedeem(selectedItem)}
                  className="flex-1 bg-[var(--neon-green)] text-black hover:bg-[var(--neon-purple)] hover:text-white"
                  disabled={loading}
                >
                  {loading ? 'Procesando...' : 'Confirmar'}
                </Button>
                <Button
                  onClick={() => setSelectedItem(null)}
                  variant="outline"
                  className="flex-1 border-gray-700 text-gray-300"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
