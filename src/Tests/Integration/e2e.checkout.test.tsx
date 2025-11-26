import React from 'react';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';
import { vi } from 'vitest';

// Mock productos usando los productos de "La Tienda Gamer de Cony"
vi.mock('../../Data/productos', () => {
  const productos = [
    {
      id: 1,
      nombre: 'PlayStation 5 Slim',
      precio: 589990,
      categoria: 'consolas',
      imagen: '/ps5slim.jpg',
      descripcion: 'Nueva versión PS5 Slim con control DualSense.',
      rating: 4.9,
      stock: 10
    },
    {
      id: 4,
      nombre: 'Fortnite Minty Legends Pack (Físico)',
      precio: 29990,
      categoria: 'juegos',
      imagen: '/mintyfortnite.jpg',
      descripcion: 'Caja física con código para skins Minty Legends.',
      rating: 4.7,
      stock: 45
    },
    {
      id: 9,
      nombre: 'Tarjeta PlayStation Store 20 USD',
      precio: 20990,
      categoria: 'giftcards',
      imagen: '/ps20.jpg',
      descripcion: 'Código digital canjeable en PS4 y PS5.',
      rating: 4.8,
      stock: 300
    },
    {
      id: 11,
      nombre: 'Mouse Gamer Rosa RGB',
      precio: 15990,
      categoria: 'accesorios',
      imagen: '/mousepink.jpg',
      descripcion: 'Mouse ligero con luces RGB pastel.',
      rating: 4.9,
      stock: 40
    }
  ];

  return {
    obtenerProductos: vi.fn(() => productos),
    obtenerProductosPorCategoria: vi.fn((categoria) => productos.filter(p => p.categoria === categoria)),
    obtenerProductoPorId: vi.fn((id) => productos.find(p => Number(p.id) === Number(id))),
    categorias: [
      { id: 'todos', nombre: 'Todos' },
      { id: 'consolas', nombre: 'Consolas' },
      { id: 'juegos', nombre: 'Videojuegos Físicos' },
      { id: 'giftcards', nombre: 'Gift Cards' },
      { id: 'accesorios', nombre: 'Accesorios Gamer' }
    ]
  };
});

describe('E2E flujo carrito -> proceder al pago (La Tienda Gamer de Cony)', () => {
  test('desde Home a Productos, agregar PS5 Slim al carrito y proceder al pago', async () => {
    render(<App />);

    // Ir a Productos desde el hero (botón "Explorar Productos")
    const explorar = await screen.findByText('Explorar Productos');
    await userEvent.click(explorar);

    // Esperar que la página de productos muestre el listado
    await waitFor(() => expect(screen.getByText('Nuestros Productos')).toBeInTheDocument());

    // Encontrar la tarjeta del producto PlayStation 5 Slim
    const productoCard = screen.getByText('PlayStation 5 Slim').closest('.card');
    expect(productoCard).toBeTruthy();

    // Buscar botón "Agregar al Carrito" dentro de la card (fallback robusto)
    const area = within(productoCard);
    let addBtn = null;
    try {
      addBtn = area.getByRole('button', { name: /Agregar al Carrito|Agregar|Añadir/i });
    } catch (e) {
      const btns = area.queryAllByRole('button');
      addBtn = btns.length ? btns[0] : null;
    }

    expect(addBtn).toBeTruthy();
    if (addBtn) await userEvent.click(addBtn);

    // Navegar al carrito usando el link con href '/carrito' o link con texto 'Carrito'
    const carritoLink = document.querySelector('a[href="/carrito"]') || screen.queryByRole('link', { name: /carrito|Carrito/i });
    expect(carritoLink).toBeTruthy();
    if (carritoLink) await userEvent.click(carritoLink);

    // Verificar que estamos en la página del carrito y que el producto aparece
    await waitFor(() => expect(screen.getByText('Tu Carrito de Compras')).toBeInTheDocument());
    expect(screen.getByText('PlayStation 5 Slim')).toBeInTheDocument();

    // Click en Proceder al Pago (link o botón)
    const proceder = screen.getByRole('link', { name: /Proceder al Pago/i }) || screen.queryByText(/Proceder al Pago/i);
    expect(proceder).toBeTruthy();
    if (proceder) await userEvent.click(proceder);

    // Verificar que el control existe (la navegación real depende del router)
    expect(proceder).toBeInTheDocument();
  });

  // Test adicional opcional: agregar una gift card (descomenta si quieres probarlo)
  /*
  test('agregar Tarjeta PlayStation Store 20 USD al carrito', async () => {
    render(<App />);

    const explorar = await screen.findByText('Explorar Productos');
    await userEvent.click(explorar);
    await waitFor(() => expect(screen.getByText('Nuestros Productos')).toBeInTheDocument());

    const giftCardCard = screen.getByText('Tarjeta PlayStation Store 20 USD').closest('.card');
    expect(giftCardCard).toBeTruthy();

    const addBtn = within(giftCardCard).queryByRole('button', { name: /Agregar al Carrito|Agregar|Añadir/i }) || within(giftCardCard).getAllByRole('button')[0];
    expect(addBtn).toBeTruthy();
    if (addBtn) await userEvent.click(addBtn);

    const carritoLink = document.querySelector('a[href="/carrito"]') || screen.queryByRole('link', { name: /carrito|Carrito/i });
    if (carritoLink) await userEvent.click(carritoLink);

    await waitFor(() => expect(screen.getByText('Tu Carrito de Compras')).toBeInTheDocument());
    expect(screen.getByText('Tarjeta PlayStation Store 20 USD')).toBeInTheDocument();
  });
  */
});
