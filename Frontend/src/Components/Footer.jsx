import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import '../CSS/Footer.css';

export default function Footer() {
  return (
    <footer className="emprende-footer">
      <div className="emprende-footer-content">
        <div className="emprende-footer-section">
          <div className="emprende-footer-logo">
            <div className="emprende-footer-logo-icon">U</div>
            <div>
              <h3>Emprende UCC</h3>
              <p>Plataforma de emprendimiento</p>
            </div>
          </div>
          <p className="emprende-footer-description">
            Conectando emprendedores innovadores con oportunidades de crecimiento en la comunidad UCC.
          </p>
        </div>

        <div className="emprende-footer-section">
          <h4>Enlaces Rápidos</h4>
          <ul className="emprende-footer-links">
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#emprendedores">Emprendedores</a></li>
            <li><a href="#productos">Productos</a></li>
            <li><a href="#eventos">Eventos</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </div>

        <div className="emprende-footer-section">
          <h4>Compañía</h4>
          <ul className="emprende-footer-links">
            <li><a href="#about">Acerca de</a></li>
            <li><a href="#privacy">Política de Privacidad</a></li>
            <li><a href="#terms">Términos de Servicio</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#careers">Carreras</a></li>
          </ul>
        </div>

        <div className="emprende-footer-section">
          <h4>Contacto</h4>
          <div className="emprende-footer-contact">
            <div className="emprende-contact-item">
              <MapPin size={18} />
              <span>Villavicencio, Meta, Colombia</span>
            </div>
            <div className="emprende-contact-item">
              <Phone size={18} />
              <span>+57 (6) 6723000</span>
            </div>
            <div className="emprende-contact-item">
              <Mail size={18} />
              <span>info@emprendeucc.edu.co</span>
            </div>
          </div>
        </div>

        <div className="emprende-footer-section">
          <h4>Síguenos</h4>
          <div className="emprende-footer-social">
            <a href="#facebook" className="emprende-social-link facebook">
              <Facebook size={20} />
            </a>
            <a href="#instagram" className="emprende-social-link instagram">
              <Instagram size={20} />
            </a>
            <a href="#twitter" className="emprende-social-link twitter">
              <Twitter size={20} />
            </a>
            <a href="#linkedin" className="emprende-social-link linkedin">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="emprende-footer-bottom">
        <p>&copy; 2025 Emprende UCC. Todos los derechos reservados.</p>
        <p>Universidad Cooperativa de Colombia</p>
      </div>
    </footer>
  );
}