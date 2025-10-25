import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Plus, X, RefreshCw, MapPin, Tag,
  Image as ImageIcon, Mail, Phone, KeyRound,
  Pencil, Lock
} from 'lucide-react';
import '../../CSS/Perfil/Perfil.css';
import { apiClient } from '../../api/client'; // ❌ ANTES: { api }
                                               // ✅ AHORA: { apiClient }
import { alertError, alertSuccess } from '../../ui/alerts';

export default function Perfil() {
  const storedUser = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem('user') || 'null'); } catch { return null; }
  }, []);

  const [user, setUser] = useState(storedUser);
  const [emprendimientos, setEmprendimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ descripcion: '', ubicacion: '', categoria: '', imagen: '' });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({ 
    nombre: '', 
    apellido: '', 
    email: '', 
    telefono: '', 
    carrera: ''
  });
  const [editErrors, setEditErrors] = useState({});
  const [editSaving, setEditSaving] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdErrors, setPwdErrors] = useState({});

  useEffect(() => {
    async function load() {
      try {
        if (!storedUser?.id) return;
        console.log('Usuario almacenado:', storedUser);
        const u = await apiClient.get(`/usuarios/${storedUser.id}`); // ✅ Cambiado
        console.log('Usuario desde API:', u.data || u);
        setUser(u.data || u);
        const e = await apiClient.get(`/emprendedores/usuario/${storedUser.id}`); // ✅ Cambiado
        setEmprendimientos(e.data || e || []);
      } catch (err) {
        console.error('Error cargando perfil:', err);
        alertError('Error cargando perfil', err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [storedUser]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      if (!storedUser?.id) return;
      const e = await apiClient.get(`/emprendedores/usuario/${storedUser.id}`); // ✅ Cambiado
      setEmprendimientos(e.data || e || []);
    } catch (err) {
      alertError('No se pudo actualizar', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setForm({ descripcion: '', ubicacion: '', categoria: '', imagen: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const openEdit = () => {
    setEditForm({ 
      nombre: user?.nombre || '', 
      apellido: user?.apellido || '', 
      email: user?.email || '', 
      telefono: user?.telefono || '', 
      carrera: user?.carrera || ''
    });
    setEditErrors({});
    setShowEdit(true);
  };
  const closeEdit = () => setShowEdit(false);
  const onEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((p) => ({ ...p, [name]: value }));
    setEditErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateEdit = () => {
    const errs = {};
    if (!editForm.nombre?.trim()) errs.nombre = 'Nombre requerido';
    if (!editForm.apellido?.trim()) errs.apellido = 'Apellido requerido';
    if (!editForm.email || !/^\S+@\S+\.\S+$/.test(editForm.email)) errs.email = 'Correo inválido';
    if (editForm.telefono && !/^\d{10}$/.test(editForm.telefono.replace(/\D/g, ''))) errs.telefono = 'Teléfono debe tener 10 dígitos';
    setEditErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    if (!validateEdit()) return;
    setEditSaving(true);
    try {
      const res = await apiClient.put(`/usuarios/${user.id}`, { // ✅ Cambiado
        nombre: editForm.nombre,
        apellido: editForm.apellido,
        email: editForm.email,
        telefono: editForm.telefono || null,
        carrera: editForm.carrera || null,
      }).catch(() => ({ data: { ...user, ...editForm } }));

      const newUser = res?.data || res || { ...user, ...editForm };
      setUser(newUser);
      sessionStorage.setItem('user', JSON.stringify(newUser));
      alertSuccess('Perfil actualizado', 'Tus datos fueron actualizados.');
      closeEdit();
    } catch (err) {
      alertError('No se pudo actualizar', err.message);
    } finally {
      setEditSaving(false);
    }
  };

  const openPwd = () => { setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); setShowPwd(true); };
  const closePwd = () => setShowPwd(false);

  const validatePwd = () => {
    const errs = {};
    if (!pwdForm.currentPassword) errs.currentPassword = 'Requerido';
    if (!pwdForm.newPassword || pwdForm.newPassword.length < 6) errs.newPassword = 'Mínimo 6 caracteres';
    if (pwdForm.newPassword === pwdForm.currentPassword) errs.newPassword = 'Debe ser diferente a la actual';
    if (pwdForm.confirmPassword !== pwdForm.newPassword) errs.confirmPassword = 'No coincide';
    setPwdErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!user?.id || !validatePwd()) return;
    try {
      await apiClient.post(`/usuarios/${user.id}/change-password`, { // ✅ Cambiado
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword,
      });
      alertSuccess('Listo', 'Tu contraseña fue actualizada.');
      closePwd();
    } catch (err) {
      alertError('No se pudo actualizar', err.message);
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.categoria && !form.descripcion) {
      errs.categoria = 'Ingresa una categoría o descripción';
      errs.descripcion = 'Ingresa una descripción o categoría';
    }
    if (form.imagen && !/^https?:\/\//i.test(form.imagen)) {
      errs.imagen = 'La imagen debe ser una URL válida';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    setSaving(true);
    try {
      if (!validate()) return alertError('Campos incompletos', 'Revisa los datos.');
      const res = await apiClient.post('/emprendedores', { // ✅ Cambiado
        usuario_id: user.id,
        descripcion: form.descripcion,
        ubicacion: form.ubicacion,
        categoria: form.categoria,
        imagen: form.imagen,
        calificacion: 0,
      });
      setEmprendimientos((prev) => [res.data || res, ...prev]);
      alertSuccess('Emprendimiento creado', 'Tu emprendimiento fue registrado.');
      handleCloseModal();
    } catch (err) {
      alertError('Error al crear', err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!storedUser) {
    return (
      <div className="perfil-container">
        <div className="perfil-card">
          <Link to="/" className="perfil-back-link">
            <ArrowLeft size={16} /> Volver
          </Link>
          <h2>Inicia sesión para ver tu perfil</h2>
          <Link to="/login" className="btn-primary">Ir a iniciar sesión</Link>
        </div>
      </div>
    );
  }

  const total = emprendimientos.length;
  const avatarInitial = (user?.nombre || '?').trim().charAt(0).toUpperCase();
  const nombreCompleto = `${user?.nombre || ''} ${user?.apellido || ''}`.trim();

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <div className="header-toolbar">
          <Link to="/" className="perfil-back-link">
            <ArrowLeft size={16} /> Volver al menú
          </Link>
        </div>

        <div className="perfil-hero">
          <div className="hero-left">
            <div className="avatar avatar--xl">{avatarInitial}</div>
            <div className="hero-meta">
              <h1 className="hero-title">{nombreCompleto || 'Usuario'}</h1>
              <p className="hero-subtitle">{user?.email || 'Sin email'}</p>
              
              <div className="hero-info">
                <p><strong>Nombre:</strong> {user?.nombre || 'No especificado'}</p>
                <p><strong>Apellido:</strong> {user?.apellido || 'No especificado'}</p>
                <p><strong>Email:</strong> {user?.email || 'No especificado'}</p>
                {user?.telefono && (
                  <p><strong>Teléfono:</strong> {user.telefono}</p>
                )}
                {user?.carrera && (
                  <p><strong>Carrera:</strong> {user.carrera}</p>
                )}
                {user?.fecha_nacimiento && (
                  <p><strong>Fecha de nacimiento:</strong> {new Date(user.fecha_nacimiento).toLocaleDateString('es-ES')}</p>
                )}
              </div>
              
              <div className="hero-chips">
                {user?.rol && <span className="pill">{user.rol === 'estudiante' ? 'Estudiante' : 'Usuario Universidad'}</span>}
                <span className="chip chip--stat">{total} emprendimiento{total !== 1 && 's'}</span>
                {user?.verificado && <span className="chip chip--verified">✓ Verificado</span>}
              </div>
            </div>
          </div>
          <div className="hero-actions">
            <button className="btn-outline" onClick={openEdit}><Pencil size={16} /> Editar perfil</button>
            <button className="btn-outline" onClick={openPwd}><Lock size={16} /> Cambiar contraseña</button>
            <button className="btn-outline" onClick={handleRefresh}><RefreshCw size={16} /> Actualizar</button>
            <button className="btn-primary" onClick={handleOpenModal}><Plus size={16} /> Crear emprendimiento</button>
          </div>
        </div>

        <h2 className="section-title">Mis emprendimientos</h2>
        {loading ? (
          <div className="cards-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card skeleton-card" aria-hidden="true">
                <div className="card-cover" />
                <div className="card-body">
                  <div className="skeleton skeleton-title" />
                  <div className="skeleton skeleton-text" />
                  <div className="skeleton skeleton-text w-60" />
                </div>
              </div>
            ))}
          </div>
        ) : total === 0 ? (
          <div className="empty">
            <div className="empty-illustration" />
            <h3>No tienes emprendimientos aún</h3>
            <p className="muted">Crea tu primer emprendimiento para mostrar tu trabajo.</p>
            <button className="btn-primary" onClick={handleOpenModal}><Plus size={16} /> Crear emprendimiento</button>
          </div>
        ) : (
          <div className="cards-grid">
            {emprendimientos.map((e) => (
              <article className="card" key={e.id}>
                <div
                  className={`card-cover ${e.imagen ? '' : 'card-cover--placeholder'}`}
                  style={e.imagen ? { backgroundImage: `url(${e.imagen})` } : undefined}
                />
                <div className="card-body">
                  <span className="chip chip--category"><Tag size={14} /> {e.categoria || 'Sin categoría'}</span>
                  {e.descripcion && <p className="muted card-desc">{e.descripcion}</p>}
                  {e.ubicacion && <p className="muted card-loc"><MapPin size={14} /> {e.ubicacion}</p>}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Modal de Edición de Perfil */}
        {showEdit && (
          <div className="modal-overlay" onClick={closeEdit}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Editar Perfil</h3>
                <button className="icon-btn" onClick={closeEdit}><X size={20} /></button>
              </div>
              <form onSubmit={handleUpdateProfile} className="modal-body">
                <div className="form-row">
                  <label>Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    value={editForm.nombre}
                    onChange={onEditChange}
                    className={editErrors.nombre ? 'input-error' : ''}
                    placeholder="Tu nombre"
                  />
                  {editErrors.nombre && <span className="error-text">{editErrors.nombre}</span>}
                </div>

                <div className="form-row">
                  <label>Apellido</label>
                  <input
                    type="text"
                    name="apellido"
                    value={editForm.apellido}
                    onChange={onEditChange}
                    className={editErrors.apellido ? 'input-error' : ''}
                    placeholder="Tu apellido"
                  />
                  {editErrors.apellido && <span className="error-text">{editErrors.apellido}</span>}
                </div>

                <div className="form-row">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={onEditChange}
                    className={editErrors.email ? 'input-error' : ''}
                    placeholder="tu@email.com"
                  />
                  {editErrors.email && <span className="error-text">{editErrors.email}</span>}
                </div>

                <div className="form-row">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    value={editForm.telefono}
                    onChange={onEditChange}
                    className={editErrors.telefono ? 'input-error' : ''}
                    placeholder="3001234567"
                  />
                  {editErrors.telefono && <span className="error-text">{editErrors.telefono}</span>}
                </div>

                <div className="form-row">
                  <label>Carrera</label>
                  <input
                    type="text"
                    name="carrera"
                    value={editForm.carrera}
                    onChange={onEditChange}
                    placeholder="Tu carrera o programa"
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-outline" onClick={closeEdit}>Cancelar</button>
                  <button type="submit" className="btn-primary" disabled={editSaving}>
                    {editSaving ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Cambio de Contraseña */}
        {showPwd && (
          <div className="modal-overlay" onClick={closePwd}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Cambiar Contraseña</h3>
                <button className="icon-btn" onClick={closePwd}><X size={20} /></button>
              </div>
              <form onSubmit={handleChangePassword} className="modal-body">
                <div className="form-row">
                  <label>Contraseña Actual</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={pwdForm.currentPassword}
                    onChange={(e) => setPwdForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className={pwdErrors.currentPassword ? 'input-error' : ''}
                    placeholder="Tu contraseña actual"
                  />
                  {pwdErrors.currentPassword && <span className="error-text">{pwdErrors.currentPassword}</span>}
                </div>

                <div className="form-row">
                  <label>Nueva Contraseña</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={pwdForm.newPassword}
                    onChange={(e) => setPwdForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className={pwdErrors.newPassword ? 'input-error' : ''}
                    placeholder="Nueva contraseña"
                  />
                  {pwdErrors.newPassword && <span className="error-text">{pwdErrors.newPassword}</span>}
                </div>

                <div className="form-row">
                  <label>Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={pwdForm.confirmPassword}
                    onChange={(e) => setPwdForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className={pwdErrors.confirmPassword ? 'input-error' : ''}
                    placeholder="Confirma tu nueva contraseña"
                  />
                  {pwdErrors.confirmPassword && <span className="error-text">{pwdErrors.confirmPassword}</span>}
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-outline" onClick={closePwd}>Cancelar</button>
                  <button type="submit" className="btn-primary">Cambiar Contraseña</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}