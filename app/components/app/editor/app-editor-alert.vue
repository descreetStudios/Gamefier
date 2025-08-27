<template>
	<div
		v-if="show"
		class="editor-popup-overlay"
	>
		<div class="editor-popup">
			<h2>{{ title }}</h2>
			<p>{{ message }}</p>

			<div
				v-if="type === 'confirm'"
				class="editor-popup-buttons"
			>
				<button @click="onCancelClick">
					Cancel
				</button>
				<button @click="onConfirmClick">
					Confirm
				</button>
			</div>
			<div
				v-else
				class="editor-popup-buttons"
			>
				<button @click="onConfirmClick">
					OK
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

// unused
const _props = defineProps({
	show: Boolean,
	title: String,
	message: String,
	type: { type: String, default: "info" }, // info | success | error | confirm
});

const emits = defineEmits(["confirm", "cancel"]);

const onConfirmClick = () => emits("confirm");
const onCancelClick = () => emits("cancel");
</script>

<style scoped>
.editor-popup-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.editor-popup {
  background: var(--surface);
  padding: 2rem;
  border-radius: 1rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.editor-popup-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.editor-popup-buttons button {
  padding: 0.5rem 1.2rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  font-weight: bold;
}
</style>
