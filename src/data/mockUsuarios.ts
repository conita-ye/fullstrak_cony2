import { User } from '../types';

export const usuarios: User[] = [
  {
    id: '1',
    run: '12345678',
    nombre: 'Admin',
    apellidos: 'One Tech',
    email: 'admin@duoc.cl',
    password: 'admin123',
    fechaNacimiento: '1990-01-01',
    direccion: 'Av. Libertador 123',
    region: 'Metropolitana',
    comuna: 'Santiago',
    rol: 'admin',
    puntosLevelUp: 0,
    codigoReferido: 'ADMIN2024'
  },
  {
    id: '2',
    run: '87654321',
    nombre: 'Carlos',
    apellidos: 'González',
    email: 'carlos@gmail.com',
    password: 'cliente123',
    fechaNacimiento: '1995-05-15',
    direccion: 'Paseo Bulnes 456',
    region: 'Metropolitana',
    comuna: 'Providencia',
    rol: 'cliente',
    puntosLevelUp: 250,
    codigoReferido: 'GAMER2024'
  }
];
