# Level-Up Gamer Frontend

## Ejecutar Localmente

### 1. Instalar dependencias
```bash
cd frontend/fullstrak_cony2
npm install
```

### 2. Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación se abrirá en: http://localhost:5173

### 3. Configuración

El frontend está configurado para conectarse al backend en:
- **Desarrollo**: http://localhost:8081/api/v1
- **Producción**: Configurar variable `VITE_API_BASE_URL` en `.env`

## Características

- ✅ Autenticación JWT con persistencia de sesión
- ✅ Carrito de compras sincronizado con backend
- ✅ Gestión de productos, categorías y reseñas
- ✅ Sistema de puntos y gamificación
- ✅ Blog y contenido dinámico

## Usuarios de Prueba

Ver `backend/LevelUpGamer-backend/README_LOCAL.md` para credenciales de prueba.
