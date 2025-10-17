import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
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

  useEffect(() => {
    async function load() {
      try {
        if (!storedUser?.id) return; // no hay sesión
        // Refrescar datos de usuario
        const u = await api(`/api/usuarios/${storedUser.id}`);
        setUser(u.data);
        // Cargar emprendimientos del usuario
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

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => { setShowModal(false); setForm({ descripcion: '', ubicacion: '', categoria: '', imagen: '' }); };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    setSaving(true);
    try {
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
      alertError('No se pudo crear', err.message || 'Intenta de nuevo');
    } finally {
      setSaving(false);
    }
  };

  if (!storedUser) {
    return (
      <div className="perfil-container">
        <div className="perfil-card">
          <Link to="/" className="back-link"><ArrowLeft size={16} /> Volver</Link>
          <h2>Inicia sesión para ver tu perfil</h2>
          <Link to="/login" className="btn-primary">Ir a iniciar sesión</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <Link to="/" className="back-link"><ArrowLeft size={16} /> Volver al menú</Link>
        <div className="perfil-header">
          <div className="avatar">{(user?.nombre || '?').charAt(0)}</div>
          <div>
            <h1>{user?.nombre || 'Usuario'}</h1>
            <p className="muted">{user?.email}</p>
            {user?.tipo_usuario && <span className="pill">{user.tipo_usuario}</span>}
          </div>
        </div>

        <div className="perfil-actions">
          <button className="btn-primary" onClick={handleOpenModal}><Plus size={16} /> Crear emprendimiento</button>
        </div>

        <h2 className="section-title">Mis emprendimientos</h2>
        {loading ? (
          <div className="loading">Cargando…</div>
        ) : emprendimientos.length === 0 ? (
          <div className="empty">Aún no tienes emprendimientos.</div>
        ) : (
          <div className="cards-grid">
            {emprendimientos.map((e) => (
              <div className="card" key={e.id}>
                <div className="card-cover" style={{ backgroundImage: e.imagen ? `url(${e.imagen})` : undefined }} />
                <div className="card-body">
                  <h3>{e.categoria || 'Emprendimiento'}</h3>
                  {e.descripcion && <p className="muted">{e.descripcion}</p>}
                  {e.ubicacion && <p className="muted">Ubicación: {e.ubicacion}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="modal-header">
              <h3>Nuevo emprendimiento</h3>
              <button className="icon-btn" onClick={handleCloseModal}><X size={18} /></button>
            </div>
            <form className="modal-body" onSubmit={handleCreate}>
              <div className="form-row">
                <label>Categoría</label>
                <input name="categoria" value={form.categoria} onChange={handleChange} placeholder="Gastronomía, Tecnología…" />
              </div>
              <div className="form-row">
                <label>Descripción</label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="¿Qué ofrece tu emprendimiento?" />
              </div>
              <div className="form-row">
                <label>Ubicación</label>
                <input name="ubicacion" value={form.ubicacion} onChange={handleChange} placeholder="Ciudad / Campus" />
              </div>
              <div className="form-row">
                <label>Imagen (URL)</label>
                <input name="imagen" value={form.imagen} onChange={handleChange} placeholder="https://..." />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Guardando…' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
