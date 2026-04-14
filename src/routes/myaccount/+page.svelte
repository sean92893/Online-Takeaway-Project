<script lang="ts">
  import { onMount } from "svelte";

  let email = "";
  let password = "";
  let name = "";
  let message = "";
  let isRegister = false;

  let loggedIn = false;
  let user = null;

  // =========================
  // LOAD USER FROM BACKEND
  // =========================
  onMount(async () => {
    const res = await fetch("/myaccount");

    if (res.ok) {
      user = await res.json();
      loggedIn = true;
    }
  });

  // =========================
  // LOGIN (REAL BACKEND)
  // =========================
  async function login() {
    message = "";

    const res = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      message = data.error;
      return;
    }

    // reload user after login
    const userRes = await fetch("/myaccount");
    if (userRes.ok) {
      user = await userRes.json();
      loggedIn = true;
    }
  }

  // =========================
  // REGISTER (KEEP SIMPLE)
  // =========================
  async function register() {
    message = "";

    await new Promise(r => setTimeout(r, 500));

    if (name && email && password) {
      message = "Account created! Please log in.";
      isRegister = false;
    } else {
      message = "Please fill all fields";
    }
  }

  // =========================
  // LOGOUT (REAL)
  // =========================
  async function logout() {
    await fetch("/logout");

    user = null;
    loggedIn = false;

    email = "";
    password = "";
    name = "";
    message = "";
  }

  // =========================
  // STATIC UI DATA (KEEP YOUR UI)
  // =========================
  const orderHistory = [
    { id: 1, items: "Pepperoni Pizza, Garlic Bread", date: "12 Mar 2026" },
    { id: 2, items: "BBQ Chicken Pizza", date: "5 Mar 2026" }
  ];

  const favouriteMeals = ["Pepperoni Pizza", "BBQ Chicken Pizza", "Garlic Bread"];
  const location = "75 Hillcrest Close, Lucan Co. Dublin";
</script>

<h1>My Account</h1>

{#if loggedIn}

<div class="account-page">

  <div class="account-header">
    <h2>Welcome back {user?.name || user?.email}</h2>
    <p>Ready for your next order?</p>
  </div>

  <div class="dashboard-grid">

    <section class="card">
      <h3>Order History</h3>
      {#each orderHistory as order}
        <div class="order-item">
          <strong>{order.date}</strong>
          <p>{order.items}</p>
        </div>
      {/each}
    </section>

    <section class="card">
      <h3>Delivery Location</h3>
      <p>{location}</p>
    </section>

    <section class="card">
      <h3>Favourite Meals</h3>
      <div class="meal-list">
        {#each favouriteMeals as meal}
          <span class="meal-chip">{meal}</span>
        {/each}
      </div>
    </section>

    <section class="card">
      <h3>Profile</h3>
      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Address:</strong> {user?.address}</p>
      <p><strong>Phone:</strong> {user?.phone}</p>
    </section>

  </div>

  <button class="logout-btn" on:click={logout}>Logout</button>

</div>

{:else}

<div class="login-container">

  <div class="login-box">
    {#if isRegister}
      <h2>Create Account</h2>
      <input type="text" placeholder="Name" bind:value={name} />
      <input type="email" placeholder="Email" bind:value={email} />
      <input type="password" placeholder="Password" bind:value={password} />
      <button type="button" on:click={register}>Create Account</button>
      <p>
        Already have an account?
        <a href="#" on:click={() => isRegister = false}>Login</a>
      </p>
    {:else}
      <h2>Login</h2>
      <input type="email" placeholder="Email" bind:value={email} />
      <input type="password" placeholder="Password" bind:value={password} />
      <button type="button" on:click={login}>Login</button>
      <p>
        Don't have an account?
        <a href="#" on:click={() => isRegister = true}>Create Account</a>
      </p>
    {/if}

    <p class="message">{message}</p>
  </div>

  <!-- Images -->
  <div class="pre-login-images">
    <img src="dominos.jpg" alt="Delicious Dish 1" class="pre-login-image" />
    <img src="clucks.jpeg" alt="Delicious Dish 2" class="pre-login-image" />
  </div>

  <section class="account-page">
    <h1>Getting Started</h1>

    <div class="dashboard-grid">

      <div class="card">
        <h3>How to Log In</h3>
        <ol class="login-steps">
          <li>Enter your username or email address.</li>
          <li>Type your secure password.</li>
          <li>Click the <strong>Log In</strong> button.</li>
          <li>Enjoy full access to your account!</li>
        </ol>
      </div>

      <div class="card">
        <h3>Benefits of Creating an Account</h3>
        <ul class="login-benefits">
          <li>Access your personalized dashboard.</li>
          <li>Save your preferences and settings.</li>
          <li>Receive exclusive offers and updates.</li>
          <li>Faster checkout and order tracking.</li>
        </ul>
      </div>

    </div>
  </section>

</div>

{/if}







<!-- styling/css  -->
<style>
h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 3rem;
  font-weight: 900;
  position: relative;
}

.account-page{
  max-width:1000px;
  margin:auto;
  padding:2rem;
  min-height:60vh;
}

.account-header{
  background:#ff6600;
  color:white;
  padding:2rem;
  border-radius:10px;
  text-align:center;
  margin-bottom:2rem;
}

.dashboard-grid{
  display:grid;
  grid-template-columns:repeat(auto-fit, minmax(250px,1fr));
  gap:20px;
}

.card{
  background:white;
  padding:1.5rem;
  border-radius:10px;
  box-shadow:0 4px 12px rgba(0,0,0,0.1);
}

.card h3{
  margin-bottom:10px;
}

.order-item{
  background:#f5f5f5;
  padding:10px;
  border-radius:6px;
  margin-bottom:8px;
}

.meal-list{
  display:flex;
  flex-wrap:wrap;
}

.meal-chip{
  background:#ff6600;
  color:white;
  padding:6px 12px;
  border-radius:20px;
  margin:5px;
  font-size:14px;
}

.logout-btn{
  margin-top:2rem;
  padding:12px;
  width:100%;
  background:#e74c3c;
  color:white;
  border:none;
  font-weight:bold;
  cursor:pointer;
  border-radius:6px;
  transition: background 0.2s;
}

.logout-btn:hover{
  background:#c0392b;
}

.login-container{
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:2rem;
}

.pre-login-images{
  display:flex;
  gap:20px;
  justify-content:center;
  margin-top:20px;
}

.pre-login-image{
  width:250px;
  border-radius:10px;
  box-shadow:0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor:pointer;
}

.pre-login-image:hover{
  transform: scale(1.05);
  box-shadow:0 8px 20px rgba(0,0,0,0.2);
}

.login-box{
  background:white;
  max-width:400px;
  width:100%;
  padding:2rem;
  border-radius:10px;
  box-shadow:0 4px 15px rgba(0,0,0,0.1);
  display:flex;
  flex-direction:column;
  gap:12px;
}

input{
  padding:10px;
  font-size:16px;
  width:100%;
  box-sizing:border-box;
}

button{
  padding:10px;
  background:#ff6600;
  color:white;
  border:none;
  cursor:pointer;
  font-weight:bold;
  transition: background 0.2s;
}

button:hover{
  background:#e65c00;
}

a{
  cursor:pointer;
  color:#ff6600;
  text-decoration:underline;
}

.message{
  color:red;
  font-weight:bold;
}

.login-steps, .login-benefits {
  margin: 0;
  padding-left: 20px;
}

.login-steps li, .login-benefits li {
  margin-bottom: 10px;
  font-size: 16px;
}

</style>