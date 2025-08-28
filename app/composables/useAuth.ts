import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	GoogleAuthProvider,
	signInWithPopup,
	updateProfile,
	updateEmail,
	updatePassword,
	reauthenticateWithCredential,
	EmailAuthProvider,
} from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { useNuxtApp, useState } from "nuxt/app";
import { ref, watch } from "vue";
import { createError } from "h3";
import type { useUserStore } from "@/../stores/userStore";
import type { useSiteSettingsStore } from "@/../stores/siteSettingsStore";
import type { Auth, User } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import type { Functions } from "firebase/functions";

interface UsernameCheckRequest {
	displayName: string;
}

interface UsernameCheckResponse {
	available: boolean;
}

interface SerializableUser {
	uid: string;
	email: string | null;
	displayName: string | null;
	photoURL: string | null;
	emailVerified: boolean;
	providerId: string;
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
	const user = useState<SerializableUser | null>("user", () => null);
	const unsubscribe = ref<() => void>();

	const initAuth = async () => {
		onAuthStateChanged(auth, async (u) => {
			// console.log("User detected from FireAuth:", u);

			if (u) {
				await u.getIdToken(true);

				user.value = {
					uid: u.uid,
					email: u.email,
					displayName: u.displayName,
					photoURL: u.photoURL,
					emailVerified: u.emailVerified,
					providerId: u.providerId,
				};
				uid.value = u.uid;
			}
			else {
				user.value = null;
				uid.value = "";
			}

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
						// console.log("Document modified:", snapshot.data());
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
			console.error("Error checking username availability:", err);
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
					googleEmail: user.email,
					displayName: user.displayName,
					displayNameLowerCase: user.displayName?.toLowerCase(),
					createdAt: new Date(),
					role: "user",
				});
			}
		}
		catch (err) {
			console.error("Error during Google login:", err);
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
			});
			console.log("User data saved in Firestore!");
		}
		catch (err) {
			console.error("Error saving user data:", err);
		}
	};

	const updateUserData = async (
		uid: string,
		email?: string,
		displayName?: string,
	): Promise<void> => {
		try {
			const updateData: Record<string, unknown> = {};

			if (email) {
				updateData.email = email;
			}

			if (displayName) {
				updateData.displayName = displayName;
				updateData.displayNameLowerCase = displayName.toLowerCase();
			}

			if (Object.keys(updateData).length === 0) {
				console.warn("No data provided to update.");
				return;
			}

			await setDoc(doc(db, "users", uid), updateData, { merge: true });
			console.log("User data updated in Firestore!");
		}
		catch (err) {
			console.error("Error updating user data:", err);
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

	const changeEmail = async (
		currentUser: User,
		oldPassword: string,
		newEmail: string,
	): Promise<void> => {
		try {
			const credential = EmailAuthProvider.credential(currentUser.email!, oldPassword);
			await reauthenticateWithCredential(currentUser, credential);

			await updateEmail(currentUser, newEmail);
			await updateUserData(currentUser.uid, newEmail);
			console.log("Email updated successfully!");
		}
		catch (err) {
			console.error("Error updating email:", err);
			throw err;
		}
	};

	const changePassword = async (
		currentUser: User,
		oldPassword: string,
		newPassword: string,
	): Promise<void> => {
		try {
			const credential = EmailAuthProvider.credential(currentUser.email!, oldPassword);
			await reauthenticateWithCredential(currentUser, credential);

			await updatePassword(currentUser, newPassword);
			console.log("Password updated successfully!");
		}
		catch (err) {
			console.error("Error updating password:", err);
			throw err;
		}
	};

	const changeDisplayName = async (
		currentUser: User,
		oldPassword: string,
		newDisplayName: string,
	): Promise<void> => {
		try {
			const available = await isUsernameAvailable(newDisplayName);
			if (!available) {
				throw createError({
					statusCode: 409,
					message: "Username not available",
					data: { code: "displayName-not-available" },
				});
			}

			const credential = EmailAuthProvider.credential(currentUser.email!, oldPassword);
			await reauthenticateWithCredential(currentUser, credential);
			await updateProfile(currentUser, {
				displayName: newDisplayName,
			});
			await updateUserData(currentUser.uid, undefined, newDisplayName);
			console.log("Display name updated successfully!");
		}
		catch (err) {
			console.error("Error updating display name:", err);
			throw err;
		};
	};

	return {
		user,
		initAuth,
		updateLocalCache,
		login,
		signup,
		logout,
		loginWithGoogle,
		changeEmail,
		changePassword,
		changeDisplayName,
	};
};
