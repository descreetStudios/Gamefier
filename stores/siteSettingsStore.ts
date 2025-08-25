import { defineStore } from "pinia";

export const useSiteSettingsStore = defineStore("siteSettingsStore", {
	state: () => ({
		startup: true as unknown | boolean,
		loaded: false as unknown | boolean,
		maintenanceMode: null as unknown | boolean,
	}),
	actions: {
		async syncSiteSettings(siteSettings: {
			maintenanceMode?: boolean;
		}) {
			if (siteSettings.maintenanceMode !== null) {
				this.maintenanceMode = siteSettings.maintenanceMode ?? null;
				this.loaded = true;
			}
		},
	},
});
