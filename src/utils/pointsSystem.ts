// Sistema de niveles y puntos LevelUp

export interface UserLevel {
  nombre: string;
  puntosMinimos: number;
  puntosMaximos: number;
  color: string;
  descripcion: string;
  beneficios: string[];
}

export const LEVELS: UserLevel[] = [
  {
    nombre: 'Bronce',
    puntosMinimos: 0,
    puntosMaximos: 999,
    color: '#CD7F32',
    descripcion: 'Nivel inicial - ¡Bienvenido a Level-Up Gamer!',
    beneficios: [
      'Acceso a ofertas especiales',
      'Puntos por cada compra',
    ],
  },
  {
    nombre: 'Plata',
    puntosMinimos: 1000,
    puntosMaximos: 4999,
    color: '#C0C0C0',
    descripcion: 'Gamer activo - ¡Sigue así!',
    beneficios: [
      '5% de descuento adicional',
      'Acceso anticipado a nuevos productos',
      'Puntos dobles en eventos',
    ],
  },
  {
    nombre: 'Oro',
    puntosMinimos: 5000,
    puntosMaximos: 14999,
    color: '#FFD700',
    descripcion: 'Gamer VIP - ¡Eres parte de la élite!',
    beneficios: [
      '10% de descuento adicional',
      'Envío gratis en todas las compras',
      'Soporte prioritario',
      'Acceso a productos exclusivos',
    ],
  },
  {
    nombre: 'Platino',
    puntosMinimos: 15000,
    puntosMaximos: Infinity,
    color: '#E5E4E2',
    descripcion: 'Leyenda Gamer - ¡El nivel más alto!',
    beneficios: [
      '15% de descuento adicional',
      'Envío express gratis',
      'Soporte 24/7',
      'Productos exclusivos y ediciones limitadas',
      'Invitaciones a eventos privados',
    ],
  },
];

export const getLevelByPoints = (puntos: number): UserLevel => {
  return LEVELS.find(
    (level) => puntos >= level.puntosMinimos && puntos <= level.puntosMaximos
  ) || LEVELS[0];
};

export const getNextLevel = (puntos: number): UserLevel | null => {
  const currentLevel = getLevelByPoints(puntos);
  const currentIndex = LEVELS.indexOf(currentLevel);
  
  if (currentIndex < LEVELS.length - 1) {
    return LEVELS[currentIndex + 1];
  }
  return null;
};

export const getPointsToNextLevel = (puntos: number): number => {
  const nextLevel = getNextLevel(puntos);
  if (!nextLevel) return 0;
  return nextLevel.puntosMinimos - puntos;
};

export const getProgressToNextLevel = (puntos: number): number => {
  const currentLevel = getLevelByPoints(puntos);
  const nextLevel = getNextLevel(puntos);
  
  if (!nextLevel) return 100; // Ya está en el nivel máximo
  
  const range = nextLevel.puntosMinimos - currentLevel.puntosMinimos;
  const progress = puntos - currentLevel.puntosMinimos;
  
  return Math.min(100, Math.max(0, (progress / range) * 100));
};

// Productos canjeables por puntos
export interface RedeemableProduct {
  id: number;
  nombre: string;
  descripcion: string;
  puntosRequeridos: number;
  tipo: 'descuento' | 'producto' | 'envio';
  valor?: number; // Porcentaje de descuento o valor del producto
  imagen?: string;
}

export const REDEEMABLE_ITEMS: RedeemableProduct[] = [
  {
    id: 1,
    nombre: 'Cupón 10% Descuento',
    descripcion: 'Descuento del 10% en tu próxima compra',
    puntosRequeridos: 500,
    tipo: 'descuento',
    valor: 10,
  },
  {
    id: 2,
    nombre: 'Cupón 20% Descuento',
    descripcion: 'Descuento del 20% en tu próxima compra',
    puntosRequeridos: 1000,
    tipo: 'descuento',
    valor: 20,
  },
  {
    id: 3,
    nombre: 'Envío Express Gratis',
    descripcion: 'Envío express gratis en tu próxima compra',
    puntosRequeridos: 300,
    tipo: 'envio',
  },
  {
    id: 4,
    nombre: 'Mousepad Gamer',
    descripcion: 'Mousepad gamer personalizado Level-Up',
    puntosRequeridos: 800,
    tipo: 'producto',
    valor: 0,
  },
  {
    id: 5,
    nombre: 'Polera Level-Up',
    descripcion: 'Polera exclusiva Level-Up Gamer',
    puntosRequeridos: 1200,
    tipo: 'producto',
    valor: 0,
  },
  {
    id: 6,
    nombre: 'Cupón 30% Descuento',
    descripcion: 'Descuento del 30% en tu próxima compra',
    puntosRequeridos: 2000,
    tipo: 'descuento',
    valor: 30,
  },
];
