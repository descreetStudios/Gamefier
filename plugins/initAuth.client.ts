import { defineNuxtPlugin } from "#app";
import { useAuth } from "~/composables/useAuth";

export default defineNuxtPlugin(() => {
	const { initAuth } = useAuth();

	console.log("🔄 Inizializzazione autenticazione...");
	initAuth();
});
