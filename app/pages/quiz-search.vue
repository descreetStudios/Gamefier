<template>
	<div>
		<app-global-alert />
		<form @submit.prevent="searchQuizzesStartsWith()">
			<input
				v-model="quizSearchName"
				type="text"
				placeholder="Quiz Name"
			>
			<input
				value="Search"
				type="submit"
			>
		</form>
		<app-dashboard-card
			v-for="quiz in quizzes"
			:key="quiz.id"
			:img-src="quiz.firstSlideImageUrl"
			@card-click="() => openQuizEditor(quiz.id)"
		>
			<p class="quiz-title">
				{{ quiz.title || "Untitled Quiz" }}
			</p>
		</app-dashboard-card>
		<app-infinite-scroll
			:has-more="hasMoreQuizzes"
			@load="searchQuizzesStartsWith(false)"
		>
			<div
				v-if="isLoadingMore"
				class="loader"
			>
				Caricamento...
			</div>
		</app-infinite-scroll>
	</div>
</template>

<script setup>
import {
	collection,
	query,
	where,
	getDocs,
	limit,
	startAfter,
} from "firebase/firestore";
import { ref as storageRef, getDownloadURL } from "firebase/storage";
import { ref } from "vue";

const { $db, $storage } = useNuxtApp();
const { $eventBus } = useNuxtApp();

const quizSearchName = ref("");
const pageSize = 10;
const lastVisibleDoc = ref(null);
const hasMoreQuizzes = ref(false);
const isLoadingMore = ref(false);
const quizzes = ref([]);

const searchQuizzesStartsWith = async (isNewSearch = true) => {
	isLoadingMore.value = true;

	if (isNewSearch) {
		quizzes.value = [];
		lastVisibleDoc.value = null;
		hasMoreQuizzes.value = false;
	}

	const usersRef = collection($db, "quizzes");
	const lowerCaseSearchQuery = quizSearchName.value.toLowerCase();

	if (!lowerCaseSearchQuery) {
		isLoadingMore.value = false;
		if (isNewSearch) {
			$eventBus.emit("alert", {
				message: "Please enter a name to search.",
				type: "error",
				duration: 3000,
			});
		}
		return;
	}

	const endText = lowerCaseSearchQuery + "\uf8ff";

	let q = query(
		usersRef,
		where("titleLowerCase", ">=", lowerCaseSearchQuery),
		where("titleLowerCase", "<=", endText),
		limit(pageSize),
	);

	if (!isNewSearch && lastVisibleDoc.value) {
		q = query(q, startAfter(lastVisibleDoc.value));
	}

	try {
		const querySnapshot = await getDocs(q);

		const newQuizzes = await Promise.all(
			querySnapshot.docs.map(async (docSnap) => {
				const data = docSnap.data();
				let imageUrl = "/images/BackgroundDark.png";

				if (data.slides && data.slides.length > 0) {
					imageUrl = await getSlideImageURL(data.slides[0]._backgroundPath);
				}
				return { id: docSnap.id, firstSlideImageUrl: imageUrl, ...data };
			}),
		);

		if (isNewSearch && newQuizzes.length === 0) {
			$eventBus.emit("alert", {
				message: "No quizzes found.",
				type: "info",
				duration: 3000,
			});
		}

		quizzes.value = [...quizzes.value, ...newQuizzes];

		if (querySnapshot.docs.length < pageSize) {
			hasMoreQuizzes.value = false;
		}
		else {
			lastVisibleDoc.value = querySnapshot.docs[querySnapshot.docs.length - 1];
			hasMoreQuizzes.value = true;
		}
	}
	catch (err) {
		$eventBus.emit("alert", {
			message: `Failed to fetch quizzes: ${err.message || "Unknown error"}`,
			type: "error",
			duration: 3000,
		});
		console.error(err);
	}
	finally {
		isLoadingMore.value = false;
	}
};

async function getSlideImageURL(path) {
	if (!path) return "/images/BackgroundDark.png"; // fallback
	try {
		const imgRef = storageRef($storage, path);
		const url = await getDownloadURL(imgRef);
		return url;
	}
	catch (e) {
		console.warn("Errore nel caricamento immagine:", path, e.message);
		return "/images/BackgroundDark.png"; // fallback in caso di errore
	}
};

function openQuizEditor(quizId) {
	return navigateTo({ path: "/quiz-player", query: { quizId: quizId } });
}
</script>

<style lang="scss" scoped>

</style>
