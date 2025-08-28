import { defineNuxtPlugin, useNuxtApp } from "#app";
import { computed, watch } from "vue";
import type { Auth } from "firebase/auth";
import type { useUserStore } from "@/../stores/userStore";
import type { useSiteSettingsStore } from "@/../stores/siteSettingsStore";

export default defineNuxtPlugin(() => {
	const { $userStore, $auth } = useNuxtApp();
	const { $siteSettingsStore } = useNuxtApp();
	const userStore = $userStore as ReturnType<typeof useUserStore>;
	const siteSettingsStore = $siteSettingsStore as ReturnType<typeof useSiteSettingsStore>;
	const auth = $auth as Auth;

	const role = computed(() => userStore.role);
	const maintenanceMode = computed(() => siteSettingsStore.maintenanceMode);

	// Watch for changes in user role or maintenance mode
	watch([role, maintenanceMode], async ([newRole, newMaintenance], [oldRole, oldMaintenance]) => {
		if (!userStore.loaded || !siteSettingsStore.loaded) {
			return;
		}

		if (newRole !== oldRole && oldRole === null) {
			return;
		}

		if (newRole !== oldRole) {
			try {
				await auth.currentUser?.getIdToken(true);
				window.location.reload();
			}
			catch (error) {
				console.error("Error refreshing Firebase ID token:", error);
			}
		}

		if ((newMaintenance !== oldMaintenance) && newRole !== "admin") {
			window.location.reload();
		}
	});
});
