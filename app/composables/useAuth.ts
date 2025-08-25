import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	GoogleAuthProvider,
	signInWithPopup,
	updateProfile,
} from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { useNuxtApp, useState } from "nuxt/app";
import { ref, watch } from "vue";
import { createError } from "h3";
import type { useUserStore } from "@/../stores/userStore";
import type { useSiteSettingsStore } from "@/../stores/siteSettingsStore";
import type { User, Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { Functions } from "firebase/functions";

interface UsernameCheckRequest {
	displayName: string;
}

interface UsernameCheckResponse {
	available: boolean;
}

// Google Login
export const useAuth = () => {
	// Pinia Store
	const { $userStore } = useNuxtApp();
	const { $siteSettingsStore } = useNuxtApp();
	const userStore = $userStore as ReturnType<typeof useUserStore>;
	const siteSettingsStore = $siteSettingsStore as ReturnType<typeof useSiteSettingsStore>;

	const { $db } = useNuxtApp();
	const { $auth } = useNuxtApp();
	const { $functions } = useNuxtApp();
	const db = $db as Firestore;
	const auth = $auth as Auth;
	const functions = $functions as Functions;

	const uid = ref("");
	const user = useState<User | null>("user", () => null);
	const unsubscribe = ref<() => void>();

	const initAuth = async () => {
		onAuthStateChanged(auth, async (u) => {
			// console.log("Utente rilevato da FireAuth:", u);
			user.value = u;
			uid.value = u?.uid || "";

			userStore.storeUserData("loaded", true);
		});
	};

	const updateLocalCache = async () => {
		watch(uid, (newUid, _, onCleanup) => {
			if (!newUid) return;

			const docRef = doc(db, "users", newUid);

			const unsub = onSnapshot(
				docRef,
				async (snapshot) => {
					if (snapshot.exists()) {
						// console.log("Documento modificato:", snapshot.data());
						await userStore.syncUserData(snapshot.data());
					}
					else {
						logout();
					}
				},
				(err) => {
					console.error("Firestore error:", err);
				},
			);

			unsubscribe.value = unsub;

			onCleanup(() => {
				unsub();
				console.log("CleanUp");
			});
		});

		const siteSettingsRef = doc(db, "site_settings", "general");
		const _unsubSettings = onSnapshot(siteSettingsRef, async (snapshot) => {
			if (snapshot.exists()) {
				await siteSettingsStore.syncSiteSettings(snapshot.data());
			}
			siteSettingsStore.setLoaded();
		});
	};

	const isUsernameAvailable = async (displayName: string): Promise<boolean> => {
		const checkUsernameAvailability = httpsCallable<UsernameCheckRequest, UsernameCheckResponse>(
			functions,
			"checkUsernameAvailability",
		);
		try {
			const result = await checkUsernameAvailability({ displayName });
			return result.data.available;
		}
		catch (err) {
			console.error("Errore durante la verifica:", err);
			return false;
		}
	};

	const loginWithGoogle = async () => {
		const provider = new GoogleAuthProvider();

		try {
			const result = await signInWithPopup(auth, provider);
			const user = result.user;
			if (!user.displayName) {
				await updateProfile(user, {
					displayName: user.email?.split("@")[0] || user.uid,
				});
			}
			const userRef = doc(db, "users", user.uid);
			const userSnapshot = await getDoc(userRef);
			if (!userSnapshot.exists()) {
				await setDoc(userRef, {
					uid: user.uid,
					email: user.email,
					displayName: user.displayName,
					displayNameLowerCase: user.displayName?.toLowerCase(),
					createdAt: new Date(),
					role: "user",
				});
			}
		}
		catch (err) {
			console.error("Errore durante il login con Google:", err);
		}
	};

	const login = async (email: string, password: string) => {
		await signInWithEmailAndPassword(auth, email, password);
	};

	const signupUserData = async (uid: string, email: string, displayName: string) => {
		try {
			await setDoc(doc(db, "users", uid), {
				uid: uid,
				displayName: displayName,
				displayNameLowerCase: displayName.toLowerCase(),
				email: email,
				createdAt: new Date(),
				role: "user",
			});
			console.log("Dati utente salvati in Firestore!");
		}
		catch (err) {
			console.error("Errore nel salvataggio dei dati:", err);
		}
	};

	const signup = async (email: string, password: string, displayName: string) => {
		const available = await isUsernameAvailable(displayName);
		if (!available) {
			throw createError({
				statusCode: 409,
				message: "Username not available",
				data: { code: "displayName-not-available" },
			});
		}
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		uid.value = userCredential.user.uid;
		await signupUserData(uid.value, email, displayName);
		await updateProfile(userCredential.user, {
			displayName: displayName,
		});
	};

	const logout = async () => {
		await signOut(auth);
		user.value = null;
	};

	return {
		user,
		initAuth,
		updateLocalCache,
		login,
		signup,
		logout,
		loginWithGoogle,
	};
};
