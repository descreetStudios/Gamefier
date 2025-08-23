import { defineNuxtPlugin, useNuxtApp } from "#app";
import { computed, watch } from "vue";
import type { useStore } from "@/../stores/userStore";

export default defineNuxtPlugin(() => {
	const { $userStore } = useNuxtApp();
	const userStore = $userStore as ReturnType<typeof useStore>;
	const role = computed(() => userStore.role);

	watch(role, (newRole, oldRole, _) => {
		if (oldRole == null)
			return;
		if (newRole != oldRole) {
			window.location.reload();
		}
	});
});
