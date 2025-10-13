import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, Search, Filter, ChevronRight, X } from 'lucide-react';
import Header from '../Header';
import Footer from '../Footer';
import '../../CSS/Sesiones/Eventos.css';

export default function EventosUCC() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const eventos = [
    {
      id: 1,
      titulo: "Feria de Emprendimiento UCC 2025",
      fecha: "15 de Noviembre, 2025",
      hora: "9:00 AM - 5:00 PM",
      lugar: "Campus Principal UCC",
      categoria: "feria",
      asistentes: 250,
      imagen: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      descripcion: "Gran feria anual donde emprendedores presentan sus productos y servicios innovadores. Incluye stands, demostraciones en vivo y networking.",
      destacado: true
    },
    {
      id: 2,
      titulo: "Taller: Marketing Digital para Emprendedores",
      fecha: "22 de Noviembre, 2025",
      hora: "2:00 PM - 5:00 PM",
      lugar: "Auditorio Central",
      categoria: "taller",
      asistentes: 50,
      imagen: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
      descripcion: "Aprende estrategias efectivas de marketing digital, redes sociales y branding para impulsar tu emprendimiento.",
      destacado: false
    },
    {
      id: 3,
      titulo: "Networking: Conecta con Inversores",
      fecha: "28 de Noviembre, 2025",
      hora: "6:00 PM - 9:00 PM",
      lugar: "Centro de Innovación",
      categoria: "networking",
      asistentes: 80,
      imagen: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
      descripcion: "Evento exclusivo para conectar emprendedores con potenciales inversores y mentores del ecosistema empresarial.",
      destacado: true
    },
    {
      id: 4,
      titulo: "Conferencia: Innovación y Tecnología",
      fecha: "5 de Diciembre, 2025",
      hora: "10:00 AM - 12:00 PM",
      lugar: "Sala de Conferencias 3",
      categoria: "conferencia",
      asistentes: 120,
      imagen: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
      descripcion: "Expertos en tecnología compartirán las últimas tendencias en innovación y transformación digital para emprendimientos.",
      destacado: false
    },
    {
      id: 5,
      titulo: "Taller: Finanzas para tu Startup",
      fecha: "12 de Diciembre, 2025",
      hora: "3:00 PM - 6:00 PM",
      lugar: "Sala de Capacitación 2",
      categoria: "taller",
      asistentes: 40,
      imagen: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
      descripcion: "Gestión financiera, presupuestos, y estrategias de financiamiento para hacer crecer tu emprendimiento de manera sostenible.",
      destacado: false
    },
    {
      id: 6,
      titulo: "Pitch Competition 2025",
      fecha: "18 de Diciembre, 2025",
      hora: "4:00 PM - 8:00 PM",
      lugar: "Auditorio Principal",
      categoria: "competencia",
      asistentes: 200,
      imagen: "https://images.unsplash.com/photo-1559223607-a43c990c2485?w=800&q=80",
      descripcion: "Competencia de pitch donde emprendedores presentan sus ideas ante un panel de jueces. Premios en efectivo y mentoría.",
      destacado: true
    }
  ];

  const categorias = [
    { id: "todos", nombre: "Todos" },
    { id: "feria", nombre: "Ferias" },
    { id: "taller", nombre: "Talleres" },
    { id: "networking", nombre: "Networking" },
    { id: "conferencia", nombre: "Conferencias" },
    { id: "competencia", nombre: "Competencias" }
  ];

  const eventosFiltrados = eventos.filter(evento => {
    const coincideBusqueda = evento.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            evento.descripcion.toLowerCase().includes(searchQuery.toLowerCase());
    const coincideCategoria = selectedCategory === "todos" || evento.categoria === selectedCategory;
    return coincideBusqueda && coincideCategoria;
  });

  const getCategoriaClass = (categoria) => {
    const clases = {
      feria: "categoria-feria",
      taller: "categoria-taller",
      networking: "categoria-networking",
      conferencia: "categoria-conferencia",
      competencia: "categoria-competencia"
    };
    return clases[categoria] || "categoria-default";
  };

  return (
    <div className="eventos-container">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      {/* Hero Header */}
      <div className="eventos-header">
          <div className="eventos-header-decoracion"></div>
          
          <div className="eventos-header-content">
            <h1 className="eventos-header-title">Eventos UCC</h1>
            <p className="eventos-header-text">
              Participa en ferias, talleres y actividades de networking exclusivas
            </p>
          </div>
        </div>

      <div className="eventos-main">
        {/* Búsqueda y Filtros */}
        <div className="eventos-filtros-card">
          <div className="eventos-filtros-content">
            {/* Buscador */}
            <div className="eventos-search-wrapper">
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="eventos-search-input"
              />
              <Search className="eventos-search-icon" size={20} />
            </div>

            {/* Categorías */}
            <div className="eventos-categorias">
              <Filter size={18} className="eventos-filter-icon" />
              {categorias.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`eventos-categoria-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid de Eventos */}
        <div className="eventos-grid">
          {eventosFiltrados.map(evento => (
            <div
              key={evento.id}
              onClick={() => setSelectedEvent(evento)}
              className={`evento-card ${evento.destacado ? 'destacado' : ''}`}
            >
              {evento.destacado && (
                <div className="evento-badge-destacado">
                  DESTACADO
                </div>
              )}
              
              <div 
                className="evento-imagen"
                style={{ backgroundImage: `url(${evento.imagen})` }}
              ></div>
              
              <div className="evento-content">
                <div className="evento-categoria-wrapper">
                  <span className={`evento-categoria-badge ${getCategoriaClass(evento.categoria)}`}>
                    {categorias.find(c => c.id === evento.categoria)?.nombre}
                  </span>
                </div>

                <h3 className="evento-titulo">{evento.titulo}</h3>

                <div className="evento-info">
                  <div className="evento-info-item">
                    <Calendar size={16} />
                    <span>{evento.fecha}</span>
                  </div>
                  <div className="evento-info-item">
                    <Clock size={16} />
                    <span>{evento.hora}</span>
                  </div>
                  <div className="evento-info-item">
                    <MapPin size={16} />
                    <span>{evento.lugar}</span>
                  </div>
                  <div className="evento-info-item">
                    <Users size={16} />
                    <span>{evento.asistentes} asistentes</span>
                  </div>
                </div>

                <button className="evento-btn-detalles">
                  Ver Detalles
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {eventosFiltrados.length === 0 && (
          <div className="eventos-sin-resultados">
            <Calendar size={48} className="eventos-sin-resultados-icon" />
            <p className="eventos-sin-resultados-title">
              No se encontraron eventos
            </p>
            <p className="eventos-sin-resultados-text">
              Intenta con otros términos de búsqueda o filtros
            </p>
          </div>
        )}
      </div>

      {/* Modal de Detalles */}
      {selectedEvent && (
        <div 
          onClick={() => setSelectedEvent(null)}
          className="evento-modal-overlay"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="evento-modal-content"
          >
            <button
              onClick={() => setSelectedEvent(null)}
              className="evento-modal-close"
            >
              <X size={20} />
            </button>

            <div 
              className="evento-modal-imagen"
              style={{ backgroundImage: `url(${selectedEvent.imagen})` }}
            ></div>

            <div className="evento-modal-body">
              <div className="evento-modal-categoria-wrapper">
                <span className="evento-modal-categoria">
                  {categorias.find(c => c.id === selectedEvent.categoria)?.nombre}
                </span>
              </div>

              <h2 className="evento-modal-titulo">
                {selectedEvent.titulo}
              </h2>

              <p className="evento-modal-descripcion">
                {selectedEvent.descripcion}
              </p>

              <div className="evento-modal-info-grid">
                <div>
                  <div className="evento-modal-info-label">
                    <Calendar size={16} />
                    <span>Fecha</span>
                  </div>
                  <p className="evento-modal-info-value">{selectedEvent.fecha}</p>
                </div>

                <div>
                  <div className="evento-modal-info-label">
                    <Clock size={16} />
                    <span>Hora</span>
                  </div>
                  <p className="evento-modal-info-value">{selectedEvent.hora}</p>
                </div>

                <div>
                  <div className="evento-modal-info-label">
                    <MapPin size={16} />
                    <span>Lugar</span>
                  </div>
                  <p className="evento-modal-info-value">{selectedEvent.lugar}</p>
                </div>

                <div>
                  <div className="evento-modal-info-label">
                    <Users size={16} />
                    <span>Asistentes</span>
                  </div>
                  <p className="evento-modal-info-value">{selectedEvent.asistentes}</p>
                </div>
              </div>

              <button className="evento-modal-btn-registro">
                Registrarse al Evento
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}