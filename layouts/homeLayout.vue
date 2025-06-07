<template>
	<div>
		<!-- Components -->
		<AppNavBar />
		<AppBackground />
		<AppHomepage />

		<main class="container">
			<slot /> <!-- Inject page content here -->
		</main>
	</div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
	.container {
		padding-top: 7rem; // Space for navbar
	}
</style>
