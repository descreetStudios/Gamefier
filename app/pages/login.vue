<template>
	<div class="auth auth--login">
		<app-global-alert />

		<main class="auth__page">
			<section class="auth__card">
				<NuxtImg
					src="/images/logo/gamefier-logo-64px.png"
					alt="Logo Gamefier"
					class="auth__logo"
					format="webp"
					@dragstart.prevent
				/>

				<h1 class="auth__title">
					Log In
				</h1>

				<form
					class="auth__form auth__form--login"
					@submit.prevent="onSubmit"
				>
					<input
						v-model="email"
						type="email"
						class="auth__input auth__input--email"
						placeholder="Email"
						required
						autocomplete="email"
					>

					<input
						v-model="password"
						type="password"
						class="auth__input auth__input--password"
						placeholder="Password"
						minlength="8"
						required
						autocomplete="current-password"
					>

					<button
						type="submit"
						class="auth__btn auth__btn--primary"
					>
						Log In
					</button>
				</form>

				<button
					class="auth__btn auth__btn--google"
					@click="onGoogleLogin"
				>
					<NuxtImg
						src="/images/icons/google-icon.svg"
						alt="Google"
						class="auth__google-icon"
						format="webp"
						@dragstart.prevent
					/>
					Log In with Google
				</button>

				<footer class="auth__footer">
					Don't have an account?
					<NuxtLink
						to="/signup"
						class="auth__link"
						@dragstart.prevent
					>
						Sign Up
					</NuxtLink>
				</footer>
			</section>
		</main>
	</div>
</template>

<script setup>
import { useAuth } from "#imports";
import { navigateTo, useNuxtApp } from "#app";

const { $eventBus } = useNuxtApp();
const { login } = useAuth();
const { loginWithGoogle, user } = useAuth();

const email = ref("");
const password = ref("");

async function onSubmit() {
	try {
		await login(email.value, password.value);

		$eventBus.emit("alert", {
			message: "Login successful! Redirecting...",
			type: "success",
			duration: 3000,
		});

		// Timeout
		setTimeout(() => {
			navigateTo("/dashboard");
		}, 3000);
	}
	catch (err) {
		const message = getAuthErrorMessage(err.code);
		$eventBus.emit("alert", {
			message,
			type: "error",
			duration: 4000,
		});
	}
}

const onGoogleLogin = async () => {
	try {
		await loginWithGoogle();

		if (!user.value) {
			return;
		}

		$eventBus.emit("alert", {
			message: "Login successful! Redirecting...",
			type: "success",
			duration: 3000,
		});

		setTimeout(() => {
			navigateTo("/dashboard");
		}, 3000);
	}
	catch (err) {
		const message = getAuthErrorMessage(err.code);
		$eventBus.emit("alert", {
			message,
			type: "error",
			duration: 4000,
		});
	}
};
</script>

<style lang="scss">
@use "@/assets/scss/login.scss"
</style>
