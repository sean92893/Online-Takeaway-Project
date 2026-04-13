// api file for my account

import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';

// GET user profile
export async function GET({ locals }) {
  const userId = locals.user.id; // from session
  const user = await db.select().from(users).where(users.id.eq(userId));
  return new Response(JSON.stringify(user[0]));
}

// POST (update) user profile
export async function POST({ request, locals }) {
  const data = await request.json();
  const userId = locals.user.id;

  await db.update(users)
    .set({
      name: data.name,
      email: data.email,
      address: data.address,
      phone: data.phone
    })
    .where(users.id.eq(userId));

  return new Response(JSON.stringify({ success: true }));
}