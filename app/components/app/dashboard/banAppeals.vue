<template>
	<div class="ban-appeals">
		<fieldset
			v-for="user in users"
			:key="user.id"
			class="ban-appeals__card"
		>
			<legend>{{ user.displayName }} - #{{ user.id }}</legend>

			<p class="ban-appeals__info">
				<span class="ban-appeals__highlight">
					{{ user.banType === 'temporary' ? 'Ban expires at:' : 'Permanent ban' }}
				</span>
				<template v-if="user.banType === 'temporary'">
					{{ user.banExpiresAt }}
				</template>
			</p>

			<p class="ban-appeals__info">
				<span class="ban-appeals__highlight">Ban reason:</span> {{ user.banReason }}
			</p>

			<p class="ban-appeals__info">
				<span class="ban-appeals__highlight">Banned by:</span> {{ user.bannedBy }}
			</p>

			<p class="ban-appeals__info">
				<span class="ban-appeals__highlight">Ban appeal text:</span> {{ user.banAppealText }}
			</p>

			<form
				class="ban-appeals__form"
				@submit.prevent="eventHandler(user)"
			>
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

				<div class="ban-appeals__actions">
					<input
						type="submit"
						value="Update ban"
						class="ban-appeals__btn ban-appeals__btn--blue"
						@click="user.action = 1"
					>
					<input
						type="submit"
						value="Unban"
						class="ban-appeals__btn ban-appeals__btn--green"
						@click="user.action = 2"
					>
					<input
						type="submit"
						value="Refuse"
						class="ban-appeals__btn ban-appeals__btn--red"
						@click="user.action = 3"
					>
				</div>
			</form>
		</fieldset>
		<app-infinite-scroll
			:has-more="hasMoreUsers"
			@load="searchPendingBanAppeals"
		>
			<div
				v-if="isLoadingMore"
				class="loader"
			>
				Caricamento...
			</div>
		</app-infinite-scroll>
	</div>
</template>

<script setup>
import {
	collection,
	query,
	where,
	getDocs,
	doc,
	updateDoc,
	deleteField,
	limit,
	startAfter,
} from "firebase/firestore";
import { onMounted, ref } from "vue";

const { $db, $eventBus } = useNuxtApp();

const users = ref([]);
const oldUsers = ref([]);
const pageSize = 10;
const lastVisibleDoc = ref(null);
const hasMoreUsers = ref(false);
const isLoadingMore = ref(false);
const called = ref(false);

const formatDate = (input) => {
	const date = input.toDate ? input.toDate() : new Date(input);
	return date.toISOString().split("T")[0];
};

const searchPendingBanAppeals = async (isNewSearch = false) => {
	isLoadingMore.value = true;

	if (isNewSearch) {
		users.value = [];
		oldUsers.value = [];
		lastVisibleDoc.value = null;
		hasMoreUsers.value = false;
	}

	try {
		let q = query(
			collection($db, "users"),
			where("banAppealText", "!=", null),
			where("banAppealPending", "==", true),
			limit(pageSize),
		);

		if (!isNewSearch && lastVisibleDoc.value) {
			q = query(q, startAfter(lastVisibleDoc.value));
		}

		const snapshot = await getDocs(q);
		const results = [];

		snapshot.forEach((docSnap) => {
			const data = docSnap.data();
			if (data.banExpiresAt) {
				data.banExpiresAt = formatDate(data.banExpiresAt);
			}
			results.push({ id: docSnap.id, ...data });
		});

		if (isNewSearch && results.length === 0) {
			$eventBus.emit("alert", {
				message: `Found 0 banned users with pending appeals.`,
				type: "info",
				duration: 3000,
			});
		}

		users.value = [...users.value, ...results];
		oldUsers.value = users.value.map(u => ({ ...u }));

		if (snapshot.docs.length < pageSize) {
			hasMoreUsers.value = false;
		}
		else {
			lastVisibleDoc.value = snapshot.docs[snapshot.docs.length - 1];
			hasMoreUsers.value = true;
		}

		called.value = true;
	}
	catch (err) {
		$eventBus.emit("alert", {
			message: `Error loading ban appeals: ${err.message || "Unknown error"}`,
			type: "error",
			duration: 3000,
		});
	}
	finally {
		isLoadingMore.value = false;
	}
};

