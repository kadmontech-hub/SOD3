const WINDOW_MS = 60_000;
const buckets = globalThis.__sodRateBuckets || new Map();
globalThis.__sodRateBuckets = buckets;

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'strict-origin-when-cross-origin',
      ...extraHeaders,
    },
  });
}

export function sanitize(value, max = 2_000) {
  return String(value ?? '').replace(/[<>]/g, '').trim().slice(0, max);
}

export function getClientId(request) {
  return request.headers.get('x-vercel-forwarded-for')
    || request.headers.get('x-forwarded-for')
    || 'anonymous';
}

export function isRateLimited(request, key, limit = 20) {
  const now = Date.now();
  const id = `${getClientId(request)}:${key}`;
  const entry = buckets.get(id) || { count: 0, resetAt: now + WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + WINDOW_MS;
  }
  entry.count += 1;
  buckets.set(id, entry);
  return entry.count > limit;
}

export function dialogueReply(message) {
  const normalized = message.toLowerCase();
  let core = 'Antes de buscar una respuesta, distinguí qué ocurrió, qué interpretaste y qué decisión está disponible ahora.';

  if (/miedo|ansiedad|angustia/.test(normalized)) {
    core = 'No voy a convertir lo que sentís en una falla. Nombrá la sensación, localizala en el cuerpo y reducí la próxima decisión a un paso seguro y reversible.';
  } else if (/propósito|rumbo|dirección/.test(normalized)) {
    core = 'El propósito rara vez aparece como una frase perfecta. Se vuelve visible en aquello que elegís sostener incluso cuando nadie te observa.';
  } else if (/hábito|disciplina|constancia/.test(normalized)) {
    core = 'No empieces exigiendo una identidad nueva. Diseñá una repetición tan pequeña que el entorno pueda recordártela.';
  } else if (/decidir|decisión|elegir/.test(normalized)) {
    core = 'Toda decisión distribuye energía. Preguntá qué opción produce información nueva y qué costo estás dispuesto a aceptar.';
  } else if (/claridad|confund/.test(normalized)) {
    core = 'La claridad comienza separando capas: hecho verificable, interpretación, emoción, necesidad y acción.';
  }

  return `${core}\n\nPregunta de integración: ¿qué acción de menos de diez minutos haría visible esta comprensión hoy?`;
}
