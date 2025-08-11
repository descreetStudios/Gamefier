<template>
	<div class="slide-card">
		<div class="slide-title-section-wrapper">
			<div class="slide-title-wrapper">
				<slot name="slide-title" />
				<h4 class="x">
					X
				</h4>
			</div>
			<div class="separator" />
		</div>

		<div class="slide-content-wrapper">
			<slot name="slide-content" />
		</div>
	</div>
</template>

<style lang="scss">
.slide-card {
    display: flex;
    flex-direction: column;

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

    .slide-title-section-wrapper {
        display: flex;
        flex-direction: column;
        text-align: center;

        .slide-title-wrapper {
            display: flex;
            justify-content: space-between;
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
            margin: 0;
            margin-right: 1rem;
            margin-left: 1rem;
            font-size: 1.25rem;

            .slide-title {
                justify-self: center;
            }

            .x {
                justify-self: flex-end;
            }
        }

        .separator {
            background-color: var(--inv-secondary-text);
            width: 100%;
            height: 1px;
        }
    }

    .slide-content-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }
}

h4 {
    margin: 0;
}
</style>
