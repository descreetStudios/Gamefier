<template>
	<div :class="['navbar-blur', { 'navbar-blur--active': scrolled }]">
		<nav class="navbar container">
			<!-- Logo (Left) -->
			<div class="navbar__left">
				<NuxtLink
					to="/"
					class="navbar__logo"
					@dragstart.prevent
				>
					<NuxtImg
						src="/images/logo/gamefier-logo-64px.png"
						alt="Gamefier logo"
						class="navbar__logo-img"
						format="webp"
						@dragstart.prevent
					/>
					<strong class="navbar__logo-text">Gamefier</strong>
				</NuxtLink>
			</div>

			<!-- Navigation buttons (Center) -->
			<ul class="navbar__menu">
				<li
					v-for="link in navLinks"
					:key="link.label"
					class="navbar__item"
				>
					<NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
				</li>
			</ul>

			<!-- Auth/User (Right) -->
			<div class="navbar__right">
				<template v-if="!logged">
					<NuxtLink
						to="/login"
						class="btn btn--login"
					>Login</NuxtLink>
					<NuxtLink
						to="/signup"
						class="btn btn--signup"
					>Sign Up</NuxtLink>
				</template>

				<div
					v-else
					class="navbar__user"
				>
					<div
						class="navbar__user-img"
						@click="toggleUserMenu"
					>
						<NuxtImg
							:src="userIcon"
							alt="User icon"
							format="webp"
							@dragstart.prevent
						/>
						<h4>{{ $userStore.displayName }}</h4>
					</div>
					<div
						v-if="showUserMenu"
						class="navbar__user-menu"
					>
						<p @click="profileHandler">
							My Profile
						</p>
						<p @click="settingsHandler">
							Settings
						</p>
						<p @click="logoutHandler">
							Log Out
						</p>
					</div>
				</div>
			</div>
		</nav>
	</div>
</template>

<script setup>
const { $eventBus, $userStore } = useNuxtApp();
const { logout } = useAuth();

const logged = computed(() => !!$userStore.userId);
const scrolled = ref(false);
const showUserMenu = ref(false);
const userIcon = ref("/images/icons/user.png");

const navLinks = [
	{ label: "About", to: "#" },
	{ label: "Services", to: "#" },
	{ label: "Products", to: "#" },
	{ label: "Features", to: "#" },
	{ label: "Contact", to: "#" },
	{ label: "Dashboard", to: "/dashboard" },
];

function onScroll() {
	scrolled.value = window.scrollY > 0;
}

function toggleUserMenu() {
	showUserMenu.value = !showUserMenu.value;
}

const logoutHandler = async () => {
	await logout();
	$eventBus.emit("alert", { message: "You have been logged out.", type: "success", duration: 2000 });
	setTimeout(() => window.location.reload(), 2000);
};

const profileHandler = () => {
	navigateTo({ path: "/dashboard", query: { activeViewComponent: "profile" } });
};

const settingsHandler = () => {
	navigateTo({ path: "/dashboard", query: { activeViewComponent: "settings" } });
};

onMounted(() => {
	window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
	window.removeEventListener("scroll", onScroll);
});
</script>

<style lang="scss" scoped>
@use "@/assets/scss/nav-bar" as *;
</style>
