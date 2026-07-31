import crypto from 'node:crypto';
import { dialogueReply, isRateLimited, json, sanitize } from '../lib/server-utils.mjs';

export default async function handler(request) {
  if (request.method !== 'POST') {
    return json({ error: 'Método no permitido' }, 405, { allow: 'POST' });
  }

  if (isRateLimited(request, 'dialogue', 20)) {
    return json({ error: 'Pausa un momento antes de continuar.' }, 429);
  }

  let input;
  try {
    input = await request.json();
  } catch {
    return json({ error: 'JSON inválido.' }, 400);
  }

  const message = sanitize(input?.message, 2_000);
  if (message.length < 2) {
    return json({ error: 'La pregunta está vacía.' }, 400);
  }

  return json({
    id: crypto.randomUUID(),
    reply: dialogueReply(message),
    mode: 'scripted',
    disclaimer: 'SØD ofrece reflexión guiada; no reemplaza asistencia médica, psicológica, legal o profesional.',
  });
}
