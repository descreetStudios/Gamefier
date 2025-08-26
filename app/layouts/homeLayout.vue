<script setup>
</script>

<template>
	<div>
		<!-- Components -->
		<app-global-alert />
		<app-nav-bar />
		<app-background />
		<app-homepage />

		<main class="container">
			<slot />
		</main>
	</div>
</template>
