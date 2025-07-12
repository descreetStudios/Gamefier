<template>
	<article class="card">
		<div class="title">
			<article class="text">
				<slot name="title" />
			</article>
			<div class="separator" />
		</div>
		<slot name="content" />
	</article>
</template>

<script setup>

</script>

<style lang="scss">
.card {
    position: relative;
    width: 300px;
    height: 200px;
    background-color: var(--surface);
    border-radius: 8px;
    box-shadow: 0 4px 8px var(--shadow);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    .title {
        position: absolute;
        top: 0;
        width: 100%;
        height: 40px;
        z-index: 1;
        border-radius: 8px;

        .text {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: var(--surface);
            margin-bottom: auto;
            padding: 0.5rem;
        }

        .separator {
            background-color: var(--inv-secondary-text);
            width: 100%;
            height: 1px;
        }
    }
}

.card:hover {
    transform: scale(1.03);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

h4 {
    margin: 0;
}

article {
    box-shadow: none;
}
</style>
