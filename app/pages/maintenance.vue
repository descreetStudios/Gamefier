<template>
	<div class="maintenance-page">
		<AppBackground />
		<AppGlobalAlert />

		<div
			class="maintenance-page__background"
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

		<section class="maintenance-page__card">
			<div class="maintenance-card">
				<div class="maintenance-card__brand">
					<img
						src="/images/logo/gamefier-logo-64px.png"
						alt="Gamefier Logo"
						class="maintenance-card__logo"
						@dragstart.prevent
					>
					<p class="maintenance-card__site-name">
						Gamefier
					</p>
				</div>

				<hr>

				<h1 class="maintenance-card__title">
					Gamefier is under maintenance
				</h1>

				<p class="maintenance-card__message">
					We're currently updating our systems to improve your experience. Please check back later.
				</p>

				<p
					class="maintenance-card__logout"
					@click="logoutHandler"
				>
					Log out
				</p>
			</div>
		</section>
	</div>
</template>

<script setup>
const { $eventBus } = useNuxtApp();
const { logout } = useAuth();

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

// Mouse effect placeholders (you can implement or remove)
const mouseX = ref(0);
const mouseY = ref(0);
const bgOffset = ref(0);
</script>

<style lang="scss">
html {
    overflow: hidden;
}

.maintenance-page {
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

.maintenance-card {
    width: 100%;
    max-width: 500px;
    background-color: var(--surface);
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 1;

    &__brand {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    &__logo {
        width: 64px;
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
        color: var(--warning);
        margin: 1rem 0;
    }

    &__message {
        text-align: center;
        color: var(--secondary-text);
        font-size: 1rem;
        margin-bottom: 2rem;
    }

    &__logout {
        margin: 0 auto;
        padding: 0.5rem;
        border-radius: var(--border-radius);
        width: 50%;
        text-align: center;
        color: var(--error);
        cursor: pointer;
        font-weight: 500;
        font-size: 0.95rem;
        position: relative;
        overflow: hidden;
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
