<template>
	<div>
		<AppGlobalAlert />

		<h1>Admin Page</h1>

		<fieldset>
			<legend>Search users by name</legend>
			<form @submit.prevent="searchUsersByDisplayNameStartsWith">
				<input
					v-model="userSearchName"
					type="text"
				>
				<input
					type="submit"
					value="Search"
				>
			</form>
		</fieldset>
		<fieldset
			v-for="user in users"
			:key="user.id"
		>
			<legend>{{ user.displayName }} - #{{ user.id }}</legend>
			<div class="profile">
				<div class="profile__iconContainer">
					<img
						class="profile__iconContainer__icon"
						:src="userIcon"
						alt="user icon"
						@dragstart.prevent
					>
					<div class="profile__iconContainer__editOverlay" />
					<img
						class="profile__iconContainer__editIcon"
						:src="editIcon"
						alt="edit icon overlay"
						@dragstart.prevent
					>
				</div>
			</div>
			<form
				class="settings"
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
				>
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
import { collection, query, where, getDocs, doc, updateDoc, deleteField, Timestamp } from "firebase/firestore";
import { ref } from "vue";
import { httpsCallable } from "firebase/functions";

const { $db } = useNuxtApp();
const { $functions } = useNuxtApp();
const { $eventBus } = useNuxtApp();
const { $userStore } = useNuxtApp();

const userSearchName = ref("");
const users = ref([]);
const oldUsers = ref([]);
const called = ref(false);

const userIcon = ref("/images/icons/user.png");
const editIcon = ref("/images/icons/edit.png");
// Search users whose displayName starts with the input
async function searchUsersByDisplayNameStartsWith() {
	const usersRef = collection($db, "users");
	const lowerCaseSearchQuery = userSearchName.value.toLowerCase();
	if (!lowerCaseSearchQuery) {
		users.value = [];
		oldUsers.value = [];
		$eventBus.emit("alert", {
			message: "Please enter a valid name",
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
			if (!data.banType) {
				data.banType = "temporary";
			}
			if (data.banExpiresAt) {
				const date = data.banExpiresAt.toDate ? data.banExpiresAt.toDate() : new Date(data.banExpiresAt);
				data.banExpiresAt = date.toISOString().split("T")[0];
			}
			users.value.push({ id: doc.id, ...data });
			oldUsers.value = users.value.map(user => ({ ...user }));
		});
		const count = users.value.length;
		const message = `Found ${count} user${count !== 1 ? "s" : ""}.`;
		if (!called.value) {
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
			message: err.message || "An error occurred while searching for users.",
			type: "error",
			duration: 3000,
		});
	}
	called.value = false;
}

// Update user profile (both Firestore and Auth)
async function updateProfile(user) {
	const oldUser = oldUsers.value.find(u => u.id === user.id);
	const callable = httpsCallable($functions, "updateUserAuth");

	if (!oldUser) {
		console.warn("User not found in backup for update.");
		return;
	}

	const userDocRef = doc($db, "users", user.id);
	const updatedStoreFields = {};
	const updatedAuthFields = {};

	if (user.displayName !== oldUser.displayName) {
		updatedStoreFields.displayName = user.displayName;
		updatedAuthFields.displayName = user.displayName;
		updatedStoreFields.displayNameLowerCase = user.displayName.toLowerCase();
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
	if (user.role !== "banned" && (user.banReason || user.banType || user.banExpiresAt || user.bannedBy)) {
		updatedStoreFields.banReason = deleteField();
		updatedStoreFields.banType = deleteField();
		updatedStoreFields.banExpiresAt = deleteField();
		updatedStoreFields.bannedBy = deleteField();
	}
	else {
		if (user.banReason !== oldUser.banReason) {
			updatedStoreFields.banReason = user.banReason;
		}
		if (user.banType !== oldUser.banType) {
			updatedStoreFields.banType = user.banType;
		}
		if (user.banExpiresAt && (user.banExpiresAt !== oldUser.banExpiresAt)) {
			const date = new Date(user.banExpiresAt + "T00:00:00");
			Timestamp.fromDate(date);
			if (date <= new Date()) {
				$eventBus.emit("alert", {
					message: "Please enter a valid date.",
					type: "error",
					duration: 3000,
				});
				return;
			}
			else {
				updatedStoreFields.banExpiresAt = date;
			}
		}
		else {
			updatedStoreFields.banExpiresAt = deleteField();
		}
		if (!user.bannedBy || (user.bannedBy !== oldUser.bannedBy)) {
			updatedStoreFields.bannedBy = $userStore.displayName;
		}
	}

	if (!Object.keys(updatedStoreFields).length > 0 && !Object.keys(updatedAuthFields).length > 0) {
		$eventBus.emit("alert", {
			message: "No changes detected for the user.",
			type: "error",
			duration: 3000,
		});
	}
	else {
		try {
			if (Object.keys(updatedAuthFields).length > 0) {
				const _result = await callable({
					uid: user.id,
					fieldsToUpdate: {
						displayName: updatedAuthFields.displayName,
						email: updatedAuthFields.email,
						password: updatedAuthFields.password,
					},
				});
				// console.log('Response:', result.data)
			}
			await updateDoc(userDocRef, updatedStoreFields);
			$eventBus.emit("alert", {
				message: "User profile updated successfully.",
				type: "success",
				duration: 3000,
			});
			called.value = true;
			searchUsersByDisplayNameStartsWith();
		}
		catch (err) {
			$eventBus.emit("alert", {
				message: err.message || "An error occurred while updating the user profile.",
				type: "error",
				duration: 3000,
			});
		}
	}
}
</script>

<style lang="scss" scoped>
fieldset {
	display: flex;
	padding-left: 0.75rem;
	padding-right: 0.75rem;
	border-radius: var(--border-radius);
	border: 0.1rem solid var(--inv-secondary-text);

	legend {
		margin-left: 1.25rem;
		padding-left: 1rem;
		padding-right: 1rem;
	}

	.settings {
		flex: 1;
	}

	.profile {
		align-items: center;
		margin-right: 2rem;
		margin-left: 1rem;
		margin-top: 2rem;

		&__iconContainer {
			position: relative;
			width: 15rem;
			height: 15rem;

			&__icon,
			&__editOverlay,
			&__editIcon {
				position: absolute;
				width: 100%;
				height: 100%;
				border-radius: 50%;
				border: 1px solid var(--inv-bg);
			}

			&__editOverlay {
				transition: opacity 0.3s ease;
				background-color: black;
				opacity: 0;
				z-index: 1;

				&:hover {
					opacity: 0.4;
					cursor: pointer;
				}
			}

			&__editIcon {
				opacity: 0;
				padding: 6rem;
				transition: opacity 0.3s ease;
			}

			&:hover .profile__iconContainer__editIcon {
				opacity: 1;
			}
		}
	}
}
</style>
