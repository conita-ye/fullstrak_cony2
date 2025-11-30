import type { Product } from '../types';

export const productos: Product[] = [
  {
    id: '1',
    codigo: 'KB-RGB-001',
    nombre: 'Teclado Mecánico RGB Gamer',
    descripcion: 'Teclado mecánico con switches azules, iluminación RGB personalizable y reposamanos extraíble. Perfecto para gaming y productividad.',
    precio: 89990,
    stock: 15,
    stockCritico: 5,
    categoria: 'Periféricos',
    imagen: 'https://m.media-amazon.com/images/I/71h45LTINwL._AC_SL1500_.jpg',
    featured: true
  },
  {
    id: '2',
    codigo: 'HS-7.1-002',
    nombre: 'Audífonos Gamer 7.1 Surround',
    descripcion: 'Audífonos con sonido envolvente 7.1, micrófono retráctil con cancelación de ruido e iluminación RGB.',
    precio: 69990,
    stock: 23,
    stockCritico: 8,
    categoria: 'Audio',
    imagen: 'https://media.spdigital.cl/thumbnails/products/1756390473351-arcus1_d4a0bf48_e77646b7_thumbnail_512.jpg',
    featured: true
  },
  {
    id: '3',
    codigo: 'CH-PRO-003',
    nombre: 'Silla Gamer Pro Ergonómica',
    descripcion: 'Silla ergonómica con soporte lumbar ajustable, reposabrazos 4D y reclinación hasta 180°. Ideal para largas sesiones.',
    precio: 249990,
    stock: 8,
    stockCritico: 3,
    categoria: 'Sillas',
    imagen: 'https://m.media-amazon.com/images/I/813lzbP5UoL._AC_SL1500_.jpg',
    featured: false
  },
  {
    id: '4',
    codigo: 'MON-144-004',
    nombre: 'Monitor Gaming 144Hz 27"',
    descripcion: 'Monitor curvo 27 pulgadas, tasa de refresco 144Hz, tiempo de respuesta 1ms, resolución QHD 2K.',
    precio: 349990,
    stock: 12,
    stockCritico: 4,
    categoria: 'Monitores',
    imagen: 'https://http2.mlstatic.com/D_NQ_NP_2X_874805-MLA96135207215_102025-F.webp',
    featured: true
  },
  {
    id: '5',
    codigo: 'PS5-CTRL-005',
    nombre: 'Control DualSense PS5',
    descripcion: 'Control inalámbrico PlayStation 5 con retroalimentación háptica y gatillos adaptativos.',
    precio: 59990,
    stock: 30,
    stockCritico: 10,
    categoria: 'Consolas',
    imagen: 'https://images.unsplash.com/photo-1687713143171-b1ffd531263d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGF5c3RhdGlvbiUyMGNvbnNvbGUlMjBjb250cm9sbGVyfGVufDF8fHx8MTc2MDYzODkzMnww&ixlib=rb-4.1.0&q=80&w=1080',
    featured: false
  },
  {
    id: '6',
    codigo: 'PC-RTX-006',
    nombre: 'PC Gamer RTX 4060',
    descripcion: 'Computador gamer completo: Intel i7 13va gen, RTX 4060 8GB, 16GB RAM, SSD 1TB NVMe, RGB.',
    precio: 1299990,
    stock: 5,
    stockCritico: 2,
    categoria: 'Computadores',
    imagen: 'https://m.media-amazon.com/images/I/71ENeVg0MuL._AC_SX466_.jpg',
    featured: true
  },
  {
    id: '7',
    codigo: 'MOU-RGB-007',
    nombre: 'Mouse Gaming RGB 16000 DPI',
    descripcion: 'Mouse óptico con sensor de alta precisión, 7 botones programables y peso ajustable.',
    precio: 39990,
    stock: 42,
    stockCritico: 15,
    categoria: 'Periféricos',
    imagen: 'https://rimage.ripley.cl/home.ripley/Attachment/MKP/1299/MPM00021978732/Image-1.jpg',
    featured: false
  },
  {
    id: '8',
    codigo: 'KIT-STREAM-008',
    nombre: 'Kit Streaming Completo',
    descripcion: 'Kit para streamers: micrófono condensador, brazo articulado, luz LED ring, cámara web 1080p.',
    precio: 0,
    stock: 3,
    stockCritico: 1,
    categoria: 'Audio',
    imagen: 'https://m.media-amazon.com/images/I/61sa7TrZZzL._AC_SL1280_.jpg',
    featured: false
  }
];