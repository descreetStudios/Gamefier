<template>
	<div
		v-if="props.show"
		class="quiz-popup__overlay"
	>
		<div class="quiz-popup__content">
			<h2>{{ props.title }}</h2>
			<p>{{ props.message }}</p>

			<div
				v-if="props.type === 'input' || props.type === 'select'"
				style="margin-bottom: 1rem;"
			>
				<template v-if="props.type === 'input'">
					<input
						:value="props.modelValue"
						type="text"
						placeholder="Enter value"
						style="width: 100%; padding: 0.5rem;"
						@input="onInput"
						@keyup.enter="props.onConfirm ? props.onConfirm() : props.closePopup()"
					>
				</template>
				<template v-else>
					<select
						:value="props.modelValue"
						style="width:100%; padding:0.5rem;"
						@input="onInput"
					>
						<option
							v-for="opt in props.scoringOptions"
							:key="opt.value"
							:value="opt.value"
						>
							{{ opt.label }}
						</option>
					</select>
				</template>
			</div>

			<div class="quiz-popup__buttons">
				<!-- Normal popups -->
				<template v-if="props.type === 'confirm' || props.type === 'input' || props.type === 'select'">
					<button @click="props.onCancel ? props.onCancel() : props.closePopup()">
						Cancel
					</button>
				</template>

				<!-- Play Quiz Popup -->
				<div
					v-if="props.show && props.type === 'play'"
					class="quiz-popup__popup"
				>
					<div class="quiz-popup__popup-actions">
						<button @click="eventHandler('link')">
							Copy Link
						</button>
						<button @click="eventHandler('open')">
							Open Quiz
						</button>
						<button @click="eventHandler('close')">
							Close
						</button>
					</div>
				</div>

				<!-- Default info/success/error -->
				<template v-else>
					<button
						:class="{ 'quiz-popup__button--danger': props.title === 'Exit Quiz?' || props.title === 'Confirm Delete' }"
						@click="props.onConfirm ? props.onConfirm() : props.closePopup()"
					>
						OK
					</button>
				</template>
			</div>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	modelValue: String,
	show: Boolean,
	title: String,
	message: String,
	type: { type: String, default: "info" }, // info | success | error | confirm | exit
	onConfirm: { type: Function, default: null },
	onCancel: { type: Function, default: null },
	closePopup: { type: Function, default: () => { } },
	scoringOptions: [
		{
			value: String,
			label: String,
		},
	],
});

const emits = defineEmits(["update:modelValue", "open", "close", "link"]);

const onInput = (event) => {
	emits("update:modelValue", event.target.value);
};

const eventHandler = (event) => {
	switch (event) {
		case "link":
			emits("link");
			break;
		case "open":
			emits("open");
			break;
		case "close":
			emits("close");
			break;
	}
};
</script>

<style lang="scss" scoped>
.quiz-popup {
	&__overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 10000;
	}

	&__content {
		background: var(--surface);
		padding: 2rem;
		border-radius: 1rem;
		max-width: 400px;
		width: 90%;
		text-align: center;
	}

	&__buttons {
		display: flex;
		justify-content: center;
		gap: 1rem;
		margin-top: 1rem;

		button {
			padding: 0.5rem 1.2rem;
			border-radius: 0.5rem;
			border: none;
			cursor: pointer;
			font-weight: bold;
		}
	}

	&__button {
		&--danger {
			background-color: red;

			&:hover {
				background-color: #b71c1c;
			}
		}
	}

	&__popup {
		&-actions {
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
		}
	}
}
</style>
