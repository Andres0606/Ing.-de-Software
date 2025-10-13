import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, Users, ShoppingBag, Calendar, Mail, Search, Plus, LogOut, User } from 'lucide-react';
import Footer from '../Footer.jsx';
import '../../CSS/Inicio/EmprendedoresUCC.css';
import '../../CSS/Header.css';

export default function EmprendedoresUCC() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { label: "Inicio", href: "/", icon: Home },
    { label: "Emprendedores", href: "/emprendedores", icon: Users },
    { label: "Productos", href: "/productos", icon: ShoppingBag },
    { label: "Eventos", href: "/eventos", icon: Calendar },
    { label: "Contacto", href: "/contacto", icon: Mail },
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
              <span className="emprende-logo-text">Emprende UCC</span>
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
                <a key={link.label} href={link.href} className="emprende-nav-link">
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
                  <Link
                    to="/login"
                    className="emprende-btn-login"
                    style={{ textDecoration: 'none', display: 'inline-block' }}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/registro"
                    className="emprende-btn-register"
                    style={{ textDecoration: 'none', display: 'inline-block' }}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>

            {/* Botón Menú Móvil */}
            <button onClick={toggleMenu} className="emprende-menu-toggle">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Menú Móvil */}
          {isMenuOpen && (
            <div className="emprende-menu-mobile">
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

              {navLinks.map((link) => (
                <a key={link.label} href={link.href} className="emprende-nav-link-mobile">
                  <link.icon size={20} />
                  <span>{link.label}</span>
                </a>
              ))}

              <div className="emprende-actions-mobile">
                {isLoggedIn ? (
                  <>
                    <button className="emprende-btn-publish-mobile">
                      <Plus size={18} /> Publicar
                    </button>
                    <button className="emprende-btn-profile-mobile">
                      <User size={18} /> Mi Perfil
                    </button>
                    <button
                      onClick={() => setIsLoggedIn(false)}
                      className="emprende-btn-logout-mobile"
                    >
                      <LogOut size={18} /> Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="emprende-btn-login-mobile"
                      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/registro"
                      className="emprende-btn-register-mobile"
                      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="emprende-main">
        <div className="emprende-hero">
          <h1 className="emprende-hero-title">Bienvenido a Emprende UCC</h1>
          <p className="emprende-hero-text">
            Conecta con emprendedores, descubre productos innovadores y sé parte de una comunidad de innovadores de la Universidad Cooperativa de Colombia.
          </p>
          {!isLoggedIn ? (
            <button className="emprende-btn-hero-primary">Comienza Ahora</button>
          ) : (
            <button className="emprende-btn-hero-secondary">Explorar Proyectos</button>
          )}
        </div>

        <div className="emprende-cards-section">
          <div className="emprende-card">
            <Users size={32} className="emprende-card-icon icon-green" />
            <h3 className="emprende-card-title">Emprendedores</h3>
            <p className="emprende-card-text">
              Descubre y conecta con emprendedores innovadores de la comunidad UCC.
            </p>
          </div>
          <div className="emprende-card">
            <ShoppingBag size={32} className="emprende-card-icon icon-blue" />
            <h3 className="emprende-card-title">Productos</h3>
            <p className="emprende-card-text">
              Explora una variedad de productos y servicios creados por nuestros emprendedores.
            </p>
          </div>
          <div className="emprende-card">
            <Calendar size={32} className="emprende-card-icon icon-purple" />
            <h3 className="emprende-card-title">Eventos</h3>
            <p className="emprende-card-text">
              Participa en ferias, talleres y actividades de networking exclusivas.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
