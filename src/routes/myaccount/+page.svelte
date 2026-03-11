<!-- <script lang="ts">
  import { session } from '$lib/stores/session';
  import { get } from 'svelte/store';

  let email = "";
  let password = "";
  let name = "";
  let message = "";
  let isRegister = false;

  // Reactive loggedIn
  let loggedIn = false;
  session.subscribe((value) => loggedIn = !!value);

  // Sample dashboard data
  const orderHistory = [
    { id: 1, items: "Pepperoni Pizza, Garlic Bread", date: "12 Mar 2026" },
    { id: 2, items: "BBQ Chicken Pizza", date: "5 Mar 2026" }
  ];
  const favouriteMeals = ["Pepperoni Pizza", "BBQ Chicken Pizza", "Garlic Bread"];
  const location = "123 Main Street";

  async function login() {
    try {
      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        session.set({ email, name: data.name, token: data.token });
        message = "";
      } else {
        message = data.message || "Login failed";
      }
    } catch (err) {
      message = "Network error or server unavailable";
      console.error(err);
    }
  }

  async function register() {
    try {
      const res = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        message = "Account created! Please log in.";
        isRegister = false;
      } else {
        message = data.message || "Registration failed";
      }
    } catch (err) {
      message = "Network error";
      console.error(err);
    }
  }

  function logout() {
    session.set(null);
    email = "";
    password = "";
    name = "";
  }
</script>

<h1>My Account</h1>

{#if loggedIn}
  <!- Dashboard -->
  <!-- <div class="dashboard">
    <h2>Welcome {get(session)?.name || get(session)?.email}</h2>

    <section>
      <h3>Order History</h3>
      <ul>
        {#each orderHistory as order}
          <li>{order.date} — {order.items}</li>
        {/each}
      </ul>
    </section>

    <section>
      <h3>Location</h3>
      <p>{location}</p>
    </section>

    <section>
      <h3>Favourite Meals</h3>
      <ul>
        {#each favouriteMeals as meal}
          <li>{meal}</li>
        {/each}
      </ul>
    </section>

    <button class="logout-btn" on:click={logout}>Logout</button>
  </div>

{:else} -->
  <!-- Login / Register Form -->
  <!-- <div class="login-box">
    {#if isRegister}
      <input type="text" placeholder="Name" bind:value={name} />
      <input type="email" placeholder="Email" bind:value={email} />
      <input type="password" placeholder="Password" bind:value={password} />
      <button type="button" on:click={() => register()}>Create Account</button>
      <p>
        Already have an account? 
        <a href="#" on:click={() => isRegister = false}>Login</a>
      </p>
    {:else}
      <input type="email" placeholder="Email" bind:value={email} />
      <input type="password" placeholder="Password" bind:value={password} />
      <button type="button" on:click={() => login()}>Login</button>
      <p>
        Don't have an account? 
        <a href="#" on:click={() => isRegister = true}>Create Account</a>
      </p>
    {/if}
    <p class="message">{message}</p>
  </div>
{/if}

<style>
  h1 {
    text-align: center;
    margin-bottom: 1rem;
  }

  .login-box, .dashboard {
    max-width: 500px;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 1rem;
  }

  input {
    padding: 10px;
    font-size: 16px;
    width: 100%;
    box-sizing: border-box;
  }

  button {
    padding: 10px;
    background: #ff6600;
    color: white;
    border: none;
    cursor: pointer;
    font-weight: bold;
  }

  a {
    cursor: pointer;
    color: #ff6600;
    text-decoration: underline;
  }

  .logout-btn {
    margin-top: 1rem;
    background: #444;
  }

  .message {
    color: red;
    font-weight: bold;
  }

  section {
    margin-top: 1rem;
  }

  section h3 {
    margin-bottom: 0.5rem;
  }

  ul {
    margin: 0;
    padding-left: 1.2rem;
  }

  li {
    margin-bottom: 0.3rem;
  }
</style>  -->

 

<script lang="ts">
  import { session } from '$lib/stores/session';
  import { get } from 'svelte/store';

  let email = "";
  let password = "";
  let name = "";
  let message = "";
  let isRegister = false;

  // Reactive loggedIn state
  let loggedIn = false;
  session.subscribe((value) => loggedIn = !!value);

  // Sample dashboard data
  const orderHistory = [
    { id: 1, items: "Pepperoni Pizza, Garlic Bread", date: "12 Mar 2026" },
    { id: 2, items: "BBQ Chicken Pizza", date: "5 Mar 2026" }
  ];
  const favouriteMeals = ["Pepperoni Pizza", "BBQ Chicken Pizza", "Garlic Bread"];
  const location = "123 Main Street";

  // Mocked login
  async function login() {
    message = "";
    // simulate network delay
    await new Promise(r => setTimeout(r, 500));

    if (email && password) {
      session.set({ email, name: "Test User", token: "dummy-token" });
    } else {
      message = "Please enter email and password";
    }
  }

  // Mocked registration
  async function register() {
    message = "";
    await new Promise(r => setTimeout(r, 500));

    if (name && email && password) {
      message = "Account created! Please log in.";
      isRegister = false;
      // optionally pre-fill email field for login
    } else {
      message = "Please fill all fields";
    }
  }

  function logout() {
    session.set(null);
    email = "";
    password = "";
    name = "";
    message = "";
  }
</script>

<h1>My Account</h1>

{#if loggedIn}
  <!-- Dashboard -->
  <div class="dashboard">
    <h2>Welcome {get(session)?.name || get(session)?.email}</h2>

    <section>
      <h3>Order History</h3>
      <ul>
        {#each orderHistory as order}
          <li>{order.date} — {order.items}</li>
        {/each}
      </ul>
    </section>

    <section>
      <h3>Location</h3>
      <p>{location}</p>
    </section>

    <section>
      <h3>Favourite Meals</h3>
      <ul>
        {#each favouriteMeals as meal}
          <li>{meal}</li>
        {/each}
      </ul>
    </section>

    <button class="logout-btn" on:click={logout}>Logout</button>
  </div>

{:else}
  <!-- Login / Register Form -->
  <div class="login-box">
    {#if isRegister}
      <input type="text" placeholder="Name" bind:value={name} />
      <input type="email" placeholder="Email" bind:value={email} />
      <input type="password" placeholder="Password" bind:value={password} />
      <button type="button" on:click={register}>Create Account</button>
      <p>
        Already have an account? 
        <a href="#" on:click={() => isRegister = false}>Login</a>
      </p>
    {:else}
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
{/if}

<style>
  h1 {
    text-align: center;
    margin-bottom: 1rem;
  }

  .login-box, .dashboard {
    max-width: 500px;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 1rem;
  }

  input {
    padding: 10px;
    font-size: 16px;
    width: 100%;
    box-sizing: border-box;
  }

  button {
    padding: 10px;
    background: #ff6600;
    color: white;
    border: none;
    cursor: pointer;
    font-weight: bold;
  }

  a {
    cursor: pointer;
    color: #ff6600;
    text-decoration: underline;
  }

  .logout-btn {
    margin-top: 1rem;
    background: #444;
  }

  .message {
    color: red;
    font-weight: bold;
  }

  section {
    margin-top: 1rem;
  }

  section h3 {
    margin-bottom: 0.5rem;
  }

  ul {
    margin: 0;
    padding-left: 1.2rem;
  }

  li {
    margin-bottom: 0.3rem;
  }
</style>