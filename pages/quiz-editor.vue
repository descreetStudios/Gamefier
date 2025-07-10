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
	</div>
</template>

<script setup>
const textBoxTest = ref("");
const numberBoxTest = ref(0);
const colorPickerTest = ref("");
const choiceBoxTest = ref("");
</script>

<style lang="scss" scoped>
input.textBoxTest,
input.numberBoxTest,
input.colorPickerTest,
input.filePickerTest,
select.choiceBoxTest {
	margin: 0.25rem 0.25rem 0.125rem;
	border-radius: 10px;
	height: 2rem;
	width: 150px;
}

input.colorPickerTest {
	border-radius: 13px;
	height: 2rem;
	width: 2rem;
	padding: 0.2rem; // between the color zone and the border
}

input.filePickerTest {
	height: 2.4rem;
	width: 300px;
	padding: 0.25rem 0.5rem;
	border: 1px solid var(--border);
	cursor: pointer;
	font-size: 0.875rem;
}

input.filePickerTest::-webkit-file-upload-button {
	padding: 0.2rem 0.5rem;
	margin-right: 0.5rem;
	border: none;
	background: rgb(var(--secondary-surface-rgb));
	color: rgb(var(--primary-text-rgb));
	border-radius: 10px;
	cursor: pointer;
	font-size: 0.875rem;
	transition: background 0.2s ease;
	box-shadow: 0 2px 5px var(--shadow);
}

input.filePickerTest::-webkit-file-upload-button:hover {
	background: var(--primary-hover);
}

select.choiceBoxTest {
	height: 2.5rem;
	width: 200px;
	padding: 0 0.5rem;
	font-size: 0.875rem;
	background-color: var(--secondary-surface-rgb);
	color: var(--primary-text);
}

select.choiceBoxTest:focus {
	outline: none;
	border-color: var(--pico-primary, #0d6efd);
	box-shadow: 0 0 0 2px var(--pico-primary, #0d6efd);
}

p {
	margin: 0.25rem 0.25rem 0.125rem;
	font-size: 0.875rem;
}
</style>
