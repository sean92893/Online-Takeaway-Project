<script>
	import AddressForm from '$lib/components/AddressForm.svelte';

	let savedAddress = $state('');
	let formError = $state('');

	function handleAddress(address) {
		savedAddress = address;
		formError = '';
		console.log('Finding food near:', savedAddress);
	}

	function handleError(error) {
		formError = error;
		savedAddress = '';
		console.log('Error:', formError);
	}
</script>

<AddressForm onSubmit={handleAddress} onError={handleError} />

<section class="px-0 mx-0">
	<img
		src="free.png"
		alt="Free Delivery Over €30"
		style="width: 100%; height: 900px; width: 100vw; margin-left: calc(-50vw + 50%);"
	/>
</section>

<section
	style="background-color: #1a1a1a; padding: 5rem 0; width: 100vw; margin-left: calc(-50vw + 50%);"
>
	<div class="container text-center text-white">
		<h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 4rem;">
			Simple. Fast. Delicious.
		</h2>

		<div class="row justify-content-center g-5">
			<div class="col-md-4">
				<h3 style="font-size: 3rem; font-weight: 900; color: white;">Step 1</h3>
				<h5 style="font-weight: 700; margin: 1rem 0 0.5rem;">Create an Account</h5>
				<p style="color: #aaa; font-size: 0.95rem;">
					Tell us a bit about yourself and get Free Delivery
				</p>
			</div>

			<div class="col-md-4">
				<h3 style="font-size: 3rem; font-weight: 900; color: white;">Step 2</h3>
				<h5 style="font-weight: 700; margin: 1rem 0 0.5rem;">Find What You Want</h5>
				<p style="color: #aaa; font-size: 0.95rem;">
					Browse dishes, cuisines and restaurants near you
				</p>
			</div>

			<div class="col-md-4">
				<h3 style="font-size: 3rem; font-weight: 900; color: white;">Step 3</h3>
				<h5 style="font-weight: 700; margin: 1rem 0 0.5rem;">Enjoy your order</h5>
				<p style="color: #aaa; font-size: 0.95rem;">Get it delivered — we'll keep you updated</p>
			</div>
		</div>
	</div>
</section>

<section>
	<div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="carousel">
		<div class="carousel-indicators">
			<button
				type="button"
				data-bs-target="#carouselExampleCaptions"
				data-bs-slide-to="0"
				class="active"
				aria-current="true"
				aria-label="Slide 1"
			></button>
			<button
				type="button"
				data-bs-target="#carouselExampleCaptions"
				data-bs-slide-to="1"
				aria-label="Slide 2"
			></button>
			<button
				type="button"
				data-bs-target="#carouselExampleCaptions"
				data-bs-slide-to="2"
				aria-label="Slide 3"
			></button>
		</div>
		<div class="carousel-inner">
			<div class="carousel-item active">
				<img
					src="review1.png"
					class="d-block w-100"
					alt="review1"
					style="height: 800px; object-fit: cover;"
				/>
				<div class="carousel-caption d-none d-md-block">
					<h5 style="color:black;">"Always quick and easy"</h5>
					<p style="color:#333;">@JefferyEbose</p>
				</div>
			</div>

			<div class="carousel-item">
				<img
					src="review2.png"
					class="d-block w-100"
					alt="review2"
					style="height: 800px; object-fit: cover;"
				/>
				<div class="carousel-caption d-none d-md-block">
					<h5 style="color:black;">
						"All the best restaurants at your fingertips, no calls needed. Food delivered on time"
					</h5>
					<p style="color: #333;">@SeanMoran</p>
				</div>
			</div>

			<div class="carousel-item">
				<img
					src="review3.png"
					class="d-block w-100"
					alt="review3"
					style="height: 800px; object-fit: cover;"
				/>
				<div class="carousel-caption d-none d-md-block">
					<h5 style="color:black;">
						"The food is always fresh and up to standard, its the only place we go to for takeaway"
					</h5>
					<p style="color:#333;">@SaranuwatS</p>
				</div>
			</div>
		</div>
		<button
			class="carousel-control-prev"
			type="button"
			data-bs-target="#carouselExampleCaptions"
			data-bs-slide="prev"
		>
			<span class="carousel-control-prev-icon" aria-hidden="true"></span>
			<span class="visually-hidden">Previous</span>
		</button>
		<button
			class="carousel-control-next"
			type="button"
			data-bs-target="#carouselExampleCaptions"
			data-bs-slide="next"
		>
			<span class="carousel-control-next-icon" aria-hidden="true"></span>
			<span class="visually-hidden">Next</span>
		</button>
	</div>
</section>

<section>
	<div class="row g-5 mt-5" style="margin-top: 8rem;">
		<div class="col-md-4">
			<div class="card">
				<img
					class="card-img-top"
					src="greencurry.jpg"
					alt="Curry"
					style="height: 200px; object-fit: cover;"
				/>
				<div class="card-body">
					<h5 class="card-title">Top Curry in Dublin</h5>
					<p class="card-text">
						Discover the best curry spots in Dublin.
					</p>
					<a
						href="https://www.tripadvisor.ie/FindRestaurants?geo=186605&dishes=20181&onlineOptions=20692&broadened=false"
						class="btn btn-warning">Read More</a
					>
				</div>
			</div>
		</div>

		<div class="col-md-4">
			<div class="card h-100">
				<img
					class="card-img-top"
					src="noodlesTop.jpg"
					alt="noodles"
					style="height: 200px; object-fit: cover;"
				/>
				<div class="card-body">
					<h5 class="card-title">Top Noodles in Dublin</h5>
					<p class="card-text">
						Discover the best noodles in Dublin.
					</p>
					<a
						href="https://www.tripadvisor.ie/FindRestaurants?geo=186605&dishes=10645&onlineOptions=20692&broadened=false"
						class="btn btn-warning">Read More</a
					>
				</div>
			</div>
		</div>

		<div class="col-md-4">
			<div class="card h-100">
				<img
					class="card-img-top"
					src="fishchips.jpg"
					alt="fish&chips"
					style="height: 200px; object-fit: cover;"
				/>
				<div class="card-body">
					<h5 class="card-title">Top Fish & Chips in Dublin</h5>
					<p class="card-text">
						Discover the best fish & Chips in Dublin.
					</p>
					<a
						href="https://www.tripadvisor.ie/FindRestaurants?geo=186605&dishes=10901&onlineOptions=20692&broadened=false"
						class="btn btn-warning">Read More</a
					>
				</div>
			</div>
		</div>
	</div>
</section>

<div style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; min-width: 300px;">
	<div class="alert alert-light alert-dismissible fade show" role="alert">
		<h4 class="alert-heading">Wassupp!</h4>
		<p>Sign up now and enjoy <strong>FREE delivery</strong> on your first order!</p>
		<hr />
		<p class="mb-2 bi bi-pin-fill">
			Don't miss out — create your account today and we'll take care of the shipping!
		</p>
		<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
	</div>
</div>