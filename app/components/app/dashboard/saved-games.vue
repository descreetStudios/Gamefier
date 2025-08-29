<template>
	<div>
		<h2
			v-if="quizzes.length === 0"
			class="create__heading"
		>
			No saved games found.
		</h2>

		<div class="create__card-container">
			<app-dashboard-card
				v-for="quiz in quizzes"
				:key="quiz.id"
				:img-src="quiz.background || '/images/BackgroundDark.png'"
				@card-click="() => openQuizPlayer(quiz.id)"
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
import { getFirestore, collection, onSnapshot } from "firebase/firestore";

const quizzes = ref([]);
let unsubscribe = null;

const db = getFirestore();

const openQuizPlayer = (quizId) => {
	window.open(`/quiz-player?quizId=${quizId}`, "_blank");
};

onMounted(() => {
	// detach previous listener if any
	if (unsubscribe) unsubscribe();

	// Fetch all quizzes with live updates
	unsubscribe = onSnapshot(collection(db, "quizzes"), (snapshot) => {
		quizzes.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	});
});

// cleanup listener on unmount
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
    flex-wrap: wrap;
    gap: 1rem;
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
}

.quiz-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  display: block;
}
</style>
