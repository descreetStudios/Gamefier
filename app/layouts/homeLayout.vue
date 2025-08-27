<script setup>
</script>

<template>
	<div>
		<!-- Components -->
		<app-global-alert />
		<app-background />
		<app-homepage />
		<app-homepage-nav-bar />

		<main class="container">
			<slot />
		</main>
	</div>
</template>
