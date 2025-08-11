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
import { httpsCallable } from "firebase/functions";
import { doc, setDoc, getDoc } from "firebase/firestore";

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
	const userStore = $userStore as ReturnType<typeof useStore>;

	const { $auth } = useNuxtApp();
	const { $db } = useNuxtApp();
	const { $functions } = useNuxtApp();

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

	const signupUserData = async (uid: string, email: string, displayName: string) => {
		try {
			await setDoc(doc($db, "users", uid), {
				uid: uid,
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

	const signup = async (email: string, password: string, displayName: string) => {
		const checkUsernameAvailability = httpsCallable<UsernameCheckRequest, UsernameCheckResponse>(
			$functions,
			"checkUsernameAvailability",
		);
		const isUsernameAvailable = async (displayName: string): Promise<boolean> => {
			try {
				const result = await checkUsernameAvailability({ displayName });
				return result.data.available;
			}
			catch (error) {
				console.error("Errore durante la verifica:", error);
				return false;
			}
		};
		const available = await isUsernameAvailable(displayName);
		if (!available) {
			const error = new Error("The username is not available.");
			if (typeof error === "object" && error !== null && "code" in error) {
				(error as { code: string }).code = "displayName-not-available";
			}
			throw error;
		}
		const userCredential = await createUserWithEmailAndPassword($auth, email, password);
		uid.value = userCredential.user.uid;
		await signupUserData(uid.value, email, displayName);
		await updateProfile(userCredential.user, {
			displayName: displayName,
		});
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
		logout,
		loginWithGoogle,
	};
};
