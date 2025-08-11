<script setup>
</script>

<template>
	<div>
		<!-- Components -->
		<AppNavBar />
		<AppBackground />
		<AppHomepage />

		<main class="container">
			<slot />
		</main>
	</div>
</template>
