import { useState, useEffect } from 'react';
import { Package, Users, ShoppingCart, TrendingUp, Plus, Edit, Trash2, FileText, Tag, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import type { Product, User, Boleta, Categoria } from '@/types';
import { formatPrice, validateProductCode, validatePrice, validateStock, validateRUN, validateEmail, formatRUN } from '@/utils/validations';
import { toast } from 'sonner';

interface AdminPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export const AdminPage = ({ onNavigate }: AdminPageProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'users' | 'orders' | 'categories'>('dashboard');
  const [productos, setProductos] = useState<Product[]>([]);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [boletas, setBoletas] = useState<Boleta[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBoleta, setSelectedBoleta] = useState<Boleta | null>(null);

  useEffect(() => {
    if (user?.rol === 'admin' || user?.rol === 'ADMINISTRADOR') {
      cargarProductos();
      cargarUsuarios();
      cargarBoletas();
      cargarRoles();
      cargarCategorias(); // Cargar categorías siempre para usarlas en productos
      if (activeTab === 'categories') {
        cargarCategorias();
      }
    }
  }, [user]);
  
  useEffect(() => {
    if (user?.rol === 'admin' || user?.rol === 'ADMINISTRADOR') {
      if (activeTab === 'categories' && categorias.length === 0) {
        cargarCategorias();
      }
    }
  }, [activeTab]);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const productosData = await apiService.getProductos();
      setProductos(productosData.map((p: any) => ({
        id: String(p.id),
        codigo: p.codigo,
        nombre: p.nombre,
        descripcion: p.descripcion,
        precio: p.precio,
        stock: p.stock,
        stockCritico: p.stockCritico,
        categoria: typeof p.categoria === 'object' && p.categoria !== null 
          ? (p.categoria.nombre || p.categoria.codigo || 'Sin categoría')
          : (p.categoria || 'Sin categoría'),
        imagen: p.imagenes && p.imagenes.length > 0 ? p.imagenes[0] : '',
        featured: (p.puntosLevelUp || 0) >= 500
      })));
    } catch (error) {
      console.error('Error al cargar productos:', error);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const usuariosData = await apiService.getUsuarios();
      // Filtrar usuarios inactivos y el usuario "matias gutierres" con RUN 333333
      const usuariosFiltrados = usuariosData
        .filter((u: any) => {
          // Filtrar usuarios inactivos
          if (u.activo === false) return false;
          // Filtrar específicamente a "matias gutierres" con RUN 333333
          const runLimpio = (u.run || '').replace(/\./g, '').replace(/-/g, '').toUpperCase();
          if (runLimpio === '333333' || runLimpio.startsWith('333333')) {
            return false;
          }
          // Filtrar por nombre si contiene "matias" y "gutierres" (variaciones)
          const nombreCompleto = `${u.nombre || ''} ${u.apellidos || ''}`.toLowerCase();
          if (nombreCompleto.includes('matias') && (nombreCompleto.includes('gutierres') || nombreCompleto.includes('guitierres'))) {
            return false;
          }
          return true;
        })
        .map((u: any) => ({
        id: String(u.id),
        run: u.run || '',
        nombre: u.nombre || '',
        apellidos: u.apellidos || '',
        email: u.correo || u.email || '',
        password: '',
        fechaNacimiento: u.fechaNacimiento || '',
        direccion: u.direccion || '',
        region: u.region || '',
        comuna: u.comuna || '',
        rol: (u.rol || 'CLIENTE').toLowerCase() as any,
        puntosLevelUp: u.puntosAcumulados || 0,
      }));
      setUsuarios(usuariosFiltrados);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const cargarRoles = async () => {
    try {
      const rolesData = await apiService.getRoles();
      setRoles(rolesData.map((r: any) => r.toString()));
    } catch (error) {
      console.error('Error al cargar roles:', error);
    }
  };

  const cargarBoletas = async () => {
    try {
      setLoading(true);
      const boletasData = await apiService.getBoletas();
      setBoletas(boletasData.map((b: any) => ({
        id: b.id,
        numeroBoleta: b.numeroBoleta || String(b.id),
        fechaCreacion: b.fechaCreacion || '',
        fechaActualizacion: b.fechaActualizacion || '',
        total: b.total || 0,
        estado: b.estado || 'PENDIENTE',
        usuarioId: b.usuarioId || 0,
        usuarioNombre: b.usuarioNombre || 'N/A',
        detalle: b.detalle || [],
      })));
    } catch (error) {
      console.error('Error al cargar boletas:', error);
      toast.error('Error al cargar boletas');
    } finally {
      setLoading(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      setLoading(true);
      const categoriasData = await apiService.getCategorias(true);
      setCategorias(categoriasData.map((c: any) => ({
        id: c.id,
        codigo: c.codigo || '',
        nombre: c.nombre || '',
        descripcion: c.descripcion || '',
        activa: c.activa !== undefined ? c.activa : true,
      })));
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      toast.error('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };
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
  const [newUser, setNewUser] = useState<Partial<User>>({
    run: '',
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    fechaNacimiento: '',
    direccion: '',
    region: '',
    comuna: '',
    rol: 'CLIENTE',
  });
  const [newCategory, setNewCategory] = useState<Partial<Categoria>>({
    codigo: '',
    nombre: '',
    descripcion: '',
    activa: true,
  });
  const [editingCategory, setEditingCategory] = useState<Categoria | null>(null);
  const [regiones, setRegiones] = useState<Array<{ nombre: string; comunas: string[] }>>([]);
  const [comunas, setComunas] = useState<string[]>([]);

  // Cargar regiones al montar el componente
  useEffect(() => {
    const cargarRegiones = async () => {
      try {
        const regionesData = await apiService.getRegiones();
        setRegiones(regionesData);
      } catch (error) {
        console.error('Error al cargar regiones:', error);
        setRegiones([]);
      }
    };
    cargarRegiones();
  }, []);

  if (user?.rol !== 'admin' && user?.rol !== 'ADMINISTRADOR') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
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

  const handleSaveProduct = async () => {
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

    // Buscar el ID de la categoría por nombre (tanto para crear como para actualizar)
    const categoriaSeleccionada = categorias.find(c => c.nombre === newProduct.categoria);
    if (!categoriaSeleccionada) {
      toast.error('Categoría no encontrada. Por favor selecciona una categoría válida.');
      return;
    }

    try {
      if (editingProduct) {
        // Editar producto existente - el backend espera JSON con @RequestBody
        await apiService.updateProducto(Number(editingProduct.id), {
          codigo: newProduct.codigo,
          nombre: newProduct.nombre,
          descripcion: newProduct.descripcion || '',
          precio: Number(newProduct.precio),
          stock: Number(newProduct.stock),
          stockCritico: newProduct.stockCritico || null,
          categoriaId: categoriaSeleccionada.id,
          puntosLevelUp: editingProduct.puntosLevelUp || 0,
        });
        toast.success('Producto actualizado correctamente');
      } else {
        // Crear nuevo producto - el backend espera multipart/form-data con @RequestPart("producto")
        await apiService.createProducto({
          codigo: newProduct.codigo!,
          nombre: newProduct.nombre!,
          descripcion: newProduct.descripcion || '',
          precio: Number(newProduct.precio),
          stock: Number(newProduct.stock),
          stockCritico: newProduct.stockCritico || null,
          categoriaId: categoriaSeleccionada.id,
          puntosLevelUp: 0,
        });
        toast.success('Producto creado correctamente');
      }

      await cargarProductos();
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
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al guardar el producto';
      toast.error(errorMessage);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) {
      return;
    }
    try {
      await apiService.deleteProducto(Number(id));
      toast.success('Producto eliminado correctamente');
      await cargarProductos();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al eliminar el producto';
      toast.error(errorMessage);
    }
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    // Asegurar que la categoría se establezca correctamente
    const categoriaNombre = typeof product.categoria === 'string' 
      ? product.categoria 
      : (product.categoria as any)?.nombre || 'Periféricos';
    setNewProduct({
      ...product,
      categoria: categoriaNombre,
    });
    setIsCreating(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-gray-400">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl mb-2 text-[var(--neon-green)]">Panel de Administración</h1>
          <p className="text-gray-400">Gestiona productos y usuarios de Level-Up Gamer</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 transition-colors whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'text-[var(--neon-green)] border-b-2 border-[var(--neon-green)]'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 transition-colors whitespace-nowrap ${
              activeTab === 'products'
                ? 'text-[var(--neon-green)] border-b-2 border-[var(--neon-green)]'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Productos
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 transition-colors whitespace-nowrap ${
              activeTab === 'users'
                ? 'text-[var(--neon-green)] border-b-2 border-[var(--neon-green)]'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Usuarios
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 transition-colors whitespace-nowrap ${
              activeTab === 'orders'
                ? 'text-[var(--neon-green)] border-b-2 border-[var(--neon-green)]'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Órdenes
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 transition-colors whitespace-nowrap ${
              activeTab === 'categories'
                ? 'text-[var(--neon-green)] border-b-2 border-[var(--neon-green)]'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Categorías
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
                <div className="text-3xl text-white mb-1">{boletas.length}</div>
                <div className="text-gray-400">Total Órdenes</div>
              </div>

              <div className="bg-[#111] border border-[var(--neon-blue)] rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-[var(--neon-blue)]" />
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl text-white mb-1">{usuarios.length}</div>
                <div className="text-gray-400">Total Usuarios</div>
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
                      maxLength={20}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^a-zA-Z0-9-_]/g, '');
                        setNewProduct({ ...newProduct, codigo: value });
                      }}
                      placeholder="KB-RGB-001"
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">Solo letras, números, guiones y guiones bajos (máx. 20 caracteres)</p>
                  </div>

                  <div>
                    <label className="text-gray-300 mb-2 block">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={newProduct.nombre}
                      maxLength={100}
                      onChange={(e) => {
                        if (e.target.value.length <= 100) {
                          setNewProduct({ ...newProduct, nombre: e.target.value });
                        }
                      }}
                      placeholder="Teclado Mecánico RGB"
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">Máximo 100 caracteres</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-gray-300 mb-2 block">
                      Descripción <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={newProduct.descripcion}
                      maxLength={500}
                      onChange={(e) => {
                        if (e.target.value.length <= 500) {
                          setNewProduct({ ...newProduct, descripcion: e.target.value });
                        }
                      }}
                      placeholder="Descripción del producto..."
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {newProduct.descripcion?.length || 0}/500 caracteres
                    </p>
                  </div>

                  <div>
                    <label className="text-gray-300 mb-2 block">
                      Precio <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="9999999"
                      step="0.01"
                      value={newProduct.precio === 0 ? '' : newProduct.precio}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                        if (value >= 0 && value <= 9999999) {
                          setNewProduct({ ...newProduct, precio: value });
                        }
                      }}
                      onFocus={(e) => {
                        if (e.target.value === '0') {
                          e.target.value = '';
                        }
                      }}
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">Mínimo $0, máximo $9,999,999</p>
                  </div>

                  <div>
                    <label className="text-gray-300 mb-2 block">
                      Stock <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      min="0"
                      max="99999"
                      value={newProduct.stock === 0 ? '' : newProduct.stock}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                        if (value >= 0 && value <= 99999 && Number.isInteger(value)) {
                          setNewProduct({ ...newProduct, stock: value });
                        }
                      }}
                      onFocus={(e) => {
                        if (e.target.value === '0') {
                          e.target.value = '';
                        }
                      }}
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">Número entero, mínimo 0, máximo 99,999</p>
                  </div>

                  <div>
                    <label className="text-gray-300 mb-2 block">Stock Crítico</label>
                    <Input
                      type="number"
                      min="0"
                      max="99999"
                      value={newProduct.stockCritico === 0 ? '' : newProduct.stockCritico}
                      onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                        if (value >= 0 && value <= 99999 && Number.isInteger(value)) {
                          setNewProduct({
                            ...newProduct,
                            stockCritico: value,
                          });
                        }
                      }}
                      onFocus={(e) => {
                        if (e.target.value === '0') {
                          e.target.value = '';
                        }
                      }}
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">Número entero, mínimo 0, máximo 99,999</p>
                  </div>

                  <div>
                    <label className="text-gray-300 mb-2 block">Categoría <span className="text-red-500">*</span></label>
                    <Select
                      value={newProduct.categoria}
                      onValueChange={(value: any) => setNewProduct({ ...newProduct, categoria: value })}
                    >
                      <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.length > 0 ? (
                          categorias.map((cat) => (
                            <SelectItem key={cat.id} value={cat.nombre}>
                              {cat.nombre}
                            </SelectItem>
                          ))
                        ) : (
                          <>
                            <SelectItem value="Periféricos">Periféricos</SelectItem>
                            <SelectItem value="Audio">Audio</SelectItem>
                            <SelectItem value="Sillas">Sillas</SelectItem>
                            <SelectItem value="Monitores">Monitores</SelectItem>
                            <SelectItem value="Consolas">Consolas</SelectItem>
                            <SelectItem value="Computadores">Computadores</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-gray-300 mb-2 block">URL de Imagen</label>
                    <Input
                      type="url"
                      value={newProduct.imagen}
                      maxLength={500}
                      onChange={(e) => {
                        if (e.target.value.length <= 500) {
                          setNewProduct({ ...newProduct, imagen: e.target.value });
                        }
                      }}
                      placeholder="https://..."
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">Máximo 500 caracteres</p>
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
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-[var(--neon-green)]">Gestión de Usuarios</h2>
              <Button
                onClick={() => {
                  setIsCreating(true);
                  setEditingProduct(null);
                  setNewUser({
                    run: '',
                    nombre: '',
                    apellidos: '',
                    email: '',
                    password: '',
                    fechaNacimiento: '',
                    direccion: '',
                    region: '',
                    comuna: '',
                    rol: 'CLIENTE',
                  });
                }}
                className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-purple)] hover:text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nuevo Usuario Admin
              </Button>
            </div>

            {isCreating && editingProduct === null && (
              <div className="bg-[#111] border border-[var(--neon-green)] rounded-lg p-6 mb-6">
                <h3 className="text-xl text-white mb-4">Nuevo Usuario Administrador</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 mb-2 block">RUN <span className="text-red-500">*</span></label>
                    <Input
                      value={newUser.run}
                      maxLength={12}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/[^0-9kK]/g, '').toUpperCase();
                        // Limitar estrictamente a 9 caracteres (máximo para RUT: 8 dígitos + 1 dígito verificador, ej: 12345678-5)
                        const limitedCleaned = cleaned.slice(0, 9);
                        const formatted = formatRUN(limitedCleaned);
                        setNewUser({ ...newUser, run: formatted });
                      }}
                      placeholder="12345678-K"
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">Solo números y dígito verificador</p>
                  </div>
                  <div>
                    <label className="text-gray-300 mb-2 block">Correo <span className="text-red-500">*</span></label>
                    <Input
                      type="email"
                      value={newUser.email}
                      maxLength={100}
                      onChange={(e) => {
                        if (e.target.value.length <= 100) {
                          setNewUser({ ...newUser, email: e.target.value });
                        }
                      }}
                      placeholder="usuario@duoc.cl"
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">Máximo 100 caracteres</p>
                  </div>
                  <div>
                    <label className="text-gray-300 mb-2 block">Nombre <span className="text-red-500">*</span></label>
                    <Input
                      value={newUser.nombre}
                      maxLength={50}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
                        if (value.length <= 50) {
                          setNewUser({ ...newUser, nombre: value });
                        }
                      }}
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">Solo letras (máx. 50 caracteres)</p>
                  </div>
                  <div>
                    <label className="text-gray-300 mb-2 block">Apellidos <span className="text-red-500">*</span></label>
                    <Input
                      value={newUser.apellidos}
                      maxLength={50}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
                        if (value.length <= 50) {
                          setNewUser({ ...newUser, apellidos: value });
                        }
                      }}
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">Solo letras (máx. 50 caracteres)</p>
                  </div>
                  <div>
                    <label className="text-gray-300 mb-2 block">Contraseña <span className="text-red-500">*</span></label>
                    <Input
                      type="password"
                      value={newUser.password}
                      maxLength={32}
                      onChange={(e) => {
                        if (e.target.value.length <= 32) {
                          setNewUser({ ...newUser, password: e.target.value });
                        }
                      }}
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres, máximo 32</p>
                  </div>
                  <div>
                    <label className="text-gray-300 mb-2 block">Rol</label>
                    <Select
                      value={newUser.rol}
                      onValueChange={(value: any) => setNewUser({ ...newUser, rol: value })}
                    >
                      <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((rol) => (
                          <SelectItem key={rol} value={rol}>
                            {rol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-gray-300 mb-2 block">Fecha de Nacimiento <span className="text-red-500">*</span></label>
                    <Input
                      type="date"
                      value={newUser.fechaNacimiento || ''}
                      max={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setNewUser({ ...newUser, fechaNacimiento: e.target.value })}
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">Debe ser mayor de 18 años</p>
                  </div>
                  <div>
                    <label className="text-gray-300 mb-2 block">Región <span className="text-red-500">*</span></label>
                    <Select
                      value={newUser.region || ''}
                      onValueChange={(value: string) => {
                        setNewUser({ ...newUser, region: value, comuna: '' });
                        const regionSeleccionada = regiones.find((r) => r.nombre === value);
                        if (regionSeleccionada && regionSeleccionada.comunas) {
                          setComunas(regionSeleccionada.comunas);
                        } else {
                          setComunas([]);
                        }
                      }}
                    >
                      <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
                        <SelectValue placeholder="Selecciona una región" />
                      </SelectTrigger>
                      <SelectContent>
                        {regiones.map((region) => (
                          <SelectItem key={region.nombre} value={region.nombre}>
                            {region.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-gray-300 mb-2 block">Comuna <span className="text-red-500">*</span></label>
                    <Select
                      value={newUser.comuna || ''}
                      onValueChange={(value: string) => setNewUser({ ...newUser, comuna: value })}
                      disabled={!newUser.region || comunas.length === 0}
                    >
                      <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
                        <SelectValue placeholder="Selecciona una comuna" />
                      </SelectTrigger>
                      <SelectContent>
                        {comunas.map((comuna) => (
                          <SelectItem key={comuna} value={comuna}>
                            {comuna}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-gray-300 mb-2 block">Dirección <span className="text-red-500">*</span></label>
                    <Input
                      value={newUser.direccion || ''}
                      maxLength={300}
                      onChange={(e) => {
                        if (e.target.value.length <= 300) {
                          setNewUser({ ...newUser, direccion: e.target.value });
                        }
                      }}
                      placeholder="Calle y número"
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">Máximo 300 caracteres</p>
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <Button
                    onClick={async () => {
                      // Limpiar RUN antes de validar
                      const runLimpio = newUser.run?.replace(/\./g, '').replace(/-/g, '').replace(/\s/g, '').toUpperCase() || '';
                      if (!runLimpio || runLimpio.length < 7) {
                        toast.error('El RUN es obligatorio y debe tener al menos 7 caracteres');
                        return;
                      }
                      if (runLimpio.length > 9) {
                        toast.error('El RUN no puede tener más de 9 caracteres (sin puntos ni guión)');
                        return;
                      }
                      if (!/^[0-9]+[0-9K]$/.test(runLimpio)) {
                        toast.error('El RUN debe contener solo números y un dígito verificador (0-9 o K)');
                        return;
                      }
                      // No validar el dígito verificador aquí, dejar que el backend lo valide
                      // if (!validateRUN(runLimpio)) {
                      //   toast.error('RUN inválido. Verifica el dígito verificador (ej: 12345678-K)');
                      //   return;
                      // }
                      if (!validateEmail(newUser.email)) {
                        toast.error('Correo inválido o dominio no permitido');
                        return;
                      }
                      if (!newUser.password || newUser.password.length < 8) {
                        toast.error('La contraseña debe tener al menos 8 caracteres');
                        return;
                      }
                      if (!newUser.fechaNacimiento) {
                        toast.error('La fecha de nacimiento es obligatoria');
                        return;
                      }
                      if (!newUser.region) {
                        toast.error('La región es obligatoria');
                        return;
                      }
                      if (!newUser.comuna) {
                        toast.error('La comuna es obligatoria');
                        return;
                      }
                      if (!newUser.direccion || newUser.direccion.trim().length < 5) {
                        toast.error('La dirección es obligatoria y debe tener al menos 5 caracteres');
                        return;
                      }
                      try {
                        await apiService.crearUsuarioAdmin({
                          run: newUser.run?.replace(/\./g, '').replace(/-/g, '') || '',
                          correo: newUser.email || '',
                          nombre: newUser.nombre || '',
                          apellidos: newUser.apellidos || '',
                          contrasena: newUser.password || '',
                          fechaNacimiento: newUser.fechaNacimiento || '',
                          region: newUser.region || '',
                          comuna: newUser.comuna || '',
                          direccion: newUser.direccion || '',
                        });
                        toast.success('Usuario creado correctamente');
                        await cargarUsuarios();
                        setIsCreating(false);
                        setNewUser({
                          run: '',
                          nombre: '',
                          apellidos: '',
                          email: '',
                          password: '',
                          fechaNacimiento: '',
                          direccion: '',
                          region: '',
                          comuna: '',
                          rol: 'CLIENTE',
                        });
                      } catch (error: any) {
                        toast.error(error.response?.data?.error || 'Error al crear usuario');
                      }
                    }}
                    className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-purple)] hover:text-white"
                  >
                    Crear Usuario
                  </Button>
                  <Button
                    onClick={() => {
                      setIsCreating(false);
                      setNewUser({
                        run: '',
                        nombre: '',
                        apellidos: '',
                        email: '',
                        password: '',
                        fechaNacimiento: '',
                        direccion: '',
                        region: '',
                        comuna: '',
                        rol: 'CLIENTE',
                      });
                    }}
                    variant="outline"
                    className="border-gray-700 text-gray-300"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {usuarios.map((usuario) => (
                <div
                  key={usuario.id}
                  className="bg-[#111] border border-gray-800 rounded-lg p-4 flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white mb-1">{usuario.nombre} {usuario.apellidos}</h3>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span>RUN: {formatRUN(usuario.run)}</span>
                      <span>Email: {usuario.email}</span>
                      <span>Rol: {usuario.rol?.toUpperCase()}</span>
                      <span>Puntos: {usuario.puntosLevelUp || 0}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={async () => {
                        if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
                        try {
                          const response = await apiService.eliminarUsuario(Number(usuario.id));
                          // El backend devuelve 204 No Content, así que cualquier respuesta es éxito
                          toast.success('Usuario eliminado correctamente');
                          await cargarUsuarios();
                        } catch (error: any) {
                          // Si es 204, es éxito aunque axios lo trate como error
                          if (error.response?.status === 204 || error.response?.status === 200) {
                            toast.success('Usuario eliminado correctamente');
                            await cargarUsuarios();
                          } else {
                            const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Error al eliminar usuario';
                            toast.error(errorMessage);
                          }
                        }
                      }}
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

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-[var(--neon-green)]">Gestión de Órdenes</h2>
            </div>

            <div className="bg-[#111] border border-[var(--neon-green)] rounded-lg p-12 text-center">
              <h3 className="text-2xl text-[var(--neon-green)] mb-4">Próximamente</h3>
              <p className="text-gray-400">La gestión de órdenes estará disponible próximamente</p>
            </div>

            {false && selectedBoleta ? (
              <div className="bg-[#111] border border-gray-800 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl text-white">Detalle de Orden #{selectedBoleta.numeroBoleta}</h3>
                  <Button
                    onClick={() => setSelectedBoleta(null)}
                    variant="outline"
                    className="border-gray-700 text-gray-300"
                  >
                    Volver
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400">Estado</p>
                      <Select
                        value={selectedBoleta.estado}
                        onValueChange={async (value) => {
                          try {
                            await apiService.actualizarEstadoBoleta(selectedBoleta.id, value);
                            toast.success('Estado actualizado');
                            setSelectedBoleta({ ...selectedBoleta, estado: value });
                            await cargarBoletas();
                          } catch (error: any) {
                            toast.error(error.response?.data?.error || 'Error al actualizar estado');
                          }
                        }}
                      >
                        <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDIENTE">PENDIENTE</SelectItem>
                          <SelectItem value="PAGADO">PAGADO</SelectItem>
                          <SelectItem value="ENVIADO">ENVIADO</SelectItem>
                          <SelectItem value="CANCELADO">CANCELADO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <p className="text-gray-400">Total</p>
                      <p className="text-white text-xl">{formatPrice(selectedBoleta.total)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-2">Productos</p>
                    <div className="space-y-2">
                      {selectedBoleta.detalle?.map((item, idx) => (
                        <div key={idx} className="bg-[#1a1a1a] p-3 rounded flex justify-between">
                          <span className="text-white">{item.productoNombre || `Producto ${item.productoId}`}</span>
                          <span className="text-gray-400">
                            {item.cantidad} x {formatPrice(item.precioUnitario)} = {formatPrice(item.subtotal)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {boletas.map((boleta) => (
                  <div
                    key={boleta.id}
                    className="bg-[#111] border border-gray-800 rounded-lg p-4 flex items-center gap-4"
                  >
                    <FileText className="w-8 h-8 text-[var(--neon-blue)]" />
                    <div className="flex-1">
                      <h3 className="text-white mb-1">Orden #{boleta.numeroBoleta}</h3>
                      <div className="flex gap-4 text-sm text-gray-400">
                        <span>Usuario: {boleta.usuarioNombre}</span>
                        <span>Total: {formatPrice(boleta.total)}</span>
                        <span className={`${
                          boleta.estado === 'PAGADO' ? 'text-green-500' :
                          boleta.estado === 'CANCELADO' ? 'text-red-500' :
                          boleta.estado === 'ENVIADO' ? 'text-blue-500' :
                          'text-yellow-500'
                        }`}>
                          {boleta.estado}
                        </span>
                        <span>{new Date(boleta.fechaCreacion).toLocaleDateString('es-CL')}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={async () => {
                          try {
                            const detalle = await apiService.getBoleta(boleta.id);
                            setSelectedBoleta({ ...boleta, detalle: detalle.detalle || [] });
                          } catch (error: any) {
                            toast.error('Error al cargar detalle');
                          }
                        }}
                        size="sm"
                        variant="outline"
                        className="border-[var(--neon-green)] text-[var(--neon-green)]"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalle
                      </Button>
                      {boleta.estado !== 'CANCELADO' && (
                        <Button
                          onClick={async () => {
                            if (!confirm('¿Estás seguro de cancelar esta orden?')) return;
                            try {
                              await apiService.cancelarBoleta(boleta.id);
                              toast.success('Orden cancelada');
                              await cargarBoletas();
                            } catch (error: any) {
                              toast.error(error.response?.data?.error || 'Error al cancelar orden');
                            }
                          }}
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl text-[var(--neon-green)]">Gestión de Categorías</h2>
              <Button
                onClick={() => {
                  setIsCreating(true);
                  setEditingProduct(null);
                  setNewCategory({
                    codigo: '',
                    nombre: '',
                    descripcion: '',
                    activa: true,
                  });
                }}
                className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-purple)] hover:text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nueva Categoría
              </Button>
            </div>

            {isCreating && editingProduct === null && (
              <div className="bg-[#111] border border-[var(--neon-green)] rounded-lg p-6 mb-6">
                <h3 className="text-xl text-white mb-4">
                  {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 mb-2 block">Código <span className="text-red-500">*</span></label>
                    <Input
                      value={newCategory.codigo}
                      maxLength={20}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^a-zA-Z0-9-_]/g, '');
                        setNewCategory({ ...newCategory, codigo: value });
                      }}
                      placeholder="CAT-001"
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">Solo letras, números, guiones y guiones bajos (máx. 20 caracteres)</p>
                  </div>
                  <div>
                    <label className="text-gray-300 mb-2 block">Nombre <span className="text-red-500">*</span></label>
                    <Input
                      value={newCategory.nombre}
                      maxLength={100}
                      onChange={(e) => {
                        if (e.target.value.length <= 100) {
                          setNewCategory({ ...newCategory, nombre: e.target.value });
                        }
                      }}
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">Máximo 100 caracteres</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-gray-300 mb-2 block">Descripción</label>
                    <Textarea
                      value={newCategory.descripcion}
                      maxLength={300}
                      onChange={(e) => {
                        if (e.target.value.length <= 300) {
                          setNewCategory({ ...newCategory, descripcion: e.target.value });
                        }
                      }}
                      className="bg-[#1a1a1a] border-gray-700 text-white"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {newCategory.descripcion?.length || 0}/300 caracteres
                    </p>
                  </div>
                  <div className="md:col-span-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="categoriaActiva"
                      checked={newCategory.activa}
                      onChange={(e) => setNewCategory({ ...newCategory, activa: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="categoriaActiva" className="text-gray-300">
                      Categoría activa
                    </label>
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <Button
                    onClick={async () => {
                      if (!newCategory.codigo || !newCategory.nombre) {
                        toast.error('Completa todos los campos obligatorios');
                        return;
                      }
                      try {
                        if (editingCategory) {
                          await apiService.updateCategoria(editingCategory.id, newCategory);
                          toast.success('Categoría actualizada');
                        } else {
                          await apiService.createCategoria(newCategory);
                          toast.success('Categoría creada');
                        }
                        await cargarCategorias();
                        setIsCreating(false);
                        setEditingCategory(null);
                        setNewCategory({ codigo: '', nombre: '', descripcion: '', activa: true });
                      } catch (error: any) {
                        toast.error(error.response?.data?.error || 'Error al guardar categoría');
                      }
                    }}
                    className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-purple)] hover:text-white"
                  >
                    {editingCategory ? 'Actualizar' : 'Crear'} Categoría
                  </Button>
                  <Button
                    onClick={() => {
                      setIsCreating(false);
                      setEditingCategory(null);
                      setNewCategory({ codigo: '', nombre: '', descripcion: '', activa: true });
                    }}
                    variant="outline"
                    className="border-gray-700 text-gray-300"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {categorias.map((categoria) => (
                <div
                  key={categoria.id}
                  className="bg-[#111] border border-gray-800 rounded-lg p-4 flex items-center gap-4"
                >
                  <Tag className="w-8 h-8 text-[var(--neon-purple)]" />
                  <div className="flex-1">
                    <h3 className="text-white mb-1">{categoria.nombre}</h3>
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span>Código: {categoria.codigo}</span>
                      <span className={categoria.activa ? 'text-green-500' : 'text-red-500'}>
                        {categoria.activa ? 'Activa' : 'Inactiva'}
                      </span>
                      {categoria.descripcion && <span>{categoria.descripcion}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setEditingCategory(categoria);
                        setNewCategory({
                          codigo: categoria.codigo,
                          nombre: categoria.nombre,
                          descripcion: categoria.descripcion || '',
                          activa: categoria.activa,
                        });
                        setIsCreating(true);
                      }}
                      size="sm"
                      variant="outline"
                      className="border-[var(--neon-green)] text-[var(--neon-green)]"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={async () => {
                        if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
                        try {
                          await apiService.deleteCategoria(categoria.id);
                          toast.success('Categoría eliminada');
                          await cargarCategorias();
                        } catch (error: any) {
                          toast.error(error.response?.data?.error || 'Error al eliminar categoría');
                        }
                      }}
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
      </div>
    </div>
  );
};
