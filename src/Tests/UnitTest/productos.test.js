import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('productos CRUD (Data/productos.js)', () => {

  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('carga correctamente la lista inicial de productos', async () => {
    const mod = await import('../../Data/productos.js');
    const { obtenerProductos } = mod;

    const lista = obtenerProductos();
    expect(Array.isArray(lista)).toBe(true);
    expect(lista.length).toBeGreaterThan(0);
  });

  it('agregarProducto crea un producto nuevo con id único', async () => {
    const mod = await import('../../Data/productos.js');
    const { agregarProducto, obtenerProductos } = mod;

    const nuevo = {
      nombre: 'ProductoPrueba',
      precio: 1200,
      categoria: 'accesorios',
      descripcion: 'producto test',
      imagen: '',
      stock: 4
    };

    const creado = agregarProducto(nuevo);
    expect(creado).toHaveProperty('id');

    const lista = obtenerProductos();
    expect(lista.some(p => p.id === creado.id)).toBe(true);
  });

  it('actualizarProducto modifica los campos que se envían', async () => {
    const mod = await import('../../Data/productos.js');
    const { agregarProducto, actualizarProducto, obtenerProductoPorId } = mod;

    const inicial = {
      nombre: 'EditarProd',
      precio: 500,
      categoria: 'accesorios',
      descripcion: 'desc',
      imagen: '',
      stock: 1
    };

    const creado = agregarProducto(inicial);

    actualizarProducto(creado.id, { nombre: 'EditadoOK', precio: 1999 });

    const actualizado = obtenerProductoPorId(creado.id);
    expect(actualizado.nombre).toBe('EditadoOK');
    expect(actualizado.precio).toBe(1999);
  });

  it('eliminarProducto borra el producto correspondiente al id', async () => {
    const mod = await import('../../Data/productos.js');
    const { agregarProducto, eliminarProducto, obtenerProductos } = mod;

    const nuevo = {
      nombre: 'EliminarEste',
      precio: 99,
      categoria: 'accesorios',
      descripcion: '',
      imagen: '',
      stock: 1
    };

    const creado = agregarProducto(nuevo);

    const antes = obtenerProductos();
    expect(antes.some(p => p.id === creado.id)).toBe(true);

    eliminarProducto(creado.id);

    const despues = obtenerProductos();
    expect(despues.some(p => p.id === creado.id)).toBe(false);
  });

});
