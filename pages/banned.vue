<template>
	<div>
		<AppGlobalAlert />

		<h1>You are currently banned</h1>
		<h2>Ban reason {{ $userStore.banReason }}</h2>
		<h2>Ban expires in {{ $userStore.banExpiresAt }}</h2>
		<h2>Banned by {{ $userStore.bannedBy }}</h2>
		<form @submit.prevent="sendBanAppeal()">
			<input
				v-model="banAppealText"
				type="textarea"
				:disabled="banAppealAlreadySent"
				required
			>
			<input
				type="submit"
				value="Send ban appeal"
				:disabled="banAppealAlreadySent"
			>
		</form>
	</div>
</template>

<script setup>
import { doc, updateDoc } from "firebase/firestore";

const { $db } = useNuxtApp();
const { $eventBus } = useNuxtApp();
const { $userStore } = useNuxtApp();

const banAppealText = ref($userStore.banAppealText);
const banAppealAlreadySent = computed(() => $userStore.banAppealAlreadySent);

async function sendBanAppeal() {
	if (banAppealText.value && !banAppealAlreadySent.value) {
		try {
			const userDocRef = doc($db, "users", $userStore.userId);
			await updateDoc(userDocRef, { banAppealText: banAppealText.value });
			await $userStore.syncUserData($userStore.userId);
			$eventBus.emit("alert", {
				message: "Ban appeal sent successfully.",
				type: "success",
				duration: 3000,
			});
		}
		catch (err) {
			$eventBus.emit("alert", {
				message: err.message || "An error occurred while sending ban appeal.",
				type: "error",
				duration: 3000,
			});
		}
	}
}
</script>

<style lang="scss" scoped></style>
