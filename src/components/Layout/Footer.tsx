import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';


export const Footer = () => {
  return (
    // Fondo oscuro gamer, con borde superior amarillo MELI
    <footer className="bg-gray-900 border-t-4 border-yellow-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sección: Información de la empresa */}
          <div>
            {/* Título en amarillo MELI */}
            <h3 className="text-yellow-400 font-bold text-lg mb-4">Sobre Level-Up Store</h3>
            <p className="text-gray-400 mb-4 text-sm">
              Tienda online creada en 2022, dedicada a la comercialización de productos gamer
              de alta calidad en todo Chile.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                // Íconos y hover en amarillo MELI
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Contacto */}
          <div>
            {/* Título en amarillo MELI */}
            <h3 className="text-yellow-400 font-bold text-lg mb-4">Contacto</h3>
            <div className="space-y-3 text-gray-400 text-sm">
              <div className="flex items-start gap-2">
                {/* Ícono en amarillo MELI */}
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0 text-yellow-400" />
                <span>Envíos a todo Chile (sin locales físicos)</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Ícono en amarillo MELI */}
                <Phone className="w-5 h-5 text-yellow-400" />
                <span>+56 9 1234 5678</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Ícono en amarillo MELI */}
                <Mail className="w-5 h-5 text-yellow-400" />
                <span>contacto@levelupgamer.cl</span>
              </div>
            </div>
          </div>

          {/* Enlaces */}
          <div>
            {/* Título en amarillo MELI */}
            <h3 className="text-yellow-400 font-bold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                {/* Hover en amarillo MELI */}
                <a href="#" className="hover:text-yellow-400 transition-colors">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors">
                  Cambios y Devoluciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-400 transition-colors">
                  Preguntas Frecuentes
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Sección de Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-xs">
          <p>© {new Date().getFullYear()} Level-Up Gamer. Todos los derechos reservados.</p>
          <p className="mt-2 opacity-75">
            Misión: Entregar productos gamer de alta calidad con experiencia personalizada,
            rápida y confiable.
          </p>
        </div>
      </div>
    </footer>
  );
};