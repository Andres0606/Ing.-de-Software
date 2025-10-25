import React, { useEffect, useState } from 'react';
import { Search, MapPin, Mail, Globe, Star, Filter, X } from 'lucide-react';
import Header from '../Header.jsx';
import Footer from '../Footer.jsx';
import '../../CSS/Inicio/Emprendedores.css';
import { apiClient } from '../../api/client.js'; // ❌ ANTES: { api }
                                                  // ✅ AHORA: { apiClient }

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

  const [emprendedores, setEmprendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    apiClient.get('/emprendedores') // ❌ ANTES: api('/api/emprendedores')
                                     // ✅ AHORA: apiClient.get('/emprendedores')
                                     // Nota: /api/ ya está en VITE_API_URL
      .then((res) => {
        if (!mounted) return;
        const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        // Mapear mínimos esperados por la UI
        const mapped = data.map((e) => ({
          id: e.id,
          nombre: e.usuario_nombre || `Emprendedor #${e.id}`,
          categoria: e.categoria || 'otros',
          descripcion: e.descripcion || '',
          ubicacion: e.ubicacion || 'Villavicencio, Meta',
          email: e.usuario_email || 'n/a',
          web: 'red-social',
          calificacion: Number(e.calificacion || 0),
          imagen: e.imagen || '🧑‍💼',
        }));
        setEmprendedores(mapped);
        setError('');
      })
      .catch((err) => setError(err.message || 'Error cargando emprendedores'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const filteredEmprendedores = emprendedores.filter((emp) => {
    const matchesSearch =
      emp.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.ubicacion.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'todos' || emp.categoria === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="emprendedores-container">
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <main className="emprendedores-main">
          <div className="emprendedores-search-section">
            <h1 className="emprendedores-title">Cargando emprendedores...</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
            {error ? (
              <div className="emprendedores-empty"><p>{error}</p></div>
            ) : filteredEmprendedores.length > 0 ? (
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