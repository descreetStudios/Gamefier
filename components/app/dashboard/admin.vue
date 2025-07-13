<template>
	<div>
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

const userSearchName = ref(null);
const users = ref([]);
const oldUsers = ref([]);

// Search users whose displayName starts with the input
async function searchUsersByDisplayNameStartsWith() {
	const usersRef = collection($db, "users");
	const lowerCaseSearchQuery = userSearchName.value.toLowerCase();
	if (!lowerCaseSearchQuery) {
		users.value = [];
		oldUsers.value = [];
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
		console.log(users.value);
	}
	catch (error) {
		console.error("Error during 'starts with' search:", error);
	}
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
	const updatedFirestoreFields = {};
	const updatedAuthFields = {};

	if (user.displayName !== oldUser.displayName) {
		updatedAuthFields.displayName = user.displayName;
		updatedFirestoreFields.displayName = user.displayName;
		updatedFirestoreFields.displayNameLowerCase = user.displayName.toLowerCase();
	}
	if (user.email !== oldUser.email) {
		updatedFirestoreFields.email = user.email;
		updatedAuthFields.email = user.email;
	}
	if (user.role !== oldUser.role) {
		updatedFirestoreFields.role = user.role;
	}
	if (user.password) {
		updatedAuthFields.password = user.password;
	}

	if (!Object.keys(updatedFirestoreFields).length > 0 && !Object.keys(updatedAuthFields).length > 0) {
		console.log("No changes detected for the user.");
	}
	else {
		if (Object.keys(updatedFirestoreFields).length > 0) {
			try {
				await updateDoc(userDocRef, updatedFirestoreFields);
				console.log("User profile updated in Firestore:", updatedFirestoreFields);
				searchUsersByDisplayNameStartsWith();
			}
			catch (error) {
				console.error("Error updating Firestore profile:", error);
			}
		}
		if (Object.keys(updatedAuthFields).length > 0) {
			try {
				const result = await callable({
					uid: user.id,
					fieldsToUpdate: {
						displayName: updatedAuthFields.displayName,
						email: updatedAuthFields.email,
						password: updatedAuthFields.password
					}
				})
				console.log('Response:', result.data)
			} catch (error) {
				console.error("Error updating Firebase Auth profile:", error);
			}
		}
	}
}
</script>
