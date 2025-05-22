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
						src="@/assets/images/logo/gamefier-logo-64px.png"
						alt="GF"
						class="logo-img"
					>
					<strong class="logo-text">Gamefier</strong>
				</NuxtLink>
			</div>

			<!-- Dropdown items (Center) -->
			<ul class="navbar-center nav">
				<li class="dropdown">
					<a href="#">About</a>
					<ul class="dropdown-menu menu">
						<li><a href="#">About content</a></li>
					</ul>
				</li>
				<li class="dropdown">
					<a href="#">Services</a>
					<ul class="dropdown-menu menu">
						<li><a href="#">Services content</a></li>
					</ul>
				</li>
				<li class="dropdown">
					<a href="#">Products</a>
					<ul class="dropdown-menu menu">
						<li><a href="#">Products content</a></li>
					</ul>
				</li>
				<li class="dropdown">
					<a href="#">Features</a>
					<ul class="dropdown-menu menu">
						<li><a href="#">Features content</a></li>
					</ul>
				</li>
				<li class="dropdown">
					<a href="#">Contact</a>
					<ul class="dropdown-menu menu">
						<li><a href="#">Contact content</a></li>
					</ul>
				</li>
			</ul>

			<!-- Auth buttons (Right) -->
			<div class="navbar-right">
				<button class="btn login">
					Login
				</button>
				<button class="btn signup">
					Sign Up
				</button>
			</div>
		</nav>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const scrolled = ref(false);

function onScroll() {
	scrolled.value = window.scrollY > 0;
}

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
