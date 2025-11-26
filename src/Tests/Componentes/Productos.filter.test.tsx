import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Productos from '../../Paginas/Productos';
import { BrowserRouter } from 'react-router-dom';

// Mock del módulo de productos con los productos de "La Tienda Gamer de Cony"
vi.mock('../../Data/productos', () => {
  const productos = [
    // Consolas
    { id: 1, nombre: 'PlayStation 5 Slim', precio: 589990, categoria: 'consolas', imagen: '', descripcion: 'PS5 Slim', rating: 4.9, stock: 10 },
    { id: 2, nombre: 'Nintendo Switch OLED Edición Rosa Pastel', precio: 429990, categoria: 'consolas', imagen: '', descripcion: 'Switch OLED Rosa', rating: 4.8, stock: 15 },
    { id: 3, nombre: 'Xbox Series S', precio: 299990, categoria: 'consolas', imagen: '', descripcion: 'Xbox Series S', rating: 4.6, stock: 20 },

    // Videojuegos físicos
    { id: 4, nombre: 'Fortnite Minty Legends Pack (Físico)', precio: 29990, categoria: 'juegos', imagen: '', descripcion: 'Fortnite físico', rating: 4.7, stock: 45 },
    { id: 5, nombre: 'Spider-Man 2 PS5 (Físico)', precio: 54990, categoria: 'juegos', imagen: '', descripcion: 'Spider-Man 2 PS5', rating: 5.0, stock: 30 },
    { id: 6, nombre: 'Mario Kart 8 Deluxe (Switch) Físico', precio: 46990, categoria: 'juegos', imagen: '', descripcion: 'Mario Kart 8', rating: 4.9, stock: 25 },

    // Giftcards / códigos digitales
    { id: 8, nombre: 'Pavos Fortnite – 2.800 V-Bucks', precio: 13990, categoria: 'fortnite', imagen: '', descripcion: 'V-Bucks 2800', rating: 4.9, stock: 500 },
    { id: 9, nombre: 'Tarjeta PlayStation Store 20 USD', precio: 20990, categoria: 'giftcards', imagen: '', descripcion: 'PS Store 20 USD', rating: 4.8, stock: 300 },
    { id: 10, nombre: 'Xbox Game Pass Ultimate – 1 mes', precio: 10990, categoria: 'giftcards', imagen: '', descripcion: 'Game Pass 1 mes', rating: 4.7, stock: 250 },

    // Accesorios (ejemplo)
    { id: 11, nombre: 'Mouse Gamer Rosa RGB', precio: 15990, categoria: 'accesorios', imagen: '', descripcion: 'Mouse rosa', rating: 4.9, stock: 40 }
  ];

  return {
    obtenerProductos: vi.fn(() => productos),
    obtenerProductosPorCategoria: vi.fn((categoria) => productos.filter(p => p.categoria === categoria)),
    categorias: [
      { id: 'todos', nombre: 'Todos los Productos' },
      { id: 'consolas', nombre: 'Consolas' },
      { id: 'juegos', nombre: 'Videojuegos Físicos' },
      { id: 'giftcards', nombre: 'Gift Cards' },
      { id: 'accesorios', nombre: 'Accesorios Gamer' }
    ]
  };
});

describe('Filtrado de productos por categoría (Tienda Gamer de Cony)', () => {
  const renderComponent = () => render(
    <BrowserRouter>
      <Productos />
    </BrowserRouter>
  );

  test('muestra solo productos de la categoría consolas', async () => {
    renderComponent();

    // Seleccionar la opción "Consolas"
    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, 'consolas');

    // Verificar que los productos de consolas se muestran
    expect(screen.getByText('PlayStation 5 Slim')).toBeInTheDocument();
    expect(screen.getByText('Nintendo Switch OLED Edición Rosa Pastel')).toBeInTheDocument();
    expect(screen.getByText('Xbox Series S')).toBeInTheDocument();

    // Y que un producto de otra categoría no se muestra (por ejemplo un juego físico)
    expect(screen.queryByText('Spider-Man 2 PS5 (Físico)')).toBeNull();
  });

  test('muestra solo productos de la categoría juegos (físicos)', async () => {
    renderComponent();

    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, 'juegos');

    expect(screen.getByText('Fortnite Minty Legends Pack (Físico)')).toBeInTheDocument();
    expect(screen.getByText('Spider-Man 2 PS5 (Físico)')).toBeInTheDocument();
    expect(screen.getByText('Mario Kart 8 Deluxe (Switch) Físico')).toBeInTheDocument();

    // Y que un producto de otra categoría no se muestra (por ejemplo una giftcard)
    expect(screen.queryByText('Tarjeta PlayStation Store 20 USD')).toBeNull();
  });

  test('muestra solo productos de la categoría giftcards', async () => {
    renderComponent();

    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, 'giftcards');

    expect(screen.getByText('Tarjeta PlayStation Store 20 USD')).toBeInTheDocument();
    expect(screen.getByText('Xbox Game Pass Ultimate – 1 mes')).toBeInTheDocument();

    // Y que un producto de otra categoría (por ejemplo consola) no se muestra
    expect(screen.queryByText('PlayStation 5 Slim')).toBeNull();
  });
});
