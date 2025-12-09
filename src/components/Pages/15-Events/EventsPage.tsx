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
          {/* Detalles del Evento Seleccionado */}
          <div className="lg:col-span-2">
            {selectedEvent ? (
              <div className="bg-[#111] border border-[var(--neon-green)] rounded-lg p-6 max-h-[600px] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl text-[var(--neon-green)] flex items-center gap-2">
                    <Award className="w-6 h-6" />
                    {selectedEvent.nombre}
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedEvent(null)}
                    className="border-[var(--neon-green)] text-[var(--neon-green)] hover:bg-[var(--neon-green)] hover:text-black"
                  >
                    Limpiar Selección
                  </Button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl mb-3 text-[var(--neon-green)]">Descripción del Evento</h3>
                    <p className="text-gray-300 leading-relaxed">{selectedEvent.descripcion}</p>
                    {selectedEvent.id === 1 && (
                      <p className="text-gray-400 mt-3 text-sm">
                        El torneo más importante del año reúne a los mejores equipos de esports de todo Chile. 
                        Competencias en múltiples categorías con premios en efectivo superiores a $10.000.000. 
                        El evento contará con transmisión en vivo, comentaristas profesionales, y la presencia 
                        de equipos internacionales invitados.
                      </p>
                    )}
                    {selectedEvent.id === 2 && (
                      <p className="text-gray-400 mt-3 text-sm">
                        La feria más grande de productos gaming de la región. Descubre las últimas tecnologías, 
                        periféricos, y hardware gaming. Demostraciones en vivo de las nuevas consolas, 
                        oportunidades de probar juegos antes de su lanzamiento, y descuentos exclusivos 
                        para asistentes del evento.
                      </p>
                    )}
                    {selectedEvent.id === 3 && (
                      <p className="text-gray-400 mt-3 text-sm">
                        Sé uno de los primeros en probar la PlayStation 6 antes de su lanzamiento oficial. 
                        Evento exclusivo con sesiones de juego guiadas, presentaciones de nuevas funciones, 
                        y la oportunidad de conocer a desarrolladores de juegos. Cupos limitados.
                      </p>
                    )}
                    {selectedEvent.id === 4 && (
                      <p className="text-gray-400 mt-3 text-sm">
                        Este torneo regional reúne a los mejores jugadores de la zona sur de Chile. 
                        Los participantes competirán en múltiples categorías de videojuegos, incluyendo 
                        League of Legends, Counter-Strike 2, y Valorant. El evento contará con transmisión 
                        en vivo, stands de patrocinadores, y la oportunidad de conocer a streamers profesionales.
                      </p>
                    )}
                    {selectedEvent.id === 5 && (
                      <p className="text-gray-400 mt-3 text-sm">
                        Festival de gaming con la presencia de los streamers y youtubers más populares de Chile. 
                        Meet & greet, firmas de autógrafos, competencias de cosplay, y torneos abiertos. 
                        Zona de food trucks, música en vivo, y actividades para toda la familia.
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-[var(--neon-green)]" />
                        <h4 className="text-white font-semibold">Fecha y Hora</h4>
                      </div>
                      <p className="text-gray-300">
                        {new Date(selectedEvent.fecha).toLocaleDateString('es-CL', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">10:00 AM - 8:00 PM</p>
                    </div>
                    
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <MapPin className="w-5 h-5 text-[var(--neon-green)]" />
                        <h4 className="text-white font-semibold">Ubicación</h4>
                      </div>
                      <p className="text-gray-300">{selectedEvent.ubicacion}</p>
                      <p className="text-gray-400 text-sm mt-1">{selectedEvent.ciudad}</p>
                    </div>
                    
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Award className="w-5 h-5 text-[var(--neon-green)]" />
                        <h4 className="text-white font-semibold">Puntos LevelUp</h4>
                      </div>
                      <p className="text-2xl font-bold text-[var(--neon-green)]">{selectedEvent.puntosLevelUp} puntos</p>
                      <p className="text-gray-400 text-sm mt-1">Por asistir y participar</p>
                    </div>
                    
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-[var(--neon-green)]" />
                        <h4 className="text-white font-semibold">Categorías</h4>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedEvent.id === 1 && (
                          <>
                            <Badge className="bg-[var(--neon-purple)] text-white">League of Legends</Badge>
                            <Badge className="bg-[var(--neon-purple)] text-white">CS2</Badge>
                            <Badge className="bg-[var(--neon-purple)] text-white">Valorant</Badge>
                            <Badge className="bg-[var(--neon-purple)] text-white">Rocket League</Badge>
                          </>
                        )}
                        {selectedEvent.id === 2 && (
                          <>
                            <Badge className="bg-[var(--neon-purple)] text-white">Exposición</Badge>
                            <Badge className="bg-[var(--neon-purple)] text-white">Demostraciones</Badge>
                            <Badge className="bg-[var(--neon-purple)] text-white">Descuentos</Badge>
                          </>
                        )}
                        {selectedEvent.id === 3 && (
                          <>
                            <Badge className="bg-[var(--neon-purple)] text-white">PlayStation 6</Badge>
                            <Badge className="bg-[var(--neon-purple)] text-white">Exclusivo</Badge>
                            <Badge className="bg-[var(--neon-purple)] text-white">Lanzamiento</Badge>
                          </>
                        )}
                        {selectedEvent.id === 4 && (
                          <>
                            <Badge className="bg-[var(--neon-purple)] text-white">League of Legends</Badge>
                            <Badge className="bg-[var(--neon-purple)] text-white">CS2</Badge>
                            <Badge className="bg-[var(--neon-purple)] text-white">Valorant</Badge>
                          </>
                        )}
                        {selectedEvent.id === 5 && (
                          <>
                            <Badge className="bg-[var(--neon-purple)] text-white">Streamers</Badge>
                            <Badge className="bg-[var(--neon-purple)] text-white">Cosplay</Badge>
                            <Badge className="bg-[var(--neon-purple)] text-white">Torneos</Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[var(--neon-green)]/20 to-[var(--neon-purple)]/20 border border-[var(--neon-green)] rounded-lg p-6">
                    <h3 className="text-xl mb-4 text-[var(--neon-green)]">Información Adicional</h3>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--neon-green)] mt-1">•</span>
                        <span>Inscripción gratuita en el lugar del evento</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--neon-green)] mt-1">•</span>
                        <span>Premios en efectivo para los primeros lugares</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--neon-green)] mt-1">•</span>
                        <span>Transmisión en vivo en Twitch y YouTube</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[var(--neon-green)] mt-1">•</span>
                        <span>Zona de food trucks y stands de productos gaming</span>
                      </li>
                    </ul>
                  </div>
                  
                  <Button
                    onClick={() => handleClaimPoints(selectedEvent)}
                    className="w-full bg-[var(--neon-green)] text-black hover:bg-[var(--neon-purple)] hover:text-white text-lg py-6"
                  >
                    <Award className="w-5 h-5 mr-2" />
                    Reclamar Puntos por Asistencia
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-[#111] border border-[var(--neon-green)] rounded-lg p-6 h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-[var(--neon-green)] mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl text-gray-400 mb-2">Selecciona un evento</h3>
                  <p className="text-gray-500 text-sm">
                    Haz clic en cualquier evento de la lista para ver sus detalles
                  </p>
                </div>
              </div>
            )}
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

      </div>
    </div>
  );
};
