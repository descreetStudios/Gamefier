<template>
	<div class="quiz-player">
		<app-editor-loading-screen v-if="loading" />

		<div
			v-else
			class="quiz-container"
		>
			<!-- Quiz title -->
			<h2 class="quiz-title">
				{{ quizData.title }}
			</h2>

			<!-- Current slide -->
			<div
				v-if="currentSlideIndex < quizData.slides.length"
				class="quiz-slide"
			>
				<!-- Question card at top -->
				<div class="slide-question-card">
					<h3 class="slide-question">
						{{ currentSlide.question }}
					</h3>
				</div>

				<!-- Slide content -->
				<div class="slide-content">
					<!-- Left: Image -->
					<div class="slide-left">
						<NuxtImg
							v-if="currentSlide.background"
							:src="currentSlide.background"
							class="slide-image"
							format="webp"
						/>
					</div>

					<!-- Right: Answers -->
					<div class="slide-right">
						<div class="answers">
							<button
								v-for="(answer, index) in currentSlide.answers"
								:key="index"
								:class="{ selected: selectedAnswerIndexes.includes(index) }"
								@click="toggleAnswer(index)"
							>
								{{ answer.text || `Answer ${index + 1}` }}
							</button>
						</div>
						<button
							v-if="selectedAnswerIndexes.length > 0"
							class="next-button"
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
				class="quiz-results"
			>
				<h3>Quiz Finished!</h3>
				<p>You got {{ correctCount }} / {{ quizData.slides.length }} correct.</p>

				<div
					v-for="(slide, index) in quizData.slides"
					:key="index"
					class="result-slide"
				>
					<h4>{{ slide.question }}</h4>
					<ul>
						<li
							v-for="(answer, aIndex) in slide.answers"
							:key="aIndex"
							:class="{ correct: answer.correct, selected: userAnswers[index]?.includes(aIndex) }"
						>
							{{ answer.text }}
						</li>
					</ul>
				</div>

				<button @click="restartQuiz">
					Restart Quiz
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, navigateTo } from "#imports";
import { doc, getDoc } from "firebase/firestore";
// <- missing
const { $db } = useNuxtApp(); // <- missing

const route = useRoute();
const loading = ref(false);
const quizData = ref({ title: "", slides: [] });
const currentSlideIndex = ref(0);
const selectedAnswerIndexes = ref([]);
const userAnswers = ref([]);

const currentSlide = computed(
	() => quizData.value.slides[currentSlideIndex.value] || { question: "", answers: [] },
);

const toggleAnswer = (index) => {
	const i = selectedAnswerIndexes.value.indexOf(index);
	if (i > -1) selectedAnswerIndexes.value.splice(i, 1);
	else selectedAnswerIndexes.value.push(index);
};

const nextSlide = () => {
	userAnswers.value[currentSlideIndex.value] = [...selectedAnswerIndexes.value];
	selectedAnswerIndexes.value = [];
	currentSlideIndex.value++;
};

const restartQuiz = () => {
	currentSlideIndex.value = 0;
	selectedAnswerIndexes.value = [];
	userAnswers.value = [];
};

const arraysEqual = (a, b) => a.length === b.length && a.every(v => b.includes(v));

const loadQuiz = async (quizId) => {
	loading.value = true;
	try {
		const docRef = doc($db, "quizzes", quizId);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			quizData.value = docSnap.data(); // <-- now slides should be set
			if (!quizData.value.slides) quizData.value.slides = [];
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

const correctCount = computed(() =>
	userAnswers.value.reduce((count, ansIndexes, slideIndex) => {
		const slide = quizData.value.slides[slideIndex];
		if (!slide) return count;

		const correctIndexes = slide.answers
			.map((a, i) => (a.correct ? i : null))
			.filter(i => i !== null);

		// Use arraysEqual to compare arrays
		if (arraysEqual(ansIndexes || [], correctIndexes)) count++;
		return count;
	}, 0),
);

onMounted(async () => {
	let quizId = route.query.quizId;
	if (Array.isArray(quizId)) quizId = quizId[0];
	if (!quizId) return navigateTo("/dashboard?activeViewComponent=games");
	await loadQuiz(quizId);
});
</script>

<style lang="scss" scoped>
@use "/assets/scss/quiz-player.scss";
</style>
