<template>
	<div>
		<!-- Loading overlay -->
		<app-editor-loading-screen v-if="loading" />

		<!-- Main editor content -->
		<div
			v-else
			class="editor"
		>
			<!-- Popup overlay -->
			<app-quiz-alert
				v-model="popup.inputValue"
				:show="popup.show"
				:title="popup.title"
				:message="popup.message"
				:type="popup.type"
				:on-confirm="popup.onConfirm"
				:on-cancel="popup.onCancel"
				:close-popup="closePopup"
				:scoring-options="scoringOptions"
				@confirm="popup.onConfirm ? popup.onConfirm() : closePopup()"
				@cancel="popup.onCancel ? popup.onCancel() : closePopup()"
				@close="closePopup"
				@link="copyPlayLink"
				@open="openPlayLink"
			/>

			<div class="sidebar">
				<div class="title">
					<NuxtImg
						src="/images/logo/gamefier-logo-64px.png"
						alt="GF"
						format="webp"
					/>
					<h2>Quiz Editor</h2>

					<button
						:disabled="isGenerating"
						@click="generateQuestionsWithTheme"
					>
						{{ isGenerating ? "Generating..." : "Generate Questions" }}
					</button>

					<div class="title-buttons">
						<button @click="saveQuiz">
							Save
						</button>
						<button
							v-if="currentQuizId"
							class="danger"
							@click="deleteQuiz"
						>
							Delete
						</button>
						<button
							:class="{ danger: hasUnsavedChanges }"
							@click="confirmExit"
						>
							Exit
						</button>

						<!-- Play button only shows after quiz has been saved -->
						<button
							v-if="hasBeenSaved"
							@click="showPopup({ title: 'Play Quiz', message: 'You can now play your quiz.', type: 'play' })"
						>
							Play
						</button>
					</div>
				</div>
				<div class="separator" />

				<!-- Contextual props -->
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
								<div class="file-picker-wrapper">
									<input
										type="file"
										class="quiz-editor__input--file"
										@change="onBackgroundSelected"
									>
									<img
										v-if="currentSlide.background"
										:src="currentSlide.background"
										class="quiz-editor__background-preview"
									>
									<button
										v-if="currentSlide._backgroundFile || currentSlide._backgroundPath"
										class="remove-background-btn"
										@click="removeBackground"
									>
										Remove Background
									</button>
								</div>
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
									maxlength="150"
								>
							</div>
						</template>
					</app-editor-property-card>

					<!-- Answer Properties -->
					<div v-if="selectedElement === 'answer'">
						<app-editor-property-card
							v-for="i in currentSlide.answerNumber"
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
										v-model="currentSlide.answers[i - 1].text"
										type="text"
										placeholder="Answer"
										aria-label="Text"
									>
									<div class="answer-correct">
										<label>
											Correct:
											<input
												v-model="currentSlide.answers[i - 1].correct"
												type="checkbox"
											>
										</label>
									</div>
								</div>
							</template>
						</app-editor-property-card>
					</div>
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
											{{ currentSlide.answers[i - 1]?.text || `Insert Answer ${i}` }}
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
	</div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { doc, collection, setDoc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const { $db, $auth, $storage } = useNuxtApp();
const route = useRoute();

const loading = ref(false);
const slidesData = ref([
	{ question: "", background: "", answerNumber: 2, answers: [{ text: "", correct: false }, { text: "", correct: false }] },
]);
const currentSlideIndex = ref(0);
const selectedElement = ref(null);
const currentQuizId = ref(null);
const quizTitle = ref("");
const quizTitleLowerCase = computed(() => quizTitle.value.toLowerCase());
const scoringSystem = ref("allOrNothing");
const hasBeenSaved = ref(false);

const scoringOptions = [
	{ value: "allOrNothing", label: "All-or-Nothing" },
	{ value: "partialCredit", label: "Partial Credit" },
	{ value: "correctOnly", label: "Correct Only (no penalty)" },
	{ value: "threshold", label: "Threshold / Weighted" },
];

const currentSlide = computed(() => slidesData.value[currentSlideIndex.value]);

const popup = ref({
	show: false,
	title: "",
	message: "",
	type: "info", // 'info' | 'success' | 'error' | 'confirm' | 'input' | 'select' | 'play'
	inputValue: "",
	onConfirm: null,
	onCancel: null,
});

const showPopup = ({ title = "", message = "", type = "info", onConfirm = null, onCancel = null }) => {
	popup.value = {
		show: true,
		title,
		message,
		type,
		inputValue: type === "select" ? scoringOptions[0].value : "",
		onConfirm,
		onCancel,
	};
};

const closePopup = () => {
	popup.value.show = false;
	popup.value.onConfirm = null;
	popup.value.onCancel = null;
};

// QUIZ GENERATION
const isGenerating = ref(false);

/*
Do not modify the parser unless you know what you are doing.
The parser works in very tight relation to the prompt found in server/api/generate-quiz-local.js.
Improper edits to either can cause the whole ai generation to stop working.
*/
function parseQuizAIOutput(output) {
	const slides = [];
	const blocks = output.split(/\n\s*\n/); // split by blank lines between questions

	blocks.forEach((block) => {
		const lines = block.split("\n").map(l => l.trim()).filter(l => l);
		if (!lines.length) return;

		const questionLine = lines[0];
		if (!questionLine.toLowerCase().startsWith("question:")) return;

		const questionText = questionLine.replace(/^Question:\s*/i, "");
		const answers = [];
		let correctLetter = "";

		lines.slice(1).forEach((line) => {
			const answerMatch = line.match(/^([A-F])\.\s*(.+)/i);
			const answerFlag = line.match(/^Answer:\s*([A-F])/i);

			if (answerMatch) {
				answers.push({ text: answerMatch[2], correct: false });
			}
			else if (answerFlag) {
				correctLetter = answerFlag[1].toUpperCase();
			}
		});

		if (correctLetter) {
			const index = correctLetter.charCodeAt(0) - 65; // A=0, B=1...
			if (answers[index]) answers[index].correct = true;
		}

		if (questionText && answers.length >= 2) {
			slides.push({
				question: questionText,
				background: "",
				answerNumber: answers.length,
				answers,
			});
		}
	});

	return slides;
}

const generateQuestionsWithTheme = () => {
	showPopup({
		title: "Enter Quiz Theme",
		message: "Please provide a theme for AI-generated questions. Always check AI-generated content for errors.",
		type: "input",
		inputValue: "",
		onConfirm: () => {
			const theme = popup.value.inputValue.trim();
			if (!theme) {
				closePopup();
				return;
			}
			closePopup();
			generateQuestions(theme);
		},
		onCancel: () => closePopup(),
	});
};

const generateQuestions = async (theme) => {
	if (!theme) return;

	isGenerating.value = true;
	try {
		const res = await $fetch("/api/generate-quiz-local", {
			method: "POST",
			body: { theme }, // send theme to prompt
		});

		const parsedSlides = parseQuizAIOutput(res.questions);

		if (parsedSlides.length === 0) {
			console.warn("No slides generated from AI output.");
			return;
		}

		slidesData.value.push(...parsedSlides);
	}
	catch (err) {
		console.error("Error generating quiz:", err);
	}
	finally {
		isGenerating.value = false;
	}
};

// Slide management
const selectSlide = index => currentSlideIndex.value = index;
const addSlide = () => {
	slidesData.value.push({
		question: "",
		background: "",
		answerNumber: 2,
		answers: [{ text: "", correct: false }, { text: "", correct: false }],
	});
	currentSlideIndex.value = slidesData.value.length - 1;
};
const removeSlide = async (index) => {
	const slide = slidesData.value[index];
	if (slide._backgroundPath) {
		try {
			await deleteObject(storageRef($storage, slide._backgroundPath));
		}
		catch { return; }
	}
	slidesData.value.splice(index, 1);
	if (slidesData.value.length === 0) {
		slidesData.value.push({ question: "", background: "", answerNumber: 2, answers: [{ text: "", correct: false }, { text: "", correct: false }] });
		currentSlideIndex.value = 0;
	}
	else if (currentSlideIndex.value >= slidesData.value.length) currentSlideIndex.value = slidesData.value.length - 1;
};

// Sync answers array
watch(() => currentSlide.value.answerNumber, (n) => {
	const answers = currentSlide.value.answers;
	if (n > answers.length) for (let i = answers.length; i < n; i++) answers.push({ text: "", correct: false });
	else answers.splice(n);
});

// Handle background
const onBackgroundSelected = async (event) => {
	const file = event.target.files[0];
	if (!file) return;
	currentSlide.value.background = URL.createObjectURL(file);
	currentSlide.value._backgroundFile = file;
};

const originalQuizData = ref(null);
const loadQuiz = async (quizId) => {
	loading.value = true;
	const docRef = doc($db, "quizzes", quizId);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		slidesData.value = docSnap.data().slides || [];
		quizTitle.value = docSnap.data().title || "";
		scoringSystem.value = docSnap.data().scoringSystem || "allOrNothing";
		originalQuizData.value = JSON.stringify({ title: quizTitle.value, titleLowerCase: quizTitleLowerCase.value, slides: slidesData.value, scoringSystem: scoringSystem.value });
		currentQuizId.value = quizId;
		hasBeenSaved.value = true; // quiz already exists
	}
	loading.value = false;
	originalQuizData.value = JSON.stringify({ title: quizTitle.value, titleLowerCase: quizTitleLowerCase.value, slides: slidesData.value, scoringSystem: scoringSystem.value });
};

