import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, isAuthenticated, isAdmin, isSeller, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false); // Estado: controla apertura del menú móvil
  const [cartCount, setCartCount] = useState(0); // Estado: cantidad total de ítems en el carrito
  const [menuOpen, setMenuOpen] = useState(false); // Estado: muestra/oculta el menú desplegable del usuario

  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
      setCartCount(count);
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    window.addEventListener('cartUpdated', updateCount);
    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('cartUpdated', updateCount);
    };
  }, []);

  const toggleMobile = () => setMobileOpen((prev) => !prev);

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-emerald-700">Mr.Robot</Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-emerald-700">Inicio</Link>
          <Link to="/productos" className="text-gray-700 hover:text-emerald-700">Productos</Link>
          <Link to="/nosotros" className="text-gray-700 hover:text-emerald-700">Nosotros</Link>
          <Link to="/blogs" className="text-gray-700 hover:text-emerald-700">Blogs</Link>
          <Link to="/contacto" className="text-gray-700 hover:text-emerald-700">Contacto</Link>
          <Link to="/carrito" className="relative text-gray-700 hover:text-emerald-700">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-emerald-600 text-white text-xs px-2 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          {isAuthenticated() ? (
            <div className="relative" onMouseLeave={() => setMenuOpen(false)}>
              <button
                className="flex items-center space-x-2 text-gray-700 hover:text-emerald-700"
                onMouseEnter={() => setMenuOpen(true)}
                onClick={() => setMenuOpen((v) => !v)}
              >
                <span>{user?.name || (user?.email ? user.email.split('@')[0] : '')}</span>
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z" /></svg>
              </button>
              <div
                className={`absolute right-0 top-full w-48 bg-white border rounded shadow-md py-2 ${menuOpen ? 'block' : 'hidden'}`}
                onMouseEnter={() => setMenuOpen(true)}
                onMouseLeave={() => setMenuOpen(false)}
              >
                <Link to="/perfil" className="block px-4 py-2 hover:bg-gray-100">Perfil</Link>
                <Link to="/ordenes" className="block px-4 py-2 hover:bg-gray-100">Mis órdenes</Link>
                {(isAdmin() || isSeller()) && (
                  <Link to="/admin/productos" className="block px-4 py-2 hover:bg-gray-100">Admin Productos</Link>
                )}
                {isAdmin() && (
                  <Link to="/admin/usuarios" className="block px-4 py-2 hover:bg-gray-100">Admin Usuarios</Link>
                )}
                <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Salir</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-gray-700 hover:text-emerald-700">Ingresar</Link>
          )}
        </nav>
        <button className="md:hidden" onClick={toggleMobile}>☰</button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t">
          <nav className="px-4 py-2 flex flex-col gap-2">
            <Link to="/" className="py-2">Inicio</Link>
            <Link to="/productos" className="py-2">Productos</Link>
            <Link to="/nosotros" className="py-2">Nosotros</Link>
            <Link to="/blogs" className="py-2">Blogs</Link>
            <Link to="/contacto" className="py-2">Contacto</Link>
            <Link to="/carrito" className="py-2">Carrito {cartCount > 0 ? `(${cartCount})` : ''}</Link>
            {isAuthenticated() ? (
              <>
                <Link to="/perfil" className="py-2">Perfil</Link>
                <Link to="/ordenes" className="py-2">Mis órdenes</Link>
                {(isAdmin() || isSeller()) && (
                  <Link to="/admin/productos" className="py-2">Admin Productos</Link>
                )}
                {isAdmin() && (
                  <Link to="/admin/usuarios" className="py-2">Admin Usuarios</Link>
                )}
                <button onClick={logout} className="text-left py-2">Salir</button>
              </>
            ) : (
              <Link to="/login" className="py-2">Ingresar</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;