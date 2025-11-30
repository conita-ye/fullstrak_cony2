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
            {/* Fondo sólido con degradado sutil */}
            <div className="h-[400px] md:h-[500px] bg-gradient-to-r from-gray-900 to-gray-800 flex items-center">
              <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="max-w-xl">
                  <h2 className="text-4xl md:text-5xl mb-4 text-white font-extrabold">
                    <Zap className="inline-block w-10 h-10 text-yellow-400 mr-2" />
                    OFERTA FLASH EN{' '}
                    {/* Acento en Amarillo MELI */}
                    <span className="text-yellow-400">PERIFÉRICOS</span>
                  </h2>
                  <p className="text-xl text-gray-300 mb-6">
                    Aprovecha 12 cuotas sin interés en productos seleccionados.
                  </p>
                  <Button
                    onClick={() => onNavigate('catalog', { categoria: 'Periféricos' })}
                    // Botón principal en Amarillo MELI
                    className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 font-bold text-lg px-8 py-6"
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
            {/* Fondo oscuro con toque de azul (Estilo secundario MELI) */}
            <div className="h-[400px] md:h-[500px] bg-gray-950 flex items-center justify-center">
              <div className="text-center px-4">
                <h2 className="text-5xl md:text-7xl mb-6 text-white font-black tracking-tight">
                  <span className="text-blue-400">AUDIO</span> DE ALTA FIDELIDAD
                </h2>
                <p className="text-2xl text-gray-400 mb-8">
                  Auriculares y altavoces diseñados para la inmersión total.
                </p>
                <Button
                  onClick={() => onNavigate('catalog', { categoria: 'Audio' })}
                  // Botón secundario en un color de acento (Azul/Cian)
                  className="bg-blue-600 text-white hover:bg-blue-700 font-bold text-lg px-8 py-6"
                >
                  Explorar Audio
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </CarouselItem>

          {/* Banner 3: COMPUTADORES GAMER (Foco en el branding) */}
          <CarouselItem className="pl-0">
            <div className="h-[400px] md:h-[500px] bg-gray-800 flex items-center justify-end">
              <div className="max-w-7xl mx-auto px-4 w-full">
                <div className="max-w-xl ml-auto text-right">
                  <h2 className="text-4xl md:text-5xl mb-4 text-white font-extrabold">
                    POTENCIA EXTREMA
                    {/* Acento en Amarillo MELI */}
                    <span className="text-yellow-400 block mt-1">GAMER PCS</span>
                  </h2>
                  <p className="text-xl text-gray-300 mb-6">
                    Arma el setup de tus sueños con la mejor tecnología.
                  </p>
                  <Button
                    onClick={() => onNavigate('catalog', { categoria: 'Computadores' })}
                    // Botón principal en Amarillo MELI
                    className="bg-yellow-400 text-gray-900 hover:bg-yellow-500 font-bold text-lg px-8 py-6"
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