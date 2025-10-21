import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { alertError, alertSuccess } from '../../ui/alerts';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Procesando autenticación...');

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const error = params.get('error');
      const u = params.get('u');
      if (error) {
        setMessage('Error de autenticación');
        alertError('Inicio de sesión', decodeURIComponent(error));
        return;
      }
      if (!u) {
        setMessage('Respuesta inválida');
        alertError('Inicio de sesión', 'Respuesta inválida del proveedor');
        return;
      }
  const b64 = u.replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  const json = JSON.parse(decodeURIComponent(Array.prototype.map.call(raw, c => '%' + c.charCodeAt(0).toString(16).padStart(2,'0')).join('')));
      sessionStorage.setItem('user', JSON.stringify(json));
      alertSuccess('¡Bienvenido/a!', `Hola ${json.nombre || json.email}`);
      navigate('/', { replace: true });
    } catch (e) {
      setMessage('No se pudo completar la autenticación');
      alertError('Inicio de sesión', e.message || 'Error desconocido');
    }
  }, [navigate]);

  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <p>{message}</p>
      <p><Link to="/login">Volver al inicio de sesión</Link></p>
    </div>
  );
};

export default AuthCallback;
