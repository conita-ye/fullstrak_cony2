import React from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { Button } from '../../../ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '../../../ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import type { HomeCarouselProps } from '../Interface/HomeCarouselProps';

// URLs de imágenes del carrusel desde S3
const CAROUSEL_IMAGES = {
  banner1: 'https://levelupgamer-assets.s3.us-east-1.amazonaws.com/carousel/banner1-perifericos.jpg',
  banner2: 'https://levelupgamer-assets.s3.us-east-1.amazonaws.com/carousel/banner2-audio.jpg',
  banner3: 'https://levelupgamer-assets.s3.us-east-1.amazonaws.com/carousel/banner3-computadores.jpg',
};

const HomeCarousel: React.FC<HomeCarouselProps> = ({ onNavigate }) => {
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);
  
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  React.useEffect(() => {
    if (!carouselApi) return;

    setCount(carouselApi.scrollSnapList().length);
    setCurrent(carouselApi.selectedScrollSnap());

    const handleSelect = () => setCurrent(carouselApi.selectedScrollSnap());
    carouselApi.on('select', handleSelect);

    return () => {
      carouselApi.off('select', handleSelect);
    };
  }, [carouselApi]);

  return (
    <section className="relative bg-gray-900">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        plugins={[autoplayPlugin.current]}
        setApi={setCarouselApi}
        className="w-full"
        onMouseEnter={() => autoplayPlugin.current.stop()}
        onMouseLeave={() => autoplayPlugin.current.play()}
      >
        <CarouselContent className="ml-0">
          
          {/* Banner 1: OFERTA FLASH (Estilo MELI en texto) */}
          <CarouselItem className="pl-0">
            {/* Fondo con imagen desde S3 */}
            <div 
              className="h-[400px] md:h-[500px] bg-cover bg-center bg-no-repeat flex items-center relative"
              style={{
                backgroundImage: `url(${CAROUSEL_IMAGES.banner1})`,
              }}
            >
              {/* Overlay oscuro para mejor legibilidad */}
              <div className="absolute inset-0 bg-black/50"></div>
              <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
                <div className="max-w-xl">
                  <h2 className="text-4xl md:text-5xl mb-4 text-white font-extrabold drop-shadow-lg">
                    <Zap className="inline-block w-10 h-10 text-yellow-400 mr-2" />
                    OFERTA FLASH EN{' '}
                    {/* Acento en Amarillo MELI */}
                    <span className="text-yellow-400">PERIFÉRICOS</span>
                  </h2>
                  <p className="text-xl text-gray-200 mb-6 drop-shadow-md">
                    Aprovecha 12 cuotas sin interés en productos seleccionados.
                  </p>
                  <Button
                    onClick={() => onNavigate('catalog', { categoria: 'Periféricos' })}
                    // Botón principal en Amarillo MELI
                    className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 font-bold text-lg px-8 py-6 shadow-lg"
                  >
                    ¡Comprar ahora!
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </CarouselItem>

          {/* Banner 2: CATEGORÍA DESTACADA (Diseño centrado) */}
          <CarouselItem className="pl-0">
            {/* Fondo con imagen desde S3 */}
            <div 
              className="h-[400px] md:h-[500px] bg-cover bg-center bg-no-repeat flex items-center justify-center relative"
              style={{
                backgroundImage: `url(${CAROUSEL_IMAGES.banner2})`,
              }}
            >
              {/* Overlay oscuro para mejor legibilidad */}
              <div className="absolute inset-0 bg-black/50"></div>
              <div className="text-center px-4 relative z-10">
                <h2 className="text-5xl md:text-7xl mb-6 text-white font-black tracking-tight drop-shadow-lg">
                  <span className="text-blue-400">AUDIO</span> DE ALTA FIDELIDAD
                </h2>
                <p className="text-2xl text-gray-200 mb-8 drop-shadow-md">
                  Auriculares y altavoces diseñados para la inmersión total.
                </p>
                <Button
                  onClick={() => onNavigate('catalog', { categoria: 'Audio' })}
                  // Botón secundario en un color de acento (Azul/Cian)
                  className="bg-blue-600 text-white hover:bg-blue-700 font-bold text-lg px-8 py-6 shadow-lg"
                >
                  Explorar Audio
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </CarouselItem>

          {/* Banner 3: COMPUTADORES GAMER (Foco en el branding) */}
          <CarouselItem className="pl-0">
            {/* Fondo con imagen desde S3 */}
            <div 
              className="h-[400px] md:h-[500px] bg-cover bg-center bg-no-repeat flex items-center justify-end relative"
              style={{
                backgroundImage: `url(${CAROUSEL_IMAGES.banner3})`,
              }}
            >
              {/* Overlay oscuro para mejor legibilidad */}
              <div className="absolute inset-0 bg-black/50"></div>
              <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
                <div className="max-w-xl ml-auto text-right">
                  <h2 className="text-4xl md:text-5xl mb-4 text-white font-extrabold drop-shadow-lg">
                    POTENCIA EXTREMA
                    {/* Acento en Amarillo MELI */}
                    <span className="text-yellow-400 block mt-1">GAMER PCS</span>
                  </h2>
                  <p className="text-xl text-gray-200 mb-6 drop-shadow-md">
                    Arma el setup de tus sueños con la mejor tecnología.
                  </p>
                  <Button
                    onClick={() => onNavigate('catalog', { categoria: 'Computadores' })}
                    // Botón principal en Amarillo MELI
                    className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 font-bold text-lg px-8 py-6 shadow-lg"
                  >
                    Ver Computadores
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </CarouselItem>

        </CarouselContent>

        {/* Botones de navegación (Acento en Amarillo MELI) */}
        <CarouselPrevious
          className="left-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-0 w-12 h-12 shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </CarouselPrevious>

        <CarouselNext
          className="right-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 border-0 w-12 h-12 shadow-lg"
        >
          <ChevronRight className="w-6 h-6" />
        </CarouselNext>

        {/* Indicadores de puntos (Acento en Amarillo MELI) */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => carouselApi?.scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === current
                  // Punto activo en Amarillo MELI y más ancho
                  ? 'bg-yellow-400 w-8'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Ir al banner ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
};

export default HomeCarousel;