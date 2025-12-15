import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/v1';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        // Si se está enviando FormData, eliminar Content-Type para que axios lo establezca automáticamente
        if (config.data instanceof FormData) {
          // Eliminar Content-Type para que axios establezca multipart/form-data con boundary
          delete (config.headers as any)['Content-Type'];
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                refreshToken,
              });
              const { accessToken } = response.data;
              localStorage.setItem('accessToken', accessToken);
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            // Disparar evento personalizado para navegación
            window.dispatchEvent(new CustomEvent('navigate', { detail: { page: 'login' } }));
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async login(correo: string, contrasena: string, rol?: string) {
    const response = await this.api.post('/auth/login', {
      correo,
      contrasena,
      rol,
    });
    return response.data;
  }

  async register(userData: any) {
    const response = await this.api.post('/users/register', userData);
    return response.data;
  }

  async refreshToken(refreshToken: string) {
    const response = await this.api.post('/auth/refresh', { refreshToken });
    return response.data;
  }

  async getUsuario(id: number) {
    const response = await this.api.get(`/users/${id}`);
    return response.data;
  }

  async updateUsuario(id: number, userData: any) {
    const response = await this.api.put(`/users/${id}`, userData);
    return response.data;
  }

  async getProductos(params?: any) {
    const response = await this.api.get('/products', { params });
    return response.data;
  }

  async getProducto(id: string) {
    const response = await this.api.get(`/products/${id}`);
    return response.data;
  }

  async getProductosDestacados() {
    const response = await this.api.get('/products/featured');
    return response.data;
  }

  async getCarrito(userId: number) {
    const response = await this.api.get(`/cart/${userId}`);
    return response.data;
  }

  async addToCart(userId: number, productId: number, quantity: number) {
    const response = await this.api.post(`/cart/${userId}/add`, null, {
      params: { productId, quantity },
    });
    return response.data;
  }

  async removeFromCart(userId: number, productId: number) {
    const response = await this.api.delete(`/cart/${userId}/remove`, {
      params: { productId },
    });
    return response.data;
  }

  async clearCart(userId: number) {
    const response = await this.api.delete(`/cart/${userId}`);
    return response.data;
  }

  async getResenas(productId: string) {
    const response = await this.api.get(`/products/${productId}/reviews`);
    return response.data;
  }

  async crearResena(resena: any) {
    const response = await this.api.post('/reviews', resena);
    return response.data;
  }

  async getBlogPosts() {
    const response = await this.api.get('/blog-posts');
    return response.data;
  }

  async getBlogPost(id: string) {
    const response = await this.api.get(`/blog-posts/${id}`);
    return response.data;
  }

  async enviarContacto(contacto: any) {
    const response = await this.api.post('/contact-messages', contacto);
    return response.data;
  }

  async getPuntos(userId: number) {
    const response = await this.api.get(`/points/${userId}`);
    return response.data;
  }

  async createProducto(producto: any) {
    // El backend espera multipart/form-data con @RequestPart("producto")
    const formData = new FormData();
    const productoJson = JSON.stringify(producto);
    const productoBlob = new Blob([productoJson], { type: 'application/json' });
    formData.append('producto', productoBlob);
    
    // El interceptor eliminará automáticamente Content-Type cuando detecte FormData
    const response = await this.api.post('/products', formData);
    return response.data;
  }

  async updateProducto(id: number, producto: any) {
    const response = await this.api.put(`/products/${id}`, producto);
    return response.data;
  }

  async deleteProducto(id: number) {
    const response = await this.api.delete(`/products/${id}`);
    return response.data;
  }

  async getRegiones() {
    const response = await this.api.get('/regions');
    return response.data;
  }

  async crearBoleta(boletaData: any) {
    const response = await this.api.post('/boletas', boletaData);
    return response.data;
  }

  async getNivelUsuario(userId: number) {
    const response = await this.api.get(`/points/${userId}/level`);
    return response.data;
  }

  async getItemsCanjeables() {
    const response = await this.api.get('/points/redeemable-items');
    return response.data;
  }

  async canjearItem(usuarioId: number, itemId: number, tipoItem: string, puntosRequeridos: number, valor?: number) {
    const response = await this.api.post('/points/redeem-item', {
      usuarioId,
      itemId,
      tipoItem,
      puntosRequeridos,
      valor,
    });
    return response.data;
  }

  // Métodos para usuarios (admin)
  async getUsuarios() {
    const response = await this.api.get('/users');
    return response.data;
  }

  async getRoles() {
    const response = await this.api.get('/users/roles');
    return response.data;
  }

  async crearUsuarioAdmin(userData: any) {
    const response = await this.api.post('/users/admin', userData);
    return response.data;
  }

  async eliminarUsuario(id: number) {
    // El backend devuelve 204 No Content, así que validamos el status
    const response = await this.api.delete(`/users/${id}`, {
      validateStatus: (status) => status === 204 || status === 200,
    });
    return response;
  }

  // Métodos para boletas/órdenes
  async getBoletas() {
    const response = await this.api.get('/boletas');
    return response.data;
  }

  async getBoletasPorUsuario(userId: number) {
    const response = await this.api.get(`/boletas/user/${userId}`);
    return response.data;
  }

  async getBoleta(id: number) {
    const response = await this.api.get(`/boletas/${id}`);
    return response.data;
  }

  async actualizarEstadoBoleta(id: number, estado: string) {
    const response = await this.api.put(`/boletas/${id}/estado`, { estado });
    return response.data;
  }

  async cancelarBoleta(id: number) {
    const response = await this.api.delete(`/boletas/${id}`);
    return response.data;
  }

  // Métodos para categorías
  async getCategorias(includeInactive: boolean = false) {
    const response = await this.api.get('/categories', {
      params: { includeInactive },
    });
    return response.data;
  }

  async getCategoria(id: number) {
    const response = await this.api.get(`/categories/${id}`);
    return response.data;
  }

  async createCategoria(categoria: any) {
    const response = await this.api.post('/categories', categoria);
    return response.data;
  }

  async updateCategoria(id: number, categoria: any) {
    const response = await this.api.put(`/categories/${id}`, categoria);
    return response.data;
  }

  async deleteCategoria(id: number) {
    const response = await this.api.delete(`/categories/${id}`);
    return response.data;
  }
}

export const apiService = new ApiService();
