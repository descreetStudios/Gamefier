<template>
	<div class="card">
		<div class="title-section-wrapper">
			<div class="title-wrapper">
				<slot name="title" />
			</div>
			<div class="separator" />
		</div>

		<div class="content-section-wrapper">
			<div class="content-wrapper">
				<slot name="content" />
			</div>
		</div>
	</div>
</template>

<script setup>

</script>

<style lang="scss">
.card {
    display: flex;
    flex-direction: column;

    background-color: var(--surface);
    border-radius: 8px;
    box-shadow: 0 2px 4px var(--shadow);
    border: 1px solid var(--border);

    width: 300px;
    min-height: 180px;
    height: auto;
    overflow: visible;

    transition: transform 0.25s ease, box-shadow 0.25s ease;

    &:hover {
        transform: scale(1.03) translateY(-2px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
    }

    .title-section-wrapper {
        display: flex;
        flex-direction: column;
        text-align: center;

        .title-wrapper {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
            margin: 0;
            font-size: 1.25rem;
        }

        .separator {
            background-color: var(--inv-secondary-text);
            width: 100%;
            height: 1px;
        }
    }

    .content-section-wrapper {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        padding: 0.5rem;
        overflow-y: auto;

        .content-wrapper {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            width: 100%;
            box-sizing: border-box;

            .content-content {
                display: flex;
                flex-direction: column; // ensure vertical stacking
                gap: 0.25rem; // spacing between elements

                h5 {
                    margin: 0;
                    font-size: 0.875rem;
                    white-space: nowrap;
                }

                input {
                    flex: 1;
                    min-width: 0;
                }

                // New: correct checkbox block
                .answer-correct {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    margin-top: 0.25rem;
                }
            }

        }
    }
}

h4 {
    margin: 0;
}
</style>
