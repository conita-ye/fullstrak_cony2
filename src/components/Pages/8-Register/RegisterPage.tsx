import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { UserPlus, Mail, Lock, User, Calendar, MapPin, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { validateRUN, validateEmail, validateAge, formatRUN } from '@/utils/validations';
import { toast } from 'sonner';

type UserRole = 'admin' | 'cliente' | 'vendedor';


interface UserData {
  run: string;
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  confirmPassword: string; 
  fechaNacimiento: string;
  direccion: string;
  region: string;
  comuna: string;
  rol: UserRole;
}

type RegisterPayload = Omit<UserData, 'confirmPassword'>;


interface RegisterPageProps {
  onNavigate: (page: 'login' | 'home', data?: any) => void;
}

// --- Componente Principal ---

export const RegisterPage = ({ onNavigate }: RegisterPageProps) => {
  const { register } = useAuth();

  // Estado principal con valores iniciales limpios
  const [formData, setFormData] = useState<UserData>({
    run: '',
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    confirmPassword: '', // Inicializado
    fechaNacimiento: '',
    direccion: '',
    region: '',
    comuna: '',
    rol: 'cliente',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [regiones, setRegiones] = useState<Array<{ nombre: string; comunas: string[] }>>([]);
  const [loadingRegiones, setLoadingRegiones] = useState(true);

  // Cargar regiones desde el backend
  useEffect(() => {
    const cargarRegiones = async () => {
      try {
        const regionesData = await apiService.getRegiones();
        setRegiones(regionesData);
      } catch (error) {
        console.error('Error al cargar regiones:', error);
        // No mostrar error si el endpoint no existe, usar datos por defecto
        setRegiones([
          { nombre: 'Región Metropolitana', comunas: ['Santiago', 'Providencia', 'Las Condes', 'Ñuñoa'] },
          { nombre: 'Valparaíso', comunas: ['Valparaíso', 'Viña del Mar', 'Quilpué'] },
        ]);
      } finally {
        setLoadingRegiones(false);
      }
    };
    cargarRegiones();
  }, []);

  // Manejador de cambios genérico
  const handleChange = useCallback((
    key: keyof UserData, 
    value: string | UserRole
  ) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // Opcional: limpiar el error del campo al cambiar su valor
    if (errors[key]) {
      setErrors(prev => {
        const { [key]: _, ...rest } = prev;
        return rest;
      });
    }
  }, [errors]);

  // Comunas dinámicas (Usamos useMemo para evitar recálculos innecesarios)
  const comunasDisponibles = useMemo(() => {
    return regiones.find((r) => r.nombre === formData.region)?.comunas || [];
  }, [formData.region, regiones]);
  
  // Función de validación (Usamos useCallback)
  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};

    // Validación de RUN
    const runLimpio = formData.run.replace(/[^0-9kK]/g, ''); // Limpiar RUN antes de validar
    if (!runLimpio) {
      newErrors.run = 'El RUN es obligatorio';
    } else if (!validateRUN(runLimpio)) {
      newErrors.run = 'RUN inválido (ej: 12345678-k)';
    }

    // Validación de texto
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.apellidos.trim()) newErrors.apellidos = 'Los apellidos son obligatorios';
    if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es obligatoria';

    // Validación de Email
    if (!formData.email) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Correo inválido. Dominios permitidos: @duoc.cl, @profesor.duoc.cl, @gmail.com';
    }

    // Validación de Contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword || formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validación de Fecha de Nacimiento
    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
    } else if (!validateAge(formData.fechaNacimiento)) {
      newErrors.fechaNacimiento = 'Debes ser mayor de 18 años para registrarte';
    }

    // Validación de Región/Comuna
    if (!formData.region) newErrors.region = 'Debes seleccionar una región';
    if (!formData.comuna) newErrors.comuna = 'Debes seleccionar una comuna';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]); // Depende de formData

  // Envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Por favor corrige los errores del formulario');
      return;
    }

    // 1. Crear el payload sin `confirmPassword` y `rol`
    // 2. Formatear el RUN antes de enviar (ej: 12.345.678-k)
    // 3. Convertir nombres de campos: email -> correo, password -> contrasena
    const runFormateado = formatRUN(formData.run); 

    const payload = {
        run: runFormateado,
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        correo: formData.email,
        contrasena: formData.password,
        fechaNacimiento: formData.fechaNacimiento,
        direccion: formData.direccion,
        region: formData.region,
        comuna: formData.comuna,
        codigoReferido: formData.codigoReferido || undefined,
    };

    const success = await register(payload);

    if (success) {
      toast.success('Registro exitoso. ¡Bienvenido a Level-Up Gamer!');
      onNavigate('home');
    }
  };

  // --- Renderizado ---

  if (loadingRegiones) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Cargando formulario...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-black">
      <div className="max-w-2xl w-full">
        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-2 text-[var(--neon-green)]">Crear Cuenta</h1>
          <p className="text-gray-400">Únete a la comunidad gamer de Level-Up Gamer</p>
        </div>

        {/* Formulario */}
        <div className="bg-[#111] border border-[var(--neon-green)] rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* --- RUN --- */}
              <div>
                <label className="text-gray-300 mb-2 block">
                  RUN <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="12.345.678-K"
                    value={formData.run}
                    onChange={(e) => handleChange('run', e.target.value)} 
                    onBlur={(e) => {
                      const runLimpio = e.target.value.replace(/[^0-9kK]/g, '');
                      if (validateRUN(runLimpio)) {
                        setFormData(prev => ({ ...prev, run: formatRUN(runLimpio) }));
                      } else {
                        validate(); 
                      }
                    }}
                    className="pl-10 bg-[#1a1a1a] border-gray-700 text-white"
                  />
                </div>
                {errors.run && <p className="text-red-500 text-sm mt-1">{errors.run}</p>}
              </div>

              {/* --- Nombre --- */}
              <div>
                <label className="text-gray-300 mb-2 block">Nombre *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.nombre}
                    onChange={(e) => handleChange('nombre', e.target.value)}
                    className="pl-10 bg-[#1a1a1a] border-gray-700 text-white"
                  />
                </div>
                {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
              </div>

              {/* --- Apellidos --- */}
              <div>
                <label className="text-gray-300 mb-2 block">Apellidos *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Tus apellidos"
                    value={formData.apellidos}
                    onChange={(e) => handleChange('apellidos', e.target.value)}
                    className="pl-10 bg-[#1a1a1a] border-gray-700 text-white"
                  />
                </div>
                {errors.apellidos && <p className="text-red-500 text-sm mt-1">{errors.apellidos}</p>}
              </div>

              {/* --- Email --- */}
              <div>
                <label className="text-gray-300 mb-2 block">Correo Electrónico *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="pl-10 bg-[#1a1a1a] border-gray-700 text-white"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* --- Password --- */}
              <div>
                <label className="text-gray-300 mb-2 block">Contraseña *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="pl-10 bg-[#1a1a1a] border-gray-700 text-white"
                  />
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              {/* --- Confirmar Password --- */}
              <div>
                <label className="text-gray-300 mb-2 block">Confirmar Contraseña *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="pl-10 bg-[#1a1a1a] border-gray-700 text-white"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* --- Fecha Nacimiento --- */}
              <div>
                <label className="text-gray-300 mb-2 block">Fecha de Nacimiento *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
                    className="pl-10 bg-[#1a1a1a] border-gray-700 text-white"
                    max={new Date().toISOString().split('T')[0]} 
                  />
                </div>
                {errors.fechaNacimiento && (
                  <p className="text-red-500 text-sm mt-1">{errors.fechaNacimiento}</p>
                )}
              </div>

              {/* --- Dirección --- */}
              <div>
                <label className="text-gray-300 mb-2 block">Dirección *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Tu dirección"
                    value={formData.direccion}
                    onChange={(e) => handleChange('direccion', e.target.value)}
                    className="pl-10 bg-[#1a1a1a] border-gray-700 text-white"
                  />
                </div>
                {errors.direccion && <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>}
              </div>

              {/* --- Región --- */}
              <div>
                <label className="text-gray-300 mb-2 block">Región *</label>
                <Select
                  value={formData.region || undefined}
                  onValueChange={(value: any) => {
                    setFormData(prev => ({ 
                      ...prev, 
                      region: value, 
                      comuna: '' 
                    }));
                  }}
                >
                  <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
                    <SelectValue placeholder="Selecciona región" />
                  </SelectTrigger>
                  {regiones.length > 0 && (
                    <SelectContent>
                      {regiones.map((region) => (
                        <SelectItem key={region.nombre} value={region.nombre}>
                          {region.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  )}
                </Select>
                {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region}</p>}
              </div>

              {/* --- Comuna --- */}
              <div>
                <label className="text-gray-300 mb-2 block">Comuna *</label>
                <Select
                  value={formData.comuna || undefined}
                  onValueChange={(value: string) => handleChange('comuna', value)}
                  disabled={!formData.region || comunasDisponibles.length === 0}
                >
                  <SelectTrigger className="bg-[#1a1a1a] border-gray-700 text-white">
                    <SelectValue placeholder={formData.region ? "Selecciona comuna" : "Selecciona una región primero"} />
                  </SelectTrigger>
                  {comunasDisponibles.length > 0 && (
                    <SelectContent>
                      {comunasDisponibles.map((comuna) => (
                        <SelectItem key={comuna} value={comuna}>
                          {comuna}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  )}
                </Select>
                {errors.comuna && <p className="text-red-500 text-sm mt-1">{errors.comuna}</p>}
              </div>
            </div>

            {/* --- Botón submit --- */}
            <Button
              type="submit"
              className="w-full bg-[var(--neon-green)] text-black hover:bg-[var(--neon-purple)] hover:text-white"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Crear Cuenta
            </Button>
          </form>

          {/* Link a login */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-[var(--neon-green)] hover:text-[var(--neon-purple)] transition-colors"
              >
                Inicia sesión aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
