import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	GoogleAuthProvider,
	signInWithPopup,
	updateProfile,
} from "firebase/auth";
import type { User } from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";

// Google Login
export const useAuth = () => {
	// Pinia Store
	const { $userStore } = useNuxtApp();
	const userStore = $userStore as ReturnType<typeof useStore>;

	const { $auth } = useNuxtApp();
	const { $db } = useNuxtApp();

	const uid = ref("");
	const user = useState<User | null>("user", () => null);
	const userData = useState<Record<string, unknown> | null>("userData", () => null);

	const initAuth = async () => {
		onAuthStateChanged($auth, async (u) => {
			// console.log("🔍 Utente rilevato da FireAuth:", u);
			user.value = u;

			if (user.value) {
				await userStore.syncUserData(user.value?.uid);
			}
			userStore.storeUserData("loaded", true);
		});
	};

	const loginWithGoogle = async () => {
		const provider = new GoogleAuthProvider();

		try {
			const result = await signInWithPopup($auth, provider);
			const user = result.user;

			if (!user.displayName) {
				await updateProfile(user, {
					displayName: user.email?.split("@")[0] || user.uid,
				});
			}

			const userRef = doc($db, "users", user.uid);
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
			await userStore.syncUserData(user.uid);
		}
		catch (err) {
			console.error("Errore durante il login con Google:", err);
		}
	};

	const login = async (email: string, password: string) => {
		await signInWithEmailAndPassword($auth, email, password);
	};

	const signup = async (email: string, password: string, displayName: string) => {
		const userCredential = await createUserWithEmailAndPassword($auth, email, password);
		await updateProfile(userCredential.user, {
			displayName: displayName,
		});
		uid.value = userCredential.user.uid;
	};

	const signupUserData = async (email: string, displayName: string) => {
		try {
			await setDoc(doc($db, "users", uid.value), {
				uid: uid.value,
				displayName: displayName,
				displayNameLowerCase: displayName.toLowerCase(),
				email: email,
				createdAt: new Date(),
				role: "user",
			});
			console.log("Dati utente salvati in Firestore!");
		}
		catch (error) {
			console.error("Errore nel salvataggio dei dati:", error);
		}
	};

	const logout = async () => {
		await signOut($auth);
		user.value = null;
		userData.value = null;
	};

	return {
		user,
		userData,
		initAuth,
		login,
		signup,
		signupUserData,
		logout,
		loginWithGoogle,
	};
};