const updateBan = async (user) => {
	const oldUser = oldUsers.value.find(u => u.id === user.id);
	const userRef = doc($db, "users", user.id);
	const updates = {};

	if (user.banType !== oldUser.banType || user.banExpiresAt !== oldUser.banExpiresAt) {
		updates.banType = user.banType;
		if (user.banType === "permanent") {
			updates.banExpiresAt = deleteField();
		}
		else {
			if (!user.banExpiresAt) return;
			const date = new Date(user.banExpiresAt + "T00:00:00");
			if (date <= new Date()) {
				$eventBus.emit("alert", {
					message: "Invalid expiration date. Please select a future date.",
					type: "error",
					duration: 3000,
				});
				return;
			}
			updates.banExpiresAt = date;
		}
		updates.banAppealPending = false;
	}
	else {
		$eventBus.emit("alert", {
			message: "No changes detected. Modify ban type or expiration before submitting.",
			type: "error",
			duration: 3000,
		});
		return;
	}

	try {
		await updateDoc(userRef, updates);
		$eventBus.emit("alert", {
			message: `Ban updated successfully for ${user.displayName}.`,
			type: "success",
			duration: 3000,
		});
	}
	catch (err) {
		$eventBus.emit("alert", {
			message: `Failed to update ban for ${user.displayName}. ${err.message || "Try again."}`,
			type: "error",
			duration: 3000,
		});
	}
};

const refuse = async (user) => {
	try {
		await updateDoc(doc($db, "users", user.id), { banAppealPending: false });
		$eventBus.emit("alert", {
			message: `Ban appeal from ${user.displayName} refused.`,
			type: "success",
			duration: 3000,
		});
	}
	catch (err) {
		$eventBus.emit("alert", {
			message: `Failed to refuse ban appeal from ${user.displayName}. ${err.message || "Try again."}`,
			type: "error",
			duration: 3000,
		});
	}
};

const unban = async (user) => {
	const updates = {
		role: "user",
		banReason: deleteField(),
		banType: deleteField(),
		banExpiresAt: deleteField(),
		bannedBy: deleteField(),
		banAppealText: deleteField(),
		banAppealPending: deleteField(),
	};
	try {
		await updateDoc(doc($db, "users", user.id), updates);
		$eventBus.emit("alert", {
			message: `User ${user.displayName} unbanned successfully.`,
			type: "success",
			duration: 3000,
		});
	}
	catch (err) {
		$eventBus.emit("alert", {
			message: `Failed to unban ${user.displayName}. ${err.message || "Try again."}`,
			type: "error",
			duration: 3000,
		});
	}
};

const eventHandler = async (user) => {
	try {
		const action = user.action;
		if (action === 1) await updateBan(user);
		else if (action === 2) await unban(user);
		else if (action === 3) await refuse(user);

		called.value = true;
		lastVisibleDoc.value = null;
		hasMoreUsers.value = true;
		await searchPendingBanAppeals(true);
	}
	catch (err) {
		$eventBus.emit("alert", {
			message: "Unexpected error: " + (err.message || "Unknown error."),
			type: "error",
			duration: 3000,
		});
	}
};

onMounted(() => {
	searchPendingBanAppeals(true);
},
);
</script>

<style scoped lang="scss">
.ban-appeals {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  &__card {
    padding: 1.5rem;
    border: 2px solid var(--inv-secondary-text);
    border-radius: var(--border-radius);
    display: flex;
    flex-direction: column;
    gap: 1rem;

    legend {
      padding: 0 1rem;
      font-weight: bold;
      font-size: 1.2rem;
    }
  }

  &__info {
    margin: 0;

    & .ban-appeals__highlight {
      font-weight: bold;
    }
  }

  &__highlight {
    font-weight: bold;
  }

  &__form {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: flex-end;

    select,
    input[type="date"] {
      padding: 0.5rem;
      font-size: 1rem;
      border-radius: var(--border-radius);
      border: 1px solid var(--inv-secondary-text);
      margin-bottom: 0;
    }
  }

  &__actions {
    display: flex;
    flex: 1;
    gap: 1rem;
    margin-top: 0;
  }

  &__btn {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    border: none;
    border-radius: var(--border-radius);
    cursor: pointer;
    color: white;
    transition: background-color 0.3s ease;

    &--blue {
      background-color: #007bff;
      &:hover {
        background-color: #0069d9;
      }
    }

    &--green {
      background-color: #28a745;
      &:hover {
        background-color: #218838;
      }
    }

    &--red {
      background-color: #dc3545;
      &:hover {
        background-color: #c82333;
      }
    }
  }
}
</style>
