import { getFirestore, collection } from "firebase/firestore";

export default defineNuxtPlugin((nuxtApp) => {
	const db = getFirestore(nuxtApp.$firebase);
	const modelsRef = collection(db, "models");
	return {
		provide: {
			db,
			modelsRef,
		},
	};
});
