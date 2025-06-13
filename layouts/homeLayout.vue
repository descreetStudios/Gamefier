<script setup>
const minLoadingTime = 1.0;
const isLoading = ref(true);

onMounted(async () => {
	const start = Date.now();

	// Simulate your async task here, like fetching data or waiting for route
	// await someAsyncTask(); // Replace this with actual logic

	const elapsed = (Date.now() - start) / 1000;
	const remainingTime = minLoadingTime - elapsed;

	if (remainingTime > 0) {
		setTimeout(() => {
			isLoading.value = false;
		}, remainingTime * 1000);
	}
	else {
		isLoading.value = false;
	}
});
</script>

<template>
	<div>
		<!-- Components -->
		<AppLoading v-if="isLoading" />
		<AppNavBar />
		<AppBackground />
		<AppHomepage />

		<main class="container">
			<slot /> <!-- Inject page content here -->
		</main>
	</div>
</template>
