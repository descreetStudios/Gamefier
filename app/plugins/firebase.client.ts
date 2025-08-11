import { defineNuxtPlugin, useRuntimeConfig } from "nuxt/app";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import type { FirebaseApp } from "firebase/app";

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig();

	const firebaseConfig = {
		apiKey: config.public.NUXT_PUBLIC_FIREBASE_API_KEY as string,
		authDomain: config.public.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN as string,
		projectId: config.public.NUXT_PUBLIC_FIREBASE_PROJECT_ID as string,
		storageBucket: config.public.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
		messagingSenderId: config.public.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string,
		appId: config.public.NUXT_PUBLIC_FIREBASE_APP_ID as string,
		measurementId: config.public.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID as string,
	};

	// Inizializza app Firebase solo se non già inizializzata

	const app = (getApps().length ? getApps()[0] : initializeApp(firebaseConfig)) as FirebaseApp;

	const db = getFirestore(app);
	const auth = getAuth(app);
	const functions = getFunctions(app);

	// Connessione emulatori solo in sviluppo
	if (process.env.NODE_ENV === "development") {
		connectFirestoreEmulator(db, "localhost", 8080);
		connectAuthEmulator(auth, "http://localhost:9099");
		connectFunctionsEmulator(functions, "localhost", 5001);
	}

	// Analytics può fallire in SSR o emulatori, gestiamo con try/catch
	let analytics;
	try {
		analytics = getAnalytics(app);
	}
	catch {
		analytics = null;
	}

	return {
		provide: {
			firebase: app,
			db,
			auth,
			analytics,
			functions,
		},
	};
});
