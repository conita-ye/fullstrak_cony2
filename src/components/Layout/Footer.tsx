import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';


export const Footer = () => {
  return (
    <footer className="bg-black border-t-2 border-[var(--neon-green)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sección: Información de la empresa */}
          <div>
            <h3 className="text-[var(--neon-green)] mb-4">Sobre One Tech</h3>
            <p className="text-gray-400 mb-4">
              Tienda online creada en 2022, dedicada a la comercialización de productos gamer
              de alta calidad en todo Chile.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[var(--neon-green)] transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[var(--neon-green)] transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[var(--neon-green)] transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-[var(--neon-green)] mb-4">Contacto</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-[var(--neon-green)]" />
                <span>Envíos a todo Chile (sin locales físicos)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-[var(--neon-green)]" />
                <span>+56 9 1234 5678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[var(--neon-green)]" />
                <span>contacto@onetech.cl</span>
              </div>
            </div>
          </div>

          {/* Enlaces */}
          <div>
            <h3 className="text-[var(--neon-green)] mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-[var(--neon-green)] transition-colors">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--neon-green)] transition-colors">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--neon-green)] transition-colors">
                  Cambios y Devoluciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[var(--neon-green)] transition-colors">
                  Preguntas Frecuentes
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} One Tech. Todos los derechos reservados.</p>
          <p className="mt-2">
            Misión: Entregar productos gamer de alta calidad con experiencia personalizada,
            rápida y confiable.
          </p>
        </div>
      </div>
    </footer>
  );
};
