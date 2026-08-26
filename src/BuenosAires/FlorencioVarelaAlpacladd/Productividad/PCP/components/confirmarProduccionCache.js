const CACHE_KEY = 'fv_confirmar_produccion_cache_v2';

/** @type {{ items: any[], estados: Record<string, string>, updatedAt: number } | null} */
let memoryCache = null;

function normalizeEstado(estado) {
  if (!estado || typeof estado !== 'string') return 'sin iniciar';
  const e = estado.trim().toLowerCase();
  return e || 'sin iniciar';
}

function itemFingerprint(item, estado) {
  const id = item?.id ?? '';
  const est = normalizeEstado(estado ?? item?.estado_orden);
  const metros =
    item?.metros_confirmados ??
    item?.metrosTotales ??
    item?.metros_totales ??
    item?.metros_real ??
    item?.metros ??
    0;
  return `${id}|${est}|${Number(metros) || 0}`;
}

/**
 * @returns {{ items: any[], estados: Record<string, string>, updatedAt: number } | null}
 */
export function loadCache() {
  if (memoryCache) return memoryCache;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return null;
    memoryCache = {
      items: parsed.items,
      estados: parsed.estados && typeof parsed.estados === 'object' ? parsed.estados : {},
      updatedAt: parsed.updatedAt || 0,
    };
    return memoryCache;
  } catch {
    return null;
  }
}

/**
 * @param {{ items: any[], estados?: Record<string, string> }} payload
 */
export function saveCache({ items, estados = {} }) {
  const next = {
    items: Array.isArray(items) ? items : [],
    estados: estados && typeof estados === 'object' ? { ...estados } : {},
    updatedAt: Date.now(),
  };
  memoryCache = next;
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(next));
  } catch (err) {
    console.warn('No se pudo guardar cache Confirmar Producción:', err);
  }
  return next;
}

export function clearCache() {
  memoryCache = null;
  try {
    sessionStorage.removeItem(CACHE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Fingerprint map keyed by id_orden / item.id (includes estado + metros).
 * @param {any[]} items
 * @param {Record<string, string>} [estados]
 * @returns {Record<string, string>}
 */
export function fingerprintList(items, estados = {}) {
  const map = {};
  (items || []).forEach((item) => {
    if (item?.id == null) return;
    const key = String(item.id);
    map[key] = itemFingerprint(item, estados[key] ?? estados[item.id] ?? item.estado_orden);
  });
  return map;
}

/**
 * Compare fingerprints to detect altas / bajas / cambios.
 * @returns {{ changed: boolean, altas: string[], bajas: string[], cambios: string[] }}
 */
export function compareFingerprints(prevFp, nextFp) {
  const prev = prevFp || {};
  const next = nextFp || {};
  const prevIds = new Set(Object.keys(prev));
  const nextIds = new Set(Object.keys(next));

  const altas = [];
  const bajas = [];
  const cambios = [];

  nextIds.forEach((id) => {
    if (!prevIds.has(id)) altas.push(id);
    else if (prev[id] !== next[id]) cambios.push(id);
  });
  prevIds.forEach((id) => {
    if (!nextIds.has(id)) bajas.push(id);
  });

  return {
    changed: altas.length > 0 || bajas.length > 0 || cambios.length > 0,
    altas,
    bajas,
    cambios,
  };
}
