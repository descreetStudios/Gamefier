<template>
	<div>
		<!-- Components -->
		<AppNavBar />
		<AppBackground />

		<main class="container">
			<slot /> <!-- Inject page content here -->
		</main>
	</div>
</template>

<script setup>
import { useAuth } from "~/composables/useAuth";

const { initAuth } = useAuth();

onMounted(() => {
	initAuth(); // listen for auth changes
});
</script>

<style lang="scss" scoped>
	.container {
		padding-top: 7rem; // Space for navbar
	}
</style>
