import type { useUserStore } from "@/../stores/userStore";
import type { useSiteSettingsStore } from "@/../stores/siteSettingsStore";
import { useNuxtApp, defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware(async (to, from) => {
	const { $userStore } = useNuxtApp();
	const { $siteSettingsStore } = useNuxtApp();
	const userStore = $userStore as ReturnType<typeof useUserStore>;
	const siteSettingsStore = $siteSettingsStore as ReturnType<typeof useSiteSettingsStore>;

	const nuxtApp = useNuxtApp();
	nuxtApp.payload.previousPath = from.fullPath;

	const excludedPaths = ["/", "/signup", "/login", "/loading", "/maintenance"];

	if ((userStore.startup || !siteSettingsStore.loaded) && (!"/loading".includes(to.path) || "/".includes(to.path))) {
		return navigateTo({ path: "/loading", query: { ...to.query, pathTo: to.path } });
	}

	if (siteSettingsStore.maintenanceMode && userStore.role !== "admin" && to.path !== "/maintenance") {
		return navigateTo("/maintenance");
	}

	if (!siteSettingsStore.maintenanceMode && ["/maintenance"].includes(to.path)) {
		return navigateTo("/");
	}

	if (!userStore.userId && !excludedPaths.includes(to.path)) {
		return navigateTo("/login");
	}

	if (userStore.role !== "banned" && ["/banned"].includes(to.path)) {
		return navigateTo("/");
	}

	if (userStore.role === "banned" && to.path !== "/banned" && siteSettingsStore.maintenanceMode === false) {
		return navigateTo("/banned");
	}

	if (userStore.userId && ["/login", "/signup"].includes(to.path)) {
		return navigateTo("/");
	}
});
