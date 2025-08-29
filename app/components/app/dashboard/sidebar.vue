<!-- eslint-disable vue/require-explicit-emits -->
<template>
	<aside class="sidebar">
		<NuxtLink
			to="/"
			class="sidebar__logo"
			@dragstart.prevent
		>
			<NuxtImg
				src="/images/logo/gamefier-logo-64px.png"
				alt="GF"
				class="sidebar__logo-img"
				format="webp"
				@dragstart.prevent
			/>
			<span class="sidebar__logo-text">Gamefier</span>
		</NuxtLink>

		<hr class="sidebar__divider">

		<nav class="sidebar__nav">
			<button
				class="sidebar__nav-link"
				:class="{ 'sidebar__nav-link--active': active === 'dashboard' }"
				@click="emit('navigate', 'dashboard')"
			>
				Dashboard
			</button>

			<button
				class="sidebar__nav-link"
				:class="{ 'sidebar__nav-link--active': active === 'games' }"
				@click="emit('navigate', 'games')"
			>
				My Games
			</button>

			<button
				class="sidebar__nav-link"
				:class="{ 'sidebar__nav-link--active': active === 'savedGames' }"
				@click="emit('navigate', 'savedGames')"
			>
				Saved Games
			</button>

			<button
				class="sidebar__nav-link"
				:class="{ 'sidebar__nav-link--active': active === 'templates' }"
				@click="emit('navigate', 'templates')"
			>
				Templates
			</button>

			<button
				v-if="admin"
				class="sidebar__nav-link"
				:class="{ 'sidebar__nav-link--active': active === 'admin' }"
				@click="emit('navigate', 'admin')"
			>
				Admin
			</button>

			<button
				v-if="admin"
				class="sidebar__nav-link"
				:class="{ 'sidebar__nav-link--active': active === 'banAppeals' }"
				@click="emit('navigate', 'banAppeals')"
			>
				Ban Appeals
			</button>

			<div
				class="sidebar__user"
				:class="{ 'sidebar__user--open': showUserLinks }"
				@click="toggleUserLinks"
			>
				<div class="sidebar__user-header">
					<NuxtImg
						class="sidebar__user-icon"
						:src="userIcon"
						alt="User Icon"
						format="webp"
						@dragstart.prevent
					/>
					<h4 class="sidebar__user-name">
						{{ $userStore.displayName }}
					</h4>
					<arrow
						class="sidebar__user-arrow"
						:class="{ 'sidebar__user-arrow--rotated': showUserLinks }"
					/>
				</div>

				<div
					class="sidebar__user-links"
					:class="{ 'sidebar__user-links--visible': showUserLinks }"
				>
					<button
						class="sidebar__nav-link"
						:class="{ 'sidebar__nav-link--active': active === 'profile' }"
						@click.stop="emit('navigate', 'profile')"
					>
						My Profile
					</button>
					<button
						class="sidebar__nav-link"
						:class="{ 'sidebar__nav-link--active': active === 'settings' }"
						@click.stop="emit('navigate', 'settings')"
					>
						Settings
					</button>
					<button
						class="sidebar__nav-link sidebar__nav-link--logout"
						@click.stop="logoutHandler"
					>
						Log Out
					</button>
				</div>
			</div>
		</nav>
	</aside>
</template>

<script setup>
import { ref } from "vue";
import arrow from "~/assets/icons/arrow.svg";

const emit = defineEmits(["navigate"]);

defineProps({
	active: {
		type: String,
		required: true,
	},
});

const { $eventBus, $userStore } = useNuxtApp();
const { logout } = useAuth();
const admin = computed(() => $userStore.role === "admin");
const userIcon = ref("/images/icons/user.png");
const showUserLinks = ref(false);

const toggleUserLinks = () => {
	showUserLinks.value = !showUserLinks.value;
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

<style lang="scss" scoped>
@use '@/assets/scss/sidebar.scss';
</style>
