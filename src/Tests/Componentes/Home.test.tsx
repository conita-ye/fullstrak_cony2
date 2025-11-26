// tests/Home.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

// MOCK debe estar antes de importar Home
vi.mock('../../Data/productos', () => ({
  obtenerProductos: vi.fn(() => [
    {
      id: 1,
      nombre: "PlayStation 5 Slim",
      precio: 589990,
      categoria: "consolas",
      imagen: "https://example.com/ps5slim.jpg",
      descripcion: "Nueva versión PS5 Slim con control DualSense.",
      rating: 4.9,
      stock: 10
    },
    {
      id: 2,
      nombre: "Nintendo Switch OLED Edición Rosa Pastel",
      precio: 429990,
      categoria: "consolas",
      imagen: "https://example.com/switch-rosa.jpg",
      descripcion: "Edición especial rosada.",
      rating: 4.8,
      stock: 15
    },
    {
      id: 4,
      nombre: "Fortnite Minty Legends Pack (Físico)",
      precio: 29990,
      categoria: "juegos",
      imagen: "https://example.com/mintyfortnite.jpg",
      descripcion: "Caja física con código.",
      rating: 4.7,
      stock: 45
    }
  ])
}));

import Home from '../../Paginas/Home';

describe('Home Page', () => {
  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={['/']}>
        <Home />
      </MemoryRouter>
    );
  };

  test('renders hero section with correct content', () => {
    renderComponent();

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/Eleva tu/);
    expect(heading).toHaveTextContent(/Experiencia/);
    expect(heading).toHaveTextContent(/Gaming/);

    expect(screen.getByText('Explorar Productos')).toBeInTheDocument();
  });

  test('renders features section', () => {
    renderComponent();

    expect(screen.getByText('Envío Gratis')).toBeInTheDocument();
    expect(screen.getByText(/Garantía/)).toBeInTheDocument();
    expect(screen.getByText(/Soporte/)).toBeInTheDocument();
  });

  test('renders featured products section', async () => {
    renderComponent();

    expect(await screen.findByText('Productos Destacados')).toBeInTheDocument();
    expect(await screen.findByText('PlayStation 5 Slim')).toBeInTheDocument();
    expect(await screen.findByText('Nintendo Switch OLED Edición Rosa Pastel')).toBeInTheDocument();
    expect(await screen.findByText('Fortnite Minty Legends Pack (Físico)')).toBeInTheDocument();
  });

  test('renders call to action section', () => {
    renderComponent();

    expect(screen.getByText('Explorar Productos')).toBeInTheDocument();
    expect(screen.getByText('Ver Todos los Productos')).toBeInTheDocument();
  });
});
