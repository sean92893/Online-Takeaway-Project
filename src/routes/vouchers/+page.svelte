<!-- X00224599 -->
<script>
	import { enhance } from '$app/forms';

	let { form } = $props();
	let submitting = $state(null);

	const vouchers = [
		{ value: 1000, label: '€10', title: 'Gift Voucher €10' },
		{ value: 2000, label: '€20', title: 'Gift Voucher €20' },
		{ value: 2500, label: '€25', title: 'Gift Voucher €25' },
		{ value: 3000, label: '€30', title: 'Gift Voucher €30' },
		{ value: 4000, label: '€40', title: 'Gift Voucher €40' },
		{ value: 5000, label: '€50', title: 'Gift Voucher €50' }
	];

	const euro = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });

	let selected = $state(null);
	let recipientName = $state('');
	let recipientEmail = $state('');
	let senderName = $state('');
	let message = $state('');

	function selectVoucher(v) {
		selected = v;
		recipientName = '';
		recipientEmail = '';
		senderName = '';
		message = '';
	}

	function closeModal() {
		selected = null;
	}
</script>

<svelte:head>
	<title>Gift Vouchers — Ready To Eat</title>
</svelte:head>

<div class="voucher-hero mb-5">
	<h1 class="display-4 fw-bold text-white">Gift Vouchers</h1>
	<h4 class="fw-bold text-white mt-2" style="letter-spacing:1px;">Ready To Eat</h4>
</div>

