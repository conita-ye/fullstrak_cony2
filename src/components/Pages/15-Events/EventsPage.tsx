import React, { useState } from 'react';
import { MapPin, Calendar, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Event {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  ubicacion: string;
  ciudad: string;
  puntosLevelUp: number;
  lat: number;
  lng: number;
}

interface EventsPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export const EventsPage = ({ onNavigate }: EventsPageProps) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Eventos de ejemplo en diferentes ciudades de Chile
  const eventos: Event[] = [
    {
      id: 1,
      nombre: 'Torneo Nacional de Esports',
      descripcion: 'Competencia de videojuegos con premios en efectivo y puntos LevelUp',
      fecha: '2024-03-15',
      ubicacion: 'Estadio Nacional',
      ciudad: 'Santiago',
      puntosLevelUp: 500,
      lat: -33.4489,
      lng: -70.6693,
    },
    {
      id: 2,
      nombre: 'Expo Gaming Valparaíso',
      descripcion: 'Feria de productos gaming y demostraciones de nuevas tecnologías',
      fecha: '2024-03-22',
      ubicacion: 'Centro de Eventos',
      ciudad: 'Valparaíso',
      puntosLevelUp: 300,
      lat: -33.0472,
      lng: -71.6127,
    },
    {
      id: 3,
      nombre: 'Lanzamiento PlayStation 6',
      descripcion: 'Evento exclusivo para probar la nueva consola y ganar puntos',
      fecha: '2024-04-05',
      ubicacion: 'Mall Plaza',
      ciudad: 'Concepción',
      puntosLevelUp: 400,
      lat: -36.8201,
      lng: -73.0444,
    },
    {
      id: 4,
      nombre: 'Championship Gaming Temuco',
      descripcion: 'Torneo regional con clasificación a nacional',
      fecha: '2024-04-12',
      ubicacion: 'Centro de Convenciones',
      ciudad: 'Temuco',
      puntosLevelUp: 350,
      lat: -38.7359,
      lng: -72.5904,
    },
    {
      id: 5,
      nombre: 'Gaming Fest Antofagasta',
      descripcion: 'Festival de gaming con streamers y youtubers invitados',
      fecha: '2024-04-20',
      ubicacion: 'Parque Cultural',
      ciudad: 'Antofagasta',
      puntosLevelUp: 450,
      lat: -23.6509,
      lng: -70.3975,
    },
  ];

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const handleClaimPoints = (event: Event) => {
    // Aquí se conectaría con el backend para otorgar puntos
    alert(`¡Has reclamado ${event.puntosLevelUp} puntos LevelUp por asistir a ${event.nombre}!`);
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-4 text-[var(--neon-green)]">Eventos Gaming en Chile</h1>
          <p className="text-gray-400 text-lg">
            Participa en eventos y gana puntos LevelUp
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Mapa de Chile */}
          <div className="lg:col-span-2">
            <div className="bg-[#111] border border-[var(--neon-green)] rounded-lg p-6">
              <h2 className="text-2xl mb-6 text-[var(--neon-green)] flex items-center gap-2">
                <MapPin className="w-6 h-6" />
                Mapa de Eventos
              </h2>
              
              {/* Mapa de Chile con SVG detallado */}
              <div className="relative w-full h-[500px] bg-[#1a1a1a] rounded-lg overflow-hidden">
                {/* SVG de Chile con forma más realista */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 200 800"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Fondo */}
                  <rect width="200" height="800" fill="#0a0a0a" />
                  
                  {/* Forma de Chile más detallada - basada en coordenadas reales */}
                  <path
                    d="M 35 15 
                       L 38 25 L 42 45 L 46 70 L 50 100 L 52 130 L 54 160 
                       L 56 200 L 58 240 L 60 280 L 62 320 L 64 360 
                       L 66 400 L 68 440 L 70 480 L 72 520 L 74 560 
                       L 76 600 L 78 640 L 80 680 L 82 720 L 84 750 
                       L 85 770 L 84 780 L 82 775 L 80 765 L 78 750 
                       L 76 730 L 74 710 L 72 690 L 70 670 L 68 650 
                       L 66 630 L 64 610 L 62 590 L 60 570 L 58 550 
                       L 56 530 L 54 510 L 52 490 L 50 470 L 48 450 
                       L 46 430 L 44 410 L 42 390 L 40 370 L 38 350 
                       L 36 330 L 34 310 L 32 290 L 30 270 L 28 250 
                       L 26 230 L 24 210 L 22 190 L 20 170 L 18 150 
                       L 16 130 L 14 110 L 12 90 L 10 70 L 8 50 
                       L 6 30 L 4 20 Z"
                    fill="#1a1a1a"
                    stroke="var(--neon-green)"
                    strokeWidth="2.5"
                    opacity="0.4"
                  />
                  
                  {/* Líneas de costa este (Andes) */}
                  <path
                    d="M 85 770 L 84 750 L 83 720 L 82 680 L 81 640 L 80 600 L 79 560 L 78 520 L 77 480 L 76 440 L 75 400 L 74 360 L 73 320 L 72 280 L 71 240 L 70 200 L 69 160 L 68 120 L 67 80 L 66 50 L 65 30"
                    fill="none"
                    stroke="var(--neon-blue)"
                    strokeWidth="1.5"
                    opacity="0.3"
                  />
                  
                  {/* Líneas de costa oeste (Pacífico) */}
                  <path
                    d="M 35 15 L 36 20 L 37 30 L 38 45 L 39 65 L 40 85 L 41 105 L 42 125 L 43 145 L 44 165 L 45 185 L 46 205 L 47 225 L 48 245 L 49 265 L 50 285"
                    fill="none"
                    stroke="var(--neon-purple)"
                    strokeWidth="1.5"
                    opacity="0.3"
                  />
                  
                  {/* Regiones principales marcadas */}
                  <circle cx="50" cy="200" r="3" fill="var(--neon-green)" opacity="0.6" />
                  <circle cx="48" cy="250" r="3" fill="var(--neon-green)" opacity="0.6" />
                  <circle cx="52" cy="350" r="3" fill="var(--neon-green)" opacity="0.6" />
                  <circle cx="54" cy="450" r="3" fill="var(--neon-green)" opacity="0.6" />
                  <circle cx="42" cy="100" r="3" fill="var(--neon-green)" opacity="0.6" />
                </svg>
                
                {/* Marcadores de eventos posicionados absolutamente */}
                {eventos.map((event, index) => {
                  // Posiciones porcentuales basadas en coordenadas reales de Chile
                  // Calculadas desde las coordenadas lat/lng
                  const positions = [
                    { left: '48%', top: '38%' }, // Santiago (-33.4489, -70.6693)
                    { left: '45%', top: '35%' }, // Valparaíso (-33.0472, -71.6127)
                    { left: '50%', top: '52%' }, // Concepción (-36.8201, -73.0444)
                    { left: '52%', top: '58%' }, // Temuco (-38.7359, -72.5904)
                    { left: '38%', top: '18%' }, // Antofagasta (-23.6509, -70.3975)
                  ];
                  const pos = positions[index] || { left: '48%', top: '38%' };
                  
                  return (
                    <div
                      key={event.id}
                      className="absolute cursor-pointer group"
                      style={{ left: pos.left, top: pos.top, transform: 'translate(-50%, -50%)' }}
                      onClick={() => handleEventClick(event)}
                    >
                      {/* Marcador con pulso */}
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-[var(--neon-green)] animate-ping opacity-75"></div>
                        <div className="relative w-6 h-6 rounded-full bg-[var(--neon-green)] border-2 border-[var(--neon-purple)] shadow-lg shadow-[var(--neon-green)]/50 flex items-center justify-center group-hover:scale-125 transition-transform">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      </div>
                      
                      {/* Etiqueta con nombre de ciudad */}
                      {selectedEvent?.id === event.id && (
                        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                          <div className="bg-black/90 border border-[var(--neon-green)] rounded-lg px-3 py-1 text-xs text-[var(--neon-green)] font-bold shadow-lg">
                            {event.ciudad}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {/* Leyenda */}
                <div className="absolute bottom-4 left-4 bg-black/80 border border-[var(--neon-green)] rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-3 h-3 rounded-full bg-[var(--neon-green)]"></div>
                    <span>Evento disponible</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Haz clic en los marcadores para ver detalles
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de eventos */}
          <div className="lg:col-span-1">
            <div className="bg-[#111] border border-[var(--neon-green)] rounded-lg p-6 sticky top-24">
              <h2 className="text-2xl mb-6 text-[var(--neon-green)] flex items-center gap-2">
                <Calendar className="w-6 h-6" />
                Próximos Eventos
              </h2>
              
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {eventos.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className={`bg-[#1a1a1a] border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedEvent?.id === event.id
                        ? 'border-[var(--neon-green)] shadow-lg shadow-[var(--neon-green)]/20'
                        : 'border-gray-800 hover:border-[var(--neon-green)]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-semibold text-sm">{event.nombre}</h3>
                      <Badge className="bg-[var(--neon-purple)] text-white border-0">
                        <Award className="w-3 h-3 mr-1" />
                        {event.puntosLevelUp} pts
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{event.ciudad}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(event.fecha).toLocaleDateString('es-CL')}</span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{event.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detalle del evento seleccionado */}
        {selectedEvent && (
          <div className="mt-8 bg-[#111] border border-[var(--neon-green)] rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl mb-4 text-[var(--neon-green)]">{selectedEvent.nombre}</h2>
                <p className="text-gray-300 mb-6">{selectedEvent.descripcion}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[var(--neon-green)]" />
                    <div>
                      <p className="text-gray-400 text-sm">Fecha</p>
                      <p className="text-white">
                        {new Date(selectedEvent.fecha).toLocaleDateString('es-CL', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[var(--neon-green)]" />
                    <div>
                      <p className="text-gray-400 text-sm">Ubicación</p>
                      <p className="text-white">{selectedEvent.ubicacion}</p>
                      <p className="text-gray-500 text-sm">{selectedEvent.ciudad}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-[var(--neon-green)]" />
                    <div>
                      <p className="text-gray-400 text-sm">Puntos LevelUp</p>
                      <p className="text-white font-bold text-xl">{selectedEvent.puntosLevelUp} puntos</p>
                      <p className="text-gray-500 text-xs">Por asistir a este evento</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-center">
                <div className="bg-gradient-to-br from-[var(--neon-green)]/20 to-[var(--neon-purple)]/20 border border-[var(--neon-green)] rounded-lg p-6 mb-6">
                  <h3 className="text-xl mb-4 text-[var(--neon-green)]">¿Cómo ganar puntos?</h3>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--neon-green)]">✓</span>
                      <span>Asiste al evento y regístrate en el stand de Level-Up Gamer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--neon-green)]">✓</span>
                      <span>Muestra tu código de usuario o correo registrado</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--neon-green)]">✓</span>
                      <span>Los puntos se acreditarán automáticamente a tu cuenta</span>
                    </li>
                  </ul>
                </div>
                
                <Button
                  onClick={() => handleClaimPoints(selectedEvent)}
                  className="w-full bg-[var(--neon-green)] text-black hover:bg-[var(--neon-purple)] hover:text-white"
                >
                  <Award className="w-5 h-5 mr-2" />
                  Reclamar Puntos (Simulado)
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
