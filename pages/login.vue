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
					type="email"
					placeholder="Email"
					required
					autocomplete="email"
				>
				<input
					type="password"
					placeholder="Password"
					required
					autocomplete="current-password"
				>
				<button
					type="submit"
					class="btn-login"
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
function onSubmit() {
	// Placeholder: handle login submit
	alert("Login submitted");
}

function onGoogleLogin() {
	// Placeholder: handle Google login
	alert("Google login");
}
</script>

<style lang="scss">
@use "@/assets/scss/login.scss"
</style>
