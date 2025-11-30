import React from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // Plugin autoplay
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  // Efecto para actualizar estado del carrusel
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
    <section className="relative bg-black">
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
          {/* Banner 1: Promoción Accesorios */}
          <CarouselItem className="pl-0">
            <div className="relative h-[400px] md:h-[500px]">
              <img
                src="https://xtech-frontend.s3.amazonaws.com/media/img/banners-cat-xtech-spa-6.jpg"
                alt="Descuento en accesorios pagando con tarjeta"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                <div className="max-w-7xl mx-auto px-4 w-full">
                  <div className="max-w-xl">
                    <h2 className="text-4xl md:text-5xl mb-4 text-white">
                      DESCUENTO EN{' '}
                      <span className="text-[var(--neon-green)]">ACCESORIOS</span>
                    </h2>
                    <p className="text-xl text-gray-200 mb-6">
                      Pagando con tarjeta - www.onetech.cl
                    </p>
                    <Button
                      onClick={() => onNavigate('catalog', { categoria: 'Periféricos' })}
                      className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-purple)] hover:text-white text-lg px-8 py-6"
                    >
                      Ver Accesorios
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>

          {/* Banner 2: Promoción Audio */}
          <CarouselItem className="pl-0">
            <div className="relative h-[400px] md:h-[500px]">
              <img
                src="https://media.istockphoto.com/id/1208351593/es/vector/altavoz-de-sonido-en-luz-de-ne%C3%B3n-en-la-playa-concepto-futurista-de-banner-de-fiesta-nocturna.jpg?s=2048x2048&w=is&k=20&c=fx3cB8CzYU1t1b6dyQE9ILiUc6rcUiDAJkoOL0e2uP0="
                alt="Lo mejor en audio y sonido"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent flex items-center justify-end">
                <div className="max-w-7xl mx-auto px-4 w-full">
                  <div className="max-w-xl ml-auto text-right">
                    <h2 className="text-4xl md:text-5xl mb-4 text-white">
                      LO MEJOR EN{' '}
                      <span className="text-[var(--neon-purple)]">AUDIO Y SONIDO</span>
                    </h2>
                    <p className="text-xl text-gray-200 mb-6">
                      Disfruta de lo mejor - www.onetech.cl
                    </p>
                    <Button
                      onClick={() => onNavigate('catalog', { categoria: 'Audio' })}
                      className="bg-[var(--neon-purple)] text-white hover:bg-[var(--neon-green)] hover:text-black text-lg px-8 py-6"
                    >
                      Ver Audio
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>

          {/* Banner 3: Computadores Gamer */}
          <CarouselItem className="pl-0">
            <div className="relative h-[400px] md:h-[500px] bg-gradient-to-br from-[#1a1a1a] via-black to-[#1a1a1a]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-4">
                  <h2 className="text-5xl md:text-7xl mb-6 bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-purple)] bg-clip-text text-transparent">
                    COMPUTADORES GAMER
                  </h2>
                  <p className="text-2xl text-gray-300 mb-8">
                    La mejor tecnología para tu setup
                  </p>
                  <Button
                    onClick={() => onNavigate('catalog', { categoria: 'Computadores' })}
                    className="bg-[var(--neon-green)] text-black hover:bg-[var(--neon-purple)] hover:text-white text-lg px-8 py-6"
                  >
                    Ver Computadores
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>

        {/* Botones de navegación */}
        <CarouselPrevious
          className="left-4 bg-[var(--neon-green)] hover:bg-[var(--neon-purple)] text-black hover:text-white border-0 w-12 h-12 shadow-lg hover:shadow-[0_0_20px_rgba(0,255,136,0.5)]"
        >
          <ChevronLeft className="w-6 h-6" />
        </CarouselPrevious>

        <CarouselNext
          className="right-4 bg-[var(--neon-green)] hover:bg-[var(--neon-purple)] text-black hover:text-white border-0 w-12 h-12 shadow-lg hover:shadow-[0_0_20px_rgba(0,255,136,0.5)]"
        >
          <ChevronRight className="w-6 h-6" />
        </CarouselNext>

        {/* Indicadores de puntos */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => carouselApi?.scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === current
                  ? 'bg-[var(--neon-green)] w-8'
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
