import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	type User,
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";
// Google Login
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const useAuth = () => {
	const { $auth } = useNuxtApp();
	const { $db } = useNuxtApp();

	const uid = ref("");

	const user = useState<User | null>("user", () => null);

	const initAuth = () => {
		onAuthStateChanged($auth, (u) => {
			user.value = u;
		});
	};

	const loginWithGoogle = async () => {
		const provider = new GoogleAuthProvider();
		try {
		await signInWithPopup($auth, provider);
		} catch (err) {
		console.error('Error during Google login:', err);
		}
	};

	const login = async (email: string, password: string) => {
		await signInWithEmailAndPassword($auth, email, password);
	};

	const signup = async (email: string, password: string) => {
		const userCredential = await createUserWithEmailAndPassword($auth, email, password);
		uid.value = userCredential.user.uid;
	};

	const signupUserData = async (email: string, displayName: string) => {
		try {
			await setDoc(doc($db, "users", email), {
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
	};

	return {
		user,
		initAuth,
		login,
		signup,
		signupUserData,
		logout,
		loginWithGoogle,
	};
};