// Detect unsaved changes
const hasUnsavedChanges = computed(() => {
	const current = JSON.stringify({ title: quizTitle.value, titleLowerCase: quizTitleLowerCase.value, slides: slidesData.value, scoringSystem: scoringSystem.value });
	return current !== originalQuizData.value;
});

// Save quiz
const saveQuiz = async () => {
	const user = $auth.currentUser;
	if (!user) {
		alert("You must be logged in");
		return;
	}
	if (!currentQuizId.value && !quizTitle.value) {
		// First save: choose scoring + title
		showPopup({
			title: "Select Scoring System",
			message: "Choose how points will be calculated for this quiz.",
			type: "select",
			onConfirm: async () => {
				scoringSystem.value = popup.value.inputValue;
				closePopup();
				showPopup({
					title: "Enter Quiz Title",
					message: "Please enter a name for this quiz",
					type: "input",
					onConfirm: async () => {
						if (!popup.value.inputValue) {
							showPopup({ title: "Cancelled", message: "Quiz not saved.", type: "error" });
							return;
						}
						quizTitle.value = popup.value.inputValue;
						closePopup();
						await saveQuiz();
					},
					onCancel: () => closePopup(),
				});
			},
			onCancel: () => closePopup(),
		});
		return;
	}
	loading.value = true;
	try {
		const uploadPromises = slidesData.value.map(async (slide) => {
			if (slide._backgroundFile) {
				if (slide._backgroundPath) try {
					await deleteObject(storageRef($storage, slide._backgroundPath));
				}
				catch { return; }
				const filePath = `quiz-backgrounds/${user.uid}/${Date.now()}-${user.displayName}`;
				const ref = storageRef($storage, filePath);
				await uploadBytes(ref, slide._backgroundFile);
				slide.background = await getDownloadURL(ref);
				slide._backgroundPath = filePath;
				delete slide._backgroundFile;
			}
		});
		await Promise.all(uploadPromises);
		const quizData = {
			title: quizTitle.value,
			titleLowerCase: quizTitleLowerCase.value,
			slides: slidesData.value,
			scoringSystem: scoringSystem.value,
			uid: user.uid,
			updatedAt: new Date(),
		};
		if (currentQuizId.value) await updateDoc(doc($db, "quizzes", currentQuizId.value), quizData);
		else {
			const quizRef = doc(collection($db, "quizzes"));
			await setDoc(quizRef, quizData);
			currentQuizId.value = quizRef.id;
		}
		hasBeenSaved.value = true; // enable Play button
		showPopup({ title: "Saved!", message: "Quiz saved successfully.", type: "success", onConfirm: closePopup });
		originalQuizData.value = JSON.stringify({ title: quizTitle.value, titleLowerCase: quizTitleLowerCase.value, slides: slidesData.value, scoringSystem: scoringSystem.value });
	}
	catch (err) {
		console.error(err);
		showPopup({ title: "Error", message: "Failed to save quiz.", type: "error", onConfirm: closePopup });
	}
	finally {
		loading.value = false;
	}
};

