<template>
	<div class="slide-card-plus">
		<img
			src="/images/CardPlus.png"
			@dragstart.prevent
		>
	</div>
</template>

<style lang="scss">
.slide-card-plus {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    background-color: var(--surface);
    border-radius: 8px;
    box-shadow: 0 2px 4px var(--shadow);
    border: 1px solid var(--border);

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

    >img {
        transform: translateY(10px);
    }
}
</style>
