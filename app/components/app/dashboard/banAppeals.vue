<template>
	<div>
		<fieldset
			v-for="user in users"
			:key="user.id"
		>
			<legend>{{ user.displayName }} - #{{ user.id }}</legend>
			<p v-if="user.banType=='temporary'">
				Ban expires at: {{ user.banExpiresAt }}
			</p>
			<p v-else>
				Permanent ban
			</p>
			<p>Ban reason: {{ user.banReason }}</p>
			<p>Banned by: {{ user.bannedBy }}</p>
			<p>Ban appeal text: {{ user.banAppealText }}</p>
			<form @submit.prevent>
				<select
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
					v-if="user.banType === 'temporary'"
					v-model="user.banExpiresAt"
					type="date"
					required
				>
				<input
					type="submit"
					value="Update ban"
					@click="eventHandler(user, 1)"
				>
				<input
					type="submit"
					value="Refuse"
					@click="eventHandler(user, 2)"
				>
				<input
					type="submit"
					value="Unban"
					@click="eventHandler(user, 3)"
				>
			</form>
		</fieldset>
	</div>
</template>

<script setup>
import { collection, query, where, getDocs, doc, updateDoc, deleteField } from "firebase/firestore";
import { onMounted, ref } from "vue";

const { $db } = useNuxtApp();
const { $eventBus } = useNuxtApp();

const users = ref([]);
const oldUsers = ref([]);
const called = ref(false);

onMounted(async () => {
	searchPendingBanAppeals();
});

const searchPendingBanAppeals = async () => {
	const usersRef = collection($db, "users");
	const q = query(usersRef,
		where("banAppealText", "!=", null),
		where("banAppealPending", "==", true),
	);
	try {
		const querySnapshot = await getDocs(q);
		users.value = [];
		oldUsers.value = [];
		querySnapshot.forEach((doc) => {
			const data = doc.data();
			if (data.banExpiresAt) {
				const date = data.banExpiresAt.toDate ? data.banExpiresAt.toDate() : new Date(data.banExpiresAt);
				data.banExpiresAt = date.toISOString().split("T")[0];
			}
			users.value.push({ id: doc.id, ...data });
			oldUsers.value = users.value.map(user => ({ ...user }));
		});
		if (!called.value) {
			const count = users.value.length;
			const message = `Found ${count} banned user${count !== 1 ? "s" : ""} who submitted a ban appeal request.`;
			$eventBus.emit("alert", {
				message: message,
				type: "success",
				duration: 3000,
			});
		}
	}
	catch (err) {
		console.error(err);
	}
	called.value = false;
};

const eventHandler = async (user, event) => {
	try {
		switch (event) {
			case 1:
				await updateBan(user);
				break;
			case 2:
				await refuse(user);
				break;
			case 3:
				await unban(user);
				break;
		}
		called.value = true;
		await searchPendingBanAppeals();
	}
	catch (err) {
		$eventBus.emit("alert", {
			message: "Unexpected error: " + (err.message || "Unknown error."),
			type: "error",
			duration: 3000,
		});
	}
};

const updateBan = async (user) => {
	const oldUser = oldUsers.value.find(u => u.id === user.id);
	const userDocRef = doc($db, "users", user.id);
	const updatedStoreFields = {};
	if (user.banType != oldUser.banType || user.banExpiresAt != oldUser.banExpiresAt) {
		updatedStoreFields.banType = user.banType;
		if (user.banType === "permanent") {
			updatedStoreFields.banExpiresAt = deleteField();
		}
		else {
			if (!user.banExpiresAt) {
				return;
			}
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
		updatedStoreFields.banAppealPending = false;
	}

	if (!Object.keys(updatedStoreFields).length > 0) {
		$eventBus.emit("alert", {
			message: "No changes were made to the ban. Please modify the ban type or expiration date before submitting.",
			type: "error",
			duration: 3000,
		});
	}
	else {
		try {
			await updateDoc(userDocRef, updatedStoreFields);
			$eventBus.emit("alert", {
				message: `Ban updated successfully for ${user.displayName}.`,
				type: "success",
				duration: 3000,
			});
		}
		catch (err) {
			$eventBus.emit("alert", {
				message: `Failed to update the ban for ${user.displayName}. ${err?.message ? "Error: " + err.message : "Please try again."}`,
				type: "error",
				duration: 3000,
			});
		}
	}
};

const refuse = async (user) => {
	const userDocRef = doc($db, "users", user.id);
	try {
		await updateDoc(userDocRef, { banAppealPending: false });
		$eventBus.emit("alert", {
			message: `Ban appeal from ${user.displayName} has been refused.`,
			type: "success",
			duration: 3000,
		});
	}
	catch (err) {
		$eventBus.emit("alert", {
			message: `Failed to refuse the ban appeal from ${user.displayName}. ${err?.message ? "Error: " + err.message : "Please try again."}`,
			type: "error",
			duration: 3000,
		});
	}
};

const unban = async (user) => {
	const userDocRef = doc($db, "users", user.id);
	const updatedStoreFields = {
		role: "user",
		banReason: deleteField(),
		banType: deleteField(),
		banExpiresAt: deleteField(),
		bannedBy: deleteField(),
		banAppealText: deleteField(),
		banAppealPending: deleteField(),
	};
	try {
		await updateDoc(userDocRef, updatedStoreFields);
		$eventBus.emit("alert", {
			message: `User ${user.displayName} has been successfully unbanned.`,
			type: "success",
			duration: 3000,
		});
	}
	catch (err) {
		$eventBus.emit("alert", {
			message: `Failed to unban ${user.displayName}. ${err?.message ? "Error: " + err.message : "Please try again."}`,
			type: "error",
			duration: 3000,
		});
	}
};
</script>

<style>

</style>
