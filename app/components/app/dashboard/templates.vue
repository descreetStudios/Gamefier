<template>
	<h2 class="template-select__heading">
		Choose a template and start creating!
		<div class="template-select__arrows">
			<span class="template-select__arrow" />
			<span class="template-select__arrow" />
			<span class="template-select__arrow" />
		</div>
	</h2>

	<div class="template-select__card-container">
		<app-dashboard-card
			img-src="/images/DefaultQuizImage.png"
			@card-click="handleQuizClick"
		>
			<p>Quiz</p>
		</app-dashboard-card>

		<app-dashboard-card
			img-src="/images/DefaultQuizImage.png"
			@card-click="handleGooseClick"
		>
			<p>Goose game</p>
		</app-dashboard-card>
	</div>
</template>

<script setup>
function handleQuizClick() {
	console.log("Quiz card clicked!");
}

function handleGooseClick() {
	console.log("Goose game clicked!");
}
</script>

<style lang="scss" scoped>
.template-select {
	&__card-container {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 16px;
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
		animation: template-select-arrows 2s infinite;

		&:nth-child(2) {
			animation-delay: -0.2s;
		}

		&:nth-child(3) {
			animation-delay: -0.4s;
		}
	}
}

@keyframes template-select-arrows {
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
