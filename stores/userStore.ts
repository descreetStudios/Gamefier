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
			switch (type) {
				case "userId":
					this.userId = value;
					break;
				case "role":
					this.role = value;
					break;
				case "displayName":
					this.displayName = value;
					break;
				case "startup":
					this.startup = value;
					break;
			}
		},
	},
});
