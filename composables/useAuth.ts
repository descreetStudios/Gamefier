import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	type User,
} from "firebase/auth";

export const useAuth = () => {
	const { $auth } = useNuxtApp();
	const user = useState<User | null>("user", () => null);

	const initAuth = () => {
		onAuthStateChanged($auth, (u) => {
			user.value = u;
		});
	};

	const login = async (email: string, password: string) => {
		await signInWithEmailAndPassword($auth, email, password);
	};

	const register = async (email: string, password: string) => {
		await createUserWithEmailAndPassword($auth, email, password);
	};

	const logout = async () => {
		await signOut($auth);
	};

	return {
		user,
		initAuth,
		login,
		register,
		logout,
	};
};