// Delete quiz
const deleteQuiz = async () => {
	if (!currentQuizId.value) {
		alert("Quiz not saved yet");
		return;
	}
	showPopup({
		title: "Confirm Delete",
		message: "Are you sure you want to delete this quiz?",
		type: "confirm",
		onConfirm: async () => {
			closePopup();
			loading.value = true;
			try {
				for (const slide of slidesData.value) if (slide._backgroundPath) try {
					await deleteObject(storageRef($storage, slide._backgroundPath));
				}
				catch { return; }
				await deleteDoc(doc($db, "quizzes", currentQuizId.value));
				showPopup({ title: "Deleted", message: "Quiz deleted successfully.", type: "success", onConfirm: () => navigateTo("/dashboard?activeViewComponent=games") });
			}
			catch (err) {
				console.error(err);
				showPopup({ title: "Error", message: "Failed to delete quiz.", type: "error", onConfirm: closePopup });
			}
			finally {
				loading.value = false;
			}
		},
		onCancel: closePopup,
	});
};

const removeBackground = () => {
	currentSlide.value.background = null;
	delete currentSlide.value._backgroundFile;
	delete currentSlide.value._backgroundPath;
};

// Go back to dashboard
const confirmExit = () => {
	if (hasUnsavedChanges.value) {
		showPopup({
			title: "Unsaved Changes",
			message: "You have unsaved changes. Are you sure you want to exit?",
			type: "confirm",
			onConfirm: () => navigateTo("/dashboard?activeViewComponent=games"),
			onCancel: closePopup,
		});
	}
	else navigateTo("/dashboard?activeViewComponent=games");
};

// Play button actions
const copyPlayLink = async () => {
	if (!currentQuizId.value) return;
	const link = `${window.location.origin}/quiz-player?quizId=${currentQuizId.value}`;
	await navigator.clipboard.writeText(link);
	alert("Link copied to clipboard!");
	closePopup();
};

const openPlayLink = () => {
	if (!currentQuizId.value) return;
	const link = `${window.location.origin}/quiz-player?quizId=${currentQuizId.value}`;
	window.open(link, "_blank");
	closePopup();
};

// On mount
onMounted(() => {
	const quizId = route.query.quizId;
	if (quizId) loadQuiz(quizId);
});
</script>

<style lang="scss" scoped>
@use "/assets/scss/controls.scss";
@use "/assets/scss/quiz-editor.scss";

.x {
  justify-self: flex-end;
  color: rgb(54, 193, 255);
  padding-left: 1vh;
}
.slide-card-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
