<template>
	<div class="admin">
		<h1 class="admin__title">
			Admin Page
		</h1>
		<h2>Site Administration</h2>
		<fieldset>
			<legend>
				Maintenance mode:
				<span v-if="isMaintenanceModeEnabled">Enabled</span>
				<span v-else>Disabled</span>
			</legend>
			<form @submit.prevent="updateMaintenanceMode(isMaintenanceModeEnabled ? 'off' : 'on')">
				<input
					type="submit"
					:value="isMaintenanceModeEnabled ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'"
				>
			</form>
		</fieldset>
		<h2>User Moderation</h2>
		<fieldset class="admin__search">
			<legend>Search users by name</legend>
			<form
				class="admin__searchForm"
				@submit.prevent="searchUsersByDisplayNameStartsWith"
			>
				<input
					v-model="userSearchName"
					class="admin__searchForm_name"
					type="text"
					maxlength="30"
				>
				<input
					class="admin__searchForm_button"
					type="submit"
					value="Search"
				>
			</form>
		</fieldset>

		<fieldset
			v-for="user in users"
			:key="user.id"
			class="admin__userCard"
		>
			<legend>{{ user.displayName }} - #{{ user.id }}</legend>

			<div class="userPreview">
				<div class="userPreview__avatar">
					<img
						class="userPreview__avatar__img"
						:src="userIcon"
						alt="user icon"
						@dragstart.prevent
					>
					<div class="userPreview__avatar__overlay" />
					<img
						class="userPreview__avatar__edit"
						:src="editIcon"
						alt="edit icon overlay"
						@dragstart.prevent
					>
				</div>
			</div>

			<form
				class="userForm"
				@submit.prevent="updateProfile(user)"
			>
				<input
					v-model="user.displayName"
					type="text"
				>
				<input
					v-model="user.email"
					type="email"
				>

				<select
					v-model="user.role"
					name="role"
				>
					<option value="user">
						User
					</option>
					<option value="banned">
						Banned
					</option>
					<option value="admin">
						Administrator
					</option>
				</select>

				<input
					v-if="user.role === 'banned'"
					v-model="user.banReason"
					type="text"
					placeholder="Ban reason"
					required
				>

				<select
					v-if="user.role === 'banned'"
					v-model="user.banType"
					name="banType"
					required
				>
					<option
						value=""
						disabled
						hidden
					>
						Select an option
					</option>

					<option value="temporary">
						Temporary
					</option>
					<option value="permanent">
						Permanent
					</option>
				</select>

				<input
					v-if="user.role === 'banned' && user.banType === 'temporary'"
					v-model="user.banExpiresAt"
					type="date"
					required
				>

				<input
					v-model="user.password"
					type="password"
					placeholder="New password"
					minlength="8"
				>

				<input
					type="submit"
					value="Update Profile"
				>
			</form>
		</fieldset>
	</div>
</template>

<script setup>
import { collection, query, where, doc, getDocs, getDoc, setDoc, updateDoc, deleteField } from "firebase/firestore";
import { ref, onMounted } from "vue";
import { httpsCallable } from "firebase/functions";

const { $db } = useNuxtApp();
const { $functions } = useNuxtApp();
const { $eventBus } = useNuxtApp();
const { $userStore } = useNuxtApp();

const userSearchName = ref("");
const users = ref([]);
const oldUsers = ref([]);
const called = ref(false);
const isMaintenanceModeEnabled = ref(null);

const userIcon = ref("/images/icons/user.png");
const editIcon = ref("/images/icons/edit.png");

onMounted(async () => {
	getMaintenanceModeStatus();
});

// Search users whose displayName starts with the input
const searchUsersByDisplayNameStartsWith = async () => {
	const usersRef = collection($db, "users");
	const lowerCaseSearchQuery = userSearchName.value.toLowerCase();
	if (!lowerCaseSearchQuery) {
		users.value = [];
		oldUsers.value = [];
		$eventBus.emit("alert", {
			message: "Please enter a name to search.",
			type: "error",
			duration: 3000,
		});
		return;
	}

	const endText = lowerCaseSearchQuery + "\uf8ff";

	const q = query(usersRef,
		where("displayNameLowerCase", ">=", lowerCaseSearchQuery),
		where("displayNameLowerCase", "<=", endText),
	);

	try {
		const querySnapshot = await getDocs(q);
		users.value = [];
		oldUsers.value = [];
		querySnapshot.forEach((doc) => {
			const data = doc.data();
			if (data.role !== "banned" && !data.banType) {
				data.banType = "";
			}
			if (data.banExpiresAt) {
				const date = data.banExpiresAt.toDate ? data.banExpiresAt.toDate() : new Date(data.banExpiresAt);
				data.banExpiresAt = date.toISOString().split("T")[0];
			}
			users.value.push({ id: doc.id, ...data });
			oldUsers.value = users.value.map(user => ({ ...user }));
		});
		if (!called.value) {
			const count = users.value.length;
			const message = `Found ${count} user${count !== 1 ? "s" : ""} matching your search.`;
			$eventBus.emit("alert", {
				message: message,
				type: "success",
				duration: 3000,
			});
		}
		// console.log(users.value);
	}
	catch (err) {
		$eventBus.emit("alert", {
			message: `Failed to search for users. ${err?.message || "Please try again later."}`,
			type: "error",
			duration: 3000,
		});
	}
	called.value = false;
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
			searchUsersByDisplayNameStartsWith();
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
.admin {
	&__title {
		font-size: 2.5rem;
		font-weight: bold;
		margin-bottom: 2rem;
	}

	&__search {
		margin-bottom: 2rem;
		padding: 1rem;
		border: 2px solid var(--inv-secondary-text);
		border-radius: var(--border-radius);

		legend {
			padding: 0 1rem;
			font-weight: bold;
		}

		&Form {
			position: relative;
			display: flex;
			gap: 1rem;

			&_button {
				background-color: var(--primary);
				position: absolute;
				right: 0;
				width: 15%;

				&:hover {
					background-color: var(--primary-hover);
				}
			}

			&_name {
				flex: 1;
			}
		}
	}

	&__userCard {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
		padding: 1.5rem;
		margin-bottom: 2rem;
		border: 2px solid var(--inv-secondary-text);
		border-radius: var(--border-radius);

		legend {
			padding: 0 1rem;
			font-weight: bold;
		}
	}
}

.userPreview {
	display: flex;
	align-items: center;

	&__avatar {
		position: relative;
		width: 15rem;
		height: 15rem;
		border-radius: 50%;

		&__img,
		&__overlay,
		&__edit {
			position: absolute;
			width: 100%;
			height: 100%;
			border-radius: 50%;
			border: 1px solid var(--inv-bg);
		}

		&__overlay {
			background-color: black;
			opacity: 0;
			transition: opacity 0.3s ease;
			z-index: 1;
			border-radius: 50%;

			&:hover {
				opacity: 0.4;
				cursor: pointer;
			}
		}

		&__edit {
			opacity: 0;
			padding: 6rem;
			transition: opacity 0.3s ease;
		}

		&:hover &__edit {
			opacity: 1;
		}
	}
}

.userForm {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 1rem;

	input,
	select {
		padding: 0.5rem;
		font-size: 1rem;
		border-radius: var(--border-radius);
		border: 1px solid var(--inv-secondary-text);
		margin-bottom: 0;
	}
}
</style>
