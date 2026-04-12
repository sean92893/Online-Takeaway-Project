// X00224599

import { stripe } from '$lib/server/stripe.js';
import { json } from '@sveltejs/kit';
import { voucherService } from '$lib/server/services/voucher-service.js';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';


//  Stripe calls this after a successful payment.
//  voucher is only created after payment confirmed.

export const POST = async ({ request }) => {
  // 1. Get Stripe signature header
  const sig = request.headers.get('stripe-signature');

  // 2. Read raw body (required for Stripe signature verification)
  const rawBody = await request.text();

  let event;

  try {
    //  Verify webhook signature
    event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Only proceed if payment is paid
    if (session.payment_status !== 'paid') {
      return json({ received: true });
    }

    
    const { recipientName, recipientEmail, senderName, message, amount } = session.metadata;

    try {
      // Create voucher + send email (only after payment confirmed)
      await voucherService.purchaseVoucher({
        recipientName,
        recipientEmail,
        senderName,
        amount: Number(amount),
        message
      });

      console.log(`Voucher created and emailed to ${recipientEmail} after payment`);
    } catch (err) {
      console.error('Failed to create voucher after payment:', err);
    }
  }

  
  return json({ received: true });
};