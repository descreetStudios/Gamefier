<template>
	<div class="admin">
		<app-dashboard-admin-site-administration
			:is-maintenance-mode-enabled="isMaintenanceModeEnabled"
			@toggle-maintenance="updateMaintenanceMode"
		/>
		<app-dashboard-admin-user-moderation
			:user-search-name="userSearchName"
			:users="users"
			:has-more-users="hasMoreUsers"
			:is-loading-more="isLoadingMore"
			@search="searchUsersByDisplayNameStartsWith"
			@update-profile="updateProfile"
		/>
	</div>
</template>

<script setup>
import {
	collection,
	query,
	where,
	doc,
	getDocs,
	getDoc,
	setDoc,
	updateDoc,
	deleteField,
	limit,
	startAfter,
} from "firebase/firestore";
import { ref, onMounted } from "vue";
import { httpsCallable } from "firebase/functions";

const { $db } = useNuxtApp();
const { $functions } = useNuxtApp();
const { $eventBus } = useNuxtApp();
const { $userStore } = useNuxtApp();

const userSearchName = ref("");
const pageSize = 10;
const lastVisibleDoc = ref(null);
const hasMoreUsers = ref(false);
const isLoadingMore = ref(false);
const users = ref([]);
const oldUsers = ref([]);
const called = ref(false);
const isMaintenanceModeEnabled = ref(null);

onMounted(async () => {
	getMaintenanceModeStatus();
});

// Search users whose displayName starts with the input
const searchUsersByDisplayNameStartsWith = async (isNewSearch = true, userSearchName) => {
	isLoadingMore.value = true;

	if (isNewSearch) {
		users.value = [];
		oldUsers.value = [];
		lastVisibleDoc.value = null;
		hasMoreUsers.value = false;
	}

	const usersRef = collection($db, "users");
	const lowerCaseSearchQuery = userSearchName.toLowerCase();

	if (!lowerCaseSearchQuery) {
		isLoadingMore.value = false;
		if (isNewSearch) {
			$eventBus.emit("alert", {
				message: "Please enter a name to search.",
				type: "error",
				duration: 3000,
			});
		}
		return;
	}

	const endText = lowerCaseSearchQuery + "\uf8ff";

	let q = query(
		usersRef,
		where("displayNameLowerCase", ">=", lowerCaseSearchQuery),
		where("displayNameLowerCase", "<=", endText),
		limit(pageSize),
	);

	if (!isNewSearch && lastVisibleDoc.value) {
		q = query(q, startAfter(lastVisibleDoc.value));
	}

	try {
		const querySnapshot = await getDocs(q);
		const newUsers = [];

		querySnapshot.forEach((docSnap) => {
			const data = docSnap.data();

			if (data.role !== "banned" && !data.banType) {
				data.banType = "";
			}
			if (data.banExpiresAt) {
				const date = data.banExpiresAt.toDate
					? data.banExpiresAt.toDate()
					: new Date(data.banExpiresAt);
				data.banExpiresAt = date.toISOString().split("T")[0];
			}

			newUsers.push({ id: docSnap.id, ...data });
		});

		if (isNewSearch && newUsers.length === 0) {
			$eventBus.emit("alert", {
				message: "No users found.",
				type: "info",
				duration: 3000,
			});
		}

		users.value = [...users.value, ...newUsers];
		oldUsers.value = users.value.map(user => ({ ...user }));

		if (querySnapshot.docs.length < pageSize) {
			hasMoreUsers.value = false;
		}
		else {
			lastVisibleDoc.value = querySnapshot.docs[querySnapshot.docs.length - 1];
			hasMoreUsers.value = true;
		}
	}
	catch (err) {
		$eventBus.emit("alert", {
			message: `Failed to fetch users: ${err.message || "Unknown error"}`,
			type: "error",
			duration: 3000,
		});
	}
	finally {
		isLoadingMore.value = false;
	}
};

