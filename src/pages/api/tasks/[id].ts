import type { APIRoute } from 'astro';
import { jsonResponse, getDB, handleAPIError } from '../../../lib/api';

export const prerender = false;

export const PUT: APIRoute = async ({ params, request, locals }) => {
  return handleAPIError(async () => {
    const db = getDB(locals);
    const id = params.id;
    const body = await request.json();
    const { title, description, completed } = body;

    const { results } = await db.prepare(
      'UPDATE tasks SET title = ?, description = ?, completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING *'
    ).bind(title, description || '', completed || false, id).all();

    if (results.length === 0) {
      return jsonResponse({ error: 'Task not found' }, 404);
    }

    return jsonResponse(results[0]);
  });
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  return handleAPIError(async () => {
    const db = getDB(locals);
    const id = params.id;

    const { success } = await db.prepare('DELETE FROM tasks WHERE id = ?').bind(id).run();

    if (!success) {
      return jsonResponse({ error: 'Task not found' }, 404);
    }

    return jsonResponse({ message: 'Task deleted successfully' });
  });
};