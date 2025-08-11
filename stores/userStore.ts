import { defineStore } from "pinia";
import { doc, getDoc } from "firebase/firestore";

type DataTypes = "startup" | "loaded";

export const useStore = defineStore("userStore", {
	state: () => ({
		startup: true as unknown | boolean,
		loaded: false as unknown | boolean,
		userId: null as unknown | string,
		displayName: null as unknown | string,
		role: null as unknown | string,
		banReason: null as unknown | string,
		banExpiresAt: null as unknown | string,
		bannedBy: null as unknown | string,
		banAppealText: null as unknown | string,
		banAppealAlreadySent: null as unknown | false,
	}),
	actions: {
		async syncUserData(uid: string) {
			const { $db } = useNuxtApp();
			if (!uid) return;
			const userRef = doc($db, "users", uid);
			const userSnapshot = await getDoc(userRef);
			if (userSnapshot.exists()) {
				const userData = userSnapshot.data();

				this.userId = uid;
				this.role = userData.role || null;
				this.displayName = userData.displayName || null;
				this.banReason = userData.banReason || null;
				this.banExpiresAt = userData.banExpiresAt || null;
				this.bannedBy = userData.bannedBy || null;
				this.banAppealText = userData.banAppealText || null;
				if (userData.banAppealText) {
					this.banAppealAlreadySent = true;
				}
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
