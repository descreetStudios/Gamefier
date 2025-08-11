import { useStore } from "../../stores/userStore";

export default defineNuxtPlugin((nuxtApp) => {
	const userStore = useStore();

	nuxtApp.provide("userStore", userStore);
});
