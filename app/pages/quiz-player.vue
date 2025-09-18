<template>
	<div class="quiz__container">
		<app-editor-loading-screen v-if="loading" />

		<div v-else>
			<app-quiz-alert
				:show="exitPopup.show"
				:title="exitPopup.title"
				:message="exitPopup.message"
				:type="exitPopup.type"
				:on-confirm="exitPopup.onConfirm"
				:on-cancel="exitPopup.onCancel"
			/>

			<div class="quiz__header">
				<!-- Quiz Title -->
				<h2 class="quiz__title">
					{{ quizData.title }}
				</h2>

				<!-- Exit Button -->
				<button
					class="quiz__exit-btn"
					@click="exitQuiz"
				>
					Exit
				</button>
			</div>

			<!-- Quiz Slide -->
			<div
				v-if="currentSlideIndex < quizData.slides.length"
				class="quiz__slide"
			>
				<!-- Question -->
				<div class="quiz__question-card">
					<h3 class="quiz__question-card-text">
						{{ currentSlide.question }}
					</h3>
				</div>

				<!-- Content: Image + Answers -->
				<div class="quiz__content">
					<!-- Image -->
					<div class="quiz__left">
						<NuxtImg
							v-if="currentSlide.background"
							:src="currentSlide.background"
							class="quiz__image"
							format="webp"
							alt="Quiz background image"
						/>
						<NuxtImg
							v-else
							:src="defaultBackground"
							class="quiz__image"
							format="webp"
						/>
					</div>

					<!-- Answers -->
					<div class="quiz__right">
						<div class="quiz__answers">
							<button
								v-for="(answer, index) in currentSlide.answers"
								:key="index"
								class="quiz__answers-btn"
								:class="{ 'quiz__answers-btn--selected': selectedAnswerIndexes.includes(index) }"
								@click="toggleAnswer(index)"
							>
								{{ answer.text || `Answer ${index + 1}` }}
							</button>
						</div>

						<button
							v-if="selectedAnswerIndexes.length > 0"
							class="quiz__next-btn"
							@click="nextSlide"
						>
							Next
						</button>
					</div>
				</div>
			</div>

			<!-- Results -->
			<div
				v-else
				class="quiz__results"
			>
				<h3>Quiz Finished!</h3>
				<p>Your score: {{ finalScore }} / {{ quizData.slides.length }}</p>

				<div
					v-for="(slide, index) in quizData.slides"
					:key="index"
					class="quiz__results-slide"
				>
					<h4>{{ slide.question }}</h4>
					<ul>
						<li
							v-for="(answer, aIndex) in slide.answers"
							:key="aIndex"
							:class="{
								'quiz__results-item--correct': answer.correct,
								'quiz__results-item--selected': userAnswers[index]?.includes(aIndex),
							}"
						>
							{{ answer.text }}
						</li>
					</ul>
				</div>

				<button
					class="quiz__next-btn"
					@click="restartQuiz"
				>
					Restart Quiz
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, navigateTo, useNuxtApp } from "#imports";
import { doc, getDoc } from "firebase/firestore";

const nuxtApp = useNuxtApp();
const { $db } = nuxtApp;

const route = useRoute();
const loading = ref(false);
const quizData = ref({ title: "", slides: [], scoringSystem: "allOrNothing" });
const currentSlideIndex = ref(0);
const selectedAnswerIndexes = ref([]);
const userAnswers = ref([]);

const defaultBackground = ref("/images/backgroundDark.png");

const currentSlide = computed(() => quizData.value.slides[currentSlideIndex.value] || { question: "", answers: [] });

const toggleAnswer = (index) => {
	const i = selectedAnswerIndexes.value.indexOf(index);
	if (i > -1) selectedAnswerIndexes.value.splice(i, 1);
	else selectedAnswerIndexes.value.push(index);
};

const nextSlide = () => {
	userAnswers.value[currentSlideIndex.value] = [...selectedAnswerIndexes.value.map(Number)];
	selectedAnswerIndexes.value = [];
	currentSlideIndex.value++;
};

const restartQuiz = () => {
	currentSlideIndex.value = 0;
	selectedAnswerIndexes.value = [];
	userAnswers.value = [];
};

const arraysEqualUnordered = (a, b) => {
	if (!a || !b) return false;
	if (a.length !== b.length) return false;
	const sortedA = [...a].sort((x, y) => x - y);
	const sortedB = [...b].sort((x, y) => x - y);
	return sortedA.every((v, i) => v === sortedB[i]);
};

const loadQuiz = async (quizId) => {
	loading.value = true;
	try {
		const docRef = doc($db, "quizzes", quizId);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			quizData.value = docSnap.data();
			if (!quizData.value.slides) quizData.value.slides = [];
			if (!quizData.value.scoringSystem) quizData.value.scoringSystem = "allOrNothing";
		}
		else {
			alert("Quiz not found");
			navigateTo("/dashboard?activeViewComponent=games");
		}
	}
	catch (err) {
		console.error(err);
		alert("Failed to load quiz");
		navigateTo("/dashboard?activeViewComponent=games");
	}
	finally {
		loading.value = false;
	}
};

const finalScore = computed(() => {
	return quizData.value.slides.reduce((score, slide, slideIndex) => {
		const selected = (userAnswers.value[slideIndex] || []).map(Number);
		const correctIndexes = slide.answers.map((a, i) => (a.correct ? i : null)).filter(i => i !== null);

		switch (quizData.value.scoringSystem) {
			case "allOrNothing":
				if (arraysEqualUnordered(selected, correctIndexes)) score += 1;
				break;

			case "partialCredit": {
				const correctSelected = selected.filter(i => correctIndexes.includes(i)).length;
				const wrongSelected = selected.filter(i => !correctIndexes.includes(i)).length;
				const slideScore = Math.max(correctSelected - wrongSelected, 0) / correctIndexes.length;
				score += slideScore;
				break;
			}

			case "correctOnly":
				if (selected.some(i => correctIndexes.includes(i))) score += 1;
				break;

			case "threshold": {
				const correctCount = selected.filter(i => correctIndexes.includes(i)).length;
				if ((correctCount / correctIndexes.length) >= 0.5) score += 1;
				break;
			}
		}

		return score;
	}, 0);
});

// Exit popup state
const exitPopup = ref({ show: false, title: "", message: "", type: "", onConfirm: null, onCancel: null });
const showExitPopup = ({ title, message, type, onConfirm }) => {
	exitPopup.value = { show: true, title, message, type, onConfirm, onCancel: () => (exitPopup.value.show = false) };
};

// Exit quiz function
const exitQuiz = () => {
	const quizFinished = currentSlideIndex.value >= quizData.value.slides.length;
	let previousPath = nuxtApp.payload.previousPath;
	if (previousPath.includes("/loading")) {
		previousPath = "/dashboard";
	}
	if (!quizFinished) {
		showExitPopup({
			title: "Exit Quiz?",
			message: "You haven't finished the quiz yet. Are you sure you want to exit?",
			type: "confirm",
			onConfirm: () => navigateTo(previousPath),
		});
	}
	else {
		navigateTo(previousPath);
	}
};

onMounted(() => {
	let quizId = route.query.quizId;
	if (Array.isArray(quizId)) quizId = quizId[0];
	if (!quizId) return navigateTo("/dashboard?activeViewComponent=games");
	loadQuiz(quizId);
});
</script>

<style lang="scss" scoped>
@use "/assets/scss/quiz-player.scss";
</style>
