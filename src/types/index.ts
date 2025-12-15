export type UserRole = 'admin' | 'cliente' | 'vendedor';

export interface User {
  id: string;
  run: string;
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  fechaNacimiento: string;
  direccion: string;
  region: string;
  comuna: string;
  rol: UserRole;
  puntosLevelUp: number;
  codigoReferido?: string;
}

export interface Product {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  stockCritico?: number;
  categoria: string;
  imagen: string;
  featured?: boolean;
}

export interface CartItem {
  productId: string;
  cantidad: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  calificacion: number;
  comentario: string;
  fecha: string;
}

export interface BlogPost {
  id: string;
  titulo: string;
  extracto: string;
  contenido: string;
  autor: string;
  fecha: string;
  imagen: string;
  categoria: string;
}

export interface Region {
  nombre: string;
  comunas: string[];
}

export interface Boleta {
  id: number;
  numeroBoleta: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  total: number;
  estado: string;
  usuarioId: number;
  usuarioNombre?: string;
  detalle?: BoletaDetalle[];
}

export interface BoletaDetalle {
  id: number;
  productoId: number;
  productoNombre?: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Categoria {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  activa: boolean;
}