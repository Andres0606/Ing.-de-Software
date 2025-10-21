import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Plus, X, RefreshCw, MapPin, Tag,
  Image as ImageIcon, Mail, Phone, KeyRound,
  Pencil, Lock
} from 'lucide-react';
import '../../CSS/Perfil/Perfil.css';
import { api } from '../../api/client';
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
  const [editForm, setEditForm] = useState({ email: '', telefono: '' });
  const [editErrors, setEditErrors] = useState({});
  const [editSaving, setEditSaving] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwdErrors, setPwdErrors] = useState({});

  useEffect(() => {
    async function load() {
      try {
        if (!storedUser?.id) return;
        const u = await api(`/api/usuarios/${storedUser.id}`);
        setUser(u.data);
        const e = await api(`/api/emprendedores/usuario/${storedUser.id}`);
        setEmprendimientos(e.data || []);
      } catch (err) {
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
      const e = await api(`/api/emprendedores/usuario/${storedUser.id}`);
      setEmprendimientos(e.data || []);
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
    setEditForm({ email: user?.email || '', telefono: user?.telefono || '' });
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
    if (!editForm.email || !/^\S+@\S+\.\S+$/.test(editForm.email)) errs.email = 'Correo inválido';
    if (editForm.telefono && !/^[- +()\d]{6,20}$/.test(editForm.telefono)) errs.telefono = 'Teléfono inválido';
    setEditErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    if (!validateEdit()) return;
    setEditSaving(true);
    try {
      const res = await api(`/api/usuarios/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          email: editForm.email,
          telefono: editForm.telefono || null,
        }),
      }).catch(() => ({ data: { ...user, ...editForm } }));

      const newUser = res?.data || { ...user, ...editForm };
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
      await api(`/api/usuarios/${user.id}/change-password`, {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: pwdForm.currentPassword,
          newPassword: pwdForm.newPassword,
        }),
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
      const res = await api('/api/emprendedores', {
        method: 'POST',
        body: JSON.stringify({
          usuario_id: user.id,
          descripcion: form.descripcion,
          ubicacion: form.ubicacion,
          categoria: form.categoria,
          imagen: form.imagen,
          calificacion: 0,
        }),
      });
      setEmprendimientos((prev) => [res.data, ...prev]);
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
              <h1 className="hero-title">{user?.nombre}</h1>
              <p className="muted">{user?.email}</p>
              <div className="hero-chips">
                {user?.tipo_usuario && <span className="pill">{user.tipo_usuario}</span>}
                <span className="chip chip--stat">{total} emprendimiento{total !== 1 && 's'}</span>
              </div>
            </div>
          </div>
          <div className="hero-actions">
            <button className="btn-outline" onClick={openEdit}><Pencil size={16} /> Editar perfil</button>
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
      </div>
    </div>
  );
}