{#if form?.error}
	<div class="alert alert-danger border-0 mb-4">
		<i class="bi bi-exclamation-triangle me-2"></i>{form.error}
	</div>
{/if}

<div class="row g-4 mb-5">
	{#each vouchers as v}
		<div class="col-md-4" style="margin-bottom: 5%;">
			<div class="voucher-card">
				<div class="voucher-img-wrap">
					<div class="voucher-img-placeholder">
						<img src="voucher.jpg" alt="Gift Voucher" class="voucher-img" />
					</div>
				</div>
				<div class="voucher-info">
					<p class="voucher-title mb-1">{v.title}</p>
					<p class="voucher-price mb-3">{euro.format(v.value / 100)}</p>
					<button class="btn voucher-btn w-25" onclick={() => selectVoucher(v)}>Pay Now </button>
				</div>
			</div>
		</div>
	{/each}
</div>

{#if selected}
	<div class="modal-backdrop-custom" onclick={closeModal}></div>
	<div class="modal-custom">
		<div class="modal-custom-dialog">
			<div class="modal-custom-header">
				<h5 class="mb-0 fw-bold text-white">
					<i class="bi bi-gift me-2"></i>{selected.title}
				</h5>
				<button class="btn-close btn-close-white" onclick={closeModal}></button>
			</div>
			<div class="modal-custom-body">
				<form
					method="post"
					action="?/proceed"
					use:enhance={() => {
						submitting = selected.value;
						return async ({ update }) => {
							await update();
							submitting = null;
						};
					}}
				>
					<input type="hidden" name="amount" value={selected.value} />

					<p class="text-uppercase text-white-50 small mb-3" style="letter-spacing:1px;">
						Recipient Details
					</p>

					<div class="mb-3">
						<label for="recipientName" class="form-label text-white"
							>Recipient's Name <span class="text-danger">*</span></label
						>
						<input
							type="text"
							class="form-control bg-dark text-white border-secondary"
							id="recipientName"
							name="recipientName"
							placeholder="Who is this for?"
							bind:value={recipientName}
							required
						/>
					</div>

					<div class="mb-4">
						<label for="recipientEmail" class="form-label text-white"
							>Recipient's Email <span class="text-danger">*</span></label
						>
						<input
							type="email"
							class="form-control bg-dark text-white border-secondary"
							id="recipientEmail"
							name="recipientEmail"
							placeholder="Where should we send the voucher?"
							bind:value={recipientEmail}
							required
						/>
					</div>

					<hr class="border-secondary my-3" />
					<p class="text-uppercase text-white-50 small mb-3" style="letter-spacing:1px;">
						Your Details
					</p>

					<div class="mb-3">
						<label for="senderName" class="form-label text-white"
							>Your Name <span class="text-danger">*</span></label
						>
						<input
							type="text"
							class="form-control bg-dark text-white border-secondary"
							id="senderName"
							name="senderName"
							placeholder="So they know who it's from!"
							bind:value={senderName}
							required
						/>
					</div>

					<div class="mb-4">
						<label for="message" class="form-label text-white">
							Personal Message <span class="text-white-50">(optional)</span>
						</label>
						<textarea
							class="form-control bg-dark text-white border-secondary"
							id="message"
							name="message"
							rows="3"
							placeholder="Add a personal note..."
							bind:value={message}
						></textarea>
					</div>

					<div class="card bg-dark border-secondary mb-4">
						<div class="card-body d-flex justify-content-between align-items-center py-3">
							<span class="text-white-50">{selected.title}</span>
							<span class="fw-bold fs-5 text-white">{euro.format(selected.value / 100)}</span>
						</div>
					</div>

					<div class="d-grid">
						<button
							class="btn btn-lg fw-bold"
							type="submit"
							disabled={submitting === selected.value}
							style="background:#CD1C18;color:white;border:none;"
						>
							{#if submitting === selected.value}
								<span class="spinner-border spinner-border-sm me-2" role="status"
								></span>Redirecting…
							{:else}
								<i class="bi bi-lock-fill me-2"></i>Checkout
							{/if}
						</button>
					</div>

					<p class="text-white-50 text-center small mt-3 mb-0">
						<i class="bi bi-shield-check me-1"></i>
						Payments processed securely by Stripe. Voucher emailed after payment.
					</p>
				</form>
			</div>
		</div>
	</div>
{/if}

<style>
	.voucher-hero {
		min-height: 220px;
		border-radius: 12px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 40px 20px;
	}

	.voucher-card {
		border-radius: 3%;
		overflow: hidden;
		border: 1px solid rgb(168, 3, 3);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	.voucher-card:hover {
		transform: translateY(-10px);
		box-shadow: black
	}

	.voucher-img-wrap {
		width: 100%;
		aspect-ratio: 2/1;
		overflow: hidden;
	}

	.voucher-img-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		object-fit: contain;
	}

	.voucher-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		display: block;
	}
	.voucher-info {
		padding: 14px;
		background: white;
	}

	.voucher-title {
		color: #111;
		font-weight: 500;
		font-size: 0.95rem;
	}

	.voucher-price {
		color: #444;
		font-size: 0.9rem;
	}

	.voucher-btn {
		background: transparent;
		border: 1px solid rgb(245, 60, 60);
		color: #ff912b;
		font-weight: 600;
		border-radius: 4px;
		padding: 8px;
		transition:
			background 0.2s,
			color 0.2s;
	}

	.voucher-btn:hover {
		background: green;
		color: #fff;
	}

	.modal-backdrop-custom {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.75);
	}

	.modal-custom {
		position: fixed;
		inset: 0;
		z-index: 1050;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10px;
		pointer-events: none;
	}

	.modal-custom-dialog {
		background: #1a1a1a;
		border: 1px solid #333;
		border-radius: 12px;
		width: 100%;
		max-width: 520px;
		overflow-y: auto;
		pointer-events: all;
	}

	.modal-custom-header {
		background: rgba(205, 28, 24, 0.85);
		padding: 16px 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 12px 12px 0 0;
	}

	.modal-custom-body {
		padding: 24px;
	}

	:global(.bg-dark::placeholder) {
		color: #6c757d;
	}
	:global(.form-control.bg-dark:focus) {
		background-color: #1a1a1a;
		border-color: #cd1c18;
		color: white;
	}
</style>
