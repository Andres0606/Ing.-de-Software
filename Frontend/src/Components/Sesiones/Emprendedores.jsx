import React, { useState } from 'react';
import { Search, MapPin, Mail, Globe, Star, Filter, X } from 'lucide-react';
import Header from '../Header';
import Footer from '../Footer';
import '../../CSS/Sesiones/Emprendedores.css';

export default function Emprendedores() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'tecnologia', label: 'Tecnología' },
    { id: 'salud', label: 'Salud' },
    { id: 'educacion', label: 'Educación' },
    { id: 'comercio', label: 'Comercio' },
    { id: 'servicios', label: 'Servicios' },
  ];

  const emprendedores = [
    {
      id: 1,
      nombre: 'María González',
      categoria: 'tecnologia',
      descripcion: 'Desarrolladora de apps móviles innovadoras',
      ubicacion: 'Villavicencio, Meta',
      email: 'maria@example.com',
      web: 'Red social',
      calificacion: 4.8,
      imagen: '👩‍💻',
    },
    {
      id: 2,
      nombre: 'Carlos Rodríguez',
      categoria: 'salud',
      descripcion: 'Especialista en nutrición deportiva',
      ubicacion: 'Villavicencio, Meta',
      email: 'carlos@example.com',
      web: 'Red social',
      calificacion: 4.9,
      imagen: '🏋️',
    },
    {
      id: 3,
      nombre: 'Ana Martínez',
      categoria: 'educacion',
      descripcion: 'Plataforma de educación online interactiva',
      ubicacion: 'Villavicencio, Meta',
      email: 'ana@example.com',
      web: 'Red social',
      calificacion: 4.7,
      imagen: '👩‍🏫',
    },
    {
      id: 4,
      nombre: 'Juan Pérez',
      categoria: 'comercio',
      descripcion: 'E-commerce de productos artesanales',
      ubicacion: 'Villavicencio, Meta',
      email: 'juan@example.com',
      web: 'Red social',
      calificacion: 4.6,
      imagen: '🛍️',
    },
    {
      id: 5,
      nombre: 'Sofia López',
      categoria: 'servicios',
      descripcion: 'Consultoría empresarial y marketing digital',
      ubicacion: 'Villavicencio, Meta',
      email: 'sofia@example.com',
      web: 'Red social',
      calificacion: 4.9,
      imagen: '💼',
    },
    {
      id: 6,
      nombre: 'Diego Ramírez',
      categoria: 'tecnologia',
      descripcion: 'Soluciones de ciberseguridad empresarial',
      ubicacion: 'Villavicencio, Meta',
      email: 'diego@example.com',
      web: 'Red social',
      calificacion: 4.8,
      imagen: '🔐',
    },
  ];

  const filteredEmprendedores = emprendedores.filter((emp) => {
    const matchesSearch =
      emp.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.ubicacion.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'todos' || emp.categoria === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="emprendedores-container">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <main className="emprendedores-main">
        {/* Sección de búsqueda y filtros */}
        <div className="emprendedores-search-section">
          <h1 className="emprendedores-title">Descubre Emprendedores</h1>
          <p className="emprendedores-subtitle">Conecta con los mejores emprendedores de la comunidad UCC</p>

          {/* Buscador */}
          <div className="emprendedores-search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Busca por nombre, categoría o ubicación..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="emprendedores-search-input"
            />
          </div>

          {/* Botón de filtros móvil */}
          <button
            className="emprendedores-filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            <span>Filtros</span>
          </button>
        </div>

        <div className="emprendedores-content">
          {/* Categorías */}
          <aside className={`emprendedores-categories ${showFilters ? 'active' : ''}`}>
            <div className="emprendedores-categories-header">
              <h3>Categorías</h3>
              <button
                className="emprendedores-close-filters"
                onClick={() => setShowFilters(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="emprendedores-category-list">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`emprendedores-category-btn ${
                    selectedCategory === cat.id ? 'active' : ''
                  }`}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setShowFilters(false);
                  }}
                >
                  {cat.label}
                  <span className="emprendedores-category-count">
                    {emprendedores.filter((e) => e.categoria === cat.id || cat.id === 'todos').length}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          {/* Grid de emprendedores */}
          <section className="emprendedores-grid">
            {filteredEmprendedores.length > 0 ? (
              filteredEmprendedores.map((emp) => (
                <div key={emp.id} className="emprendedor-card">
                  <div className="emprendedor-header">
                    <div className="emprendedor-avatar">{emp.imagen}</div>
                    <div className="emprendedor-rating">
                      <Star size={16} />
                      <span>{emp.calificacion}</span>
                    </div>
                  </div>

                  <div className="emprendedor-content">
                    <h3 className="emprendedor-nombre">{emp.nombre}</h3>
                    <p className="emprendedor-descripcion">{emp.descripcion}</p>

                    <div className="emprendedor-info">
                      <div className="emprendedor-info-item">
                        <MapPin size={16} />
                        <span>{emp.ubicacion}</span>
                      </div>
                      <div className="emprendedor-info-item">
                        <Mail size={16} />
                        <span>{emp.email}</span>
                      </div>
                      <div className="emprendedor-info-item">
                        <Globe size={16} />
                        <a href={`https://${emp.web}`} target="_blank" rel="noopener noreferrer">
                          {emp.web}
                        </a>
                      </div>
                    </div>

                    <div className="emprendedor-actions">
                      <button className="emprendedor-btn-primary">Ver Perfil</button>
                      <button className="emprendedor-btn-secondary">Contactar</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="emprendedores-empty">
                <p>No se encontraron emprendedores que coincidan con tu búsqueda</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('todos');
                  }}
                  className="emprendedores-reset-btn"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}