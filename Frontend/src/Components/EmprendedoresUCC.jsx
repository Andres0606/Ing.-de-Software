import React, { useState } from 'react';
import { Menu, X, Home, Users, ShoppingBag, Calendar, Mail, Search, Plus, LogOut, User } from 'lucide-react';
import '../CSS/EmprendedoresUCC.css';

export default function EmprenderUCC() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { icon: Home, label: 'Inicio', href: '#' },
    { icon: Users, label: 'Emprendedores', href: '#' },
    { icon: ShoppingBag, label: 'Productos', href: '#' },
    { icon: Calendar, label: 'Eventos', href: '#' },
    { icon: Mail, label: 'Contacto', href: '#' },
  ];

  return (
    <div className="emprende-container">
      {/* Header Fijo */}
      <header className="emprende-header">
        <div className="emprende-header-content">
          <div className="emprende-header-top">
            {/* Logo + Nombre */}
            <div className="emprende-logo-section">
              <div className="emprende-logo">
                <span>U</span>
              </div>
              <span className="emprende-logo-text">
                Emprende UCC
              </span>
            </div>

            {/* Buscador - Desktop */}
            <div className="emprende-search-desktop">
              <div className="emprende-search-wrapper">
                <input
                  type="text"
                  placeholder="Buscar emprendedores, productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="emprende-search-input"
                />
                <Search className="emprende-search-icon" size={18} />
              </div>
            </div>

            {/* Navegación - Desktop */}
            <nav className="emprende-nav-desktop">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="emprende-nav-link"
                >
                  <link.icon size={18} />
                  <span>{link.label}</span>
                </a>
              ))}
            </nav>

            {/* Botones de Acción - Desktop */}
            <div className="emprende-actions-desktop">
              {isLoggedIn ? (
                <>
                  <button className="emprende-btn-publish">
                    <Plus size={18} />
                    <span>Publicar</span>
                  </button>
                  <button className="emprende-btn-profile">
                    <User size={18} />
                  </button>
                  <button
                    onClick={() => setIsLoggedIn(false)}
                    className="emprende-btn-logout"
                  >
                    <LogOut size={18} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsLoggedIn(true)}
                    className="emprende-btn-login"
                  >
                    Iniciar Sesión
                  </button>
                  <button className="emprende-btn-register">
                    Registrarse
                  </button>
                </>
              )}
            </div>

            {/* Botón Menú Móvil */}
            <button
              onClick={toggleMenu}
              className="emprende-menu-toggle"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Menú Móvil */}
          {isMenuOpen && (
            <div className="emprende-menu-mobile">
              {/* Buscador Móvil */}
              <div className="emprende-search-mobile">
                <div className="emprende-search-wrapper">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="emprende-search-input"
                  />
                  <Search className="emprende-search-icon" size={18} />
                </div>
              </div>

              {/* Enlaces Móvil */}
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="emprende-nav-link-mobile"
                >
                  <link.icon size={20} />
                  <span>{link.label}</span>
                </a>
              ))}

              {/* Botones Móvil */}
              <div className="emprende-actions-mobile">
                {isLoggedIn ? (
                  <>
                    <button className="emprende-btn-publish-mobile">
                      <Plus size={18} />
                      Publicar
                    </button>
                    <button className="emprende-btn-profile-mobile">
                      <User size={18} />
                      Mi Perfil
                    </button>
                    <button
                      onClick={() => setIsLoggedIn(false)}
                      className="emprende-btn-logout-mobile"
                    >
                      <LogOut size={18} />
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsLoggedIn(true)}
                      className="emprende-btn-login-mobile"
                    >
                      Iniciar Sesión
                    </button>
                    <button className="emprende-btn-register-mobile">
                      Registrarse
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="emprende-main">
        {/* Hero Section */}
        <div className="emprende-hero">
          <h1 className="emprende-hero-title">
            Bienvenido a Emprende UCC
          </h1>
          <p className="emprende-hero-text">
            Conecta con emprendedores, descubre productos innovadores y sé parte de una comunidad de innovadores de la Universidad Cooperativa de Colombia.
          </p>
          {!isLoggedIn ? (
            <button className="emprende-btn-hero-primary">
              Comienza Ahora
            </button>
          ) : (
            <button className="emprende-btn-hero-secondary">
              Explorar Proyectos
            </button>
          )}
        </div>

        {/* Sección de Contenido */}
        <div className="emprende-cards-section">
          <div className="emprende-card">
            <Users size={32} className="emprende-card-icon icon-green" />
            <h3 className="emprende-card-title">Emprendedores</h3>
            <p className="emprende-card-text">Descubre y conecta con emprendedores innovadores de la comunidad UCC.</p>
          </div>
          <div className="emprende-card">
            <ShoppingBag size={32} className="emprende-card-icon icon-blue" />
            <h3 className="emprende-card-title">Productos</h3>
            <p className="emprende-card-text">Explora una variedad de productos y servicios creados por nuestros emprendedores.</p>
          </div>
          <div className="emprende-card">
            <Calendar size={32} className="emprende-card-icon icon-purple" />
            <h3 className="emprende-card-title">Eventos</h3>
            <p className="emprende-card-text">Participa en ferias, talleres y actividades de networking exclusivas.</p>
          </div>
        </div>
      </main>
    </div>
  );
}