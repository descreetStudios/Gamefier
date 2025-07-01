import { defineStore } from "pinia";

type DataTypes = "startup" | "loaded" | "path" | "userId" | "role" | "displayName";

export const useStore = defineStore("userStore", {
	state: () => ({
		startup: true as unknown | boolean,
		loaded: false as unknown | boolean,
		path: null as unknown | string,
		userId: null as unknown | string,
		role: null as unknown | string,
		displayName: null as unknown | string,
	}),
	actions: {
		storeUserData(type: DataTypes, value: unknown) {
			switch (type) {
				case "startup":
					this.startup = value;
					break;
				case "loaded":
					this.loaded = value;
					break;
				case "path":
					this.path = value;
					break;
				case "userId":
					this.userId = value;
					break;
				case "role":
					this.role = value;
					break;
				case "displayName":
					this.displayName = value;
					break;
			}
		},
	},
});
