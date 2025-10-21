import { initializeData } from '../src/utils/initializeData.js';

// Pruebas de integridad del catálogo inicial: categorías, imágenes, precios y stock
describe('Datos de productos iniciales', () => {
  beforeEach(() => {
    localStorage.clear(); // Reinicia almacenamiento antes de cada caso
    initializeData(); // Carga catálogo curado y versión
  });

  it('contiene categorías esperadas del catálogo curado', () => {
    const products = JSON.parse(localStorage.getItem('products'));
    const cats = new Set(products.map(p => p.category));
    // Verifica presencia de categorías clave del dataset
    expect(cats.has('Notebooks')).toBeTrue();
    expect(cats.has('Gafas AR/VR')).toBeTrue();
    expect(cats.has('Smartphones')).toBeTrue();
    expect(cats.has('Auriculares')).toBeTrue();
    expect(cats.has('Smartwatches')).toBeTrue();
  });

  it('todas las imágenes apuntan a assets locales /images/', () => {
    const products = JSON.parse(localStorage.getItem('products'));
    // Garantiza que los assets usen ruta local para hosting estático
    expect(products.every(p => typeof p.image === 'string' && p.image.startsWith('/images/'))).toBeTrue();
  });

  it('los precios son números positivos', () => {
    const products = JSON.parse(localStorage.getItem('products'));
    // Asegura que no existan precios cero o negativos
    expect(products.every(p => typeof p.price === 'number' && p.price > 0)).toBeTrue();
  });

  it('stock siempre es mayor o igual a criticalStock', () => {
    const products = JSON.parse(localStorage.getItem('products'));
    // Verifica coherencia básica de inventario
    expect(products.every(p => p.stock >= p.criticalStock)).toBeTrue();
  });
});