// X00224599
import { stripe } from '$lib/server/db/stripe.js';
import { fail, redirect } from '@sveltejs/kit';
import { ORIGIN } from '$env/static/private';

export async function load() {
  return {};
}

export const actions = {

  // validate voucher details, create Stripe checkout session based of lab 9
  proceed: async ({ request }) => {
    const data = await request.formData();

    const recipientName  = data.get('recipientName')?.toString().trim();
    const recipientEmail = data.get('recipientEmail')?.toString().trim();
    const senderName     = data.get('senderName')?.toString().trim();
    const message        = data.get('message')?.toString().trim() ?? '';
    const amount         = Number(data.get('amount'));

    // Validate fields
    if (!recipientName || !recipientEmail || !senderName) {
      return fail(400, {
        error: 'Please fill in all required fields.',
        values: { recipientName, recipientEmail, senderName, message, amount }
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      return fail(400, {
        error: 'Please enter a valid email address for the recipient.',
        values: { recipientName, recipientEmail, senderName, message, amount }
      });
    }

    const validAmounts = [1000, 2000, 2500, 3000, 4000, 5000];
    if (!validAmounts.includes(amount)) {
      return fail(400, {
        error: 'Please select a valid voucher amount.',
        values: { recipientName, recipientEmail, senderName, message, amount }
      });
    }

    // Create Stripe Checkout session lab 9
    // Voucher details are passed via metadata — webhook uses these to create the voucher
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: recipientEmail,
      metadata: {
        recipientName,
        recipientEmail,
        senderName,
        message,
        amount: amount.toString()
      },
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Ready To Eat Gift Voucher`,
              description: `From ${senderName} to ${recipientName}`
            },
            unit_amount: amount  // already in cents
          },
          quantity: 1
        }
      ],
      success_url: `${ORIGIN}/vouchers/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${ORIGIN}/vouchers`
    });

    
    throw redirect(303, session.url);
  }
};