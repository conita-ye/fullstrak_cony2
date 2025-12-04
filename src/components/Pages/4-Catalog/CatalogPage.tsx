import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '@/components/Pages/3-Cart/Cart/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiService } from '@/services/api';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface Product {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  stockCritico?: number;
  categoria: string;
  imagenes: string[];
  puntosLevelUp?: number;
}

interface CatalogPageProps {
  onNavigate: (page: string, data?: any) => void;
  initialData?: { categoria?: string };
}

export const CatalogPage = ({ onNavigate, initialData }: CatalogPageProps) => {
  const { addToCart } = useCart();
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    cargarProductos();
  }, []);

  useEffect(() => {
    if (initialData?.categoria) {
      setSelectedCategory(initialData.categoria);
    }
  }, [initialData]);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const productosData = await apiService.getProductos();
      setProductos(productosData);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      toast.error('Error al cargar el catálogo');
    } finally {
      setLoading(false);
    }
  };

  const getCategoriaNombre = (categoria: any): string => {
    if (typeof categoria === 'string') return categoria;
    if (categoria && typeof categoria === 'object') {
      return categoria.nombre || categoria.codigo || 'Sin categoría';
    }
    return 'Sin categoría';
  };

  const categories = ['all', ...Array.from(new Set(productos.map((p) => getCategoriaNombre(p.categoria))))];

  const handleAddToCart = async (productId: number) => {
    await addToCart(productId, 1);
  };

  let filteredProducts = productos.filter((product) => {
    const matchesSearch =
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const categoriaNombre = getCategoriaNombre(product.categoria);
    const matchesCategory =
      selectedCategory === 'all' || categoriaNombre === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.precio - b.precio;
      case 'price-desc':
        return b.precio - a.precio;
      case 'name':
        return a.nombre.localeCompare(b.nombre);
      case 'featured':
      default:
        return (b.puntosLevelUp || 0) - (a.puntosLevelUp || 0);
    }
  });

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl mb-2 text-[var(--neon-green)]">Catálogo de Productos</h1>
          <p className="text-gray-400">
            Explora nuestra selección completa de productos gamer
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-[#111] border border-[var(--neon-green)] rounded-lg p-4 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="w-5 h-5 text-[var(--neon-green)]" />
            <h3 className="text-[var(--neon-green)]">Filtros y Búsqueda</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#1a1a1a] border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>

            {/* Categoría */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'Todas las categorías' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Ordenar */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Destacados</SelectItem>
                <SelectItem value="name">Nombre A-Z</SelectItem>
                <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botón limpiar filtros */}
          {(searchTerm || selectedCategory !== 'all' || sortBy !== 'featured') && (
            <div className="mt-4">
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSortBy('featured');
                }}
                variant="outline"
                size="sm"
                className="border-[var(--neon-green)] text-[var(--neon-green)]"
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>

        {/* Resultados */}
        <div className="mb-4 text-gray-400">
          {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado
          {filteredProducts.length !== 1 ? 's' : ''}
        </div>

        {/* Grid de productos */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Cargando productos...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const categoriaNombre = typeof product.categoria === 'string' 
                ? product.categoria 
                : (product.categoria?.nombre || product.categoria?.codigo || 'Sin categoría');
              
              return (
                <ProductCard
                  key={product.id}
                  product={{
                    id: String(product.id),
                    codigo: product.codigo,
                    nombre: product.nombre,
                    descripcion: product.descripcion,
                    precio: product.precio,
                    stock: product.stock,
                    stockCritico: product.stockCritico,
                    categoria: categoriaNombre,
                    imagen: product.imagenes && product.imagenes.length > 0 ? product.imagenes[0] : '',
                    featured: (product.puntosLevelUp || 0) >= 500
                  }}
                onAddToCart={handleAddToCart}
                onViewDetails={(id) => onNavigate('product-detail', { productId: id })}
              />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg mb-4">No se encontraron productos</p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSortBy('featured');
              }}
              className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-purple)] hover:text-white"
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
