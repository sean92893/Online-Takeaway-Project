import { redirect } from "@sveltejs/kit";

export function GET({ cookies }) {
  cookies.delete("user_id", { path: "/" });

  return new Response(JSON.stringify({ success: true }));
}