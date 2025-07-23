<template>
	<div>
		<h1>You are currently banned</h1>
		<h2>Ban reason {{ $userStore.banReason }}</h2>
		<h2>Ban expires in {{ $userStore.banExpiresAt }}</h2>
		<h2>Banned by {{ $userStore.bannedBy }}</h2>
		<form @submit.prevent="">
			<input type="textarea">
		</form>
	</div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>
