<script setup>
const { $eventBus } = useNuxtApp();

const isVisible = ref(false);
const message = ref("");
const type = ref("info");

let timer = null;

const showAlert = (payload) => {
	message.value = payload.message;
	type.value = payload.type || "info";
	isVisible.value = true;

	clearTimeout(timer);
	timer = setTimeout(() => {
		isVisible.value = false;
	}, payload.duration || 3000);
};

onMounted(() => {
	$eventBus.on("alert", showAlert);
});

onBeforeUnmount(() => {
	$eventBus.off("alert", showAlert);
});
</script>

<template>
	<transition
		name="message-card-fade"
		appear
	>
		<div
			v-if="isVisible"
			class="message-card"
			:class="`message-card--${type}`"
		>
			<img
				class="image"
				:src="getIcon(type)"
				alt="I"
			>
			<div class="message-card-content">
				{{ message }}
			</div>
		</div>
	</transition>
</template>

<script>
function getIcon(type) {
	switch (type) {
		case "error":
			return "/images/icons/error.png";
		case "warning":
			return "/images/icons/warning.png";
		case "success":
			return "/images/icons/success.png";
		default:
			return "/images/icons/info.png";
	}
}
</script>

<style lang="scss">
@use "@/assets/scss/global-alert.scss"
</style>
