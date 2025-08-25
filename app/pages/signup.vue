<template>
	<div class="auth auth--signup">
		<app-global-alert />

		<main class="auth__page">
			<section class="auth__card">
				<img
					src="/images/logo/gamefier-logo-64px.png"
					alt="Logo Gamefier"
					class="auth__logo"
					@dragstart.prevent
				>

				<h1 class="auth__title">
					Sign up
				</h1>

				<form
					class="auth__form auth__form--signup"
					@submit.prevent="onSubmit"
				>
					<input
						v-model="displayName"
						type="text"
						class="auth__input auth__input--display-name"
						placeholder="Display Name"
						required
						autocomplete="name"
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
						v-model="confirmEmail"
						type="email"
						class="auth__input auth__input--confirm-email"
						placeholder="Confirm Email"
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
						autocomplete="new-password"
					>

					<input
						v-model="confirmPassword"
						type="password"
						class="auth__input auth__input--confirm-password"
						placeholder="Confirm Password"
						required
						autocomplete="new-password"
					>

					<p
						v-if="showError"
						class="auth__error"
					>
						<img
							src="/images/icons/warning.png"
							alt="Errore"
							class="auth__error-icon"
							@dragstart.prevent
						>
						{{ errorMessage }}
					</p>

					<button
						type="submit"
						class="auth__btn auth__btn--primary"
						:disabled="!formValid"
					>
						Sign up
					</button>
				</form>

				<button
					class="auth__btn auth__btn--google"
					@click="onGooglesignup"
				>
					<img
						src="/images/icons/google-icon.svg"
						alt="Google"
						class="auth__google-icon"
						@dragstart.prevent
					>
					Sign up with Google
				</button>

				<footer class="auth__footer">
					Hai già un account?
					<NuxtLink
						to="/login"
						class="auth__link"
					>
						Log in
					</NuxtLink>
				</footer>
			</section>
		</main>
	</div>
</template>

<script setup>
import { sleep } from "@/utils/sleep";
import { navigateTo } from "#app";

const { $eventBus } = useNuxtApp();
const { signup } = useAuth();

const displayName = ref("");
const email = ref("");
const confirmEmail = ref("");
const password = ref("");
const confirmPassword = ref("");

// Check if fields are filled
const emailFilled = computed(() => email.value.trim() !== "" && confirmEmail.value.trim() !== "");
const passwordFilled = computed(() => password.value !== "" && confirmPassword.value !== "");

// Match checks (only when both fields are filled)
const emailsMatch = computed(() =>
	!emailFilled.value || email.value.trim() === confirmEmail.value.trim(),
);

const passwordsMatch = computed(() =>
	!passwordFilled.value || password.value === confirmPassword.value,
);

// Form validity
const formValid = computed(() =>
	emailFilled.value && passwordFilled.value && emailsMatch.value && passwordsMatch.value,
);

// Show error only if both fields are filled and a mismatch exists
const showError = computed(() =>
	(emailFilled.value && !emailsMatch.value)
	|| (passwordFilled.value && !passwordsMatch.value),
);

// Build error message
const errorMessage = computed(() => {
	const emailFail = emailFilled.value && !emailsMatch.value;
	const passwordFail = passwordFilled.value && !passwordsMatch.value;

	if (emailFail && passwordFail) return "Passwords and emails don't match";
	if (emailFail) return "Emails don't match";
	if (passwordFail) return "Passwords don't match";
	return "";
});

async function onSubmit() {
	try {
		const duration = 3000;
		console.log();
		await signup(email.value, password.value, displayName.value);

		$eventBus.emit("alert", {
			message: "Sign up success! Redirecting...",
			type: "success",
			duration: duration,
		});

		sleep(duration).then(() => {
			navigateTo("/dashboard");
		});
	}
	catch (err) {
		const message = getAuthErrorMessage(err.data.code);
		console.log(message);
		$eventBus.emit("alert", {
			message,
			type: "error",
			duration: 4000,
		});
	}
}

const { loginWithGoogle, user } = useAuth();

const onGooglesignup = async () => {
	try {
		await loginWithGoogle();

		if (!user.value) {
			return;
		}

		$eventBus.emit("alert", {
			message: "Log in success! Redirecting...",
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