// Update user profile (both Firestore and Auth)
const updateProfile = async (user) => {
	const oldUser = oldUsers.value.find(u => u.id === user.id);
	const updateUserAuth = httpsCallable($functions, "updateUserAuth");

	if (!oldUser) {
		console.warn("User not found in backup for update.");
		return;
	}

	const userDocRef = doc($db, "users", user.id);
	const updatedStoreFields = {};
	const updatedAuthFields = {};

	if (user.displayName !== oldUser.displayName) {
		const available = await isUsernameAvailable(user.displayName);
		if (!available) {
			$eventBus.emit("alert", {
				message: "This username is already taken. Please choose another one.",
				type: "error",
				duration: 3000,
			});
			return;
		}
		else {
			updatedStoreFields.displayName = user.displayName;
			updatedAuthFields.displayName = user.displayName;
			updatedStoreFields.displayNameLowerCase = user.displayName.toLowerCase();
		}
	}
	if (user.email !== oldUser.email) {
		updatedStoreFields.email = user.email;
		updatedAuthFields.email = user.email;
	}
	if (user.role !== oldUser.role) {
		updatedStoreFields.role = user.role;
	}
	if (user.password) {
		updatedAuthFields.password = user.password;
	}
	if (user.role !== "banned" && (oldUser.banReason || oldUser.banType || oldUser.banExpiresAt || oldUser.bannedBy || oldUser.banAppealText || oldUser.banAppealPending)) {
		updatedStoreFields.banReason = deleteField();
		updatedStoreFields.banType = deleteField();
		updatedStoreFields.banExpiresAt = deleteField();
		updatedStoreFields.bannedBy = deleteField();
		updatedStoreFields.banAppealText = deleteField();
		updatedStoreFields.banAppealPending = deleteField();
	}
	else if (user.role === "banned") {
		if (user.banReason !== oldUser.banReason) {
			updatedStoreFields.banReason = user.banReason;
		}
		if (user.banType !== oldUser.banType) {
			updatedStoreFields.banType = user.banType;
			if (user.banType === "permanent") {
				updatedStoreFields.banExpiresAt = deleteField();
			}
		}
		if (user.banExpiresAt && (user.banExpiresAt !== oldUser.banExpiresAt)) {
			const date = new Date(user.banExpiresAt + "T00:00:00");
			if (date <= new Date()) {
				$eventBus.emit("alert", {
					message: "Invalid expiration date. Please select a future date for the temporary ban.",
					type: "error",
					duration: 3000,
				});
				return;
			}
			else {
				updatedStoreFields.banExpiresAt = date;
			}
		}
		if (!user.bannedBy || user.bannedBy != $userStore.displayName) {
			updatedStoreFields.bannedBy = $userStore.displayName;
		}
	}

	if (!Object.keys(updatedStoreFields).length > 0 && !Object.keys(updatedAuthFields).length > 0) {
		$eventBus.emit("alert", {
			message: "No changes were made. Please update at least one field before submitting.",
			type: "error",
			duration: 3000,
		});
	}
	else {
		try {
			if (Object.keys(updatedAuthFields).length > 0) {
				const _result = await updateUserAuth({
					uid: user.id,
					fieldsToUpdate: {
						displayName: updatedAuthFields.displayName,
						email: updatedAuthFields.email,
						password: updatedAuthFields.password,
					},
				});
				// console.log("Response:", result.data);
			}
			await updateDoc(userDocRef, updatedStoreFields);
			$eventBus.emit("alert", {
				message: `Profile for ${user.displayName} updated successfully.`,
				type: "success",
				duration: 3000,
			});
			called.value = true;
			searchUsersByDisplayNameStartsWith(true, user.displayName);
		}
		catch (err) {
			$eventBus.emit("alert", {
				message: `Failed to update the profile for ${user.displayName}. ${err?.message || "Please try again."}`,
				type: "error",
				duration: 3000,
			});
		}
	}
};

const isUsernameAvailable = async (displayName) => {
	const checkUsernameAvailability = httpsCallable($functions, "checkUsernameAvailability"); ;
	try {
		const result = await checkUsernameAvailability({
			displayName,
		});
		return result.data.available;
	}
	catch (err) {
		$eventBus.emit("alert", {
			message: `Error while checking username availability: ${err}`,
			type: "error",
			duration: 3000,
		});
		return false;
	}
};

const updateMaintenanceMode = async (event) => {
	const docRef = doc($db, "site_settings", "general");

	if (event === "on") {
		try {
			await setDoc(docRef, { maintenanceMode: true }, { merge: true });
			isMaintenanceModeEnabled.value = true;
			$eventBus.emit("alert", {
				message: "Maintenance mode has been enabled.",
				type: "success",
				duration: 3000,
			});
		}
		catch (err) {
			$eventBus.emit("alert", {
				message: `Error while enabling maintenance mode: ${err}`,
				type: "error",
				duration: 3000,
			});
		}
	}
	else if (event === "off") {
		try {
			await setDoc(docRef, { maintenanceMode: false }, { merge: true });
			isMaintenanceModeEnabled.value = false;
			$eventBus.emit("alert", {
				message: "Maintenance mode has been disabled.",
				type: "success",
				duration: 3000,
			});
		}
		catch (err) {
			$eventBus.emit("alert", {
				message: `Error while disabling maintenance mode: ${err}`,
				type: "error",
				duration: 3000,
			});
		}
	}
	else {
		$eventBus.emit("alert", {
			message: `Unexpected maintenance mode value: ${event}`,
			type: "error",
			duration: 3000,
		});
	}
};
const getMaintenanceModeStatus = async () => {
	const docRef = doc($db, "site_settings", "general");
	const siteSettings = await getDoc(docRef);
	isMaintenanceModeEnabled.value = siteSettings.data()?.maintenanceMode;
}
	;
</script>

<style lang="scss" scoped>
</style>
