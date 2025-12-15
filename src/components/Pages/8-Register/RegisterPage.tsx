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
  codigoReferido: string;
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
    codigoReferido: '',
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

  // Manejador de cambios genérico con validaciones en tiempo real
  const handleChange = useCallback((
    key: keyof UserData, 
    value: string | UserRole
  ) => {
    // Limpiar el error del campo al cambiar su valor
    if (errors[key]) {
      setErrors(prev => {
        const { [key]: _, ...rest } = prev;
        return rest;
      });
    }
    // Marcar el campo como tocado
    setTouchedFields(prev => new Set(prev).add(key));
    
    // Aplicar restricciones según el tipo de campo
    if (typeof value === 'string') {
      if (key === 'run') {
        // Solo permitir números y k/K para RUT
        const cleaned = value.replace(/[^0-9kK]/g, '').toUpperCase();
        // Limitar estrictamente a 9 caracteres (máximo para RUT: 8 dígitos + 1 dígito verificador, ej: 12345678-5)
        const limitedCleaned = cleaned.slice(0, 9);
        // Formatear automáticamente mientras escribe
        const formatted = formatRUN(limitedCleaned);
        setFormData(prev => ({ ...prev, [key]: formatted }));
        return;
      } else if (key === 'nombre' || key === 'apellidos') {
        // Solo letras, espacios y caracteres especiales en español
        const cleaned = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
        if (cleaned.length <= 50) {
          setFormData(prev => ({ ...prev, [key]: cleaned }));
        }
        return;
      } else if (key === 'email') {
        // Limitar email a 100 caracteres
        if (value.length <= 100) {
          setFormData(prev => ({ ...prev, [key]: value }));
        }
        return;
      } else if (key === 'password' || key === 'confirmPassword') {
        // Limitar contraseña a 32 caracteres
        if (value.length <= 32) {
          setFormData(prev => ({ ...prev, [key]: value }));
        }
        return;
      } else if (key === 'direccion') {
        // Limitar dirección a 200 caracteres
        if (value.length <= 200) {
          setFormData(prev => ({ ...prev, [key]: value }));
        }
        return;
      } else if (key === 'codigoReferido') {
        // Solo alfanumérico para código referido, máximo 20 caracteres
        const cleaned = value.replace(/[^a-zA-Z0-9]/g, '');
        if (cleaned.length <= 20) {
          setFormData(prev => ({ ...prev, [key]: cleaned }));
        }
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [key]: value }));
  }, [errors]);

  // Comunas dinámicas (Usamos useMemo para evitar recálculos innecesarios)
  const comunasDisponibles = useMemo(() => {
    return regiones.find((r) => r.nombre === formData.region)?.comunas || [];
  }, [formData.region, regiones]);
  
  // Función de validación (Usamos useCallback)
  // Solo valida campos que han sido tocados o cuando se intenta enviar
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  
  const validate = useCallback((onlyTouched: boolean = false): boolean => {
    const newErrors: Record<string, string> = {};

    // Validación de RUN
    if (!onlyTouched || touchedFields.has('run')) {
      // Limpiar RUN: quitar puntos, guiones y espacios, convertir a mayúsculas
      const runLimpio = formData.run.replace(/\./g, '').replace(/-/g, '').replace(/\s/g, '').toUpperCase();
      if (!runLimpio) {
        newErrors.run = 'El RUN es obligatorio';
      } else if (runLimpio.length < 7 || runLimpio.length > 9) {
        newErrors.run = 'El RUN debe tener entre 7 y 9 caracteres (sin puntos ni guión)';
      } else if (!/^[0-9]+[0-9K]$/.test(runLimpio)) {
        newErrors.run = 'El RUN debe contener solo números y un dígito verificador (0-9 o K)';
      } else {
        // Validar el dígito verificador, pero si falla, solo mostrar advertencia
        // El backend hará la validación final
        if (!validateRUN(runLimpio)) {
          // No mostrar error, solo dejar que el backend valide
          // newErrors.run = 'RUN inválido. Verifica el dígito verificador (ej: 12345678-K)';
        }
      }
    }

    // Validación de Nombre
    if (!onlyTouched || touchedFields.has('nombre')) {
      if (!formData.nombre.trim()) {
        newErrors.nombre = 'El nombre es obligatorio';
      } else if (formData.nombre.trim().length < 2) {
        newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
      } else if (formData.nombre.trim().length > 50) {
        newErrors.nombre = 'El nombre no puede tener más de 50 caracteres';
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(formData.nombre)) {
        newErrors.nombre = 'El nombre solo puede contener letras y espacios';
      }
    }

    // Validación de Apellidos
    if (!onlyTouched || touchedFields.has('apellidos')) {
      if (!formData.apellidos.trim()) {
        newErrors.apellidos = 'Los apellidos son obligatorios';
      } else if (formData.apellidos.trim().length < 2) {
        newErrors.apellidos = 'Los apellidos deben tener al menos 2 caracteres';
      } else if (formData.apellidos.trim().length > 50) {
        newErrors.apellidos = 'Los apellidos no pueden tener más de 50 caracteres';
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(formData.apellidos)) {
        newErrors.apellidos = 'Los apellidos solo pueden contener letras y espacios';
      }
    }

    // Validación de Dirección
    if (!onlyTouched || touchedFields.has('direccion')) {
      if (!formData.direccion.trim()) {
        newErrors.direccion = 'La dirección es obligatoria';
      } else if (formData.direccion.trim().length < 5) {
        newErrors.direccion = 'La dirección debe tener al menos 5 caracteres';
      } else if (formData.direccion.trim().length > 200) {
        newErrors.direccion = 'La dirección no puede tener más de 200 caracteres';
      }
    }

    // Validación de Email
    if (!onlyTouched || touchedFields.has('email')) {
      if (!formData.email) {
        newErrors.email = 'El correo es obligatorio';
      } else if (formData.email.length > 100) {
        newErrors.email = 'El correo no puede tener más de 100 caracteres';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Correo inválido. Dominios permitidos: @duoc.cl, @profesor.duoc.cl, @gmail.com';
      }
    }

    // Validación de Contraseña
    if (!onlyTouched || touchedFields.has('password')) {
      if (!formData.password) {
        newErrors.password = 'La contraseña es obligatoria';
      } else if (formData.password.length < 8) {
        newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      } else if (formData.password.length > 32) {
        newErrors.password = 'La contraseña no puede tener más de 32 caracteres';
      }
    }

    if (!onlyTouched || touchedFields.has('confirmPassword')) {
      if (!formData.confirmPassword || formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
    }

    // Validación de Fecha de Nacimiento
    if (!onlyTouched || touchedFields.has('fechaNacimiento')) {
      if (!formData.fechaNacimiento) {
        newErrors.fechaNacimiento = 'La fecha de nacimiento es obligatoria';
      } else {
        // Validar que la fecha sea válida
        const fecha = new Date(formData.fechaNacimiento);
        if (isNaN(fecha.getTime())) {
          newErrors.fechaNacimiento = 'La fecha de nacimiento no es válida';
        } else {
          // Validar que la fecha no sea muy antigua (mínimo 1900)
          const minDate = new Date('1900-01-01');
          if (fecha < minDate) {
            newErrors.fechaNacimiento = 'La fecha de nacimiento no puede ser anterior a 1900';
          } else if (!validateAge(formData.fechaNacimiento)) {
            newErrors.fechaNacimiento = 'Debes ser mayor de 18 años para registrarte';
          }
        }
      }
    }

    // Validación de Región/Comuna
    if (!onlyTouched || touchedFields.has('region')) {
      if (!formData.region) {
        newErrors.region = 'Debes seleccionar una región';
      }
    }
    if (!onlyTouched || touchedFields.has('comuna')) {
      if (!formData.comuna) {
        newErrors.comuna = 'Debes seleccionar una comuna';
      } else if (formData.region) {
        // Validar que la comuna pertenezca a la región seleccionada
        const regionSeleccionada = regiones.find((r) => r.nombre === formData.region);
        if (regionSeleccionada && regionSeleccionada.comunas && !regionSeleccionada.comunas.includes(formData.comuna)) {
          newErrors.comuna = 'La comuna seleccionada no pertenece a la región elegida';
        }
      }
    }

    // Validación de Código Referido (opcional, pero si existe debe ser válido)
    if (formData.codigoReferido && formData.codigoReferido.trim().length > 0) {
      if (formData.codigoReferido.trim().length < 3) {
        newErrors.codigoReferido = 'El código referido debe tener al menos 3 caracteres';
      } else if (!/^[a-zA-Z0-9]+$/.test(formData.codigoReferido)) {
        newErrors.codigoReferido = 'El código referido solo puede contener letras y números';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, touchedFields]); // Depende de formData y touchedFields

  // Envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados al intentar enviar
    setTouchedFields(new Set(Object.keys(formData)));

    if (!validate(false)) {
      toast.error('Por favor corrige los errores del formulario');
      return;
    }

    // 1. Crear el payload sin `confirmPassword` y `rol`
    // 2. Limpiar el RUN antes de enviar (solo números y dígito verificador, sin puntos ni guiones)
    // 3. Convertir nombres de campos: email -> correo, password -> contrasena
    // 4. Solo incluir codigoReferido si tiene valor (no enviar undefined o string vacío)
    const runLimpio = formData.run.replace(/\./g, '').replace(/-/g, '').toUpperCase(); 

    const payload: any = {
        run: runLimpio,
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        correo: formData.email,
        contrasena: formData.password,
        fechaNacimiento: formData.fechaNacimiento,
        direccion: formData.direccion,
        region: formData.region,
        comuna: formData.comuna,
    };

    // Solo agregar codigoReferido si tiene valor
    if (formData.codigoReferido && formData.codigoReferido.trim() !== '') {
      payload.codigoReferido = formData.codigoReferido.trim();
    }

    const success = await register(payload);

    if (success) {
      if (formData.codigoReferido) {
        toast.success('Registro exitoso. ¡Bienvenido a Level-Up Gamer! Has usado un código referido, ambos ganaréis puntos LevelUp.');
      } else {
        toast.success('Registro exitoso. ¡Bienvenido a Level-Up Gamer!');
      }
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
                    inputMode="numeric"
                    placeholder="12345678-K"
                    value={formData.run}
                    maxLength={12}
                    onChange={(e) => handleChange('run', e.target.value)} 
                    onBlur={() => {
                      setTouchedFields(prev => new Set(prev).add('run'));
                      const runLimpio = formData.run.replace(/\./g, '').replace(/-/g, '').replace(/\s/g, '').toUpperCase();
                      // Solo validar si el RUN tiene al menos 7 caracteres (formato completo)
                      if (runLimpio && runLimpio.length >= 7) {
                        validate(true); 
                      }
                    }}
                    className={`pl-10 bg-[#1a1a1a] border-gray-700 text-white ${errors.run ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.run && <p className="text-red-500 text-sm mt-1">{errors.run}</p>}
                <p className="text-xs text-gray-500 mt-1">Formato: números y dígito verificador (ej: 12345678-K)</p>
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
                    maxLength={50}
                    onChange={(e) => handleChange('nombre', e.target.value)}
                    onBlur={() => setTouchedFields(prev => new Set(prev).add('nombre'))}
                    className="pl-10 bg-[#1a1a1a] border-gray-700 text-white"
                  />
                </div>
                {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                <p className="text-xs text-gray-500 mt-1">Solo letras (máx. 50 caracteres)</p>
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
                    maxLength={50}
                    onChange={(e) => handleChange('apellidos', e.target.value)}
                    onBlur={() => setTouchedFields(prev => new Set(prev).add('apellidos'))}
                    className="pl-10 bg-[#1a1a1a] border-gray-700 text-white"
                  />
                </div>
                {errors.apellidos && <p className="text-red-500 text-sm mt-1">{errors.apellidos}</p>}
                <p className="text-xs text-gray-500 mt-1">Solo letras (máx. 50 caracteres)</p>
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
                    maxLength={100}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => setTouchedFields(prev => new Set(prev).add('email'))}
                    className="pl-10 bg-[#1a1a1a] border-gray-700 text-white"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                <p className="text-xs text-gray-500 mt-1">Dominios permitidos: @duoc.cl, @profesor.duoc.cl, @gmail.com</p>
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
                    maxLength={32}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={() => setTouchedFields(prev => new Set(prev).add('password'))}
                    className="pl-10 bg-[#1a1a1a] border-gray-700 text-white"
                  />
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres, máximo 32</p>
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
                    maxLength={32}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    onBlur={() => setTouchedFields(prev => new Set(prev).add('confirmPassword'))}
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
                    onBlur={() => setTouchedFields(prev => new Set(prev).add('fechaNacimiento'))}
                    className="pl-10 bg-[#1a1a1a] border-gray-700 text-white"
                    min="1900-01-01"
                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]} 
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
                    maxLength={200}
                    onChange={(e) => handleChange('direccion', e.target.value)}
                    onBlur={() => setTouchedFields(prev => new Set(prev).add('direccion'))}
                    className="pl-10 bg-[#1a1a1a] border-gray-700 text-white"
                  />
                </div>
                {errors.direccion && <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>}
                <p className="text-xs text-gray-500 mt-1">Máximo 200 caracteres</p>
              </div>

              {/* --- Región --- */}
              <div>
                <label className="text-gray-300 mb-2 block">Región *</label>
                  <Select
                  value={formData.region || undefined}
                  onValueChange={(value: string) => {
                    setTouchedFields(prev => new Set(prev).add('region'));
                    setFormData(prev => ({ 
                      ...prev, 
                      region: value, 
                      comuna: '' 
                    }));
                    // Cargar comunas de la región seleccionada
                    const regionSeleccionada = regiones.find((r) => r.nombre === value);
                    if (regionSeleccionada && regionSeleccionada.comunas) {
                      // Las comunas ya están disponibles en regionSeleccionada.comunas
                    }
                    // Limpiar error de región y comuna al cambiar región
                    setErrors(prev => {
                      const { region: _, comuna: __, ...rest } = prev;
                      return rest;
                    });
                  }}
                >
                  <SelectTrigger className={`bg-[#1a1a1a] border-gray-700 text-white ${errors.region ? 'border-red-500' : ''}`}>
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
                  onValueChange={(value: string) => {
                    setTouchedFields(prev => new Set(prev).add('comuna'));
                    handleChange('comuna', value);
                    // Validar que la comuna pertenece a la región
                    if (formData.region && !comunasDisponibles.includes(value)) {
                      setErrors(prev => ({ ...prev, comuna: 'La comuna seleccionada no pertenece a la región' }));
                    } else {
                      setErrors(prev => {
                        const { comuna: _, ...rest } = prev;
                        return rest;
                      });
                    }
                  }}
                  disabled={!formData.region || comunasDisponibles.length === 0}
                >
                  <SelectTrigger className={`bg-[#1a1a1a] border-gray-700 text-white ${errors.comuna ? 'border-red-500' : ''}`}>
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

              {/* --- Código Referido (Opcional) --- */}
              <div className="md:col-span-2">
                <label className="text-gray-300 mb-2 block">
                  Código de Referido <span className="text-gray-500 text-xs">(Opcional)</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Ingresa el código de referido si tienes uno"
                    value={formData.codigoReferido || ''}
                    maxLength={20}
                    onChange={(e) => handleChange('codigoReferido', e.target.value)}
                    className="pl-10 bg-[#1a1a1a] border-gray-700 text-white"
                  />
                </div>
                {errors.codigoReferido && <p className="text-red-500 text-sm mt-1">{errors.codigoReferido}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  Solo letras y números (máx. 20 caracteres). Si alguien te refirió, ingresa su código y ambos ganaréis puntos LevelUp
                </p>
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
