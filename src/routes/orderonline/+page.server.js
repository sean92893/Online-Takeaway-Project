import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';
import { db } from '$lib/server/db';
import { users, orders, orderItems, menuItems } from '$lib/server/db/schema.js';
import { eq, inArray } from 'drizzle-orm';

const stripe = new Stripe(STRIPE_SECRET_KEY);

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    return {
        deliveryFee: 2.50,
        minimumOrder: 10.00,
        estimatedDeliveryTime: 30
    };
}

/** @type {import('./$types').Actions} */
export const actions = {
    placeOrder: async ({ request }) => {
        const data = await request.formData();
        const name     = data.get('name')?.toString().trim();
        const address  = data.get('address')?.toString().trim();
        const phone    = data.get('phone')?.toString().trim();
        const email    = data.get('email')?.toString().trim();
        const cartJson = data.get('cart')?.toString();

        if (!name || !address || !phone || !email || !cartJson) {
            return { success: false, error: 'Please fill in all required fields.' };
        }

        let cart;
        try { cart = JSON.parse(cartJson); }
        catch { return { success: false, error: 'Invalid cart data.' }; }

        if (!Array.isArray(cart) || cart.length === 0) {
            return { success: false, error: 'Your cart is empty.' };
        }

        const orderRef = `RTE-${Date.now().toString(36).toUpperCase()}`;
        const origin   = request.headers.get('origin') || 'http://localhost:5173';
        const total    = cart.reduce((sum, item) => sum + item.price * item.qty, 0) + 2.50;

        let user = await db.select().from(users).where(eq(users.email, email)).get();

        if (!user) {
            const [newUser] = await db.insert(users).values({
                name:     name,
                email:    email,
                password: 'guest',
                address:  address,
                phone:    phone
            }).returning();
            user = newUser;
        } else {
            // Update address and phone for existing users on every order
            await db
                .update(users)
                .set({ address, phone })
                .where(eq(users.id, user.id));
        }

        const [order] = await db.insert(orders).values({
            id:         orderRef,
            userId:     user.id,
            totalPrice: total,
            status:     'pending'
        }).returning();

        // Save each cart item to order_items
        const itemNames = cart.map(i => i.name);
        const dbMenuItems = await db
            .select()
            .from(menuItems)
            .where(inArray(menuItems.name, itemNames));

        const nameToId = Object.fromEntries(dbMenuItems.map(m => [m.name, m.id]));

        const orderItemRows = cart
            .filter(i => nameToId[i.name])
            .map(i => ({
                orderId:    order.id,
                menuItemId: nameToId[i.name],
                quantity:   i.qty
            }));

        if (orderItemRows.length > 0) {
            await db.insert(orderItems).values(orderItemRows);
        }

        const lineItems = cart.map(item => ({
            price_data: {
                currency: 'eur',
                product_data: {
                    name:        item.name,
                    description: item.desc,
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.qty,
        }));

        lineItems.push({
            price_data: {
                currency: 'eur',
                product_data: { name: 'Delivery Fee' },
                unit_amount: 250,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items:           lineItems,
            mode:                 'payment',
            customer_email:       email,
            metadata: {
                orderRef,
                orderId: order.id,
                name,
                address,
                phone,
                email,
                cart: cartJson,
            },
            success_url: `${origin}/orderonline/success?ref=${orderRef}`,
            cancel_url:  `${origin}/orderonline?cancelled=true`,
        });

        return { redirect: session.url };
    }
};