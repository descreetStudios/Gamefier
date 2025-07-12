<template>
	<div>
		<p>Quiz Editor</p>

		<!-- TEXT BOX -->
		<p>Text Box: {{ textBoxTest }}</p>
		<input
			v-model="textBoxTest"
			class="textBoxTest"
			type="text"
			name="text"
			placeholder="Text"
			aria-label="Text"
		>

		<!-- NUMBER BOX -->
		<p>Number Box: {{ numberBoxTest }}</p>
		<input
			v-model.number="numberBoxTest"
			class="numberBoxTest"
			type="number"
			name="number"
			placeholder="Number"
			aria-label="Number"
		>

		<!-- COLOR PICKER -->
		<p>Color Picker: {{ colorPickerTest }}</p>
		<input
			v-model="colorPickerTest"
			class="colorPickerTest"
			type="color"
			aria-label="Color picker"
		>

		<!-- FILE PICKER -->
		<p>File Picker: {{ filePickerTest }}</p>
		<input
			type="file"
			class="filePickerTest"
			aria-label="File picker"
		>

		<!-- CHOICE BOX -->
		<p>Choice Box: {{ choiceBoxTest }}</p>
		<select
			v-model="choiceBoxTest"
			class="choiceBoxTest"
			name="favorite-cuisine"
			aria-label="Select your favorite cuisine..."
			required
		>
			<option
				selected
				disabled
				value=""
			>
				Select your favorite cuisine...
			</option>
			<option>Italian</option>
			<option>Japanese</option>
			<option>Indian</option>
			<option>Thai</option>
			<option>French</option>
		</select>

		<!-- SWITCH -->
		<p>Switch: {{ switchTest }}</p>
		<label class="switch">
			<input
				v-model="switchTest"
				name="terms"
				type="checkbox"
				role="switch"
			>
			Correct answer
		</label>
	</div>
</template>

<script setup>
const textBoxTest = ref("");
const numberBoxTest = ref(0);
const colorPickerTest = ref("");
const choiceBoxTest = ref("");
const switchTest = ref(false);
</script>

<style lang="scss" scoped>
@use "/assets/scss/controls.scss";

p {
	margin: 0.25rem 0.25rem 0.125rem;
	font-size: 0.875rem;
}
</style>
