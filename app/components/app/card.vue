<template>
	<div
		class="quiz-card"
		@click="$emit('card-click')"
	>
		<img
			:src="imgSrc"
			alt="Quiz image"
			class="quiz-card__image"
			@dragstart.prevent
		>

		<div class="quiz-card__label">
			<slot>Quiz</slot>
		</div>
	</div>
</template>

<script setup>
defineProps({
	imgSrc: {
		type: String,
		default: "/images/DefaultQuizImage.png",
	},
});

defineEmits(["card-click"]);
</script>

<style lang="scss">
.quiz-card {
  width: 300px;
  height: 200px;
  position: relative;
  cursor: pointer;

  background-color: var(--surface);
  border: 1px solid var(--secondary-surface);
  border-radius: 12px;
  padding: 16px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 1.2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 78%;
    object-fit: cover;
    border-radius: 12px;
    z-index: 0;
    image-rendering: auto;
  }

  &__label {
    width: 101%;
    height: 60px;

    position: absolute;
    bottom: 0;
    transform: translateY(1px);
    z-index: 2;

    background-color: rgb(var(--surface-rgb));
    border: 1px solid var(--secondary-surface);
    border-radius: 8px;
    box-shadow: 0 2px 6px var(--shadow);

    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 1rem;
    font-weight: 500;
  }
}
</style>
