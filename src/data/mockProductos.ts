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
    imagen: 'https://kronosgaming.cl/wp-content/uploads/2021/10/1-3.png',
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
    imagen: 'https://cdnx.jumpseller.com/mundotek/image/42970522/resize/753/753?1701399702',
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
    imagen: 'https://media.falabella.com/falabellaCL/129757370_01/w=1200,h=1200,fit=pad',
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
    imagen: 'https://www.winpy.cl/files/w19813_lg_ultragear_27gl650f-b.jpg',
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
    imagen: 'https://clsonyb2c.vtexassets.com/arquivos/ids/465203-1600-auto?v=638660598807800000&width=1600&height=auto&aspect=true',
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