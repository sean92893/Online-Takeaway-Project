<script>
	let { data } = $props();
	const euro = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });
</script>

<svelte:head>
	<title>Payment Successful — Ready To Eat</title>
</svelte:head>

<div class="row justify-content-center">
	<div class="col-md-4">
		<div
			class="card border-0 shadow"
			style="margin-top: 30%;font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;background: white"
		>
			<div class="card-body text-center p-5 text-dark">
				<div class="mb-5">
					<i class="bi bi-check-circle-fill text-success" style="font-size: 8rem;"></i>
				</div>

				<h3 class="fw-bold mb-3" style="color: #ff912b;">Thank You For Your Order!</h3>

				<p class="text-muted mb-5">
					Your payment of <strong class="text-dark">{euro.format(data.amount / 100)}</strong> was
					successful.<br />
					A gift voucher has been emailed to
					<strong class="text-dark">{data.recipientName}</strong> at
					<strong class="text-dark">{data.recipientEmail}</strong>.
				</p>

				<div class="card border mb-4" style="background:#f8f9fa;">
					<div class="card-body py-3">
						<div class="row text-start g-2">
							<div class="col-6">
								<p class="text-muted small mb-0" style="letter-spacing:1px;">FROM</p>
								<p class="fw-bold mb-0">{data.senderName}</p>
							</div>
							<div class="col-6">
								<p class="text-muted small mb-0" style="letter-spacing:1px;">TO</p>
								<p class="fw-bold mb-0">{data.recipientName}</p>
							</div>
							<div class="col-12 mt-2">
								<p class="text-muted small mb-0" style="letter-spacing:1px;">AMOUNT PAID</p>
								<p class="fw-bold fs-4 mb-0" style="color: #ff912b;">
									{euro.format(data.amount / 100)}
								</p>
							</div>
						</div>
					</div>
				</div>

				<p class="text-muted small mb-4">
					<i class="bi bi-envelope me-1"></i>
					Check the spam folder if the email doesn't arrive in a few minutes.
				</p>
				<a
					href="/vouchers"
					class="btn btn-lg fw-bold"
					style="background: #CD1C18; color: white; border: none;"
				>
					<i class="bi bi-plus-circle me-1"></i>Send Another Voucher
				</a>
			</div>
		</div>
	</div>
</div>
