<script>
    import { page } from '$app/stores';
    const ref = $page.url.searchParams.get('ref') ?? '';
</script>

<div class="container text-center py-5">
    <i class="bi bi-check-circle-fill text-success" style="font-size:5rem;"></i>
    <h2 class="fw-bold text-success mt-3">Payment Successful!</h2>
    <p class="text-muted">Order reference: <strong>{ref}</strong></p>
    <p>A confirmation email is on its way. Your food will arrive in ~30 minutes.</p>
    <p><i class="bi bi-bicycle me-1"></i>Our driver is on the way!</p>
    <a href="/" class="btn btn-danger mt-3">
        <i class="bi bi-house me-1"></i>Back to Home
    </a>
</div>