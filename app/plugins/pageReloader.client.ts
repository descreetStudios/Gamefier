import { defineNuxtPlugin, useNuxtApp } from "#app";
import { computed, watch } from "vue";
import type { useUserStore } from "@/../stores/userStore";
import type { useSiteSettingsStore } from "@/../stores/siteSettingsStore";

export default defineNuxtPlugin(() => {
	const { $userStore } = useNuxtApp();
	const { $siteSettingsStore } = useNuxtApp();
	const userStore = $userStore as ReturnType<typeof useUserStore>;
	const siteSettingsStore = $siteSettingsStore as ReturnType<typeof useSiteSettingsStore>;

	const role = computed(() => userStore.role);
	const maintenanceMode = computed(() => siteSettingsStore.maintenanceMode);

	watch([role, maintenanceMode], ([newRole, newMaintenance], [oldRole, oldMaintenance]) => {
		if (!userStore.loaded || !siteSettingsStore.loaded) {
			return;
		}
		else {
			if (newRole !== oldRole && oldRole === null) {
				return;
			}
			if (newRole !== oldRole || ((newMaintenance !== oldMaintenance) && newRole !== "admin")) {
				window.location.reload();
			}
		}
	});
});
