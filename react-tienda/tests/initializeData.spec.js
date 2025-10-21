import { initializeData, getRegionsAndCommunes } from '../src/utils/initializeData.js';

// Pruebas de initializeData: siembra de datos y no-sobrescritura condicional
describe('initializeData utility', () => {
  beforeEach(() => {
    localStorage.clear(); // Limpia antes de cada caso
  });

  it('debe crear usuarios y productos por defecto en localStorage', () => {
    expect(localStorage.getItem('users')).toBeNull();
    expect(localStorage.getItem('products')).toBeNull();

    initializeData(); // Ejecuta siembra

    const users = JSON.parse(localStorage.getItem('users'));
    const products = JSON.parse(localStorage.getItem('products'));

    // Se espera que ambos existan y tengan elementos
    expect(Array.isArray(users)).toBeTrue();
    expect(Array.isArray(products)).toBeTrue();
    expect(users.length).toBeGreaterThan(0);
    expect(products.length).toBeGreaterThan(0);
  });

  it('no debe sobrescribir datos existentes si la versión coincide', () => {
    // Simula datos existentes y versión igual a la del catálogo
    localStorage.setItem('users', JSON.stringify([{ id: '99', email: 'existente@duoc.cl' }]))
    localStorage.setItem('products', JSON.stringify([{ id: '88', name: 'Producto Existente' }]))
    localStorage.setItem('catalogVersion', '2025-10-curated-v1')

    initializeData(); // Debe respetar datos existentes

    const users = JSON.parse(localStorage.getItem('users'));
    const products = JSON.parse(localStorage.getItem('products'));

    expect(users).toEqual([{ id: '99', email: 'existente@duoc.cl' }]);
    expect(products).toEqual([{ id: '88', name: 'Producto Existente' }]);
  });

  it('debe retornar regiones y comunas de Chile con claves esperadas', () => {
    const data = getRegionsAndCommunes();
    // Valida estructura básica del mapa y claves relevantes
    expect(typeof data).toBe('object');
    expect(Object.keys(data).length).toBeGreaterThan(5);
    expect(data['Metropolitana']).toContain('Santiago');
    expect(data['Valparaíso']).toContain('Viña del Mar');
  });
});