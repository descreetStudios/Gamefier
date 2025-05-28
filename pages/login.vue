<template>
	<main class="login-page">
		<section class="login-card">
			<img
				src="assets/images/logo/gamefier-logo-64px.png"
				alt="L"
				class="logo"
			>
			<h1 class="login-title">
				Login
			</h1>
			<form
				class="login-form"
				@submit.prevent="onSubmit"
			>
				<input
					v-model="email"
					type="email"
					placeholder="Email"
					required
					autocomplete="email"
				>
				<input
					v-model="password"
					type="password"
					placeholder="Password"
					required
					autocomplete="current-password"
				>
				<button
					type="submit"
					class="btn-login"
					@click="onSubmit"
				>
					Login
				</button>
			</form>
			<button
				class="btn-google"
				@click="onGoogleLogin"
			>
				<img
					src="assets/images/icons/google-icon.svg"
					alt="G"
					class="google-icon"
				>
				Login with Google
			</button>
			<footer class="login-footer">
				Don't have an account? <a href="/signup">Sign up</a>
			</footer>
		</section>
	</main>
</template>

<script setup>
const email = ref("");
const password = ref("");
const { login } = useAuth();

async function onSubmit() {
	try {
		await login(email.value, password.value);
		alert("Logged in!");
		await navigateTo("/");
	}
	catch (err) {
		alert(err.message);
	}
}

function onGoogleLogin() {
	// Placeholder: handle Google login
	alert("Google login");
}
</script>

<style lang="scss">
@use "@/assets/scss/login.scss"
</style>
