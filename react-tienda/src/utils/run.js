// Utilidades para RUN (RUT chileno)
// - Normalizar (remover puntos y guión, mayúsculas)
// - Validar patrón y dígito verificador (DV)
// - Formatear con puntos y guión

export const normalizeRun = (run) => {
  if (!run || typeof run !== 'string') return '';
  return run.replace(/\./g, '').replace(/-/g, '').toUpperCase().trim();
};

export const splitRun = (normalized) => {
  if (!normalized) return { num: '', dv: '' };
  const dv = normalized.slice(-1);
  const num = normalized.slice(0, -1);
  return { num, dv };
};

export const isValidRunPattern = (run) => {
  if (!run) return false;
  const s = run.trim();
  const dotted = /^\d{1,2}\.\d{3}\.\d{3}-[0-9Kk]$/.test(s);
  const plain = /^\d{7,8}-[0-9Kk]$/.test(s);
  return dotted || plain;
};

export const isValidRun = (run) => {
  const norm = normalizeRun(run);
  if (!/^\d{7,8}[0-9K]$/.test(norm)) return false;
  const { num, dv } = splitRun(norm);

  let suma = 0;
  let multiplicador = 2;
  for (let i = num.length - 1; i >= 0; i--) {
    suma += parseInt(num[i], 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  const resto = suma % 11;
  const dvCalculado = 11 - resto;
  let esperado;
  if (dvCalculado === 11) esperado = '0';
  else if (dvCalculado === 10) esperado = 'K';
  else esperado = String(dvCalculado);

  return dv === esperado;
};

export const formatRun = (run) => {
  const norm = normalizeRun(run);
  if (!norm) return '';
  const { num, dv } = splitRun(norm);
  const n = num.length;
  if (!(n === 7 || n === 8)) return '';
  const part1 = n === 7 ? num.slice(0, 1) : num.slice(0, 2);
  const part2 = n === 7 ? num.slice(1, 4) : num.slice(2, 5);
  const part3 = n === 7 ? num.slice(4, 7) : num.slice(5, 8);
  return `${part1}.${part2}.${part3}-${dv}`;
};