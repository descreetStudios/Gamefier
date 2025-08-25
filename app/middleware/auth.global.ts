import type { useUserStore } from "../../stores/userStore";
import type { useSiteSettingsStore } from "@/../stores/siteSettingsStore";
import { useNuxtApp, defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware(async (to) => {
	const { $userStore } = useNuxtApp();
	const { $siteSettingsStore } = useNuxtApp();
	const userStore = $userStore as ReturnType<typeof useUserStore>;
	const siteSettingsStore = $siteSettingsStore as ReturnType<typeof useSiteSettingsStore>;

	const excludedPaths = ["/", "/signup", "/login", "/loading"];

	// console.log("User state(ID):", userStore.userId);
	// console.log("Role: ", userStore.role);

	if ((userStore.startup || !siteSettingsStore.loaded) && (!"/loading".includes(to.path) || "/".includes(to.path))) {
		return navigateTo({ path: "/loading", query: { ...to.query, pathTo: to.path } });
	}

	if (siteSettingsStore.maintenanceMode === true && userStore.role !== "admin" && to.path !== "/maintenance") {
		return navigateTo("/maintenance");
	}

	if (siteSettingsStore.maintenanceMode === false && ["/maintenance"].includes(to.path)) {
		return navigateTo("/");
	}

	if (!userStore.userId && !excludedPaths.includes(to.path)) {
		return navigateTo("/login");
	}

	if (userStore.role !== "banned" && ["/banned"].includes(to.path)) {
		return navigateTo("/");
	}

	if (userStore.role === "banned" && to.path !== "/banned") {
		return navigateTo("/banned");
	}

	if (userStore.userId && ["/login", "/signup"].includes(to.path)) {
		return navigateTo("/");
	}

	if (userStore.role !== "admin" && ["/admin"].includes(to.path)) {
		return navigateTo("/");
	}
});
