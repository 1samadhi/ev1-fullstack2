import React, { createContext, useContext, useState, useEffect } from 'react';
import { isValidRun, isValidRunPattern, formatRun } from '../utils/run';

const AuthContext = createContext();

// Dominios permitidos centralizados
const allowedLoginDomains = ['duoc.cl', 'profesor.duoc.cl'];
const allowedRegisterDomains = ['duoc.cl'];
const isAllowedLoginEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const domain = email.trim().split('@')[1] || '';
  return allowedLoginDomains.includes(domain);
};
const isAllowedRegisterEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const domain = email.trim().split('@')[1] || '';
  return allowedRegisterDomains.includes(domain);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado: usuario autenticado actual (o null si no hay sesión)
  const [isLoading, setIsLoading] = useState(true); // Estado: indica si se está cargando/restaurando sesión inicial

  useEffect(() => {
    // Verificar si hay una sesión guardada
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email, password) => {
    // Validación de dominio para evitar bypass
    if (!isAllowedLoginEmail(email)) {
      return { success: false, message: 'El dominio del correo no está permitido' };
    }

    // Obtener usuarios del localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Buscar usuario
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userSession = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        lastName: foundUser.lastName,
        role: foundUser.role || 'USER',
        isActive: foundUser.isActive !== false
      };
      
      setUser(userSession);
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      return { success: true, user: userSession };
    }
    
    return { success: false, message: 'Credenciales inválidas' };
  };

  const register = (userData) => {
    // Validación de dominio para evitar bypass en registro (solo duoc.cl)
    if (!isAllowedRegisterEmail(userData.email)) {
      return { success: false, message: 'El dominio del correo no está permitido para registro' };
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Validar RUN: patrón y dígito verificador; y normalizar a formato canónico
    if (!isValidRunPattern(userData.run)) {
      return { success: false, message: 'RUN debe ser como 12.345.678-9 o 1.123.123-K' };
    }
    if (!isValidRun(userData.run)) {
      return { success: false, message: 'RUN inválido: dígito verificador no corresponde' };
    }
    const runCanon = formatRun(userData.run);
    
    // Verificar si el email ya existe
    if (users.some(u => u.email === userData.email)) {
      return { success: false, message: 'El email ya está registrado' };
    }

    // Verificar si el RUN ya existe

    if (users.some(u => formatRun(u.run) === runCanon)) {
      return { success: false, message: 'El RUN ya está registrado' };
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      run: runCanon,
      role: 'USER',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true, message: 'Usuario registrado exitosamente' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = (updatedData) => {
    if (!user) return { success: false, message: 'No hay usuario logueado' };

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);

    // Validación de dominio si se intenta cambiar el email
    if (updatedData.email && !isAllowedLoginEmail(updatedData.email)) {
      return { success: false, message: 'El dominio del correo no está permitido' };
    }
    // Evitar duplicidad de email al actualizar
    if (updatedData.email && users.some(u => u.email === updatedData.email && u.id !== user.id)) {
      return { success: false, message: 'El email ya está registrado' };
    }
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedData };
      localStorage.setItem('users', JSON.stringify(users));
      
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      return { success: true, message: 'Perfil actualizado exitosamente' };
    }
    
    return { success: false, message: 'Error al actualizar el perfil' };
  };

  const isAdmin = () => {
    return user && user.role === 'ADMIN';
  };

  const isSeller = () => {
    return user && user.role === 'SELLER';
  };

  const isAuthenticated = () => {
    return user !== null && user.isActive;
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    isAdmin,
    isSeller,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};