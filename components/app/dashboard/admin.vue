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
				<input v-model="user.password" type="password" minlength="8">
				<input type="submit" value="Update Profile">
			</form>
		</div>
	</div>
</template>

<script setup>
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { ref } from "vue";
import { httpsCallable } from "firebase/functions";

const { $db } = useNuxtApp();
const { $functions } = useNuxtApp();
const { $eventBus } = useNuxtApp();

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
			users.value.push({ id: doc.id, ...doc.data() });
			oldUsers.value = users.value.map(user => ({ ...user }));
		});
		const count = users.value.length;
		const message = `Found ${count} user${count !== 1 ? 's' : ''}.`;
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
		// console.error("Error during 'starts with' search:", err);
	}
	called.value = false;
}

// Update user profile (both Firestore and Auth)
async function updateProfile(user) {
	const oldUser = oldUsers.value.find(u => u.id === user.id);
	const callable = httpsCallable($functions, 'updateUserAuth')

	if (!oldUser) {
		console.warn("User not found in backup for update.");
		return;
	}

	const userDocRef = doc($db, "users", user.id);
	const updatedFields = {};

	if (user.displayName !== oldUser.displayName) {
		updatedFields.displayName = user.displayName;
		updatedFields.displayNameLowerCase = user.displayName.toLowerCase();
	}
	if (user.email !== oldUser.email) {
		updatedFields.email = user.email;
	}
	if (user.role !== oldUser.role) {
		updatedFields.role = user.role;
	}
	if (user.password) {
		updatedFields.password = user.password;
	}

	if (!Object.keys(updatedFields).length > 0) {
		$eventBus.emit("alert", {
			message: "No changes detected for the user.",
			type: "error",
			duration: 3000,
		});
		// console.log("No changes detected for the user.");
	}
	else {
		if (Object.keys(updatedFields).length > 0) {
			try {
				const result = await callable({
					uid: user.id,
					fieldsToUpdate: {
						displayName: updatedFields.displayName,
						email: updatedFields.email,
						password: updatedFields.password
					}
				})
				if (updatedFields.password) {
					delete updatedFields.password;
				}
				await updateDoc(userDocRef, updatedFields);
				$eventBus.emit("alert", {
					message: "User profile updated successfully.",
					type: "success",
					duration: 3000,
				});
				// console.log('Response:', result.data)
				called.value = true;
				searchUsersByDisplayNameStartsWith();
			}
			catch (err) {
				$eventBus.emit("alert", {
					message: err.message || "An error occurred while updating the user profile.",
					type: "error",
					duration: 3000,
				});
				// console.error("Error updating Firestore profile:", err);
			}
		}

	}
}

// Global alert

</script>
