import { defineNuxtPlugin } from "#app";
import { useAuth } from "~/composables/useAuth";

export default defineNuxtPlugin(() => {
	const { initAuth, updateLocalCache } = useAuth();

	// console.log("Inizializzazione autenticazione...");
	initAuth();
	updateLocalCache();
});
