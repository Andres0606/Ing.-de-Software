import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../CSS/Sesiones/Registro.css';

    const Registro = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        confirmPassword: '',
        tipoUsuario: 'emprendedor',
        aceptaTerminos: false
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
        });
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[name]) {
        setErrors({
            ...errors,
            [name]: ''
        });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) {
        newErrors.nombre = 'El nombre es requerido';
        }

        if (!formData.email.trim()) {
        newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'El email no es válido';
        }

        if (!formData.password) {
        newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        if (!formData.aceptaTerminos) {
        newErrors.aceptaTerminos = 'Debes aceptar los términos y condiciones';
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length === 0) {
        console.log('Registro exitoso:', formData);
        // Aquí puedes agregar la lógica para enviar los datos a tu API
        } else {
        setErrors(newErrors);
        }
    };

    const handleSocialRegister = (provider) => {
        console.log(`Registro con ${provider}`);
        // Lógica para registro social
    };

    return (
        <div className="auth-container">
        <div className="auth-card">
            <div className="auth-header">
            <div className="logo-container">
                <div className="logo">U</div>
                <h1>Emprende UCC</h1>
            </div>
            <p className="subtitle">
                Únete a la comunidad de innovadores
            </p>
            </div>

            <div className="auth-form">
            <div className="form-group">
                <label htmlFor="nombre">Nombre Completo</label>
                <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                className={errors.nombre ? 'input-error' : ''}
                />
                {errors.nombre && (
                <span className="error-message">{errors.nombre}</span>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className={errors.email ? 'input-error' : ''}
                />
                {errors.email && (
                <span className="error-message">{errors.email}</span>
                )}
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
                className={errors.password ? 'input-error' : ''}
                />
                {errors.password && (
                <span className="error-message">{errors.password}</span>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={errors.confirmPassword ? 'input-error' : ''}
                />
                {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="tipoUsuario">Tipo de Usuario</label>
                <select
                id="tipoUsuario"
                name="tipoUsuario"
                value={formData.tipoUsuario}
                onChange={handleChange}
                >
                <option value="emprendedor">Emprendedor</option>
                <option value="inversionista">Inversionista</option>
                <option value="mentor">Mentor</option>
                <option value="estudiante">Estudiante</option>
                </select>
            </div>

            <div className="form-group-checkbox">
                <label className="checkbox-container">
                <input 
                    type="checkbox" 
                    name="aceptaTerminos"
                    checked={formData.aceptaTerminos}
                    onChange={handleChange}
                />
                <span>
                    Acepto los{' '}
                    <a href="#" className="link-inline">Términos de Servicio</a>
                    {' '}y{' '}
                    <a href="#" className="link-inline">Política de Privacidad</a>
                </span>
                </label>
                {errors.aceptaTerminos && (
                <span className="error-message">{errors.aceptaTerminos}</span>
                )}
            </div>

            <button onClick={handleSubmit} className="submit-btn">
                Crear Cuenta
            </button>

            <p className="switch-text">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="switch-link">
                Inicia sesión aquí
                </Link>
            </p>
            </div>

            <div className="auth-footer">
            <div className="divider">
                <span>o regístrate con</span>
            </div>
            <div className="social-buttons">
                <button 
                className="social-btn google"
                onClick={() => handleSocialRegister('Google')}
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
                onClick={() => handleSocialRegister('Microsoft')}
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

    export default Registro;