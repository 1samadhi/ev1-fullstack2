import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getRegionsAndCommunes } from '../utils/initializeData';

const Perfil = () => {
  const { user, updateProfile } = useAuth();
  const regionsData = useMemo(() => getRegionsAndCommunes(), []);
  const regions = Object.keys(regionsData);

  const [form, setForm] = useState({
    run: '',
    email: '',
    name: '',
    lastName: '',
    phone: '',
    address: '',
    region: '',
    commune: ''
  }); // Estado: datos editables del perfil del usuario
  const [errors, setErrors] = useState({}); // Estado: errores de validación por campo
  const [message, setMessage] = useState(''); // Estado: mensaje de feedback tras actualizar perfil

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        run: user.run || '',
        email: user.email || '',
        name: user.name || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: user.address || '',
        region: user.region || '',
        commune: user.commune || ''
      }));
    }
  }, [user]);

  const communes = useMemo(() => {
    return form.region ? regionsData[form.region] : [];
  }, [form.region, regionsData]);

  const validate = () => {
    const e = {};
    const trim = (v) => (v || '').trim();

    if (!trim(form.name)) e.name = 'Nombre requerido';
    if (trim(form.name).length > 50) e.name = 'Nombre max 50 caracteres';

    if (!trim(form.lastName)) e.lastName = 'Apellidos requeridos';
    if (trim(form.lastName).length > 100) e.lastName = 'Apellidos max 100 caracteres';

    if (!trim(form.address)) e.address = 'Dirección requerida';
    if (trim(form.address).length > 300) e.address = 'Dirección max 300 caracteres';

    if (!trim(form.region)) e.region = 'Región requerida';
    if (!trim(form.commune)) e.commune = 'Comuna requerida';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setMessage('');

    if (name === 'region') {
      // Reset commune when region changes
      setForm((f) => ({ ...f, commune: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');

    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      region: form.region,
      commune: form.commune
    };

    const result = updateProfile(payload);
    if (result.success) {
      setMessage('Perfil actualizado exitosamente');
    } else {
      setMessage(result.message || 'Error al actualizar el perfil');
    }
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Mi Perfil</h1>

        {message && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="run">RUN</label>
              <input
                id="run"
                name="run"
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                value={form.run}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Correo</label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                value={form.email}
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Nombre</label>
              <input
                id="name"
                name="name"
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={form.name}
                onChange={handleChange}
                placeholder="Tu nombre"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lastName">Apellidos</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Tus apellidos"
              />
              {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">Teléfono</label>
              <input
                id="phone"
                name="phone"
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={form.phone}
                onChange={handleChange}
                placeholder="Ej: +56912345678"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address">Dirección</label>
              <input
                id="address"
                name="address"
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={form.address}
                onChange={handleChange}
                placeholder="Tu dirección"
              />
              {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="region">Región</label>
              <select
                id="region"
                name="region"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={form.region}
                onChange={handleChange}
              >
                <option value="">Seleccione región</option>
                {regions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {errors.region && <p className="text-red-600 text-sm mt-1">{errors.region}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="commune">Comuna</label>
              <select
                id="commune"
                name="commune"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={form.commune}
                onChange={handleChange}
                disabled={!form.region}
              >
                <option value="">Seleccione comuna</option>
                {communes.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.commune && <p className="text-red-600 text-sm mt-1">{errors.commune}</p>}
            </div>
          </div>

          <div>
            <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Perfil;