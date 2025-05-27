<template>
	<div>
		<h1>Login</h1>
		<input
			v-model="email"
			placeholder="Email"
		>
		<input
			v-model="password"
			type="password"
			placeholder="Password"
		>
		<button @click="handleLogin">
			Login
		</button>
	</div>
</template>

<script setup>
const email = ref("");
const password = ref("");
const { login } = useAuth();

const handleLogin = async () => {
	try {
		await login(email.value, password.value);
		alert("Logged in!");
		await navigateTo("/");
	}
	catch (err) {
		alert(err.message);
	}
};
</script>
