import { getRegionsAndCommunes } from '../src/utils/initializeData.js';

// Pruebas de cobertura básica de regiones y comunas retornadas por initializeData
describe('Regiones y comunas de Chile', () => {
  it('incluye Metropolitana y Valparaíso con comunas claves', () => {
    const data = getRegionsAndCommunes();
    // Se chequea presencia de comunas representativas
    expect(data['Metropolitana']).toContain('Santiago');
    expect(data['Metropolitana']).toContain('Las Condes');
    expect(data['Valparaíso']).toContain('Viña del Mar');
    expect(data['Valparaíso']).toContain('Quilpué');
  });

  it('incluye O\'Higgins con Rancagua y Maule con Talca', () => {
    const data = getRegionsAndCommunes();
    // Verificaciones puntuales por región
    expect(data["O'Higgins"]).toContain('Rancagua');
    expect(data['Maule']).toContain('Talca');
  });
});