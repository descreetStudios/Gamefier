import type { useStore } from "~/stores/userStore";

export default defineNuxtRouteMiddleware(async (to) => {
	const { $userStore } = useNuxtApp();
	const userStore = $userStore as ReturnType<typeof useStore>;

	const excludedPaths = ["/", "/signup", "/login"];

	console.log("🔍 Stato utente(ID):", userStore.userId);
	console.log("Role: ", userStore.role);

	if (userStore.startup && "/".includes(to.path)) {
		userStore.storeUserData("startup", false);
	}

	if (userStore.startup && !"/".includes(to.path)) {
		console.log("Prima dell'update", userStore.startup);
		userStore.storeUserData("startup", false);
		console.log("Dopo l'update", userStore.startup);

		return navigateTo("/");
	}

	if (!userStore.userId && !excludedPaths.includes(to.path)) {
		return navigateTo("/login");
	}

	if (userStore.userId && ["/login", "/signup"].includes(to.path)) {
		return navigateTo("/");
	}

	if (userStore.role !== "admin" && ["/admin"].includes(to.path)) {
		return navigateTo("/");
	}
});
