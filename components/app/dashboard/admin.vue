<template>
	<div>
		<AppGlobalAlert />

		<h1>Admin Page</h1>
		<p>Welcome to your admin page!</p>
		<form @submit.prevent="searchUsersByDisplayNameStartsWith">
			<input v-model="userSearchName" type="text">
			<input type="submit" value="Search">
		</form>
		<div v-for="user in users" :key="user.id">
			<form @submit.prevent="updateProfile(user)">
				<input v-model="user.displayName" type="text">
				<input v-model="user.id" type="text" disabled>
				<input v-model="user.email" type="email">
				<select v-model="user.role" name="role">
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
				<input v-if="user.role === 'banned'" v-model="user.banReason" type="text" placeholder="Ban reason"
					required>
				<select v-if="user.role === 'banned'" v-model="user.banType" name="banType">
					<option value="temporary">
						Temporary
					</option>
					<option value="permanent">
						Permanent
					</option>
				</select>
				<input v-if="user.role === 'banned' && user.banType === 'temporary'" v-model="user.banExpiresAt"
					type="date" required>
				<input v-model="user.password" type="password" placeholder="New password" minlength="8">
				<input type="submit" value="Update Profile">
			</form>
		</div>
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
				data.banExpiresAt = date.toISOString().split('T')[0];
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
			const date = new Date(user.banExpiresAt + 'T00:00:00');
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
