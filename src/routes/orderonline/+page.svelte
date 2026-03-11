<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	// import for stores/session file

	import { session } from '$lib/stores/session';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const deliveryFee           = data?.deliveryFee           ?? 2.50;
	const minimumOrder          = data?.minimumOrder          ?? 10.00;
	const estimatedDeliveryTime = data?.estimatedDeliveryTime ?? 30;

	type Item = { id:number; name:string; desc:string; price:number; prepTime:number; mealdbSearch:string; icon:string };
	type Cat  = { id:string; label:string; icon:string; items:Item[] };

	const MENU: Cat[] = [
		{
			id:'starters', label:'Starters', icon:'🥗',
			items:[
				{ id:1,  name:'Garlic Bread',     desc:'Toasted ciabatta with roasted garlic butter & herbs',      price:3.99,  prepTime:5,  mealdbSearch:'garlic bread',    icon:'🥖' },
				{ id:2,  name:'Chicken Wings',    desc:'6 crispy wings — buffalo or BBQ sauce',                    price:7.99,  prepTime:12, mealdbSearch:'chicken wings',   icon:'🍗' },
				{ id:3,  name:'Tomato Soup',      desc:'Velvety roasted tomato soup with a crusty roll',           price:4.99,  prepTime:8,  mealdbSearch:'tomato soup',     icon:'🍲' },
				{ id:4,  name:'Onion Rings',      desc:'Beer-battered golden rings with smoky dipping sauce',      price:4.49,  prepTime:7,  mealdbSearch:'onion rings',     icon:'🧅' },
			]
		},
		{
			id:'mains', label:'Mains', icon:'🍔',
			items:[
				{ id:5,  name:'Classic Burger',      desc:'Beef patty, smoked cheese, lettuce, tomato & brioche bun', price:11.99, prepTime:15, mealdbSearch:'burger',            icon:'🍔' },
				{ id:6,  name:'Chicken Fillet Wrap', desc:'Crispy chicken, crunchy slaw & sriracha mayo',              price:10.49, prepTime:12, mealdbSearch:'chicken wrap',       icon:'🌯' },
				{ id:7,  name:'Margherita Pizza',    desc:'12" stone-baked, San Marzano tomato, fresh mozzarella',     price:12.99, prepTime:18, mealdbSearch:'pizza',              icon:'🍕' },
				{ id:8,  name:'BBQ Pulled Pork',     desc:'Slow-cooked 12hr pork, homemade slaw, brioche bun',         price:13.49, prepTime:20, mealdbSearch:'pulled pork',        icon:'🥩' },
				{ id:9,  name:'Veggie Curry',        desc:'Spiced chickpea & spinach curry with basmati rice',         price:10.99, prepTime:15, mealdbSearch:'vegetable curry',    icon:'🍛' },
				{ id:10, name:'Fish & Chips',        desc:'Beer-battered cod, chunky chips & mushy peas',              price:13.99, prepTime:18, mealdbSearch:'fish chips',         icon:'🐟' },
			]
		},
		{
			id:'sides', label:'Sides', icon:'🍟',
			items:[
				{ id:11, name:'Chunky Chips',       desc:'Hand-cut chips with sea salt & rosemary',         price:3.49, prepTime:8,  mealdbSearch:'chips',         icon:'🍟' },
				{ id:12, name:'Side Salad',         desc:'Mixed leaves, cherry tomatoes & house dressing',  price:3.99, prepTime:4,  mealdbSearch:'salad',         icon:'🥗' },
				{ id:13, name:'Coleslaw',           desc:'Creamy homemade coleslaw with a hint of mustard', price:2.49, prepTime:2,  mealdbSearch:'coleslaw',      icon:'🥬' },
				{ id:14, name:'Sweet Potato Fries', desc:'Crispy sweet potato fries with smoked paprika',   price:3.99, prepTime:10, mealdbSearch:'sweet potato',  icon:'🍠' },
			]
		},
		{
			id:'drinks', label:'Drinks', icon:'🥤',
			items:[
				{ id:15, name:'Soft Drink',         desc:'Coke, Diet Coke, 7UP or Fanta — chilled can',       price:1.99, prepTime:0, mealdbSearch:'lemonade',      icon:'🥤' },
				{ id:16, name:'Still Water',        desc:'500ml chilled bottled water',                       price:1.49, prepTime:0, mealdbSearch:'water',         icon:'💧' },
				{ id:17, name:'Milkshake',          desc:'Thick & creamy — Chocolate, Vanilla or Strawberry', price:4.49, prepTime:5, mealdbSearch:'milkshake',     icon:'🥛' },
				{ id:18, name:'Fresh Orange Juice', desc:'Freshly squeezed OJ, 300ml',                        price:3.49, prepTime:3, mealdbSearch:'orange juice',  icon:'🍊' },
			]
		},
		{
			id:'desserts', label:'Desserts', icon:'🍰',
			items:[
				{ id:19, name:'Chocolate Brownie', desc:'Warm fudge brownie with vanilla bean ice cream', price:5.99, prepTime:6, mealdbSearch:'chocolate brownie', icon:'🍫' },
				{ id:20, name:'Cheesecake',        desc:'NY baked cheesecake with summer berry coulis',   price:5.49, prepTime:4, mealdbSearch:'cheesecake',        icon:'🍰' },
				{ id:21, name:'Ice Cream',         desc:'2 generous scoops — your choice of flavour',    price:3.99, prepTime:3, mealdbSearch:'ice cream',         icon:'🍦' },
			]
		}
	];

	type CartLine = Item & { qty:number; photo:string };
	let cart         = $state<CartLine[]>([]);
	let cartOpen     = $state(false);
	let showCheckout = $state(false);
	let orderPlaced  = $state(false);
	let activeCat    = $state('starters');

	let customerName    = $state('');
	let customerAddress = $state('');
	let customerPhone   = $state('');

	let cartCount    = $derived(cart.reduce((s,i)=>s+i.qty, 0));
	let subtotal     = $derived(cart.reduce((s,i)=>s+i.price*i.qty, 0));
	let meetsMinimum = $derived(subtotal >= minimumOrder);
	let total        = $derived(meetsMinimum ? subtotal + deliveryFee : subtotal);
	let cartJson     = $derived(JSON.stringify(cart));

	
	const FALLBACK: Record<number,string> = {
		1:  'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop&auto=format', // garlic bread slices
		2:  'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop', // chicken wings
		3:  'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop', // tomato soup
		4:  'https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop', // onion rings
		5:  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', // burger
		6:  'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop', // wrap
		7:  'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop', // pizza
		8:  'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=300&fit=crop', // pulled pork
		9:  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop', // curry
		10: 'https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=400&h=300&fit=crop', // fish & chips
		11: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=400&h=300&fit=crop&auto=format', // chips
		12: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', // salad
		13: 'https://images.unsplash.com/photo-1604909052743-94e838986d24?w=400&h=300&fit=crop&auto=format', // coleslaw
		14: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=400&h=300&fit=crop', // sweet potato fries
		15: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop', // soft drink
		16: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop', // water bottle
		17: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop&auto=format', // milkshake
		18: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop', // orange juice
		19: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop', // brownie
		20: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop', // cheesecake
		21: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400&h=300&fit=crop&auto=format', // ice cream
	};

	// Fetch photos from TheMealDB, fall back to hardcoded Unsplash URLs
	let PHOTOS = $state<Record<number,string>>({...FALLBACK});

	$effect(() => {
		MENU.flatMap(c => c.items).forEach(async (item) => {
			try {
				const res  = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(item.mealdbSearch)}`);
				const json = await res.json();
				const meal = json?.meals?.[0];
				if (meal?.strMealThumb) PHOTOS[item.id] = meal.strMealThumb;
			} catch {}
		});
	});

	function addToCart(item: Item): void {
		const photo = PHOTOS[item.id] ?? '';
		const ex = cart.find(c => c.id === item.id);
		cart = ex
			? cart.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c)
			: [...cart, { ...item, qty: 1, photo }];
	}
	function removeOne(id: number): void {
		const ex = cart.find(c => c.id === id);
		if (!ex) return;
		cart = ex.qty === 1 ? cart.filter(c => c.id !== id) : cart.map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c);
	}
	function clearCart(): void { cart = []; }
	function getQty(id: number): number { return cart.find(c => c.id === id)?.qty ?? 0; }
	function fmt(n: number): string { return `€${n.toFixed(2)}`; }
	function goTo(id: string): void {
		activeCat = id;
		document.getElementById('cat-' + id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	$effect(() => {
		if (form?.success) { orderPlaced = true; clearCart(); cartOpen = false; showCheckout = false; }
	});
</script>

<!-- ORDER CONFIRMED -->
{#if orderPlaced && form?.success}
<div class="d-flex align-items-center justify-content-center" style="min-height:60vh; text-align:center;">
	<div>
		<div style="font-size:5rem">🎉</div>
		<h2 class="text-white fw-bold mt-3">Order Confirmed!</h2>
		<p class="text-white-50">Ref: <strong class="text-white">{(form as any).orderRef}</strong></p>
		<p class="text-white-50">Arriving in ~{estimatedDeliveryTime} minutes 🛵</p>
		<div class="mt-3 d-flex gap-2 justify-content-center flex-wrap">
			<button class="btn btn-outline-light" onclick={() => { orderPlaced = false; }}>Order Again</button>
			<a href="/" class="btn btn-outline-light">Back to Home</a>
		</div>
	</div>
</div>

{:else}

<div class="d-flex flex-wrap gap-3 align-items-center px-3 py-2 mb-3 rounded" style="background:rgba(0,0,0,0.4); font-size:.85rem; color:#ddd;">
	<span><i class="bi bi-clock me-1"></i>{estimatedDeliveryTime} min delivery</span>
	<span><i class="bi bi-truck me-1"></i>Delivery: {fmt(deliveryFee)}</span>
	<span><i class="bi bi-bag me-1"></i>Min order: {fmt(minimumOrder)}</span>
</div>


<div class="row g-3">

	<!-- sidebar -->
	<div class="col-auto d-none d-md-block" style="width:180px;">
		<div class="sticky-top" style="top:1rem;">
			<div class="bg-white rounded overflow-hidden border">
				<div class="px-3 py-2 border-bottom" style="font-size:.7rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#999;">Menu</div>
				{#each MENU as cat}
					<button
						class="w-100 text-start border-0 border-bottom px-3 py-2 d-flex align-items-center gap-2 {activeCat === cat.id ? 'text-white' : 'bg-white text-dark'}"
						style="font-size:.84rem; font-weight:600; cursor:pointer; {activeCat === cat.id ? 'background:#c8720a !important;' : ''}"
						onclick={() => goTo(cat.id)}
					>
						<span>{cat.icon}</span>
						<span>{cat.label}</span>
						<span class="ms-auto" style="font-size:.7rem; opacity:.6;">{cat.items.length}</span>
					</button>
				{/each}
			</div>
		</div>
	</div>

	<!-- menu items -->
	<div class="col">
		{#each MENU as cat}
			<section id="cat-{cat.id}" class="mb-4" style="scroll-margin-top:1rem;">
				<div class="d-flex align-items-center gap-2 mb-3 pb-2" style="border-bottom:2px solid #c8720a;">
					<span style="font-size:1.2rem">{cat.icon}</span>
					<h2 class="text-white fw-bold mb-0 text-uppercase" style="font-size:1.15rem; letter-spacing:.03em;">{cat.label}</h2>
				</div>

				<div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
					{#each cat.items as item}
						{@const qty = getQty(item.id)}
						<div class="col">
							<div class="card h-100 border {qty > 0 ? 'border-warning border-2' : ''}" style="border-radius:0;">

							
								<div style="position:relative; height:180px; overflow:hidden;">
									{#if PHOTOS[item.id]}
										<img src={PHOTOS[item.id]} alt={item.name} class="w-100 h-100" style="object-fit:cover; display:block;" />
									{:else}
										<div class="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
											<span style="font-size:3.5rem; opacity:.4;">{item.icon}</span>
										</div>
									{/if}
									
									<div style="position:absolute; top:0; left:0; background:#111; color:#fff; font-size:1.1rem; font-weight:700; font-style:italic; padding:.4rem .75rem; line-height:1;">
										{fmt(item.price)}
									</div>
								</div>

								
								<div class="card-body d-flex flex-column align-items-center text-center gap-2 p-3">
									<h3 class="fw-bold mb-0 text-uppercase" style="font-size:.92rem; letter-spacing:.02em;">{item.name}</h3>
									<p class="text-muted mb-0" style="font-size:.74rem; line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">{item.desc}</p>
									{#if item.prepTime > 0}
										<small class="text-muted">🕐 {item.prepTime} min</small>
									{/if}

									<!-- add / qty -->
									{#if qty === 0}
										<button
											class="btn btn-outline-warning btn-sm rounded-pill mt-auto px-3"
											style="font-size:.73rem; font-weight:700; letter-spacing:.06em;"
											onclick={() => addToCart(item)}
										>ADD TO CART</button>
									{:else}
										<div class="d-flex align-items-center gap-2 mt-auto">
											<button class="btn btn-outline-warning btn-sm rounded-circle" style="width:1.9rem;height:1.9rem;padding:0;font-size:1rem;line-height:1;" onclick={() => removeOne(item.id)}>−</button>
											<span class="fw-bold" style="min-width:1.2rem;text-align:center;">{qty}</span>
											<button class="btn btn-outline-warning btn-sm rounded-circle" style="width:1.9rem;height:1.9rem;padding:0;font-size:1rem;line-height:1;" onclick={() => addToCart(item)}>+</button>
										</div>
									{/if}
								</div>

							</div>
						</div>
					{/each}
				</div>
			</section>
		{/each}
	</div>

</div>

<button
	class="btn btn-danger d-flex align-items-center gap-2"
	style="position:fixed; bottom:1.25rem; left:50%; transform:translateX(-50%); z-index:900; border-radius:4px; padding:.65rem 1.4rem; font-weight:700; text-transform:uppercase; letter-spacing:.04em; box-shadow:0 3px 12px rgba(0,0,0,.4); white-space:nowrap;"
	onclick={() => (cartOpen = true)}
>
	<i class="bi bi-bag-fill"></i>
	{#if cartCount > 0}
		<span>View order · {fmt(total)}</span>
		<span class="badge bg-light text-danger">{cartCount}</span>
	{:else}
		<span>Your order</span>
	{/if}
</button>

{#if cartOpen}
	<div onclick={() => (cartOpen = false)} style="position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:1000;"></div>
	<div style="position:fixed;top:0;right:0;bottom:0;width:100%;max-width:390px;background:#fff;z-index:1010;display:flex;flex-direction:column;box-shadow:-4px 0 20px rgba(0,0,0,.2);animation:slideIn .2s ease;">
		<!-- head -->
		<div class="d-flex align-items-center justify-content-between px-3 py-2 bg-dark text-white flex-shrink-0">
			<span class="fw-bold text-uppercase" style="letter-spacing:.04em;font-size:.9rem;"><i class="bi bi-bag-fill me-2"></i>Your Order</span>
			<button class="btn-close btn-close-white btn-sm" onclick={() => (cartOpen = false)}></button>
		</div>

		<!-- body -->
		<div class="flex-grow-1 overflow-auto">
			{#if cart.length === 0}
				<div class="text-center p-5 text-muted">
					<div style="font-size:3rem">🛒</div>
					<p class="fw-bold text-dark mt-2 mb-1">Your order is empty</p>
					<small>Add items from the menu</small>
				</div>
			{:else}
				{#each cart as line (line.id)}
					<div class="d-flex align-items-center gap-2 px-3 py-2 border-bottom">
						{#if line.photo}
							<img src={line.photo} alt={line.name} style="width:46px;height:46px;object-fit:cover;flex-shrink:0;" />
						{:else}
							<div style="width:46px;height:46px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;">{line.icon}</div>
						{/if}
						<div class="flex-grow-1 overflow-hidden">
							<div class="fw-bold text-truncate" style="font-size:.83rem;">{line.name}</div>
							<div class="text-muted" style="font-size:.7rem;">{fmt(line.price)} each</div>
						</div>
						<div class="d-flex align-items-center gap-1 flex-shrink-0">
							<button class="btn btn-outline-warning btn-sm rounded-circle p-0" style="width:1.6rem;height:1.6rem;font-size:.85rem;line-height:1;" onclick={() => removeOne(line.id)}>−</button>
							<span class="fw-bold" style="font-size:.82rem;min-width:1rem;text-align:center;">{line.qty}</span>
							<button class="btn btn-outline-warning btn-sm rounded-circle p-0" style="width:1.6rem;height:1.6rem;font-size:.85rem;line-height:1;" onclick={() => addToCart(line)}>+</button>
						</div>
						<div class="fw-bold text-danger flex-shrink-0" style="font-size:.85rem;min-width:46px;text-align:right;">{fmt(line.price*line.qty)}</div>
					</div>
				{/each}

				<div class="px-3 pt-2 border-top border-2">
					<div class="d-flex justify-content-between text-muted mb-1" style="font-size:.83rem;"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
					{#if meetsMinimum}
						<div class="d-flex justify-content-between text-muted mb-1" style="font-size:.83rem;"><span>Delivery</span><span>{fmt(deliveryFee)}</span></div>
					{:else}
						<div class="alert alert-warning py-1 px-2 mb-1" style="font-size:.77rem;">Add {fmt(minimumOrder - subtotal)} more for delivery</div>
					{/if}
					<div class="d-flex justify-content-between fw-bold border-top pt-2" style="font-size:.95rem;"><span>Total</span><span>{fmt(meetsMinimum ? total : subtotal)}</span></div>
				</div>
			{/if}
		</div>

		{#if cart.length > 0}
			<div class="p-3 border-top d-flex flex-column gap-2 flex-shrink-0">
				{#if meetsMinimum}
					<button class="btn btn-danger w-100 fw-bold text-uppercase" style="letter-spacing:.04em;" onclick={() => { showCheckout = true; cartOpen = false; }}>
						Checkout — {fmt(total)}
					</button>
				{:else}
					<button class="btn btn-secondary w-100 fw-bold text-uppercase" disabled>Add {fmt(minimumOrder - subtotal)} more</button>
				{/if}
				<button class="btn btn-outline-secondary w-100 btn-sm" onclick={clearCart}>Clear order</button>
			</div>
		{/if}
	</div>
{/if}

{#if showCheckout}
	<div onclick={() => (showCheckout = false)} style="position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:1040;"></div>
	<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:1050;width:100%;max-width:480px;max-height:90vh;overflow-y:auto;background:#fff;box-shadow:0 8px 40px rgba(0,0,0,.3);">
		<div class="d-flex align-items-center justify-content-between px-3 py-2 bg-dark text-white">
			<span class="fw-bold text-uppercase" style="letter-spacing:.04em;"><i class="bi bi-bag-check me-2"></i>Checkout</span>
			<button class="btn-close btn-close-white btn-sm" onclick={() => (showCheckout = false)}></button>
		</div>
		<div class="p-3 d-flex flex-column gap-3">

			<!-- order summary -->
			<div class="border rounded p-2 bg-light">
				{#each cart as line (line.id)}
					<div class="d-flex align-items-center gap-2 mb-2" style="font-size:.83rem;">
						{#if line.photo}
							<img src={line.photo} alt={line.name} style="width:32px;height:32px;object-fit:cover;flex-shrink:0;" />
						{:else}
							<span style="font-size:1.3rem;">{line.icon}</span>
						{/if}
						<span class="flex-grow-1">{line.name} ×{line.qty}</span>
						<span class="fw-bold text-danger">{fmt(line.price*line.qty)}</span>
					</div>
				{/each}
				<div class="d-flex justify-content-between fw-bold border-top pt-2 mt-1" style="font-size:.9rem;">
					<span>Total inc. delivery</span><span>{fmt(total)}</span>
				</div>
			</div>

			<form method="POST" action="?/placeOrder" use:enhance={() => async ({ update }) => { await update(); }}>
				<input type="hidden" name="cart" value={cartJson} />

				{#if form && !(form as any).success && (form as any).error}
					<div class="alert alert-danger py-2 px-3" style="font-size:.82rem;">{(form as any).error}</div>
				{/if}

				<div class="mb-2">
					<label class="form-label fw-bold" style="font-size:.82rem;">Full Name *</label>
					<input name="name" type="text" class="form-control form-control-sm" placeholder="Jane Doe" bind:value={customerName} required />
				</div>
				<div class="mb-2">
					<label class="form-label fw-bold" style="font-size:.82rem;">Delivery Address *</label>
					<textarea name="address" class="form-control form-control-sm" rows={2} placeholder="12 Main Street, Dublin" bind:value={customerAddress} required></textarea>
				</div>
				<div class="mb-3">
					<label class="form-label fw-bold" style="font-size:.82rem;">Phone *</label>
					<input name="phone" type="tel" class="form-control form-control-sm" placeholder="08X XXX XXXX" bind:value={customerPhone} required />
				</div>

				<button type="submit" class="btn btn-danger w-100 fw-bold text-uppercase" style="letter-spacing:.04em;">
					<i class="bi bi-lock me-1"></i>Place Order — {fmt(total)}
				</button>
				<button type="button" class="btn btn-outline-secondary w-100 btn-sm mt-2" onclick={() => (showCheckout = false)}>← Back</button>
			</form>
		</div>
	</div>
{/if}

{/if}

<style>
@keyframes slideIn {
	from { transform: translateX(100%); }
	to   { transform: translateX(0); }
}
</style>