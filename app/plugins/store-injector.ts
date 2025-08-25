import { defineNuxtPlugin } from "nuxt/app";
import { useUserStore } from "@/../stores/userStore";
import { useSiteSettingsStore } from "@/../stores/siteSettingsStore";

export default defineNuxtPlugin((nuxtApp) => {
	const userStore = useUserStore();
	const siteSettingsStore = useSiteSettingsStore();

	nuxtApp.provide("userStore", userStore);
	nuxtApp.provide("siteSettingsStore", siteSettingsStore);
});
