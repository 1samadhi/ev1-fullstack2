import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext.jsx';
import { initializeData } from '../src/utils/initializeData.js';

// Pruebas end-to-end ligeras para CRUD de usuarios usando AuthContext + localStorage
// Harness para interactuar con el contexto en pruebas
const TestHarness = ({ onReady, onUserChange }) => {
  const ctx = useAuth();
  React.useEffect(() => { onReady && onReady(ctx); }, []); // Expone el contexto al iniciar
  React.useEffect(() => { onUserChange && onUserChange(ctx); }, [ctx.user]); // Reacciona a cambios de sesión
  return null;
};

describe('CRUD de Usuarios (AuthContext + localStorage)', () => {
  let container, root;

  beforeEach(() => {
    localStorage.clear(); // Resetea storage entre casos
    initializeData(); // Semilla de usuarios y dominio permitido
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    root.unmount();
    document.body.removeChild(container);
  });

  it('agrega usuario válido con dominio permitido y RUN único', (done) => {
    root.render(
      <AuthProvider>
        <TestHarness
          onReady={(ctx) => {
            // Registro válido: dominio duoc.cl y RUN único
            const res = ctx.register({
              id: 'u-10', run: '12312312-3', name: 'Juan', lastName: 'Pérez',
              email: 'juan.perez@duoc.cl', password: 'secreto', birthDate: '2001-02-03',
              userType: 'USER', region: 'Metropolitana', commune: 'Santiago', address: 'Calle A 123'
            });
            expect(res.success).toBeTrue(); // Debe registrar exitosamente
            const users = JSON.parse(localStorage.getItem('users'));
            expect(users.some(u => u.email === 'juan.perez@duoc.cl')).toBeTrue(); // Persistencia en storage
            done();
          }}
        />
      </AuthProvider>
    );
  });

  it('elimina usuario desde localStorage tras registro', (done) => {
    root.render(
      <AuthProvider>
        <TestHarness
          onReady={(ctx) => {
            const r = ctx.register({
              id: 'u-11', run: '11111111-1', name: 'Borrar', lastName: 'Prueba',
              email: 'borrar@duoc.cl', password: 'clave', birthDate: '1999-09-09',
              userType: 'USER', region: 'Metropolitana', commune: 'Santiago', address: 'Calle B 456'
            });
            expect(r.success).toBeTrue();
            let users = JSON.parse(localStorage.getItem('users'));
            expect(users.some(u => u.email === 'borrar@duoc.cl')).toBeTrue();
            // Eliminar y persistir
            users = users.filter(u => u.email !== 'borrar@duoc.cl');
            localStorage.setItem('users', JSON.stringify(users));
            const updated = JSON.parse(localStorage.getItem('users'));
            expect(updated.some(u => u.email === 'borrar@duoc.cl')).toBeFalse();
            done();
          }}
        />
      </AuthProvider>
    );
  });

  it('editar usuario: updateProfile cambia apellido y persiste', (done) => {
    let updated = false;
    root.render(
      <AuthProvider>
        <TestHarness
          onReady={(ctx) => {
            // Iniciar sesión con admin para poder actualizar
            ctx.login('admin@duoc.cl', 'admin123');
          }}
          onUserChange={(ctx) => {
            if (!updated && ctx.user) {
              const res = ctx.updateProfile({ lastName: 'Modificado' });
              expect(res.success).toBeTrue(); // La actualización debe ser exitosa
              updated = true;
            } else if (updated && ctx.user) {
              expect(ctx.user.lastName).toBe('Modificado'); // Estado en memoria actualizado
              const saved = JSON.parse(localStorage.getItem('currentUser'));
              expect(saved.lastName).toBe('Modificado'); // Persistencia en storage
              done();
            }
          }}
        />
      </AuthProvider>
    );
  });

  it('rechaza registro con dominio no permitido (gmail.com)', (done) => {
    root.render(
      <AuthProvider>
        <TestHarness
          onReady={(ctx) => {
            const res = ctx.register({
              id: 'u-12', run: '22222222-2', name: 'Gmail', lastName: 'Block',
              email: 'alguien@gmail.com', password: 'x', birthDate: '2000-01-01',
              userType: 'USER', region: 'Metropolitana', commune: 'Santiago', address: 'C-1'
            });
            expect(res.success).toBeFalse(); // Debe bloquear dominio no permitido
            expect(res.message).toContain('dominio'); // Mensaje explica el motivo
            done();
          }}
        />
      </AuthProvider>
    );
  });
});