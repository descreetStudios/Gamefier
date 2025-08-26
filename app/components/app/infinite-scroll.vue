<template>
	<div
		ref="triggerRef"
		class="infinite-scroll-trigger"
	>
		<slot />
	</div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

const props = defineProps({
	hasMore: { type: Boolean, default: true },
	disabled: { type: Boolean, default: false },
});

const emit = defineEmits(["load"]);

const triggerRef = ref(null);

const { stop } = useIntersectionObserver(
	triggerRef,
	([{ isIntersecting }]) => {
		if (isIntersecting && props.hasMore && !props.disabled) {
			emit("load");
		}
	},
	{ threshold: 0.1 },
);

watch(() => props.disabled, (val) => {
	if (val) stop();
});
</script>

<style scoped>
.infinite-scroll-trigger {
  height: 1px;
}
</style>
