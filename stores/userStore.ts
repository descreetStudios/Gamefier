import { defineStore } from "pinia";

type DataTypes = "startup" | "loaded";

export const useUserStore = defineStore("userStore", {
	state: () => ({
		startup: true as unknown | boolean,
		loaded: false as unknown | boolean,
		userId: null as unknown | string,
		displayName: null as unknown | string,
		role: null as unknown | string,
		banReason: null as unknown | string,
		banType: null as unknown | string,
		banExpiresAt: null as unknown | string,
		bannedBy: null as unknown | string,
		banAppealText: null as unknown | string,
		banAppealPending: null as unknown | boolean,
		banAppealAlreadySent: null as unknown | boolean,
	}),
	actions: {
		async syncUserData(userData: {
			uid?: string;
			role?: string;
			displayName?: string;
			banReason?: string;
			banType?: string;
			banExpiresAt?: string;
			bannedBy?: string;
			banAppealText?: string;
			banAppealPending?: boolean;
		}) {
			this.userId = userData.uid ?? null;
			this.role = userData.role ?? null;
			this.displayName = userData.displayName ?? null;
			this.banReason = userData.banReason ?? null;
			this.banType = userData.banType ?? null;
			this.banExpiresAt = userData.banExpiresAt ?? null;
			this.bannedBy = userData.bannedBy ?? null;
			this.banAppealText = userData.banAppealText ?? null;
			this.banAppealPending = userData.banAppealPending ?? null;
			if (userData.banAppealText) {
				this.banAppealAlreadySent = true;
			}
		},
		storeUserData(type: DataTypes, value: unknown) {
			switch (type) {
				case "startup":
					this.startup = value;
					break;
				case "loaded":
					this.loaded = value;
					break;
			}
		},
	},
});
