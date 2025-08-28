<script setup>
</script>

<template>
	<div>
		<!-- Components -->
		<app-global-alert />
		<app-background />
		<app-homepage-nav-bar />
		<app-homepage />
		<app-homepage-footer />

		<main class="container">
			<slot />
		</main>
	</div>
</template>
