<template>
	<section class="content-wrapper">
		<slot />
	</section>
</template>

<style scoped lang="scss">
.content-wrapper {
    position: relative;
    flex: 1;
    padding: 2rem;
    background: var(--bg);
    margin-bottom: 0px;
    overflow-y: auto;
    min-height: 100vh;
    margin-left: 15vw;
    max-width: calc(100vw - 15vw);
}
</style>
