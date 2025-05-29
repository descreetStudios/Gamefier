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
					Sign up
				</h1>
				<form
					class="signup-form"
					@submit.prevent="onSubmit"
				>
					<input
						v-model="displayName"
						type="text"
						placeholder="Display Name"
						required
						autocomplete="displayName"
					>
					<input
						v-model="email"
						type="email"
						placeholder="Email"
						required
						autocomplete="email"
					>
					<input
						v-model="confirmEmail"
						type="email"
						placeholder="Confirm Email"
						required
						autocomplete="email"
					>
					<input
						v-model="password"
						type="password"
						placeholder="Password"
						required
						autocomplete="new-password"
					>
					<input
						v-model="confirmPassword"
						type="password"
						placeholder="Confirm Password"
						required
						autocomplete="new-password"
					>
					<p
						v-if="showError"
						class="error"
					>
						<img
							src="/images/icons/warning.png"
							alt="!"
							class="error-icon"
						>
						{{ errorMessage }}
					</p>
					<button
						type="submit"
						class="btn-login"
						:disabled="!formValid"
					>
						Sign up
					</button>
				</form>
				<button
					class="btn-google"
					@click="onGooglesignup"
				>
					<img
						src="/images/icons/google-icon.svg"
						alt="G"
						class="google-icon"
					>
					Sign up with Google
				</button>
				<footer class="signup-footer">
					Already have an account? <NuxtLink to="/login">Log in</NuxtLink>
				</footer>
			</section>
		</main>
	</div>
</template>

<script setup>
import { sleep } from "@/utils/sleep";
import { navigateTo } from "#app";

const { $eventBus } = useNuxtApp();
const { signup, signupUserData } = useAuth();

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
		await signup(email.value, password.value);
		await signupUserData(email.value, displayName.value);

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
		$eventBus.emit("alert", {
			message: err.message || "Sign up failed.",
			type: "error",
			duration: 4000,
		});
	}
}

function onGooglesignup() {
	alert("Google signup");
}
</script>

<style lang="scss">
@use "@/assets/scss/login.scss"
</style>
