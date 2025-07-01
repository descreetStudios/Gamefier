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
		</nav>
	</aside>
</template>

<style lang="scss" scoped>
@use '@/assets/scss/sidebar.scss';
</style>
