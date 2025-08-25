<template>
	<div class="quiz-editor">
		<h2 class="quiz-editor__title">
			Quiz Editor
		</h2>

		<!-- TEXT BOX -->
		<div class="quiz-editor__field">
			<label class="quiz-editor__label">Text Box: {{ textBoxTest }}</label>
			<input
				v-model="textBoxTest"
				class="quiz-editor__input quiz-editor__input--text"
				type="text"
				name="text"
				placeholder="Text"
				aria-label="Text"
			>
		</div>

		<!-- NUMBER BOX -->
		<div class="quiz-editor__field">
			<label class="quiz-editor__label">Number Box: {{ numberBoxTest }}</label>
			<input
				v-model.number="numberBoxTest"
				class="quiz-editor__input quiz-editor__input--number"
				type="number"
				name="number"
				placeholder="Number"
				aria-label="Number"
			>
		</div>

		<!-- COLOR PICKER -->
		<div class="quiz-editor__field">
			<label class="quiz-editor__label">Color Picker: {{ colorPickerTest }}</label>
			<input
				v-model="colorPickerTest"
				class="quiz-editor__input quiz-editor__input--color"
				type="color"
				aria-label="Color picker"
			>
		</div>

		<!-- FILE PICKER -->
		<div class="quiz-editor__field">
			<label class="quiz-editor__label">File Picker:</label>
			<input
				type="file"
				class="quiz-editor__input quiz-editor__input--file"
				aria-label="File picker"
			>
		</div>

		<!-- CHOICE BOX -->
		<div class="quiz-editor__field">
			<label class="quiz-editor__label">Choice Box: {{ choiceBoxTest }}</label>
			<select
				v-model="choiceBoxTest"
				class="quiz-editor__input quiz-editor__input--select"
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
		</div>

		<!-- SWITCH -->
		<div class="quiz-editor__field quiz-editor__field--switch">
			<label class="switch">
				<input
					v-model="switchTest"
					type="checkbox"
					role="switch"
				>
				Correct answer ({{ switchTest }})
			</label>
		</div>
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
</style>
