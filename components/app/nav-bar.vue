<template>
	<div :class="['blur-container', { blurred: scrolled }]">
		<nav class="navbar container">
			<!-- Logo (Left) -->
			<div class="navbar-left">
				<NuxtLink
					to="/"
					class="logo-link"
				>
					<img
						src="/images/logo/gamefier-logo-64px.png"
						alt="GF"
						class="logo-img"
						@dragstart.prevent
					>
					<strong class="logo-text">Gamefier</strong>
				</NuxtLink>
			</div>

			<!-- Dropdown items (Center) -->
			<ul class="navbar-center nav">
				<li class="dropdown">
					<NuxtLink to="#">About</NuxtLink>
					<ul class="dropdown-menu menu">
						<li>
							<NuxtLink to="#">About content</NuxtLink>
						</li>
					</ul>
				</li>
				<li class="dropdown">
					<NuxtLink to="#">Services</NuxtLink>
					<ul class="dropdown-menu menu">
						<li>
							<NuxtLink to="#">Services content</NuxtLink>
						</li>
					</ul>
				</li>
				<li class="dropdown">
					<NuxtLink to="#">Products</NuxtLink>
					<ul class="dropdown-menu menu">
						<li>
							<NuxtLink to="#">Products content</NuxtLink>
						</li>
					</ul>
				</li>
				<li class="dropdown">
					<NuxtLink to="#">Features</NuxtLink>
					<ul class="dropdown-menu menu">
						<li>
							<NuxtLink to="#">Features content</NuxtLink>
						</li>
					</ul>
				</li>
				<li class="dropdown">
					<NuxtLink to="#">Contact</NuxtLink>
					<ul class="dropdown-menu menu">
						<li>
							<NuxtLink to="#">Contact content</NuxtLink>
						</li>
					</ul>
				</li>
				<li class="dropdown">
					<NuxtLink to="/dashboard">Dashboard</NuxtLink>
					<ul class="dropdown-menu menu">
						<li>
							<NuxtLink to="/dashboard">User dashboard</NuxtLink>
						</li>
					</ul>
				</li>
			</ul>

			<!-- Auth buttons (Right) -->
			<div class="navbar-right">
				<div v-if="!logged">
					<NuxtLink
						to="/login"
						class="btn login"
					> Login </NuxtLink>
					<NuxtLink
						to="/signup"
						class="btn signup"
					> Sign Up </NuxtLink>
				</div>
				<div class="user-container">
					<div
						v-if="logged"
						class="user-img"
						@click="onUserClick"
					>
						<img
							:src="userIcon"
							@dragstart.prevent
						>
						<h4>{{ $userStore.displayName }}</h4>
					</div>
					<div
						v-if="showUserMenu"
						:class="['user-menu', { show: showUserMenu }]"
					>
						<p @click="profileHandler">
							My Profile
						</p>
						<p @click="settingsHandler">
							Settings
						</p>
						<p @click="logoutHandler">
							Logout
						</p>
					</div>
				</div>
			</div>
		</nav>
	</div>
</template>

<script setup>
const { $userStore } = useNuxtApp();
const logged = computed(() => !!$userStore.userId);
const scrolled = ref(false);
const showUserMenu = ref(false);
const userIcon = ref("/images/icons/user.png");

function onScroll() {
	scrolled.value = window.scrollY > 0;
}

function onUserClick() {
	showUserMenu.value = !showUserMenu.value;
}

const { logout } = useAuth();
const logoutHandler = async () => {
	await logout();
	window.location.reload();
};

const profileHandler = () => {
	return navigateTo({ path: "/dashboard", query: { activeViewComponent: "profile" } });
};

const settingsHandler = () => {
	return navigateTo({ path: "/dashboard", query: { activeViewComponent: "settings" } });
};

onMounted(() => {
	window.scrollTo(0, 0); // Reset scroll state
	window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
	window.removeEventListener("scroll", onScroll);
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/nav-bar" as *;
</style>
