<template>
	<div class="card-plus">
		<NuxtImg
			class="card-plus__image"
			src="/images/CardPlus.png"
			alt="Add new card"
			loading="lazy"
			format="webp"
			@dragstart.prevent
		/>
	</div>
</template>

<style lang="scss" scoped>
.card-plus {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    box-shadow: 0 2px 4px var(--shadow);
    width: 300px;
    min-width: 300px;
    height: 180px;
    overflow: hidden;
    transition: transform 0.25s ease, box-shadow 0.25s ease;

    &:hover {
        cursor: pointer;
        transform: scale(1.03) translateY(-2px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
    }

    &__image {
        transform: translateY(10px);
        pointer-events: none;
        user-select: none;
    }
}
</style>
