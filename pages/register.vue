<template>
	<div>
		<h1>Register</h1>
		<input
			v-model="email"
			placeholder="Email"
		>
		<input
			v-model="password"
			type="password"
			placeholder="Password"
		>
		<button @click="handleRegister">
			Register
		</button>
	</div>
</template>

<script setup>
const email = ref("");
const password = ref("");
const { register } = useAuth();

const handleRegister = async () => {
	try {
		await register(email.value, password.value);
		alert("Account created!");
		await navigateTo("/");
	}
	catch (err) {
		alert(err.message);
	}
};
</script>
