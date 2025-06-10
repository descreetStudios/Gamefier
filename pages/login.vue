<template>
	<div>
		<AppGlobalAlert />

		<main class="login-page">
			<section class="login-card">
				<img
					src="/images/logo/gamefier-logo-64px.png"
					alt="L"
					class="logo"
				>
				<h1 class="login-title">
					Log in
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
					>
						Log in
					</button>
				</form>
				<button
					class="btn-google"
					@click="onGoogleLogin"
				>
					<img
						src="/images/icons/google-icon.svg"
						alt="G"
						class="google-icon"
					>
					Log in with Google
				</button>
				<footer class="login-footer">
					Don't have an account? <NuxtLink to="/signup">Sign up</NuxtLink>
				</footer>
			</section>
		</main>
	</div>
</template>

<script setup>
import { navigateTo } from "#app";

const { $eventBus } = useNuxtApp();
const { login } = useAuth();

const email = ref("");
const password = ref("");

async function onSubmit() {
	try {
		await login(email.value, password.value);

		$eventBus.emit("alert", {
			message: "Log in success! Redirecting...",
			type: "success",
			duration: 3000,
		});

		// Timeout
		setTimeout(() => {
			navigateTo("/dashboard");
		}, 3000);
	}
	catch (err) {
		$eventBus.emit("alert", {
			message: err.message || "Log in failed.",
			type: "error",
			duration: 4000,
		});
	}
}

const { loginWithGoogle } = useAuth();

const onGoogleLogin = async () => {
	await loginWithGoogle();
	await navigateTo("/dashboard");
};
</script>

<style lang="scss">
@use "@/assets/scss/login.scss"
</style>
