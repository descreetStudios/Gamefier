<template>
	<aside class="sidebar">
		<div class="sidebar-logo">
			<img
				src="/images/logo/gamefier-logo-64px.png"
				alt="GF"
				class="logo-img"
			>
			<span class="logo-text">Gamefier</span>
		</div>
		<nav class="sidebar-nav">
			<button
				class="nav-link"
				:class="{ active: active === 'dashboard' }"
				@click="$emit('navigate', 'dashboard')"
			>
				Dashboard
			</button>
			<button
				class="nav-link"
				:class="{ active: active === 'games' }"
				@click="$emit('navigate', 'games')"
			>
				My Games
			</button>
			<button
				class="nav-link"
				:class="{ active: active === 'templates' }"
				@click="$emit('navigate', 'templates')"
			>
				Templates
			</button>
			<button 
				v-if="admin"
				class="nav-link"
				:class="{ active: active === 'admin' }"
				@click="$emit('navigate', 'admin')"
			>
				Admin
			</button>
		</nav>
	</aside>
</template>

<script setup>
const { $userStore } = useNuxtApp();
const admin = computed(() => $userStore.role === 'admin');
</script>

<style lang="scss" scoped>
@use '@/assets/scss/sidebar.scss';
</style>
