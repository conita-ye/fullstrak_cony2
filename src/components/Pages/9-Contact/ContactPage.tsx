import React, { useState } from 'react';
import { MessageCircle, Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { toast } from 'sonner';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Mensaje enviado correctamente (simulado)');
    setFormData({ nombre: '', email: '', mensaje: '' });
  };

  const handleWhatsApp = () => {
    const phoneNumber = '56912345678';
    const message = '¡Hola! Me gustaría obtener información sobre productos One Tech.';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-4 text-[var(--neon-green)]">Contacto</h1>
          <p className="text-gray-400 text-lg">
            ¿Tienes preguntas? Estamos aquí para ayudarte
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Información de contacto */}
          <div>
            <h2 className="text-2xl mb-6 text-[var(--neon-green)]">Información de Contacto</h2>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4 p-4 bg-[#111] border border-gray-800 rounded-lg">
                <div className="bg-[var(--neon-green)] p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-white mb-1">Teléfono</h3>
                  <p className="text-gray-400">+56 9 1234 5678</p>
                  <p className="text-sm text-gray-500 mt-1">Lun - Vie: 9:00 AM - 6:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-[#111] border border-gray-800 rounded-lg">
                <div className="bg-[var(--neon-purple)] p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white mb-1">Email</h3>
                  <p className="text-gray-400">contacto@onetech.cl</p>
                  <p className="text-sm text-gray-500 mt-1">Respuesta en 24-48 horas</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-[#111] border border-gray-800 rounded-lg">
                <div className="bg-[var(--neon-blue)] p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-white mb-1">Ubicación</h3>
                  <p className="text-gray-400">Envíos a todo Chile</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Tienda online sin locales físicos
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="w-8 h-8" />
                <div>
                  <h3 className="text-xl">¿Necesitas ayuda inmediata?</h3>
                  <p className="text-green-100">Chatea con nosotros por WhatsApp</p>
                </div>
              </div>
              <Button
                onClick={handleWhatsApp}
                className="w-full bg-white text-green-600 hover:bg-gray-100"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Abrir WhatsApp
              </Button>
            </div>
          </div>

          {/* Formulario de contacto */}
          <div>
            <div className="bg-[#111] border border-[var(--neon-green)] rounded-lg p-8">
              <h2 className="text-2xl mb-6 text-[var(--neon-green)]">Envíanos un Mensaje</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-gray-300 mb-2 block">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                    className="bg-[#1a1a1a] border-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-gray-300 mb-2 block">
                    Correo Electrónico <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-[#1a1a1a] border-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-gray-300 mb-2 block">
                    Mensaje <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    placeholder="Escribe tu mensaje aquí..."
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    required
                    className="bg-[#1a1a1a] border-gray-700 text-white min-h-[150px]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[var(--neon-green)] text-black hover:bg-[var(--neon-purple)] hover:text-white"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Enviar Mensaje
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  *Formulario simulado - No se envían datos reales
                </p>
              </form>
            </div>

            {/* Horarios */}
            <div className="mt-6 bg-[#111] border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg text-[var(--neon-green)] mb-4">Horarios de Atención</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex justify-between">
                  <span>Lunes - Viernes</span>
                  <span className="text-white">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábado</span>
                  <span className="text-white">10:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Domingo</span>
                  <span className="text-gray-500">Cerrado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl mb-8 text-center text-[var(--neon-green)]">
            Preguntas Frecuentes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111] border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg text-white mb-2">¿Cuál es el tiempo de envío?</h3>
              <p className="text-gray-400">
                Los envíos a la Región Metropolitana demoran 2-3 días hábiles, y a regiones 3-5
                días hábiles.
              </p>
            </div>

            <div className="bg-[#111] border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg text-white mb-2">¿Tienen garantía los productos?</h3>
              <p className="text-gray-400">
                Sí, todos nuestros productos cuentan con garantía del fabricante. El plazo varía
                según el producto.
              </p>
            </div>

            <div className="bg-[#111] border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg text-white mb-2">¿Puedo cambiar o devolver un producto?</h3>
              <p className="text-gray-400">
                Tienes 30 días para realizar cambios o devoluciones, siempre que el producto
                esté en su embalaje original.
              </p>
            </div>

            <div className="bg-[#111] border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg text-white mb-2">¿Qué métodos de pago aceptan?</h3>
              <p className="text-gray-400">
                Aceptamos tarjetas de crédito, débito, transferencia bancaria y WebPay (simulado
                en esta versión).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
