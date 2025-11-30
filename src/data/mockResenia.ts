import { Review } from '../types';

export const reviews: Review[] = [
  {
    id: '1',
    productId: '1',
    userId: '2',
    userName: 'Carlos González',
    calificacion: 5,
    comentario: 'Excelente teclado, los switches azules suenan increíbles y la iluminación RGB es personalizable al detalle.',
    fecha: '2025-01-12'
  },
  {
    id: '2',
    productId: '2',
    userId: '2',
    userName: 'Carlos González',
    calificacion: 4,
    comentario: 'Muy buenos audífonos, el sonido 7.1 es impresionante. Solo el micrófono podría ser un poco mejor.',
    fecha: '2025-01-10'
  },
  {
    id: '3',
    productId: '4',
    userId: '2',
    userName: 'Carlos González',
    calificacion: 5,
    comentario: 'El mejor monitor que he tenido. Los 144Hz hacen una diferencia enorme en juegos competitivos.',
    fecha: '2025-01-08'
  }
];