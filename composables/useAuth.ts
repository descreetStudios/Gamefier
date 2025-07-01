import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	type User,
} from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";
// Google Login
import { GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";

export const useAuth = () => {
	// Pinia Store
	const { $userStore } = useNuxtApp();
	const userStore = $userStore as ReturnType<typeof useStore>;

	const { $auth } = useNuxtApp();
	const { $db } = useNuxtApp();

	const uid = ref("");
	const user = useState<User | null>("user", () => null);
	const userData = useState<Record<string, unknown> | null>("userData", () => null);

	const fetchUserData = async (uid: string) => {
		if (!uid) return;
		const userRef = doc($db, "users", uid);
		const userSnapshot = await getDoc(userRef);

		if (userSnapshot.exists()) {
			userData.value = userSnapshot.data();
			userStore.storeUserData("userId", uid);
			userStore.storeUserData("role", userData.value?.role);
			userStore.storeUserData("displayName", userData.value?.displayName);
		}
	};

	const initAuth = async () => {
		onAuthStateChanged($auth, async (u) => {
			// console.log("🔍 Utente rilevato da FireAuth:", u);
			user.value = u;

			if (user.value) {
				await fetchUserData(user.value?.uid);
			}
			userStore.storeUserData("loaded", true);
		});
	};

	const loginWithGoogle = async () => {
		const provider = new GoogleAuthProvider();
		try {
			await signInWithPopup($auth, provider);
		}
		catch (err) {
			console.error("Error during Google login:", err);
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
