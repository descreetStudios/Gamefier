<template>
	<section class="content-wrapper">
		<slot />
	</section>
</template>

<style scoped lang="scss">
.content-wrapper {
    flex: 1;
    padding: 2rem;
    background: var(--bg);
    overflow-y: auto;
    min-height: 100vh;
}
</style>
