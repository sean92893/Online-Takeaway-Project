// src/routes/orderonline/webhook/+server.js
import Stripe from 'stripe';
import { Resend } from 'resend';
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY, RESTAURANT_EMAIL } from '$env/static/private';
import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(STRIPE_SECRET_KEY);
const resend  = new Resend(RESEND_API_KEY);

export async function POST({ request }) {
    // Read raw body as ArrayBuffer — preserves exact bytes for Stripe signature check
    const rawBody   = await request.arrayBuffer();
    const buf       = Buffer.from(rawBody);
    const signature = request.headers.get('stripe-signature');

    let event;
    try {
        event = stripe.webhooks.constructEvent(buf, signature, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature failed:', err.message);
        return new Response('Webhook Error', { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { orderRef, orderId, name, address, phone, email, cart: cartJson } = session.metadata;
        const cart  = JSON.parse(cartJson);
        const total = (session.amount_total / 100).toFixed(2);

        // Update order status to 'paid' in database
        await db.update(orders)
            .set({ status: 'paid' })
            .where(eq(orders.id, orderId));

        console.log(`Order ${orderRef} marked as paid in database`);

        // Build email HTML
        const itemRows = cart.map(i =>
            `<tr>
                <td style="padding:4px 8px;">${i.name}</td>
                <td style="padding:4px 8px;text-align:center;">${i.qty}</td>
                <td style="padding:4px 8px;text-align:right;">€${(i.price * i.qty).toFixed(2)}</td>
            </tr>`
        ).join('');

        const html = `
            <h2 style="color:#c0392b;">Order Confirmed! 🎉</h2>
            <p>Hi <strong>${name}</strong>, thanks for your order!</p>
            <p><strong>Order ref:</strong> ${orderRef}</p>
            <p><strong>Delivering to:</strong> ${address}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                <thead>
                    <tr style="background:#f8f8f8;">
                        <th style="padding:4px 8px;text-align:left;">Item</th>
                        <th style="padding:4px 8px;">Qty</th>
                        <th style="padding:4px 8px;text-align:right;">Price</th>
                    </tr>
                </thead>
                <tbody>${itemRows}</tbody>
            </table>
            <p><strong>Total paid: €${total}</strong></p>
            <p style="color:#888;font-size:.85em;">Estimated delivery: ~30 minutes</p>
        `;

        // Email to customer
        await resend.emails.send({
            from:    'onboarding@resend.dev',
            to:      email,
            subject: `Your order is confirmed — ${orderRef}`,
            html,
        });

        // Email to restaurant
        await resend.emails.send({
            from:    'onboarding@resend.dev',
            to:      RESTAURANT_EMAIL,
            subject: `New order ${orderRef} from ${name}`,
            html:    `<p><strong>Customer:</strong> ${name} | ${phone} | ${email}</p>
                      <p><strong>Address:</strong> ${address}</p>${html}`,
        });

        console.log(`Order ${orderRef} — emails sent to ${email} and ${RESTAURANT_EMAIL}`);
    }

    // If payment was cancelled, update order status to 'cancelled'
    if (event.type === 'checkout.session.expired') {
        const session = event.data.object;
        const { orderId } = session.metadata;
        if (orderId) {
            await db.update(orders)
                .set({ status: 'cancelled' })
                .where(eq(orders.id, orderId));
            console.log(`Order ${orderId} marked as cancelled`);
        }
    }

    return new Response('OK', { status: 200 });
}