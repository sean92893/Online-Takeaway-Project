import { db } from "$lib/server/db";
import { users } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

export async function POST({ request, cookies }) {
  try {
    const { email, password } = await request.json();

    // Find the user in the database
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    // User not found
    if (!user[0]) {
      return new Response(
        JSON.stringify({ success: false, error: "User not found" }),
        { status: 400 }
      );
    }

    // if wrong password (basic version — no hashing yet)
    if (user[0].password !== password) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid password" }),
        { status: 400 }
      );
    }

    // Set cookie for login
    cookies.set("user_id", String(user[0].id), {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: false, // set true in HTTPS
      maxAge: 60 * 60 * 24 // 1 day
    });

    // Return user data to frontend
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user[0].id,
          name: user[0].name,
          email: user[0].email
        }
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: "Server error" }),
      { status: 500 }
    );
  }
}