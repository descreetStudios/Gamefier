<!-- eslint-disable vue/require-explicit-emits -->
<template>
	<aside class="sidebar">
		<nuxt-link to="/">
			<div class="sidebar-logo">
				<img
					src="/images/logo/gamefier-logo-64px.png"
					alt="GF"
					class="logo-img"
					@dragstart.prevent
				>
				<span class="logo-text">Gamefier</span>
			</div>
		</nuxt-link>

		<hr>

		<nav class="sidebar-nav">
			<button
				class="nav-link"
				:class="{ active: active === 'dashboard' }"
				@click="emit('navigate', 'dashboard')"
			>
				Dashboard
			</button>
			<button
				class="nav-link"
				:class="{ active: active === 'games' }"
				@click="emit('navigate', 'games')"
			>
				My Games
			</button>
			<button
				class="nav-link"
				:class="{ active: active === 'templates' }"
				@click="emit('navigate', 'templates')"
			>
				Templates
			</button>
			<button
				v-if="admin"
				class="nav-link"
				:class="{ active: active === 'admin' }"
				@click="emit('navigate', 'admin')"
			>
				Admin
			</button>

			<button
				v-if="admin"
				class="nav-link"
				:class="{ active: active === 'banAppeals' }"
				@click="emit('navigate', 'banAppeals')"
			>
				Ban Appeals
			</button>

			<div
				class="user-section"
				:class="{ open: showUserLinks }"
				@click="toggleUserLinks"
			>
				<div class="user-img">
					<img
						class="user-icon"
						:src="userIcon"
						alt="User Icon"
					>
					<h4>{{ $userStore.displayName }}</h4>
					<arrow
						class="arrow"
						:class="{ rotatedArrow: showUserLinks }"
					/>
				</div>

				<div
					class="user-nav-links"
					:class="{ visible: showUserLinks }"
				>
					<button
						class="nav-link"
						:class="{ active: active === 'profile' }"
						@click.stop="emit('navigate', 'profile')"
					>
						My Profile
					</button>
					<button
						class="nav-link"
						:class="{ active: active === 'settings' }"
						@click.stop="emit('navigate', 'settings')"
					>
						Settings
					</button>
					<button
						class="nav-link logout-link"
						style="color: var(--error);"
						@click.stop="logoutHandler"
					>
						Logout
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

const { $userStore } = useNuxtApp();
const admin = computed(() => $userStore.role === "admin");
const userIcon = ref("/images/icons/user.png");
const showUserLinks = ref(false);

const toggleUserLinks = () => {
	showUserLinks.value = !showUserLinks.value;
};

const { logout } = useAuth();
const logoutHandler = async () => {
	await logout();
	window.location.reload();
};
</script>

<style lang="scss" scoped>
@use '@/assets/scss/sidebar.scss';
</style>
