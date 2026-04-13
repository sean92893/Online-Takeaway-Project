<!-- X00224599 -->
<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import 'bootstrap-icons/font/bootstrap-icons.min.css';

  onMount(async () => {
    if (browser) {
      await import('bootstrap');
    }
  });

  let { children } = $props();
</script>

<!-- Header with Navbar — matches your main project layout -->
<header class="navbar navbar-expand-md navbar-dark bd-navbar bg-dark">
  <nav class="w-100 d-flex align-items-center" aria-label="Main navigation">
    <div class="container-fluid main-wrapper d-flex justify-content-between align-items-center">
      <a class="navbar-brand" href="/">
        <i class="bi bi-dice-3-fill me-2"></i>
        <span style="color: #CD1C18; font-family: fantasy;">Ready To Eat</span>
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link" href="/">
              <i class="bi bi-house me-1" style="margin-left: 1.5rem;"></i>Home
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/orderonline">
              <i class="bi bi-fork-knife me-1" style="margin-left: 1.5rem;"></i>Order Online
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/myaccount">
              <i class="bi bi-person me-1" style="margin-left: 1.5rem;"></i>My Account
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/vouchers">
              <i class="bi bi-gift me-1" style="margin-left: 1.5rem;"></i>Gift Vouchers
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</header>

<style>
 :global(body) {
    min-height: 100vh;
    background: linear-gradient(135deg, #ff912b, #ca0d0d);
    background-attachment: fixed;
    display: flex;
    flex-direction: column;
  }

  :global(.bd-layout) {
    flex: 1;
  }

.nav-link:hover {
    color: red;
    transition: color 0.2s ease;
    border-radius: 2rem;
  }
</style>

<div class="container-xl bd-gutter my-md-4 bd-layout">
  {@render children()}
</div>

<footer class="bg-dark text-secondary text-center py-3">
  <p class="mb-0">©2026 READY TO EAT. ALL RIGHTS RESERVED.</p>
</footer>