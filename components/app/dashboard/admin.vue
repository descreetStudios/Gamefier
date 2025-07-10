<template>
	<div>
		<h1>Admin Page</h1>
		<p>Benvenuto nella tua pagina di admin!</p>
		<form>
			<input
				v-model="userSearchName"
				type="text"
			>
			<input
				type="button"
				value="Search"
				@click="searchUsersByDisplayNameStartsWith"
			>
		</form>
		<div
			v-for="user in users"
			:key="user.id"
		>
			<form>
				<input
					v-model="user.displayName"
					type="text"
				>
				<input
					v-model="user.id"
					type="text"
					disabled
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
					type="button"
					value="Update Profile"
					@click="updateProfile(user)"
				>
			</form>
		</div>
	</div>
</template>

<script setup>
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { ref } from "vue";

const { $db } = useNuxtApp();

const userSearchName = ref(null);
const users = ref([]);
const oldUsers = ref([]);

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
		console.error("Errore durante la ricerca 'starts with':", error);
	}
}

async function updateProfile(user) {
	const oldUser = oldUsers.value.find(u => u.id === user.id);

	if (!oldUser) {
		console.warn("Utente non trovato nel backup per l'aggiornamento.");
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

	if (Object.keys(updatedFields).length > 0) {
		try {
			await updateDoc(userDocRef, updatedFields);
			console.log("Profilo utente aggiornato con successo:", updatedFields);
			searchUsersByDisplayNameStartsWith();
		}
		catch (error) {
			console.error("Errore durante l'aggiornamento del profilo:", error);
		}
	}
	else {
		console.log("Nessuna modifica rilevata per l'utente.");
	}
}
</script>
