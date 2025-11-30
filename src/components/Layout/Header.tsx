import { useState } from 'react';
import { ShoppingCart, User, LogOut, Menu, X, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { Button } from '../ui/button';
interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Header = ({ onNavigate, currentPage }: HeaderProps) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemsCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const cartCount = getCartItemsCount();

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  const navItems = [
    { label: 'Inicio', page: 'home' },
    { label: 'Tienda', page: 'catalog' },
    { label: 'Blog', page: 'blog' },
    { label: 'Contacto', page: 'contact' },
  ];

  if (user?.rol === 'admin') {
    navItems.push({ label: 'Admin', page: 'admin' });
  }

  return (
    <header className="bg-gray-900 border-b-4 border-yellow-400 fixed top-0 w-full z-50 shadow-lg"> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between h-20 md:h-24 py-2"> 
          
          <div
            className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
            onClick={() => onNavigate('home')}
          >
            <span className="text-white text-2xl font-extrabold tracking-wider">
              LEVEL-UP <span className="text-yellow-400">STORE</span>
            </span>
          </div>

          <div className="hidden lg:flex flex-grow max-w-xl mx-8">
            <input
              type="text"
              placeholder="Busca tus juegos, componentes o accesorios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border-none rounded-l bg-white text-gray-800 focus:outline-none"
            />
            <button
              className="bg-gray-200 p-2 rounded-r hover:bg-yellow-400 transition-colors"
              onClick={() => {}}
            >
              <Search className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">

            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-white hover:text-yellow-400 transition-colors hidden md:block" 
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"> 
                  {cartCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-300 text-sm hidden lg:block">
                  {user?.nombre} <span className="text-yellow-400">({user?.rol})</span>
                </span>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors" 
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => onNavigate('login')}
                className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 font-bold transition-colors" 
                size="sm"
              >
                <User className="w-4 h-4 mr-2" />
                Ingresar
              </Button>
            )}

            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => onNavigate('cart')}
                className="relative p-2 text-white hover:text-yellow-400 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-white hover:text-yellow-400"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 py-2 border-t border-gray-800">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`text-sm font-semibold transition-colors ${
                currentPage === item.page
                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                  : 'text-gray-300 hover:text-blue-400 hover:border-b-2 hover:border-blue-400'
              } py-1`}
            >
              {item.label}
            </button>
          ))}
        </nav>


        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex mb-4">
              <input
                type="text"
                placeholder="Buscar en LEVEL-UP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border-none rounded-l bg-white text-gray-800 focus:outline-none"
              />
              <button
                className="bg-gray-200 p-2 rounded-r hover:bg-yellow-400 transition-colors"
                onClick={() => {}}
              >
                <Search className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => {
                    onNavigate(item.page);
                    setIsMenuOpen(false);
                  }}
                  className={`text-left py-2 font-medium ${
                    currentPage === item.page ? 'text-yellow-400' : 'text-gray-300 hover:text-blue-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="border-t border-gray-700 pt-4 flex flex-col gap-3">
                <button
                  onClick={() => {
                    onNavigate('cart');
                    setIsMenuOpen(false);
                  }}
                  className="text-left py-2 text-gray-300 flex items-center gap-2 hover:text-yellow-400"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Carrito ({cartCount})
                </button>

                {isAuthenticated ? (
                  <>
                    <div className="text-gray-300 text-sm pt-2">
                      Hola, <span className='text-yellow-400'>{user?.nombre}</span> ({user?.rol})
                    </div>
                    <Button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      onNavigate('login');
                      setIsMenuOpen(false);
                    }}
                    className="bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-500"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Ingresar / Registrarse
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};