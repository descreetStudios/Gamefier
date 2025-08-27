<template>
	<div>
		<app-editor-loading-screen v-if="loading" />
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
										aria-label="File picker"
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
	</div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { getFirestore, doc, collection, setDoc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// Firebase
const db = getFirestore();
const auth = getAuth();
const storage = getStorage();
const route = useRoute();

const loading = ref(false);
const slidesData = ref([{ question: "", background: "", answerNumber: 2, answers: ["", ""] }]);
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

	// Delete background image from storage if a path exists
	if (slide._backgroundPath) {
		try {
			const imageRef = storageRef(storage, slide._backgroundPath);
			await deleteObject(imageRef);
			console.log("Deleted slide image from storage:", slide._backgroundPath);
		}
		catch (error) {
			console.error("Failed to delete slide image:", error);
		}
	}

	// Remove the slide from local state
	slidesData.value.splice(index, 1);
	if (currentSlideIndex.value >= slidesData.value.length)
		currentSlideIndex.value = slidesData.value.length - 1;
};

// Sync answers array with answerNumber
watch(() => currentSlide.value.answerNumber, (n) => {
	const answers = currentSlide.value.answers;
	if (n > answers.length) for (let i = answers.length; i < n; i++) answers.push("");
	else answers.splice(n);
});

// Handle background file selection
const onBackgroundSelected = async (event) => {
	const file = event.target.files[0];
	if (!file) return;
	currentSlide.value.background = URL.createObjectURL(file); // local preview
	currentSlide.value._backgroundFile = file; // temporary file reference
};

// Load quiz from Firestore
const loadQuiz = async (quizId) => {
	loading.value = true;
	const docRef = doc(db, "quizzes", quizId);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		slidesData.value = docSnap.data().slides || [];
		currentQuizId.value = quizId;
	}
	else {
		console.error("No quiz found with ID:", quizId);
	}
	loading.value = false;
};

// Save or update quiz with Storage upload
const saveQuiz = async () => {
	loading.value = true; // show loading overlay
	const user = auth.currentUser;
	if (!user) {
		alert("You must be logged in to save a quiz.");
		return;
	}

	let title = quizTitle.value || "";
	if (!currentQuizId.value && !title) {
		title = prompt("Enter a name for this quiz:");
		if (!title) {
			alert("Quiz not saved. A name is required.");
			return;
		}
	}

	try {
		// Upload images in parallel
		const uploadPromises = slidesData.value.map(async (slide) => {
			if (slide._backgroundFile) {
				// Delete previous image if it exists
				if (slide._backgroundPath) {
					const oldRef = storageRef(storage, slide._backgroundPath);
					try {
						await deleteObject(oldRef);
						console.log("Deleted previous slide image:", slide._backgroundPath);
					}
					catch (err) {
						console.warn("Failed to delete previous image:", err);
					}
				}

				// Upload new image
				const file = slide._backgroundFile;
				const filePath = `quiz-backgrounds/${user.uid}/${Date.now()}-${file.name}`;
				const ref = storageRef(storage, filePath);
				await uploadBytes(ref, file);
				slide.background = await getDownloadURL(ref);
				slide._backgroundPath = filePath;
				delete slide._backgroundFile;
			}
		});
		await Promise.all(uploadPromises);

		const quizData = {
			title,
			slides: slidesData.value,
			uid: user.uid,
			updatedAt: new Date(),
		};

		if (currentQuizId.value) {
			const quizRef = doc(db, "quizzes", currentQuizId.value);
			await updateDoc(quizRef, quizData);
			alert("Quiz updated!");
		}
		else {
			const quizRef = doc(collection(db, "quizzes"));
			await setDoc(quizRef, quizData);
			currentQuizId.value = quizRef.id;
			alert("Quiz saved!");
		}

		quizTitle.value = title;
	}
	catch (error) {
		console.error("Failed to save quiz:", error);
		alert("Failed to save quiz. Check console for details.");
		loading.value = false; // hide loading overlay
	}
	finally {
		loading.value = false; // hide loading overlay
	}
};

const deleteQuiz = async () => {
	if (!currentQuizId.value) {
		alert("This quiz hasn't been saved yet. if you exit the editor now, the quiz is automatically discarded.");
		return;
	}

	const confirmDelete = confirm("Are you sure you want to delete this quiz? This cannot be undone.");
	if (!confirmDelete) return;

	loading.value = true; // show loading overlay

	try {
		// Delete all slide images
		for (const slide of slidesData.value) {
			if (slide._backgroundPath) {
				try {
					const imageRef = storageRef(storage, slide._backgroundPath);
					await deleteObject(imageRef);
					console.log("Deleted slide image:", slide._backgroundPath);
				}
				catch (err) {
					console.error("Failed to delete slide image:", err);
				}
			}
		}

		// Delete the quiz document
		await deleteDoc(doc(db, "quizzes", currentQuizId.value));
		alert("Quiz deleted!");

		// Redirect back to My Games
		navigateTo("/dashboard?activeViewComponent=games");
	}
	catch (error) {
		console.error("Failed to delete quiz:", error);
		alert("Failed to delete quiz. Check console for details.");
		loading.value = false; // hide loading overlay
	}
};

// On mount, load quiz if query param exists
onMounted(() => {
	const quizId = route.query.quizId;
	if (quizId) loadQuiz(quizId);
});
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
