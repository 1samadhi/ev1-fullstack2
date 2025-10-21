import { formatRun, isValidRun } from '../src/utils/run.js';

describe('Utilidades de RUN', () => {
  it('formatRun formatea 12123123k a 12.123.123-K', () => {
    // Verifica que se inserten puntos y se normalice el dígito K en mayúsculas
    const formatted = formatRun('12123123k');
    expect(formatted).toBe('12.123.123-K'); // Resultado esperado tras normalización
  });

  it('isValidRun acepta 12.346.043-K (dígito verificador K)', () => {
    // Valida el cálculo del dígito verificando correcto para la secuencia dada
    expect(isValidRun('12.346.043-K')).toBeTrue();
  });
});