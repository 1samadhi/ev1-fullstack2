import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, IdCard, User as UserIcon, MapPin } from 'lucide-react';
import { getRegionsAndCommunes } from '../../utils/initializeData';
import { isValidRun, isValidRunPattern, formatRun } from '../../utils/run';

const allowedDomains = ['duoc.cl'];
const isAllowedEmail = (email) => {
  if (!email) return false;
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || local.length === 0) return false;
  if (email.length > 100) return false;
  return allowedDomains.includes(domain);
};

const Register = () => {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Estado: indicador de carga durante el envío del formulario
  const [error, setError] = useState(''); // Estado: mensaje de error/validación para feedback al usuario

  const regionsMap = useMemo(() => getRegionsAndCommunes(), []);
  const regions = Object.keys(regionsMap);

  const [form, setForm] = useState({
    run: '',
    name: '',
    lastName: '',
    email: '',
    password: '',
    address: '',
    region: '',
    commune: ''
  }); // Estado: datos del formulario de registro

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRunBlur = (e) => {
    const value = e.target.value || '';
    const formatted = formatRun(value);
    setForm(prev => ({ ...prev, run: formatted }));
  };

  const validate = () => {
    if (!form.run || !form.name || !form.lastName || !form.email || !form.password || !form.address || !form.region || !form.commune) {
      return 'Todos los campos son obligatorios';
    }
    // RUN pattern and check digit
    if (!isValidRunPattern(form.run)) {
      return 'RUN debe ser como 12.345.678-9 o 1.123.123-K';
    }
    if (!isValidRun(form.run)) {
      return 'RUN inválido: dígito verificador no corresponde';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return 'Correo inválido';
    }
    if (!isAllowedEmail(form.email)) {
      return 'Solo se permite registro con correos @duoc.cl';
    }
    if (form.password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const v = validate();
      if (v) {
        setError(v);
      } else {
        const res = register({ ...form, run: formatRun(form.run) });
        if (res.success) {
          const loginRes = login(form.email, form.password);
          if (loginRes.success) {
            navigate('/');
          } else {
            navigate('/login');
          }
        } else {
          setError(res.message);
        }
      }
    } catch {
      setError('Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="mx-auto h-12 w-12 bg-emerald-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">M</span>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Crear Cuenta</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
            Inicia sesión
          </Link>
        </p>
        <p className="mt-1 text-center text-xs text-gray-500">Registro solo con correos @duoc.cl</p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">{error}</div>}

          <div className="space-y-4">
            <div>
              <label htmlFor="run" className="block text-sm font-medium text-gray-700">RUN</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IdCard className="h-5 w-5 text-gray-400" />
                </div>
                <input id="run" name="run" required value={form.run} onChange={handleChange} onBlur={handleRunBlur}
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder="12.345.678-9" minLength={11} maxLength={12} />
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input id="name" name="name" required value={form.name} onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder="Tu nombre" />
              </div>
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Apellidos</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input id="lastName" name="lastName" required value={form.lastName} onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder="Tus apellidos" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input id="email" name="email" type="email" required value={form.email} onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder="tu@duoc.cl" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input id="password" name="password" type="password" required value={form.password} onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder="Tu contraseña" />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input id="address" name="address" required value={form.address} onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder="Tu dirección" />
              </div>
            </div>

            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700">Región</label>
              <select id="region" name="region" required value={form.region} onChange={handleChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
                <option value="">Selecciona Región</option>
                {regions.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="commune" className="block text-sm font-medium text-gray-700">Comuna</label>
              <select id="commune" name="commune" required value={form.commune} onChange={handleChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
                <option value="">Selecciona Comuna</option>
                {(regionsMap[form.region] || []).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;