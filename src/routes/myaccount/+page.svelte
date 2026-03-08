<script> 

let email = ""; 
let password = ""; 
let message = "";  

async function login() { 
const response = await fetch("http://localhost:8080/api/login", { 
method: "POST", 
headers: { 

"Content-Type": "application/json" 

}, 

body: JSON.stringify({ 
email: email, 
password: password 

}) 

}); 

 

const data = await response.json(); 
if (response.ok) { 
message = "Login successful!"; 

} else { 

message = data.message || "Login failed"; 

} 

} 

</script> 

 

<h1>My Account</h1> 

 

<div class="login-box"> 

<input 

type="email" 

placeholder="Email" 

bind:value={email} 

/> 

 

<input 

type="password" 

placeholder="Password" 

bind:value={password} 

/> 

 

<button on:click={login}> 

Login 

</button> 

 

<p>{message}</p> 

 

<a href="/register">Create account</a> 

</div> 

 

<style> 

h1 { 

text-align: center; 

} 

 

.login-box { 

max-width: 400px; 

margin: auto; 

display: flex; 

flex-direction: column; 

gap: 10px; 

} 

 

input { 

padding: 10px; 

font-size: 16px; 

} 

 

button { 

padding: 10px; 

background: #ff6600; 

color: white; 

border: none; 

cursor: pointer; 

} 

</style> 

 

