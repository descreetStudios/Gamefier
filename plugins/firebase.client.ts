import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

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

	// Use existing app if initialized, else initialize a new one
	const app = getApps().length
		? getApps()[0]
		: initializeApp(firebaseConfig);

	const db = getFirestore(app);
	// Analytics may fail on server
	let analytics;
	try {
		analytics = getAnalytics(app);
	}
	catch {
		analytics = null;
	}

	const auth = getAuth(app);

	return {
		provide: {
			firebase: app,
			db,
			analytics,
			auth,
		},
	};
});
