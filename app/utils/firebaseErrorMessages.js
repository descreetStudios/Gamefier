export function getAuthErrorMessage(code) {
	switch (code) {
		case "auth/invalid-email":
			return "Please enter a valid email address.";
		case "auth/user-disabled":
			return "This account is not available.";
		case "auth/user-not-found":
		case "auth/wrong-password":
			return "Invalid email or password. Please try again.";
		case "auth/email-already-in-use":
			return "Unable to register with this email address.";
		case "auth/weak-password":
			return "The password is too weak. Please use at least 8 characters.";
		case "auth/too-many-requests":
			return "Too many attempts. Please try again later.";
		case "auth/network-request-failed":
			return "Network error. Please check your connection.";
		case "auth/internal-error":
			return "Something went wrong. Please try again later.";
		case "auth/popup-closed-by-user":
		case "auth/cancelled-popup-request":
			return "The sign-in process was not completed.";
		case "auth/popup-blocked":
			return "The sign-in popup was blocked by your browser.";
		case "displayName-not-available":
			return "The username is not available."
		default:
			return "An unexpected error occurred. Please try again.";
	}
}
