import type { APIContext } from 'astro';

export function jsonResponse(data: any, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export function getDB(locals: APIContext['locals']) {
  const db = locals.runtime?.env?.DB;
  if (!db) {
    throw new Error('Database not available');
  }
  return db;
}

export async function handleAPIError(fn: () => Promise<Response>, fallback?: any): Promise<Response> {
  try {
    return await fn();
  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof Error && error.message === 'Database not available') {
      return jsonResponse(fallback || { error: 'Database not available' }, 503);
    }
    
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
}