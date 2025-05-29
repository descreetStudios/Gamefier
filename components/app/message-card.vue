<template>
	<transition name="message-card-fade">
		<div
			v-if="isVisible"
			class="message-card"
		>
			<img
				class="image"
				src="@/assets/images/icons/warning.png"
			>
			<div class="message-card-content">
				<slot /> <!-- Allows you to pass content into the card -->
			</div>
		</div>
	</transition>
</template>

<script setup>
import { ref } from "vue";

const isVisible = ref(true);
</script>

<style lang="scss">
@use "@/assets/scss/message-card.scss"
</style>
