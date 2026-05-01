import { db } from '$lib/server/db';
import { orders, orderItems, menuItems } from '$lib/server/db/schema.js';
import { eq, desc } from 'drizzle-orm';

export async function GET({ cookies }) {
    const userId = cookies.get('user_id');

    if (!userId) {
        return new Response(JSON.stringify({ error: 'Not logged in' }), { status: 401 });
    }

    // Get all orders for this user, newest first
    const userOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, userId))
        .orderBy(desc(orders.createdAt));

    // For each order, fetch its items joined with menu item names
    const result = await Promise.all(
        userOrders.map(async (order) => {
            const items = await db
                .select({
                    name:     menuItems.name,
                    quantity: orderItems.quantity,
                    price:    menuItems.price,
                })
                .from(orderItems)
                .innerJoin(menuItems, eq(orderItems.menuItemId, menuItems.id))
                .where(eq(orderItems.orderId, order.id));

            return {
                id:    order.id,
                date:  new Date(order.createdAt).toLocaleDateString('en-IE', {
                    day: 'numeric', month: 'short', year: 'numeric'
                }),
                items: items.length > 0
                    ? items.map(i => `${i.name} ×${i.quantity}`).join(', ')
                    : 'No items recorded',
                total: order.totalPrice.toFixed(2),
                status: order.status,
            };
        })
    );

    return new Response(JSON.stringify(result), { status: 200 });
}