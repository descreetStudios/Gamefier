import { defineStore } from "pinia";

type DataTypes = "userId" | "role" | "displayName" | "startup";

export const useStore = defineStore("userStore", {
	state: () => ({
		startup: true as unknown | boolean,
		userId: null as unknown | string,
		role: null as unknown | string,
		displayName: null as unknown | string,
	}),
	actions: {
		storeUserData(type: DataTypes, value: unknown) {
			if (type === "userId") {
				this.userId = value;
			}
			else if (type === "role") {
				this.role = value;
			}
			else if (type === "displayName") {
				this.displayName = value;
			}
			else if (type === "startup") {
				this.startup = value;
			}
		},
	},
});
