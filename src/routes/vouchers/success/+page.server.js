// X00224599
import { error } from '@sveltejs/kit';
import { stripe } from '$lib/server/db/stripe.js';



export async function load({ url }) {
  const sessionId = url.searchParams.get('session_id');

  if (!sessionId) {
    throw error(400, 'Missing session ID');
  }

  // Verify payment with Stripe
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== 'paid') {
    throw error(400, 'Payment not completed');
  }

  // Return details for display 
  return {
    recipientName:  session.metadata?.recipientName,
    recipientEmail: session.metadata?.recipientEmail,
    senderName:     session.metadata?.senderName,
    amount:         Number(session.metadata?.amount)
  };
}