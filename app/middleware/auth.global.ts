import type { useStore } from "../../stores/userStore";

export default defineNuxtRouteMiddleware(async (to) => {
	const { $userStore } = useNuxtApp();
	const userStore = $userStore as ReturnType<typeof useStore>;

	const excludedPaths = ["/", "/signup", "/login", "/loading"];

	// console.log("User state(ID):", userStore.userId);
	// console.log("Role: ", userStore.role);

	if (userStore.startup && (!"/loading".includes(to.path) || "/".includes(to.path))) {
		return navigateTo({ path: "/loading", query: { ...to.query, pathTo: to.path } });
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
