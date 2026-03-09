

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
		const cartJson = data.get('cart')?.toString();

		if (!name || !address || !phone || !cartJson) {
			return { success: false, error: 'Please fill in all required fields.' };
		}
		let cart;
		try { cart = JSON.parse(cartJson); }
		catch { return { success: false, error: 'Invalid cart data.' }; }

		if (!Array.isArray(cart) || cart.length === 0) {
			return { success: false, error: 'Your cart is empty.' };
		}

		const orderRef = `RTE-${Date.now().toString(36).toUpperCase()}`;
		console.log(`New order ${orderRef}:`, { name, address, phone, items: cart.length });

		return { success: true, orderRef };
	}
};