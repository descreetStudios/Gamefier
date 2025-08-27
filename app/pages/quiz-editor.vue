<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
	<div>
		<!-- Loading overlay -->
		<app-editor-loading-screen v-if="loading" />

		<!-- Main editor content -->
		<div
			v-else
			class="editor"
		>
			<div class="sidebar">
				<div class="title">
					<NuxtImg
						src="/images/logo/gamefier-logo-64px.png"
						alt="GF"
						format="webp"
					/>
					<h2>Quiz Editor</h2>
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
					</div>
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

		<!-- Popup overlay -->
		<div
			v-if="popup.show"
			class="editor-popup-overlay"
		>
			<div class="editor-popup">
				<h2>{{ popup.title }}</h2>
				<p>{{ popup.message }}</p>

				<div
					v-if="popup.type === 'input'"
					style="margin-bottom: 1rem;"
				>
					<input
						v-model="popup.inputValue"
						type="text"
						placeholder="Enter value"
						style="width: 100%; padding: 0.5rem;"
						@keyup.enter="popup.onConfirm ? popup.onConfirm() : closePopup()"
					>
				</div>

				<div class="editor-popup-buttons">
					<button
						v-if="popup.type === 'confirm' || popup.type === 'input'"
						@click="popup.onCancel ? popup.onCancel() : closePopup()"
					>
						Cancel
					</button>
					<button @click="popup.onConfirm ? popup.onConfirm() : closePopup()">
						OK
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { getFirestore, doc, collection, setDoc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const db = getFirestore();
const auth = getAuth();
const storage = getStorage();
const route = useRoute();

const loading = ref(false);
const slidesData = ref([{
	question: "",
	background: "",
	answerNumber: 2,
	answers: [
		{ text: "", correct: false },
		{ text: "", correct: false },
	],
}]);
const currentSlideIndex = ref(0);
const selectedElement = ref(null);
const currentQuizId = ref(null);
const quizTitle = ref("");

const currentSlide = computed(() => slidesData.value[currentSlideIndex.value]);

// Slide management
const selectSlide = index => currentSlideIndex.value = index;
const addSlide = () => {
	slidesData.value.push({ question: "", background: "", answerNumber: 2, answers: ["", ""] });
	currentSlideIndex.value = slidesData.value.length - 1;
};
const removeSlide = async (index) => {
	const slide = slidesData.value[index];
	if (slide._backgroundPath) {
		try {
			await deleteObject(storageRef(storage, slide._backgroundPath));
		}
		catch {
			return;
		}
	}
	slidesData.value.splice(index, 1);
	if (currentSlideIndex.value >= slidesData.value.length) currentSlideIndex.value = slidesData.value.length - 1;
};

// Sync answers array
watch(() => currentSlide.value.answerNumber, (n) => {
	const answers = currentSlide.value.answers;
	if (n > answers.length) {
		for (let i = answers.length; i < n; i++) answers.push({ text: "", correct: false });
	}
	else {
		answers.splice(n);
	}
});

// Handle background
const onBackgroundSelected = async (event) => {
	const file = event.target.files[0];
	if (!file) return;
	currentSlide.value.background = URL.createObjectURL(file);
	currentSlide.value._backgroundFile = file;
};

// Popup state
const popup = ref({
	show: false,
	title: "",
	message: "",
	type: "info", // info, success, error, confirm, input
	inputValue: "",
	onConfirm: null,
	onCancel: null,
});
const showPopup = ({ title = "", message = "", type = "info", onConfirm = null, onCancel = null }) => {
	popup.value = { show: true, title, message, type, inputValue: "", onConfirm, onCancel };
};
const closePopup = () => {
	popup.value.show = false;
	popup.value.onConfirm = null;
	popup.value.onCancel = null;
};

// Load quiz
const loadQuiz = async (quizId) => {
	loading.value = true;
	const docRef = doc(db, "quizzes", quizId);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) slidesData.value = docSnap.data().slides || [];
	currentQuizId.value = quizId;
	loading.value = false;
};

// Save quiz
const saveQuiz = async () => {
	const user = auth.currentUser;
	if (!user) {
		alert("You must be logged in");
		return;
	}

	const title = quizTitle.value || "";
	if (!currentQuizId.value && !title) {
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
		return;
	}

	loading.value = true;
	try {
		const uploadPromises = slidesData.value.map(async (slide) => {
			if (slide._backgroundFile) {
				if (slide._backgroundPath) try {
					await deleteObject(storageRef(storage, slide._backgroundPath));
				}
				catch {
					return;
				}
				const filePath = `quiz-backgrounds/${user.uid}/${Date.now()}-${slide._backgroundFile.name}`;
				const ref = storageRef(storage, filePath);
				await uploadBytes(ref, slide._backgroundFile);
				slide.background = await getDownloadURL(ref);
				slide._backgroundPath = filePath;
				delete slide._backgroundFile;
			}
		});
		await Promise.all(uploadPromises);

		const quizData = { title: quizTitle.value, slides: slidesData.value, uid: user.uid, updatedAt: new Date() };
		if (currentQuizId.value) await updateDoc(doc(db, "quizzes", currentQuizId.value), quizData);
		else {
			const quizRef = doc(collection(db, "quizzes"));
			await setDoc(quizRef, quizData);
			currentQuizId.value = quizRef.id;
		}

		showPopup({ title: "Saved!", message: "Quiz saved successfully.", type: "success", onConfirm: closePopup });
	}
	catch (err) {
		console.error(err);
		showPopup({ title: "Error", message: "Failed to save quiz.", type: "error", onConfirm: closePopup });
	}
	finally { loading.value = false; }
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
					await deleteObject(storageRef(storage, slide._backgroundPath));
				}
				catch {
					return;
				}
				await deleteDoc(doc(db, "quizzes", currentQuizId.value));
				showPopup({ title: "Deleted", message: "Quiz deleted successfully.", type: "success", onConfirm: () => navigateTo("/dashboard?activeViewComponent=games") });
			}
			catch (err) {
				console.error(err);
				showPopup({ title: "Error", message: "Failed to delete quiz.", type: "error", onConfirm: closePopup });
			}
			finally { loading.value = false; }
		},
		onCancel: closePopup,
	});
};

// On mount
onMounted(() => {
	const quizId = route.query.quizId;
	if (quizId) loadQuiz(quizId);
});
</script>

<style lang="scss">
@use "/assets/scss/controls.scss";
@use "/assets/scss/quiz-editor.scss";

.x { justify-self: flex-end; color: rgb(54,193,255); padding-left: 1vh; }
.slide-card-title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>
