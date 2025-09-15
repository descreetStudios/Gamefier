<template>
	<div>
		<h2
			v-if="quizzes.length === 0"
			class="create__heading"
		>
			Start creating by choosing a template!
			<div class="create__arrows">
				<span class="create__arrow" />
				<span class="create__arrow" />
				<span class="create__arrow" />
			</div>
		</h2>

		<div class="create__card-container">
			<!-- Always show the "create new game" card -->
			<app-dashboard-card
				img-src="/images/CardPlus.png"
				@card-click="handleAddClick"
			>
				<p>Create new game</p>
			</app-dashboard-card>

			<!-- Show user’s saved quizzes -->
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
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { ref as storageRef, getDownloadURL } from "firebase/storage";

const { $db, $auth, $storage } = useNuxtApp();
const quizzes = ref([]);
let unsubscribe = null;

const handleAddClick = () => {
	return navigateTo({ path: "/quiz-editor" });
};

function openQuizEditor(quizId) {
	return navigateTo({ path: "/quiz-editor", query: { quizId: quizId } });
}

async function getSlideImageURL(path) {
	if (!path) return "/images/BackgroundDark.png"; // fallback
	try {
		const imgRef = storageRef($storage, path);
		const url = await getDownloadURL(imgRef);
		return url;
	}
	catch (e) {
		console.warn("Error while loading image:", path, e.message);
		return "/images/BackgroundDark.png"; // fallback in case of error
	}
}

onMounted(() => {
	const user = $auth.currentUser;
	if (user) {
		const q = query(collection($db, "quizzes"), where("uid", "==", user.uid));

		unsubscribe = onSnapshot(q, async (snapshot) => {
			const quizData = await Promise.all(
				snapshot.docs.map(async (doc) => {
					const data = doc.data();
					let imageUrl = "/images/BackgroundDark.png";

					if (data.slides && data.slides.length > 0) {
						imageUrl = await getSlideImageURL(data.slides[0]._backgroundPath);
					}

					return {
						id: doc.id,
						...data,
						firstSlideImageUrl: imageUrl,
					};
				}),
			);

			quizzes.value = quizData;
		});
	}
	else {
		quizzes.value = [];
	}
});

onUnmounted(() => {
	if (unsubscribe) unsubscribe();
});
</script>

<style lang="scss" scoped>
.create {
	&__card-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&__heading {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		font-weight: bold;
		color: var(--primary-text);
		margin: 7vh 0 11vh;
	}

	&__arrows {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 7vh;
	}

	&__arrow {
		display: block;
		width: 20px;
		height: 20px;
		border-bottom: 1px solid var(--primary-text);
		border-right: 1px solid var(--primary-text);
		transform: rotate(45deg);
		margin: -5px 0;
		animation: create-arrows 2s infinite;

		&:nth-child(2) {
			animation-delay: -0.2s;
		}

		&:nth-child(3) {
			animation-delay: -0.4s;
		}
	}
}

@keyframes create-arrows {
	0% {
		opacity: 0;
		transform: rotate(45deg) translate(-20px, -20px);
	}

	50% {
		opacity: 1;
	}

	100% {
		opacity: 0;
		transform: rotate(45deg) translate(20px, 20px);
	}
}

.quiz-title {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	max-width: 100%;
	display: block;
}
</style>
