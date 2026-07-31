import { json } from '../lib/server-utils.mjs';

export default async function handler(request) {
  if (request.method !== 'GET') {
    return json({ error: 'Método no permitido' }, 405, { allow: 'GET' });
  }

  return json({
    ok: true,
    name: 'SØD Ecosystem API',
    runtime: 'vercel-node',
    persistence: 'local-first',
    time: new Date().toISOString(),
  });
}
