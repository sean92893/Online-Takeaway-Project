import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";

export async function POST({ request }) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return new Response(JSON.stringify({ error: "Missing fields" }), {
      status: 400
    });
  }

  try {
    await db.insert(users).values({
      name,
      email,
      password
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Email already exists" }), {
      status: 400
    });
  }
}