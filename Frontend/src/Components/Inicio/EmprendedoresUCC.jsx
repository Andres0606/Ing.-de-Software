import React, { useState } from 'react';
import { Users, ShoppingBag, Calendar } from 'lucide-react';
import Header from '../Header.jsx';
import Footer from '../Footer.jsx';
import '../../CSS/Inicio/EmprendedoresUCC.css';

export default function EmprendedoresUCC() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="emprende-container">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

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

      <Footer />
    </div>
  );
}