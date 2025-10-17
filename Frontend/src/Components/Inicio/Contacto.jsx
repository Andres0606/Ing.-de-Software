import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import Header from '../Header';
import Footer from '../Footer';
import '../../CSS/Inicio/Contacto.css';

export default function Contacto() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el email
    console.log('Formulario enviado:', formData);
    setSubmitted(true);
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      asunto: '',
      mensaje: '',
    });
    
    // Limpiar el mensaje de éxito después de 3 segundos
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="contacto-container">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <main className="contacto-main">
        {/* Sección de header */}
        <div className="contacto-header">
          <h1 className="contacto-title">Contacto</h1>
          <p className="contacto-subtitle">¿Tienes preguntas? Nos encantaría escucharte</p>
        </div>

        <div className="contacto-content">
          {/* Información de contacto */}
          <section className="contacto-info-section">
            <h2>Información de Contacto</h2>
            
            <div className="contacto-info-cards">
              <div className="contacto-info-card">
                <div className="contacto-icon">
                  <MapPin size={24} />
                </div>
                <h3>Ubicación</h3>
                <p>Villavicencio, Meta</p>
                <p className="small">Universidad Cooperativa de Colombia</p>
              </div>

              <div className="contacto-info-card">
                <div className="contacto-icon">
                  <Phone size={24} />
                </div>
                <h3>Teléfono</h3>
                <p>+57 (8) 6723000</p>
                <p className="small">Lunes a viernes, 8am - 5pm</p>
              </div>

              <div className="contacto-info-card">
                <div className="contacto-icon">
                  <Mail size={24} />
                </div>
                <h3>Email</h3>
                <p>info@emprendeucc.edu.co</p>
                <p className="small">Respuesta en 24 horas</p>
              </div>

              <div className="contacto-info-card">
                <div className="contacto-icon">
                  <MessageSquare size={24} />
                </div>
                <h3>Redes Sociales</h3>
                <p>@EmprenderUCC</p>
                <p className="small">Síguenos para actualizaciones</p>
              </div>
            </div>
          </section>

          {/* Formulario de contacto */}
          <section className="contacto-form-section">
            <h2>Envíanos un Mensaje</h2>
            
            {submitted && (
              <div className="contacto-success-message">
                <p>✓ Mensaje enviado exitosamente. Pronto nos pondremos en contacto contigo.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="contacto-form">
              <div className="contacto-form-group">
                <label htmlFor="nombre">Nombre Completo *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                  required
                  className="contacto-input"
                />
              </div>

              <div className="contacto-form-row">
                <div className="contacto-form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu.email@ejemplo.com"
                    required
                    className="contacto-input"
                  />
                </div>

                <div className="contacto-form-group">
                  <label htmlFor="telefono">Teléfono</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="+57 3XX XXX XXXX"
                    className="contacto-input"
                  />
                </div>
              </div>

              <div className="contacto-form-group">
                <label htmlFor="asunto">Asunto *</label>
                <input
                  type="text"
                  id="asunto"
                  name="asunto"
                  value={formData.asunto}
                  onChange={handleChange}
                  placeholder="¿Cuál es el motivo de tu consulta?"
                  required
                  className="contacto-input"
                />
              </div>

              <div className="contacto-form-group">
                <label htmlFor="mensaje">Mensaje *</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  placeholder="Cuéntanos más detalles sobre tu consulta..."
                  required
                  rows="6"
                  className="contacto-textarea"
                />
              </div>

              <button type="submit" className="contacto-btn-enviar">
                <Send size={18} />
                Enviar Mensaje
              </button>
            </form>
          </section>

          {/* Mapa o preguntas frecuentes */}
          <section className="contacto-faq-section">
            <h2>Preguntas Frecuentes</h2>
            
            <div className="contacto-faq-items">
              <div className="contacto-faq-item">
                <h4>¿Cómo puedo registrarme como emprendedor?</h4>
                <p>Dirígete a la sección de registro y completa el formulario con tus datos.</p>
              </div>

              <div className="contacto-faq-item">
                <h4>¿Cuál es la comisión por venta?</h4>
                <p>Cobramoa una comisión del 10% en cada venta realizada a través de la plataforma. Este porcentaje nos ayuda a mantener el servicio.</p>
              </div>

              <div className="contacto-faq-item">
                <h4>¿Cómo recibo mis pagos?</h4>
                <p>Los pagos se transfieren inmediatamente a la cuenta bancaria que ingreses.</p>
              </div>

              <div className="contacto-faq-item">
                <h4>¿Puedo vender productos físicos y servicios?</h4>
                <p>Sí, nuestra plataforma permite tanto venta de productos físicos como servicios. Consulta nuestras políticas para más detalles.</p>
              </div>

              <div className="contacto-faq-item">
                <h4>¿Hay soporte técnico disponible?</h4>
                <p>Sí, tenemos un equipo de soporte disponible de lunes a viernes de 8am a 5pm. Contáctanos vía email o teléfono.</p>
              </div>

              <div className="contacto-faq-item">
                <h4>¿Cómo reporte un problema con un producto?</h4>
                <p>Puedes reportar problemas directamente desde tu panel de comprador. Nuestro equipo investigará y resolverá el conflicto.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}