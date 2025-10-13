import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home, Users, ShoppingBag, Calendar, Mail, Search, Plus, LogOut, User } from 'lucide-react';
import '../CSS/Header.css';

export default function Header({ isLoggedIn, setIsLoggedIn }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { icon: Home, label: 'Inicio', href: '/' },
    { icon: Users, label: 'Emprendedores', href: '/emprendedores' },
    { icon: ShoppingBag, label: 'Productos', href: '/productos' },
    { icon: Calendar, label: 'Eventos', href: '/eventos' },
    { icon: Mail, label: 'Contacto', href: '/contacto' },
  ];

  return (
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
              <Link
                key={link.label}
                to={link.href}
                className="emprende-nav-link"
              >
                <link.icon size={18} />
                <span>{link.label}</span>
              </Link>
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
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/registro"
                  className="emprende-btn-register"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  Registrarse
                </Link>
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
              <Link
                key={link.label}
                to={link.href}
                className="emprende-nav-link-mobile"
                onClick={() => setIsMenuOpen(false)}
              >
                <link.icon size={20} />
                <span>{link.label}</span>
              </Link>
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
                  <Link
                    to="/login"
                    className="emprende-btn-login-mobile"
                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/registro"
                    className="emprende-btn-register-mobile"
                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => setIsMenuOpen(false)}
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
  );
}