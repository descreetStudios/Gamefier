<template>
	<div class="editor">
		<div class="sidebar">
			<div class="title">
				<NuxtImg
					src="/images/logo/gamefier-logo-64px.png"
					alt="GF"
					format="webp"
				/>
				<h2>Quiz Editor</h2>
			</div>
			<div class="separator" />

			<div class="contextual-props">
				<!-- Background Properties -->
				<app-editor-property-card
					v-if="selectedElement === 'background'"
					class="card"
				>
					<template #title>
						<h4>Background</h4>
					</template>
					<template #content>
						<div class="content-content">
							<p>File Picker:</p>
							<input
								type="file"
								class="filePickerTest"
								aria-label="File picker"
							>
						</div>
					</template>
				</app-editor-property-card>

				<!-- Question Properties -->
				<app-editor-property-card
					v-if="selectedElement === 'questionTitle'"
					class="card"
				>
					<template #title>
						<h4>Question</h4>
					</template>
					<template #content>
						<div class="content-content">
							<h5>Question Text:</h5>
							<input
								v-model="currentSlide.question"
								type="text"
								placeholder="Text"
								aria-label="Text"
								maxlength="150"
							>
						</div>
					</template>
				</app-editor-property-card>

				<!-- Answer Properties -->
				<app-editor-property-card
					v-for="i in currentSlide.answerNumber"
					v-if="selectedElement === 'answer'"
					:key="i"
					class="card"
				>
					<template #title>
						<h4>Answer {{ i }}</h4>
					</template>
					<template #content>
						<div class="content-content">
							<h5>Answer:</h5>
							<input
								v-model="currentSlide.answers[i - 1]"
								type="text"
								placeholder="Answer"
								aria-label="Text"
							>
						</div>
					</template>
				</app-editor-property-card>
			</div>

			<div class="separator" />

			<!-- Global Properties -->
			<div class="global-props">
				<app-editor-property-card class="card">
					<template #title>
						<h4>Number of answers</h4>
					</template>
					<template #content>
						<div class="content-content">
							<input
								v-model.number="currentSlide.answerNumber"
								type="number"
								min="2"
								max="6"
							>
						</div>
					</template>
				</app-editor-property-card>
			</div>
		</div>

		<div class="content">
			<div class="render">
				<h2
					class="render__question"
					@click="selectedElement = 'questionTitle'"
				>
					{{ currentSlide.question || "Insert your question here" }}
				</h2>

				<div class="render__middle">
					<NuxtImg
						class="render__middle__image"
						:src="currentSlide.background || '/images/BackgroundDark.png'"
						format="webp"
						@dragstart.prevent
						@click="selectedElement = 'background'"
					/>

					<div class="render__middle__options">
						<div
							v-for="i in currentSlide.answerNumber"
							:key="i"
							class="render__middle__options__option"
							@click="selectedElement = 'answer'"
						>
							<div class="render__middle__options__option__cardbg">
								<div class="render__middle__options__option__cardbg__card">
									<h4 class="render__middle__options__option__cardbg__card__text">
										{{ currentSlide.answers[i - 1] || `Insert Answer ${i}` }}
									</h4>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="separator" />

			<!-- Slides -->
			<div class="slides">
				<app-editor-slide-card
					v-for="(slide, index) in slidesData"
					:key="index"
					:class="{ selected: currentSlideIndex === index }"
					@click="selectSlide(index)"
				>
					<template #slide-title>
						<h4 class="slide-card-title">
							{{ slide.question || 'Slide ' + (index + 1) }}
						</h4>
						<h4
							class="x"
							@click.stop="removeSlide(index)"
						>
							X
						</h4>
					</template>
					<template #slide-content>
						<NuxtImg
							:src="slide.background || '/images/BackgroundDark.png'"
							format="webp"
							@dragstart.prevent
						/>
					</template>
				</app-editor-slide-card>

				<app-editor-slide-card-plus @click="addSlide" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const slidesData = ref([
	{ question: "", background: "", answerNumber: 2, answers: ["", ""] },
]);

const currentSlideIndex = ref(0);
const selectedElement = ref(null);

const currentSlide = computed(() => slidesData.value[currentSlideIndex.value]);

const selectSlide = (index) => {
	currentSlideIndex.value = index;
};

const addSlide = () => {
	slidesData.value.push({
		question: "",
		background: "",
		answerNumber: 2,
		answers: ["", ""],
	});
	currentSlideIndex.value = slidesData.value.length - 1;
};

const removeSlide = (index) => {
	slidesData.value.splice(index, 1);
	if (currentSlideIndex.value >= slidesData.value.length) {
		currentSlideIndex.value = slidesData.value.length - 1;
	}
};

// Keep answers array in sync with answerNumber for current slide
watch(
	() => currentSlide.value.answerNumber,
	(n) => {
		const answers = currentSlide.value.answers;
		if (n > answers.length) for (let i = answers.length; i < n; i++) answers.push("");
		else answers.splice(n);
	},
);
</script>

<style lang="scss">
@use "/assets/scss/controls.scss";
@use "/assets/scss/quiz-editor.scss";

.x {
	justify-self: flex-end;
	color: rgb(54,193,255);
	padding-left: 1vh;
}

.slide-card-title {
  white-space: nowrap;      /* Keep text on a single line */
  overflow: hidden;         /* Hide overflow */
  text-overflow: ellipsis;  /* Show three dots when text is too long */
}
</style>
