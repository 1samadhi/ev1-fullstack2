import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Productos from './pages/Productos';
import RequireAdmin from './components/Auth/RequireAdmin';
import AdminProducts from './components/Admin/AdminProducts';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import Register from './components/Auth/Register';
import Perfil from './pages/Perfil';
import RequireAuth from './components/Auth/RequireAuth';
import RequireRole from './components/Auth/RequireRole';
import Carrito from './pages/Carrito';
import AdminUsers from './components/Admin/AdminUsers';
import Blogs from './pages/Blogs';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/perfil" element={<RequireAuth><Perfil /></RequireAuth>} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route
              path="/admin/productos"
              element={
                <RequireRole roles={["ADMIN", "SELLER"]}>
                  <AdminProducts />
                </RequireRole>
              }
            />
            <Route
              path="/admin/usuarios"
              element={
                <RequireRole roles={["ADMIN"]}>
                  <AdminUsers />
                </RequireRole>
              }
            />
            {/* Más rutas se agregarán aquí */}
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
