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
			<app-card
				img-src="/images/CardPlus.png"
				@card-click="handleAddClick"
			>
				<p>Create new game</p>
			</app-card>

			<!-- Show user’s saved quizzes -->
			<app-card
				v-for="quiz in quizzes"
				:key="quiz.id"
				:img-src="quiz.background || '/images/BackgroundDark.png'"
				@card-click="() => openQuizEditor(quiz.id)"
			>
				<p>{{ quiz.question || "Untitled Quiz" }}</p>
			</app-card>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";

const quizzes = ref([]);
let unsubscribe = null;

const handleAddClick = () => {
	return navigateTo({ path: "/quiz-editor" });
};

function openQuizEditor(quizId) {
	return navigateTo({ path: "/quiz-editor", query: { quizId: quizId } });
}

onMounted(() => {
	const auth = getAuth();
	const db = getFirestore();

	onAuthStateChanged(auth, (user) => {
		// detach previous listener if any
		if (unsubscribe) unsubscribe();

		if (user) {
			const q = query(collection(db, "quizzes"), where("uid", "==", user.uid));

			// Live updates
			unsubscribe = onSnapshot(q, (snapshot) => {
				quizzes.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
			});
		}
		else {
			quizzes.value = [];
		}
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
</style>
