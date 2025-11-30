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
