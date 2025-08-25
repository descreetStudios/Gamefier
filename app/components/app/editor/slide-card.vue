<template>
	<div class="slide-card">
		<div class="slide-card__header">
			<div class="slide-card__title-wrapper">
				<slot name="slide-title" />
				<h4 class="slide-card__close">
					X
				</h4>
			</div>
			<div class="slide-card__separator" />
		</div>

		<div class="slide-card__content">
			<slot name="slide-content" />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.slide-card {
    display: flex;
    flex-direction: column;
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

    &__header {
        display: flex;
        flex-direction: column;
        text-align: center;
    }

    &__title-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 1rem;
        padding: 0.5rem 0;
        font-size: 1.25rem;
    }

    &__close {
        margin: 0;
        justify-self: flex-end;
    }

    &__separator {
        width: 100%;
        height: 1px;
        background-color: var(--inv-secondary-text);
    }

    &__content {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }
}
</style>
