import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Search, Edit2, Save, X, IdCard } from 'lucide-react';
import { getRegionsAndCommunes } from '../../utils/initializeData';
import { isValidRun, isValidRunPattern, formatRun } from '../../utils/run';

const emptyForm = {
  id: null,
  run: '',
  name: '',
  lastName: '',
  email: '',
  password: '',
  role: 'USER',
  userType: 'USER',
  region: '',
  commune: '',
  address: '',
  isActive: true,
};

const allowedDomains = ['duoc.cl', 'profesor.duoc.cl'];

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]); // Estado: listado completo de usuarios
  const [form, setForm] = useState(emptyForm); // Estado: formulario para alta/edición de usuario
  const [editingId, setEditingId] = useState(null); // Estado: ID del usuario en edición; null si creando
  const [query, setQuery] = useState(''); // Estado: término de búsqueda para filtrar usuarios
  const [errors, setErrors] = useState({}); // Estado: errores de validación por campo
  const [note, setNote] = useState(''); // Estado: mensaje de feedback (creado/actualizado/eliminado)

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(stored);
  }, []);

  const rc = useMemo(() => getRegionsAndCommunes(), []);
  const regionList = useMemo(() => Object.keys(rc), [rc]);
  const communeList = useMemo(() => rc[form.region] || [], [rc, form.region]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u =>
      (u.name || '').toLowerCase().includes(q) ||
      (u.lastName || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.run || '').toLowerCase().includes(q)
    );
  }, [users, query]);

  const validate = () => {
    const errs = {};

    // RUN: formato y dígito verificador
    if (!isValidRunPattern(form.run)) {
      errs.run = 'RUN debe ser como 12.345.678-9 o 1.123.123-K.';
    } else if (!isValidRun(form.run)) {
      errs.run = 'RUN inválido: dígito verificador no corresponde.';
    } else {
      const runCanon = formatRun(form.run);
      if (users.some(u => formatRun(u.run) === runCanon && u.id !== editingId)) {
        errs.run = 'Ya existe un usuario con este RUN.';
      }
    }

    // Nombre y apellidos
    const nameOk = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,60}$/.test((form.name || '').trim());
    const lastOk = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,60}$/.test((form.lastName || '').trim());
    if (!nameOk) errs.name = 'Nombre debe ser 2-60 letras y espacios.';
    if (!lastOk) errs.lastName = 'Apellidos deben ser 2-60 letras y espacios.';

    // Email formato + dominio permitido + longitud + unicidad
    const email = (form.email || '').trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errs.email = 'Formato de email inválido.';
    } else {
      const domain = email.split('@')[1];
      if (!allowedDomains.includes(domain)) {
        errs.email = `Dominio no permitido. Use: ${allowedDomains.join(', ')}`;
      }
      if (domain.length < 3 || domain.length > 30) {
        errs.email = 'Dominio del email debe tener entre 3 y 30 caracteres.';
      }
      if (email.length > 100) {
        errs.email = 'El email no debe superar 100 caracteres.';
      }
      if (users.some(u => u.email === email && u.id !== editingId)) {
        errs.email = 'Ya existe un usuario con este email.';
      }
    }

    // Contraseña
    if (!form.password || form.password.length < 6) {
      errs.password = 'Contraseña mínima de 6 caracteres.';
    }

    // Región/comuna/dirección
    if (!form.region || !regionList.includes(form.region)) {
      errs.region = 'Seleccione una región válida.';
    }
    if (!form.commune || !(rc[form.region] || []).includes(form.commune)) {
      errs.commune = 'Seleccione una comuna válida.';
    }
    const addressLen = (form.address || '').trim().length;
    if (addressLen < 5 || addressLen > 120) {
      errs.address = 'Dirección 5-120 caracteres.';
    }

    // Rol
    if (!['ADMIN', 'SELLER', 'USER'].includes(form.role)) {
      errs.role = 'Rol inválido.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRunBlur = (e) => {
    const value = e.target.value || '';
    const formatted = formatRun(value);
    setForm(prev => ({ ...prev, run: formatted }));
  };

  const handleEdit = (u) => {
    setForm({
      id: u.id,
      run: u.run || '',
      name: u.name || '',
      lastName: u.lastName || '',
      email: u.email || '',
      password: u.password || '',
      role: u.role || 'USER',
      userType: u.userType || u.role || 'USER',
      region: u.region || '',
      commune: u.commune || '',
      address: u.address || '',
      isActive: u.isActive !== false,
    });
    setEditingId(u.id);
    setErrors({});
  };

  const handleDelete = (u) => {
    if (currentUser && currentUser.id === u.id) {
      alert('No puedes eliminar tu propio usuario mientras estás conectado.');
      return;
    }
    const updated = users.filter(x => x.id !== u.id);
    setUsers(updated);
    localStorage.setItem('users', JSON.stringify(updated));
    setNote('Usuario eliminado.');
    setTimeout(() => setNote(''), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setNote('');
    if (!validate()) return;

    const now = new Date().toISOString();
    if (editingId) {
      const updated = users.map(u => u.id === editingId ? {
        ...u,
        ...form,
        run: formatRun(form.run),
        userType: form.role, // sincronizar
      } : u);
      setUsers(updated);
      localStorage.setItem('users', JSON.stringify(updated));

      // Si editamos al usuario actual, actualizamos la sesión
      if (currentUser && currentUser.id === editingId) {
        const updatedCurrent = updated.find(u => u.id === editingId);
        const session = {
          id: updatedCurrent.id,
          email: updatedCurrent.email,
          name: updatedCurrent.name,
          lastName: updatedCurrent.lastName,
          role: updatedCurrent.role || 'USER',
          isActive: updatedCurrent.isActive !== false
        };
        localStorage.setItem('currentUser', JSON.stringify(session));
      }

      setNote('Cambios guardados.');
      setTimeout(() => setNote(''), 2000);
      resetForm();
    } else {
      const newUser = {
        id: Date.now().toString(),
        ...form,
        run: formatRun(form.run),
        userType: form.role, // mantener consistencia
        isActive: form.isActive !== false,
        createdAt: now
      };
      const updated = [...users, newUser];
      setUsers(updated);
      localStorage.setItem('users', JSON.stringify(updated));
      setNote('Usuario creado.');
      setTimeout(() => setNote(''), 2000);
      resetForm();
    }
  };

  return (
    <section className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin Usuarios</h1>
        <div className="text-sm text-gray-600">Total: {users.length}</div>
      </div>

      <div className="bg-white rounded-md shadow p-4 mb-4">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar por nombre, email o RUN"
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-md shadow p-4 grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <input name="run" value={form.run} onChange={handleChange} onBlur={handleRunBlur} placeholder="RUN (12.345.678-9)" minLength={11} maxLength={12} className={`border rounded-md px-3 py-2 ${errors.run ? 'border-red-400' : 'border-gray-300'}`} />
        <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" className={`border rounded-md px-3 py-2 ${errors.name ? 'border-red-400' : 'border-gray-300'}`} />
        <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Apellidos" className={`border rounded-md px-3 py-2 ${errors.lastName ? 'border-red-400' : 'border-gray-300'}`} />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className={`border rounded-md px-3 py-2 ${errors.email ? 'border-red-400' : 'border-gray-300'}`} />
        <input name="password" value={form.password} onChange={handleChange} placeholder="Contraseña" type="password" className={`border rounded-md px-3 py-2 ${errors.password ? 'border-red-400' : 'border-gray-300'}`} />
        <select name="role" value={form.role} onChange={handleChange} className={`border rounded-md px-3 py-2 ${errors.role ? 'border-red-400' : 'border-gray-300'}`}>
          <option value="USER">Usuario</option>
          <option value="SELLER">Vendedor</option>
          <option value="ADMIN">Administrador</option>
        </select>
        <select name="region" value={form.region} onChange={handleChange} className={`border rounded-md px-3 py-2 ${errors.region ? 'border-red-400' : 'border-gray-300'}`}>
          <option value="">Selecciona región</option>
          {regionList.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select name="commune" value={form.commune} onChange={handleChange} className={`border rounded-md px-3 py-2 ${errors.commune ? 'border-red-400' : 'border-gray-300'}`}>
          <option value="">Selecciona comuna</option>
          {communeList.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input name="address" value={form.address} onChange={handleChange} placeholder="Dirección" className={`border rounded-md px-3 py-2 md:col-span-2 ${errors.address ? 'border-red-400' : 'border-gray-300'}`} />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
          Activo
        </label>
        <div className="md:col-span-3 flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            {editingId ? 'Guardar cambios' : 'Crear usuario'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="border px-4 py-2 rounded-md">Cancelar edición</button>
          )}
        </div>
        {Object.values(errors).length > 0 && (
          <div className="md:col-span-3 text-sm text-red-600">Revise los campos marcados en rojo.</div>
        )}
        {note && <div className="md:col-span-3 text-sm text-emerald-700">{note}</div>}
      </form>

      <div className="overflow-x-auto bg-white rounded-md shadow">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">RUN</th>
              <th className="text-left p-3">Nombre</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Rol</th>
              <th className="text-left p-3">Región</th>
              <th className="text-left p-3">Comuna</th>
              <th className="text-left p-3">Activo</th>
              <th className="text-left p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-b">
                <td className="p-3">{u.run}</td>
                <td className="p-3">{u.name} {u.lastName}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.region}</td>
                <td className="p-3">{u.commune}</td>
                <td className="p-3">{u.isActive ? 'Sí' : 'No'}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => handleEdit(u)} className="text-blue-600 hover:underline">Editar</button>
                  <button onClick={() => handleDelete(u)} className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="p-3 text-center text-gray-500" colSpan={8}>Sin usuarios</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminUsers;