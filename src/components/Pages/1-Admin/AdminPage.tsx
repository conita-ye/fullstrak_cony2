import React, { useState } from 'react';
import { Package, Users, ShoppingCart, TrendingUp, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { useAuth } from '../../../contexts/AuthContext';
import { productos as initialProductos } from '../../../data/mockProductos';
import { Product } from '../../../types';
import { formatPrice, validateProductCode, validatePrice, validateStock } from '../../../utils/validations';
import { toast } from 'sonner';

interface AdminPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export const AdminPage = ({ onNavigate }: AdminPageProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'users'>('dashboard');
  const [productos, setProductos] = useState(initialProductos);
  const [isCreating, setIsCreating] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    stockCritico: 0,
    categoria: 'Periféricos',
    imagen: '',
    featured: false,
  });

  if (user?.rol !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-red-500 mb-4">Acceso Denegado</h2>
          <p className="text-gray-400 mb-6">
            No tienes permisos para acceder al panel de administración
          </p>
          <Button
            onClick={() => onNavigate('home')}
            className="bg-[var(--neon-green)] text-black"
          >
            Volver al Inicio
          </Button>
        </div>
      </div>
    );
  }

  const handleSaveProduct = () => {
    if (!newProduct.codigo || !newProduct.nombre || !newProduct.descripcion) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    if (!validateProductCode(newProduct.codigo)) {
      toast.error('El código debe tener al menos 3 caracteres');
      return;
    }

    if (!validatePrice(newProduct.precio || 0)) {
      toast.error('El precio debe ser mayor o igual a 0');
      return;
    }

    if (!validateStock(newProduct.stock || 0)) {
      toast.error('El stock debe ser un número entero mayor o igual a 0');
      return;
    }

    if (editingProduct) {
      // Editar producto existente
      setProductos(
        productos.map((p) =>
          p.id === editingProduct.id ? { ...p, ...newProduct } as Product : p
        )
      );
      toast.success('Producto actualizado correctamente');
    } else {
      // Crear nuevo producto
      const newId = String(Math.max(...productos.map((p) => parseInt(p.id))) + 1);
      setProductos([...productos, { ...newProduct, id: newId } as Product]);
      toast.success('Producto creado correctamente');
    }

    setIsCreating(false);
    setEditingProduct(null);
    setNewProduct({
      codigo: '',
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0,
      stockCritico: 0,
      categoria: 'Periféricos',
      imagen: '',
      featured: false,
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProductos(productos.filter((p) => p.id !== id));
    toast.success('Producto eliminado correctamente');
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setNewProduct(product);
    setIsCreating(true);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl mb-2 text-[var(--neon-green)]">Panel de Administración</h1>
          <p className="text-gray-400">Gestiona productos y usuarios de One Tech</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 transition-colors ${
              activeTab === 'dashboard'
                ? 'text-[var(--neon-green)] border-b-2 border-[var(--neon-green)]'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 transition-colors ${
              activeTab === 'products'
                ? 'text-[var(--neon-green)] border-b-2 border-[var(--neon-green)]'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Productos
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 transition-colors ${
              activeTab === 'users'
                ? 'text-[var(--neon-green)] border-b-2 border-[var(--neon-green)]'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Usuarios
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-[#111] border border-[var(--neon-green)] rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <Package className="w-8 h-8 text-[var(--neon-green)]" />
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl text-white mb-1">{productos.length}</div>
                <div className="text-gray-400">Total Productos</div>
              </div>

              <div className="bg-[#111] border border-[var(--neon-purple)] rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <ShoppingCart className="w-8 h-8 text-[var(--neon-purple)]" />
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl text-white mb-1">156</div>
                <div className="text-gray-400">Ventas (Simulado)</div>
              </div>

              <div className="bg-[#111] border border-[var(--neon-blue)] rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-[var(--neon-blue)]" />
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl text-white mb-1">42</div>
                <div className="text-gray-400">Usuarios (Simulado)</div>
              </div>

              <div className="bg-[#111] border border-yellow-500 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <Package className="w-8 h-8 text-yellow-500" />
                  <span className="text-xs text-yellow-500">¡Alerta!</span>
                </div>
                <div className="text-3xl text-white mb-1">
                  {productos.filter((p) => p.stockCritico && p.stock <= p.stockCritico).length}
                </div>
                <div className="text-gray-400">Stock Crítico</div>
              </div>
            </div>

            <div className="bg-[#111] border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl text-[var(--neon-green)] mb-4">Productos con Stock Crítico</h3>
              <div className="space-y-2">
                {productos
                  .filter((p) => p.stockCritico && p.stock <= p.stockCritico)
                  .map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg"
                    >
                      <div>
                        <div className="text-white">{product.nombre}</div>
                        <div className="text-sm text-gray-500">Código: {product.codigo}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-orange-500">Stock: {product.stock}</div>
                        <div className="text-xs text-gray-500">
                          Crítico: {product.stockCritico}
                        </div>
                      </div>
                    </div>
                  ))}
                {productos.filter((p) => p.stockCritico && p.stock <= p.stockCritico).length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No hay productos con stock crítico
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-[var(--neon-green)]">Gestión de Productos</h2>
              <Button
                onClick={() => {
                  setIsCreating(true);
                  setEditingProduct(null);
                  setNewProduct({
                    codigo: '',
                    nombre: '',
                    descripcion: '',
                    precio: 0,
                    stock: 0,
                    stockCritico: 0,
                    categoria: 'Periféricos',
                    imagen: '',
                    featured: false,
                  });
                }}
                className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-purple)] hover:text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nuevo Producto
              </Button>
            </div>

            {isCreating && (
              <div className="bg-[#111] border border-[var(--neon-green)] rounded-lg p-6 mb-6">
                <h3 className="text-xl text-white mb-4">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 mb-2 block">
                      Código <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={newProduct.codigo}
                      onChange={(e) => setNewProduct({ ...newProduct, codigo: e.target.value })}
                      placeholder="KB-RGB-001"
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 mb-2 block">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={newProduct.nombre}
                      onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
                      placeholder="Teclado Mecánico RGB"
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-gray-300 mb-2 block">
                      Descripción <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={newProduct.descripcion}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, descripcion: e.target.value })
                      }
                      placeholder="Descripción del producto..."
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 mb-2 block">
                      Precio <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={newProduct.precio}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, precio: parseFloat(e.target.value) || 0 })
                      }
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 mb-2 block">
                      Stock <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={newProduct.stock}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })
                      }
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 mb-2 block">Stock Crítico</label>
                    <Input
                      type="number"
                      min="0"
                      value={newProduct.stockCritico}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          stockCritico: parseInt(e.target.value) || 0,
                        })
                      }
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 mb-2 block">Categoría</label>
                    <Select
                      value={newProduct.categoria}
                      onValueChange={(value: any) => setNewProduct({ ...newProduct, categoria: value })}
                    >
                      <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Periféricos">Periféricos</SelectItem>
                        <SelectItem value="Audio">Audio</SelectItem>
                        <SelectItem value="Sillas">Sillas</SelectItem>
                        <SelectItem value="Monitores">Monitores</SelectItem>
                        <SelectItem value="Consolas">Consolas</SelectItem>
                        <SelectItem value="Computadores">Computadores</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-gray-300 mb-2 block">URL de Imagen</label>
                    <Input
                      value={newProduct.imagen}
                      onChange={(e) => setNewProduct({ ...newProduct, imagen: e.target.value })}
                      placeholder="https://..."
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={newProduct.featured}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, featured: e.target.checked })
                      }
                      className="w-4 h-4"
                    />
                    <label htmlFor="featured" className="text-gray-300">
                      Producto destacado
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <Button
                    onClick={handleSaveProduct}
                    className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-purple)] hover:text-white"
                  >
                    {editingProduct ? 'Actualizar' : 'Crear'} Producto
                  </Button>
                  <Button
                    onClick={() => {
                      setIsCreating(false);
                      setEditingProduct(null);
                    }}
                    variant="outline"
                    className="border-gray-700 text-gray-300"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            {/* Lista de productos */}
            <div className="space-y-4">
              {productos.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#111] border border-gray-800 rounded-lg p-4 flex items-center gap-4"
                >
                  <div className="w-20 h-20 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
                    {product.imagen ? (
                      <img
                        src={product.imagen}
                        alt={product.nombre}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-gray-600" />
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-white mb-1">{product.nombre}</h3>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span>Código: {product.codigo}</span>
                      <span>Stock: {product.stock}</span>
                      <span>Precio: {formatPrice(product.precio)}</span>
                      <span>{product.categoria}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => startEdit(product)}
                      size="sm"
                      variant="outline"
                      className="border-[var(--neon-green)] text-[var(--neon-green)]"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteProduct(product.id)}
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-[#111] border border-gray-800 rounded-lg p-6">
            <h2 className="text-2xl text-[var(--neon-green)] mb-4">Gestión de Usuarios</h2>
            <p className="text-gray-400 text-center py-8">
              Gestión de usuarios disponible en versión completa con backend
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
