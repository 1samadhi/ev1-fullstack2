import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext.jsx';
import { initializeData } from '../src/utils/initializeData.js';

// Pruebas de AuthContext: login, logout, registro y actualización de perfil
// Harness para interactuar con el contexto en pruebas
const TestHarness = ({ onReady, onUserChange }) => {
  const ctx = useAuth();
  React.useEffect(() => { onReady && onReady(ctx); }, []); // Expone métodos del contexto
  React.useEffect(() => { onUserChange && onUserChange(ctx); }, [ctx.user]); // Observa cambios de usuario
  return null;
};

describe('AuthContext', () => {
  let container, root;

  beforeEach(() => {
    localStorage.clear(); // Limpia storage para aislamiento de casos
    initializeData(); // Carga usuarios de prueba (admin, vendedor, etc.)
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    root.unmount();
    document.body.removeChild(container);
  });

  it('login exitoso con credenciales de admin', (done) => {
    root.render(
      <AuthProvider>
        <TestHarness
          onReady={(ctx) => {
            const res = ctx.login('admin@duoc.cl', 'admin123');
            expect(res.success).toBeTrue();
            expect(res.user.email).toBe('admin@duoc.cl');
          }}
          onUserChange={(ctx) => {
            if (!ctx.user) return;
            expect(ctx.user.email).toBe('admin@duoc.cl');
            expect(ctx.isAdmin()).toBeTrue(); // Rol admin detectado
            done();
          }}
        />
      </AuthProvider>
    );
  });

  it('login falla con credenciales inválidas', (done) => {
    root.render(
      <AuthProvider>
        <TestHarness
          onReady={(ctx) => {
            const res = ctx.login('invalido@duoc.cl', 'xxx');
            expect(res.success).toBeFalse(); // Debe fallar
            expect(ctx.user).toBeNull(); // Usuario sigue nulo
            done();
          }}
        />
      </AuthProvider>
    );
  });

  it('logout limpia la sesión y usuario', (done) => {
    let loggedIn = false;
    root.render(
      <AuthProvider>
        <TestHarness
          onReady={(ctx) => {
            ctx.login('admin@duoc.cl', 'admin123');
          }}
          onUserChange={(ctx) => {
            if (!loggedIn && ctx.user) {
              loggedIn = true;
              expect(ctx.user).not.toBeNull();
              ctx.logout(); // Limpia currentUser y user
            } else if (loggedIn && !ctx.user) {
              expect(localStorage.getItem('currentUser')).toBeNull();
              done();
            }
          }}
        />
      </AuthProvider>
    );
  });

  it('registro de usuario exitoso y persistencia', (done) => {
    root.render(
      <AuthProvider>
        <TestHarness
          onReady={(ctx) => {
            const res = ctx.register({
              id: '100', run: '12312312-3', name: 'Nuevo', lastName: 'Usuario',
              email: 'nuevo@duoc.cl', password: 'pass', birthDate: '2000-01-01',
              userType: 'USER', region: 'Metropolitana', commune: 'Santiago', address: 'Calle 1'
            });
            expect(res.success).toBeTrue(); // Alta exitosa
            const users = JSON.parse(localStorage.getItem('users'));
            expect(users.some(u => u.email === 'nuevo@duoc.cl')).toBeTrue(); // Persistencia verificada
            done();
          }}
        />
      </AuthProvider>
    );
  });

  it('no permite registro con email duplicado', (done) => {
    root.render(
      <AuthProvider>
        <TestHarness
          onReady={(ctx) => {
            const res = ctx.register({
              id: '101', run: '98765432-1', name: 'Dup', lastName: 'Email',
              email: 'usuario@duoc.cl', password: 'x', birthDate: '1995-05-15',
              userType: 'USER', region: 'Metropolitana', commune: 'Las Condes', address: 'Calle 2'
            });
            expect(res.success).toBeFalse(); // Bloqueado por duplicidad
            done();
          }}
        />
      </AuthProvider>
    );
  });

  it('updateProfile actualiza datos y persiste', (done) => {
    let updated = false;
    root.render(
      <AuthProvider>
        <TestHarness
          onReady={(ctx) => {
            ctx.login('admin@duoc.cl', 'admin123');
          }}
          onUserChange={(ctx) => {
            if (!updated && ctx.user) {
              const res = ctx.updateProfile({ lastName: 'Actualizado' });
              expect(res.success).toBeTrue();
              updated = true;
            } else if (updated && ctx.user) {
              expect(ctx.user.lastName).toBe('Actualizado');
              const saved = JSON.parse(localStorage.getItem('currentUser'));
              expect(saved.lastName).toBe('Actualizado'); // Persistencia
              done();
            }
          }}
        />
      </AuthProvider>
    );
  });
});