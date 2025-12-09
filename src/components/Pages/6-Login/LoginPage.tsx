import React, { useState } from 'react';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { validateEmail } from '@/utils/validations';
import { toast } from 'sonner';

interface LoginPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export const LoginPage = ({ onNavigate }: LoginPageProps) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!validateEmail(formData.email)) {
      newErrors.email =
        'Correo inválido. Dominios permitidos: @duoc.cl, @profesor.duoc.cl, @gmail.com';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const success = await login(formData.email, formData.password);

    if (success) {
      toast.success('Sesión iniciada correctamente');
      onNavigate('home');
    } else {
      setErrors({ password: 'Usuario o contraseña incorrectos' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl mb-2 text-[var(--neon-green)]">Iniciar Sesión</h1>
          <p className="text-gray-400">Ingresa a tu cuenta de Level-Up Gamer</p>
        </div>

        <div className="bg-[#111] border border-[var(--neon-green)] rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="text-gray-300 mb-2 block">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrors({ ...errors, email: undefined });
                  }}
                  className="pl-10 bg-[#1a1a1a] border-gray-700 text-white"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-300 mb-2 block">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setErrors({ ...errors, password: undefined });
                  }}
                  className="pl-10 bg-[#1a1a1a] border-gray-700 text-white"
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Recuperar contraseña */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => toast.info('Recuperación de contraseña (simulado)')}
                className="text-sm text-[var(--neon-green)] hover:text-[var(--neon-purple)] transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Botones */}
            <div className="space-y-4">
              <Button
                type="submit"
                className="w-full bg-[var(--neon-green)] text-black hover:bg-[var(--neon-purple)] hover:text-white"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Iniciar Sesión
              </Button>

              <Button
                type="button"
                onClick={() => onNavigate('register')}
                variant="outline"
                className="w-full border-2 border-[var(--neon-purple)] !text-[var(--neon-purple)] !bg-transparent hover:!bg-[var(--neon-purple)] hover:!text-white transition-colors"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Registrarse
              </Button>
            </div>
          </form>

          {/* Credenciales de prueba */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500 mb-2">Credenciales de prueba:</p>
            <div className="space-y-1 text-xs text-gray-400">
              <p>
                <strong className="text-[var(--neon-green)]">Admin:</strong> admin@duoc.cl /
                admin123
              </p>
              <p>
                <strong className="text-[var(--neon-green)]">Cliente:</strong> carlos@gmail.com /
                cliente123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
