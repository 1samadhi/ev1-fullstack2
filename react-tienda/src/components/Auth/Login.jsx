import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  }); // Estado: credenciales del usuario (email y contraseña)
  const [showPassword, setShowPassword] = useState(false); // Estado: alterna visibilidad del campo contraseña
  const [error, setError] = useState(''); // Estado: mensaje de error y validación
  const [isLoading, setIsLoading] = useState(false); // Estado: indicador de carga durante el login

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validaciones básicas de email y contraseña
      const email = formData.email.trim();
      const password = formData.password;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const domain = email.split('@')[1] || '';
      const allowedDomains = ['duoc.cl', 'profesor.duoc.cl'];

      if (!emailRegex.test(email)) {
        setError('Formato de correo inválido');
        return;
      }
      if (!allowedDomains.includes(domain)) {
        setError('El dominio del correo no está permitido');
        return;
      }
      if (!password || password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
      }

      const result = login(email, password);
      
      if (result.success) {
        const role = result.user?.role;
        if (role === 'ADMIN' || role === 'SELLER') {
          navigate('/admin/productos');
        } else {
          navigate('/perfil');
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="font-medium text-emerald-600 hover:text-emerald-500">
              Regístrate aquí
            </Link>
          </p>
          <p className="mt-1 text-center text-xs text-gray-500">Solo correos @duoc.cl o @profesor.duoc.cl</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:z-10 sm:text-sm"
                  placeholder="Tu contraseña"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                  aria-label="Mostrar u ocultar contraseña"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Recordarme
              </label>
            </div>

            <div className="text-sm">
              <Link to="/recuperar-password" className="font-medium text-emerald-600 hover:text-emerald-500">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </div>

          <div className="mt-2">
            <button
              type="button"
              onClick={() => navigate('/registro')}
              className="w-full py-2 px-4 rounded-md border border-emerald-600 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Crear Cuenta
            </button>
            <p className="mt-1 text-center text-xs text-gray-500">Registro solo con correos @duoc.cl</p>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Usuarios de prueba</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500 space-y-1">
              <p><strong>Admin:</strong> admin@duoc.cl / admin123</p>
              <p><strong>Vendedor:</strong> vendedor@profesor.duoc.cl / vend123</p>
              <p><strong>Usuario:</strong> usuario@duoc.cl / user123</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;