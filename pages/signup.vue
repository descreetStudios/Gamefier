<template>
	<main class="login-page">
		<section class="login-card">
			<img
				src="assets/images/logo/gamefier-logo-64px.png"
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
						src="assets/images/icons/warning.png"
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
					src="assets/images/icons/google-icon.svg"
					alt="G"
					class="google-icon"
				>
				Sign up with Google
			</button>
		</section>
	</main>
</template>

<script setup>
import { ref, computed } from "vue";

const displayName = ref("");
const email = ref("");
const confirmEmail = ref("");
const password = ref("");
const confirmPassword = ref("");
const { register, registerUserData } = useAuth();

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

// Form validity (strict match required for submit)
const formValid = computed(() =>
	emailFilled.value && passwordFilled.value && emailsMatch.value && passwordsMatch.value,
);

// Show error only if both fields are filled and a mismatch exists
const showError = computed(() =>
	(emailFilled.value && !emailsMatch.value)
	|| (passwordFilled.value && !passwordsMatch.value),
);

// Single error message
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
		await register(email.value, password.value);
		alert("Account created!");
		await registerUserData(email.value, displayName.value);
		await navigateTo("/");
	}
	catch (err) {
		alert(err.message);
	}
}

function onGooglesignup() {
	alert("Google signup");
}
</script>

<style lang="scss">
@use "@/assets/scss/login.scss"
</style>
