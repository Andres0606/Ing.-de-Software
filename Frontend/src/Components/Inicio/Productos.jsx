import React, { useState } from 'react';
import { Search, ShoppingCart, Heart, Star, Filter, X } from 'lucide-react';
import Footer from '../Footer.jsx';
import Header from '../Header.jsx';
import '../../CSS/Inicio/Productos.css';

export default function Productos() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState({});

  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'artesania', label: 'Artesanía' },
    { id: 'alimentos', label: 'Alimentos' },
    { id: 'moda', label: 'Moda' },
    { id: 'hogar', label: 'Hogar' },
    { id: 'servicios', label: 'Servicios' },
  ];

  const productos = [
    {
      id: 1,
      nombre: 'Bolsos Tejidos Artesanales',
      categoria: 'artesania',
      descripcion: 'Bolsos únicos tejidos a mano con técnicas tradicionales',
      precio: '$85.000',
      emprendedor: 'María González',
      calificacion: 4.8,
      imagen: '👜',
      vendidos: 42,
    },
    {
      id: 2,
      nombre: 'Café Gourmet Villavicencio',
      categoria: 'alimentos',
      descripcion: 'Café de alta calidad tostado artesanalmente',
      precio: '$35.000',
      emprendedor: 'Carlos Rodríguez',
      calificacion: 4.9,
      imagen: '☕',
      vendidos: 128,
    },
    {
      id: 3,
      nombre: 'Ropa Ecológica Sostenible',
      categoria: 'moda',
      descripcion: 'Prendas de algodón orgánico y teñidas naturalmente',
      precio: '$65.000',
      emprendedor: 'Ana Martínez',
      calificacion: 4.7,
      imagen: '👕',
      vendidos: 67,
    },
    {
      id: 4,
      nombre: 'Cerámica Hecha a Mano',
      categoria: 'artesania',
      descripcion: 'Piezas de cerámica únicas y funcionales',
      precio: '$120.000',
      emprendedor: 'Juan Pérez',
      calificacion: 4.6,
      imagen: '🍶',
      vendidos: 31,
    },
    {
      id: 5,
      nombre: 'Mermeladas y Conservas Caseras',
      categoria: 'alimentos',
      descripcion: 'Mermeladas artesanales sin conservantes químicos',
      precio: '$28.000',
      emprendedor: 'Sofia López',
      calificacion: 4.9,
      imagen: '🍓',
      vendidos: 156,
    },
    {
      id: 6,
      nombre: 'Joyería de Plata Artesanal',
      categoria: 'artesania',
      descripcion: 'Collares, pulseras y anillos de plata 925',
      precio: '$150.000',
      emprendedor: 'Diego Ramírez',
      calificacion: 4.8,
      imagen: '💍',
      vendidos: 48,
    },
    {
      id: 7,
      nombre: 'Velas Aromáticas Naturales',
      categoria: 'hogar',
      descripcion: 'Velas de soja con aceites esenciales puros',
      precio: '$45.000',
      emprendedor: 'María González',
      calificacion: 4.7,
      imagen: '🕯️',
      vendidos: 89,
    },
    {
      id: 8,
      nombre: 'Honey & Bee Products',
      categoria: 'alimentos',
      descripcion: 'Miel pura 100% natural y productos apícolas',
      precio: '$42.000',
      emprendedor: 'Carlos Rodríguez',
      calificacion: 4.8,
      imagen: '🍯',
      vendidos: 95,
    },
    {
      id: 9,
      nombre: 'Tapetes Tejidos Tradicionales',
      categoria: 'hogar',
      descripcion: 'Tapetes tejidos con lanas naturales',
      precio: '$180.000',
      emprendedor: 'Ana Martínez',
      calificacion: 4.9,
      imagen: '🧶',
      vendidos: 23,
    },
    {
      id: 10,
      nombre: 'Especias y Condimentos Caseros',
      categoria: 'alimentos',
      descripcion: 'Mezclas de especias frescas molidas a la medida',
      precio: '$18.000',
      emprendedor: 'Juan Pérez',
      calificacion: 4.7,
      imagen: '🌶️',
      vendidos: 112,
    },
    {
      id: 11,
      nombre: 'Bolsas Eco-friendly de Tela',
      categoria: 'moda',
      descripcion: 'Bolsas reutilizables impresas a mano',
      precio: '$22.000',
      emprendedor: 'Sofia López',
      calificacion: 4.6,
      imagen: '🛍️',
      vendidos: 203,
    },
    {
      id: 12,
      nombre: 'Cuadros de Arte Tejido',
      categoria: 'artesania',
      descripcion: 'Tapestries artísticas hechas en telar de madera',
      precio: '$210.000',
      emprendedor: 'Diego Ramírez',
      calificacion: 4.8,
      imagen: '🎨',
      vendidos: 18,
    },
  ];

  const filteredProductos = productos.filter((prod) => {
    const matchesSearch =
      prod.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.emprendedor.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'todos' || prod.categoria === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (id) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="productos-container">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <main className="productos-main">
        {/* Sección de búsqueda y filtros */}
        <div className="productos-search-section">
          <h1 className="productos-title">Marketplace de Productos</h1>
          <p className="productos-subtitle">Descubre productos artesanales y alimentos de emprendedores UCC</p>

          {/* Buscador */}
          <div className="productos-search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Busca productos, emprendedores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="productos-search-input"
            />
          </div>

          {/* Botón de filtros móvil */}
          <button
            className="productos-filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            <span>Filtros</span>
          </button>
        </div>

        <div className="productos-content">
          {/* Categorías */}
          <aside className={`productos-categories ${showFilters ? 'active' : ''}`}>
            <div className="productos-categories-header">
              <h3>Categorías</h3>
              <button
                className="productos-close-filters"
                onClick={() => setShowFilters(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="productos-category-list">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`productos-category-btn ${
                    selectedCategory === cat.id ? 'active' : ''
                  }`}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setShowFilters(false);
                  }}
                >
                  {cat.label}
                  <span className="productos-category-count">
                    {productos.filter((p) => p.categoria === cat.id || cat.id === 'todos').length}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          {/* Grid de productos */}
          <section className="productos-grid">
            {filteredProductos.length > 0 ? (
              filteredProductos.map((prod) => (
                <div key={prod.id} className="producto-card">
                  <div className="producto-header">
                    <div className="producto-avatar">{prod.imagen}</div>
                    <button
                      className={`producto-favorite-btn ${favorites[prod.id] ? 'active' : ''}`}
                      onClick={() => toggleFavorite(prod.id)}
                    >
                      <Heart size={20} />
                    </button>
                  </div>

                  <div className="producto-content">
                    <h3 className="producto-nombre">{prod.nombre}</h3>
                    <p className="producto-descripcion">{prod.descripcion}</p>

                    <div className="producto-info">
                      <div className="producto-rating">
                        <Star size={16} />
                        <span>{prod.calificacion}</span>
                        <span className="producto-vendidos">({prod.vendidos} vendidos)</span>
                      </div>
                      <p className="producto-emprendedor">Por: {prod.emprendedor}</p>
                    </div>

                    <div className="producto-footer">
                      <span className="producto-precio">{prod.precio}</span>
                      <button className="producto-btn-comprar">
                        <ShoppingCart size={18} />
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="productos-empty">
                <p>No se encontraron productos que coincidan con tu búsqueda</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('todos');
                  }}
                  className="productos-reset-btn"
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