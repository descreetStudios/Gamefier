<script setup>
</script>

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
