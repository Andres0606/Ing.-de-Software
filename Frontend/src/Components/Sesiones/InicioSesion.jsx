import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import '../../CSS/Sesiones/InicioSesion.css';
import { apiClient } from '../../api/client';
import { alertError, alertSuccess } from '../../ui/alerts';

const InicioSesion = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // precargar email si "Recordarme" estaba activo
        const remembered = localStorage.getItem('remember_login');
        const savedEmail = localStorage.getItem('remember_email');
        if (remembered === '1' && savedEmail) {
            setFormData((prev) => ({ ...prev, email: savedEmail, remember: true }));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await apiClient.post('/usuarios/login', {
                email: formData.email, 
                password: formData.password 
            });
            
            console.log('📡 Respuesta completa del login:', res);
            
            // ✅ CORREGIDO: Extraer el usuario correctamente
            // Si la respuesta tiene estructura {mensaje, usuario}, extraer solo usuario
            const userData = res?.usuario || res?.data?.usuario || res?.data || res;
            
            console.log('✅ userData que se guardará:', userData);
            
            // Guardar preferencia de recordar
            if (formData.remember) {
                localStorage.setItem('remember_login', '1');
                localStorage.setItem('remember_email', formData.email);
            } else {
                localStorage.removeItem('remember_login');
                localStorage.removeItem('remember_email');
            }
            
            // ✅ CORREGIDO: Guardar solo el objeto usuario en sessionStorage
            sessionStorage.setItem('user', JSON.stringify(userData));
            
            await alertSuccess('¡Bienvenido/a!', `Hola ${userData.nombre || 'Usuario'}`);
            
            // Redirigir al inicio
            window.location.href = '/';
        } catch (err) {
            console.error('❌ Error en login:', err);
            setError(err.message || 'Error al iniciar sesión');
            alertError('No pudimos iniciar sesión', err.message || 'Verifica tus credenciales.');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        // Obtener la URL base del backend desde las variables de entorno
        const API_BASE_URL = import.meta.env.VITE_API_URL.replace('/api', '');
        const path = `/api/auth/${provider.toLowerCase()}/start`;
        const url = `${API_BASE_URL}${path}`;
        window.location.href = url;
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <Link to="/" className="back-link"><ArrowLeft size={16} /> Volver al menú</Link>
                <div className="auth-header">
                    <div className="logo-container">
                        <div className="logo">U</div>
                        <h1>Emprende UCC</h1>
                    </div>
                    <p className="subtitle">
                        Inicia sesión para conectar con emprendedores
                    </p>
                </div>

                <div className="auth-form">
                    {error && <div className="error-box" role="alert">{error}</div>}
                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="tu@email.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="form-options">
                        <label className="checkbox-container">
                            <input 
                                type="checkbox" 
                                name="remember"
                                checked={formData.remember}
                                onChange={handleChange}
                            />
                            <span>Recordarme</span>
                        </label>
                        <a href="#" className="forgot-password">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>

                    <button onClick={handleSubmit} className="submit-btn" disabled={loading}>
                        {loading ? 'Ingresando…' : 'Iniciar Sesión'}
                    </button>

                    <p className="switch-text">
                        ¿No tienes cuenta?{' '}
                        <Link to="/registro" className="switch-link">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>

                <div className="auth-footer">
                    <div className="divider">
                        <span>o continúa con</span>
                    </div>
                    <div className="social-buttons">
                        <button 
                            className="social-btn google"
                            onClick={() => handleSocialLogin('Google')}
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
                                <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
                                <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5818182 23.1818182,9.90909091 L12,9.90909091 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
                                <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
                            </svg>
                            Google
                        </button>
                        <button 
                            className="social-btn microsoft"
                            onClick={() => handleSocialLogin('Microsoft')}
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="#f25022" d="M1 1h10v10H1z"/>
                                <path fill="#00a4ef" d="M13 1h10v10H13z"/>
                                <path fill="#7fba00" d="M1 13h10v10H1z"/>
                                <path fill="#ffb900" d="M13 13h10v10H13z"/>
                            </svg>
                            Microsoft
                        </button>
                    </div>
                </div>
            </div>

            <div className="decorative-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>
        </div>
    );
};

export default InicioSesion;