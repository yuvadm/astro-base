import type { APIRoute } from 'astro';
import { jsonResponse, getDB, handleAPIError } from '../../lib/api';

export const prerender = false;

export const GET: APIRoute = async ({ locals }) => {
  return handleAPIError(async () => {
    const db = getDB(locals);
    const { results } = await db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();
    return jsonResponse(results || []);
  }, []);
};

export const POST: APIRoute = async ({ request, locals }) => {
  return handleAPIError(async () => {
    const db = getDB(locals);
    const body = await request.json();
    const { title, description } = body;

    if (!title) {
      return jsonResponse({ error: 'Title is required' }, 400);
    }

    const { results } = await db.prepare(
      'INSERT INTO tasks (title, description) VALUES (?, ?) RETURNING *'
    ).bind(title, description || '').all();

    return jsonResponse(results?.[0] || { id: Date.now(), title, description, completed: false }, 201);
  });
};