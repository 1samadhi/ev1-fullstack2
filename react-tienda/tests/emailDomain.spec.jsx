import React from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext.jsx';
import { initializeData } from '../src/utils/initializeData.js';

const TestHarness = ({ onReady, onUserChange }) => {
  const ctx = useAuth();
  React.useEffect(() => { onReady && onReady(ctx); }, []);
  React.useEffect(() => { onUserChange && onUserChange(ctx); }, [ctx.user]);
  return null;
};

describe('Dominios de email permitidos en login', () => {
  let container, root;

  beforeEach(() => {
    localStorage.clear();
    initializeData();
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    root.unmount();
    document.body.removeChild(container);
  });

  it('acepta login con dominio profesor.duoc.cl (usuario de prueba vendedor)', (done) => {
    root.render(
      <AuthProvider>
        <TestHarness
          onReady={(ctx) => {
            const res = ctx.login('vendedor@profesor.duoc.cl', 'vend123');
            expect(res.success).toBeTrue();
            expect(res.user.email).toBe('vendedor@profesor.duoc.cl');
            done();
          }}
        />
      </AuthProvider>
    );
  });

  it('rechaza login con dominio no permitido (gmail.com)', (done) => {
    root.render(
      <AuthProvider>
        <TestHarness
          onReady={(ctx) => {
            const res = ctx.login('alguien@gmail.com', 'xxx');
            expect(res.success).toBeFalse();
            expect(res.message).toContain('dominio');
            done();
          }}
        />
      </AuthProvider>
    );
  });
});