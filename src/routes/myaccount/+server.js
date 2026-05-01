import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";


  // GET user profile (for My Account page)
  // Uses cookie to identify logged-in user
 
export async function GET({ cookies }) {
  const userId = cookies.get("user_id");

  // cookie test for user login
  console.log("USER ID FROM COOKIE:", userId);

  // not logged in
  if (!userId) {
    return new Response(
      JSON.stringify({ error: "Not logged in" }),
      { status: 401 }
    );
  }

  // Get user from DB
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));

  // User not found (edge case)
  if (!user[0]) {
    return new Response(
      JSON.stringify({ error: "User not found" }),
      { status: 404 }
    );
  }

  return new Response(
    JSON.stringify(user[0]),
    { status: 200 }
  );
}


  // POST update user profile
  // Updates name, email, address, phone

export async function POST({ request, cookies }) {
  const userId = cookies.get("user_id");

  // If user not logged in
  if (!userId) {
    return new Response(
      JSON.stringify({ error: "Not logged in" }),
      { status: 401 }
    );
  }

  const data = await request.json();

  // update user in DB
  await db
    .update(users)
    .set({
      name: data.name,
      email: data.email,
      address: data.address,
      phone: data.phone
    })
    .where(eq(users.id, (userId)));

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200 }
  );
}

