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
    overflow-y: auto;
    min-height: 100vh;
    margin-bottom: 0px;
    left: 15vw;
    max-width: 84vw;
}
</style>
