<script setup>
</script>

<template>
	<div>
		<!-- Components -->
		<AppGlobalAlert />
		<AppNavBar />
		<AppBackground />
		<AppHomepage />

		<main class="container">
			<slot />
		</main>
	</div>
</template>
