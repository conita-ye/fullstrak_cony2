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
    const response = await this.api.post('/products', producto);
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
}

export const apiService = new ApiService();
