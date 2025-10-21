import { initializeData } from '../src/utils/initializeData.js';

// Pruebas CRUD de productos usando localStorage: alta, edición y eliminación
describe('CRUD de Productos (localStorage)', () => {
  beforeEach(() => {
    localStorage.clear(); // Limpia storage entre casos
    initializeData(); // Siembra catálogo base
  });

  it('agrega producto nuevo y persiste en localStorage', () => {
    const products = JSON.parse(localStorage.getItem('products'));
    const nuevo = {
      id: 'T1',
      code: 'TEST-1',
      name: 'Producto Test 1',
      description: 'Producto de prueba',
      price: 12345,
      category: 'Smartphones',
      stock: 7,
      criticalStock: 2,
      status: 'active',
      image: '/images/smartphone.svg',
      createdAt: new Date().toISOString()
    };
    products.push(nuevo); // Alta
    localStorage.setItem('products', JSON.stringify(products)); // Persistencia

    const saved = JSON.parse(localStorage.getItem('products'));
    expect(saved.some(p => p.id === 'T1' && p.code === 'TEST-1')).toBeTrue(); // Confirmación
  });

  it('edita precio y stock de producto existente', () => {
    const products = JSON.parse(localStorage.getItem('products'));
    const targetId = products[0].id;
    const idx = products.findIndex(p => p.id === targetId);
    products[idx] = { ...products[idx], price: products[idx].price + 1000, stock: products[idx].stock + 1 };
    localStorage.setItem('products', JSON.stringify(products)); // Persistir edición

    const saved = JSON.parse(localStorage.getItem('products'));
    const updated = saved.find(p => p.id === targetId);
    expect(updated.price).toBe(products[idx].price);
    expect(updated.stock).toBe(products[idx].stock);
    expect(updated.stock).toBeGreaterThanOrEqual(updated.criticalStock); // Consistencia de inventario
  });

  it('elimina producto y verifica que no exista', () => {
    let products = JSON.parse(localStorage.getItem('products'));
    const targetId = products[products.length - 1].id;
    products = products.filter(p => p.id !== targetId); // Baja
    localStorage.setItem('products', JSON.stringify(products)); // Persistencia

    const saved = JSON.parse(localStorage.getItem('products'));
    expect(saved.some(p => p.id === targetId)).toBeFalse(); // Verificación
  });
});