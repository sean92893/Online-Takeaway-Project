import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';

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

		const origin = request.headers.get('origin') || 'http://localhost:5173';

        const lineItems = cart.map(item => ({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.name,
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
                unit_amount: 250, // €2.50
            },
            quantity: 1,
        });

        //  Stripe Checkout 
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            customer_email: email,
            metadata: {
                orderRef,
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








// import { db } from '$lib/server/db';
// import { menuItems, orders, orderItems } from '$lib/server/db/schema';

// export async function load() {
//   const items = await db.select().from(menuItems);

//   return {
//     menu: items,
//     deliveryFee: 2.5,
//     minimumOrder: 10,
//     estimatedDeliveryTime: 30
//   };
// }

// export const actions = {
//   placeOrder: async ({ request }) => {
//     const formData = await request.formData();

//     const cart = JSON.parse(formData.get('cart'));
//     const name = formData.get('name');
//     const address = formData.get('address');
//     const phone = formData.get('phone');

//     if (!cart || cart.length === 0) {
//       return { success: false, error: 'Cart is empty' };
//     }

//     const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

//     // Create order
//     const [order] = await db.insert(orders).values({
//       userId: 'guest', // replace later with real auth
//       totalPrice: total,
//       status: 'pending'
//     }).returning();

//     // Create order items
//     for (const item of cart) {
//       await db.insert(orderItems).values({
//         orderId: order.id,
//         menuItemId: item.id,
//         quantity: item.qty
//       });
//     }

//     return {
//       success: true,
//       orderRef: order.id
//     };
//   }
// };