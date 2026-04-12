<!-- X00224599 -->
<script>
  import { deliveryAddress } from '$lib/stores.js';
  
  let { onSubmit, onError } = $props();

  let address = $state('');
  let error = $state('');

  function handleSubmit() {
    if (!address.trim()) {
      error = 'Please enter a delivery address.';
      onError?.('Please enter a delivery address.');
      return;
    }
    error = '';
    deliveryAddress.set(address); 
    onSubmit?.(address);
  }
</script>

<section class="text-white">
  <div class="container">
    <div class="row align-items-center">

      <div class="col-md-3 d-none d-md-flex">
        <img src="burger-remove.png" alt="Food Left"
          class="img-fluid" style="margin-right: 10%;" />
      </div>

      <div class="col-md-6 col-12 text-center">
        <h1 class="mb-2">Hungry? Order food and get delivered</h1>
        <p class="lead mb-4">Enter your address to get started</p>

        <form onsubmit={handleSubmit}>
          <div class="input-group input-group-lg">
            <span class="input-group-text"><i class="bi bi-geo-alt-fill"></i></span>
            <input
              type="text"
              class="form-control"
              bind:value={address}
              placeholder="Enter your delivery address..."
            />
            <button class="btn btn-dark" type="button" onclick={handleSubmit}>Find Food</button>
          </div>
          {#if error}
            <p class="text-dark mt-2">{error}</p>
          {/if}
        </form>
      </div>

      <div class="col-md-3 d-none d-md-block">
        <img src="deliveryman.png" alt="Delivery Man"
          class="img-fluid" style="margin-left: 10rem;" />
      </div>

    </div>
  </div>
</section>