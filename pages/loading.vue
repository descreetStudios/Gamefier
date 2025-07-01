<script setup>
import { onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";

const { $userStore } = useNuxtApp();

const loaded = computed(() => $userStore.loaded);

const route = useRoute();
const targetPath = route.query.pathTo;

onMounted(() => {
	document.body.style.overflow = "hidden";
	setTimeout(() => {
		const intervalId = setInterval(() => {
			if (loaded.value === true) {
				if (targetPath && typeof targetPath === "string" && targetPath !== "/loading") {
					navigateTo(targetPath);
				}
				else {
					navigateTo("/");
				}
				$userStore.storeUserData("startup", false);
				clearInterval(intervalId);
			}
		}, 1000);
	}, 1000);
});

onUnmounted(() => {
	document.body.style.overflow = "";
});
</script>

<template>
	<div class="loader-overlay">
		<div class="loader" />
	</div>
</template>

<style lang="scss" scoped>
.loader-overlay {
    position: fixed;
    inset: 0;
    background: var(--bg);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.loader {
    width: 60px;
    height: 25px;
    border: 2px solid;
    box-sizing: border-box;
    border-radius: 50%;
    display: grid;
    animation: l2 2s infinite linear;
}

.loader:before,
.loader:after {
    content: "";
    grid-area: 1/1;
    border: inherit;
    border-radius: 50%;
    animation: inherit;
    animation-duration: 3s;
}

.loader:after {
    --s: -1;
}

@keyframes l2 {
    100% {
        transform: rotate(calc(var(--s, 1)*1turn))
    }
}
</style>
