<template>
	<div class="ban-page">
		<AppBackground />
		<AppGlobalAlert />

		<div
			class="ban-page__background"
			:style="{
				transform: `translateY(${bgOffset - 100}px) translateX(${mouseX * 10}px) translateY(${mouseY * 10}px)`,
			}"
		>
			<img
				src="/images/Background.png"
				alt="Background"
				@dragstart.prevent
			>
		</div>

		<section class="ban-page__card">
			<div class="ban-card">
				<div class="ban-card__brand">
					<img
						src="/images/logo/gamefier-logo-64px.png"
						alt="Gamefier Logo"
						class="ban-card__logo"
						@dragstart.prevent
					>
					<p class="ban-card__site-name">
						Gamefier
					</p>
				</div>

				<hr>

				<h1 class="ban-card__title">
					You are currently banned
				</h1>

				<div class="ban-card__details">
					<p class="ban-card__detail ban-card__detail--reason">
						<strong>Reason:</strong> {{ $userStore.banReason }}
					</p>
					<p class="ban-card__detail ban-card__detail--expires">
						<strong>Expires on:</strong> {{ date }}
					</p>
					<p class="ban-card__detail ban-card__detail--banned-by">
						<strong>Banned by:</strong> {{ $userStore.bannedBy }}
					</p>
				</div>

				<form
					class="ban-card__form"
					@submit.prevent="sendBanAppeal"
				>
					<textarea
						v-model="banAppealText"
						class="ban-card__textarea"
						:readonly="banAppealAlreadySent"
						required
						placeholder="Write your appeal here..."
					/>

					<input
						class="ban-card__submit"
						type="submit"
						value="Send ban appeal"
						:disabled="banAppealAlreadySent"
					>
				</form>

				<p
					class="ban-card__logout"
					@click="logoutHandler"
				>
					Log out
				</p>
			</div>
		</section>
	</div>
</template>

<script setup>
import { doc, updateDoc } from "firebase/firestore";
import { onMounted } from "vue";

const { $db, $eventBus, $userStore } = useNuxtApp();
const { logout } = useAuth();

const banAppealText = ref($userStore.banAppealText);
const banAppealAlreadySent = computed(() => $userStore.banAppealAlreadySent);
const date = ref($userStore.banExpiresAt);

onMounted(() => {
	if (date.value) {
		date.value = date.value.toDate ? date.value.toDate() : new Date(date);
		date.value = date.value.toISOString().split("T")[0];
	}
});

const sendBanAppeal = async () => {
	if (banAppealText.value && !banAppealAlreadySent.value) {
		try {
			const userDocRef = doc($db, "users", $userStore.userId);
			await updateDoc(userDocRef, { banAppealText: banAppealText.value, banAppealPending: true });
			await $userStore.syncUserData($userStore.userId);

			$eventBus.emit("alert", {
				message: "Ban appeal sent successfully.",
				type: "success",
				duration: 3000,
			});
		}
		catch (err) {
			$eventBus.emit("alert", {
				message: err.message || "An error occurred while sending ban appeal.",
				type: "error",
				duration: 3000,
			});
		}
	}
};

const logoutHandler = async () => {
	await logout();

	$eventBus.emit("alert", {
		message: "You have been logged out.",
		type: "success",
		duration: 2000,
	});

	setTimeout(() => {
		window.location.reload();
	}, 2000);
};
</script>

<style lang="scss">
html {
	overflow: hidden;
}

.ban-page {
	position: relative;
	width: 100%;
	min-height: 100vh;

	&__background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 120vh;
		background-color: var(--bg);
		scale: 1.25;
		z-index: -1;
		overflow: hidden;

		img {
			width: 100%;
			height: 120%;
			object-fit: cover;
			filter: blur(8px);
			opacity: 0.6;
			user-select: none;
			pointer-events: none;
			transform: translateY(-30px);
		}
	}

	&__card {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		padding: 2rem 1rem;
	}
}

.ban-card {
	z-index: 0;
	width: 100%;
	max-width: 500px;
	background-color: var(--surface);
	padding: 2rem;
	padding-bottom: 1rem;
	border-radius: var(--border-radius);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

	&__brand {
		align-items: center;
		justify-content: center;
		display: flex;
		margin-bottom: 0.5rem;
	}

	&__logo {
		width: 64px;
		height: auto;
		margin-right: 0.5rem;
		user-select: none;
	}

	&__site-name {
		font-size: 2rem;
		font-weight: 600;
		color: var(--primary-text);
		text-transform: uppercase;
		letter-spacing: 1px;
		margin: 0;
	}

	&__title {
		font-size: 1.75rem;
		text-align: center;
		color: var(--error);
	}

	&__details {
		margin-bottom: 1.5rem;
	}

	&__detail {
		font-size: 1rem;
		color: var(--secondary-text);
		margin: 0.25rem 0;
	}

	&__form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	&__textarea {
		resize: none;
		min-height: 100px;
		padding: 0.75rem;
		margin: 0;
		font-size: 1rem;
		font-family: inherit;
		border: 1px solid var(--border);
		border-radius: var(--border-radius);
		background-color: transparent;
		color: var(--primary-text);

		&:focus,
		&:focus-visible {
			outline: none;
			box-shadow: none;
			border-color: var(--primary);
		}

		&:read-only {
			background-color: var(--tertiary-text);
			cursor: not-allowed;
			opacity: 0.6;
		}
	}

	&__submit {
		padding: 0.75rem;
		font-size: 1rem;
		background-color: var(--primary);
		color: var(--primary-text);
		border: none;
		border-radius: var(--border-radius);
		cursor: pointer;
		transition: background-color 0.2s ease;

		&:hover:not(:disabled) {
			background-color: var(--primary-hover);
		}

		&:disabled {
			background-color: var(--tertiary-text);
			cursor: not-allowed;
		}
	}

	&__logout {
		margin-left: 25%;
		margin-bottom: 0;
		padding: 0.15rem;
		border-radius: var(--border-radius);
		width: 50%;
		position: relative;
		overflow: hidden;
		text-align: center;
		color: var(--error);
		cursor: pointer;
		font-weight: 500;
		font-size: 0.95rem;
		z-index: 1;

		&::before {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			width: 0;
			height: 100%;
			background-color: rgba(255, 0, 0, 0.1);
			z-index: -1;
			transition: width 0.3s ease;
		}

		&:hover::before {
			width: 100%;
		}
	}
}

hr {
	border: none;
	height: 0.1rem;
	background-color: var(--border);
}
</style>
