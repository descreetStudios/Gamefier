const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore, Timestamp, FieldValue } = require("firebase-admin/firestore");

const { onCall, onRequest } = require("firebase-functions/v2/https");
const { schedule } = require("firebase-functions/v2/pubsub");

initializeApp();

const auth = getAuth();
const firestore = getFirestore();

exports.updateUserAuth = onCall(async (context) => {
	if (!context.auth) {
		throw new Error("Unauthenticated: The request must be authenticated.");
	}

	const callerUid = context.auth.uid;

	const callerDoc = await firestore.collection("users").doc(callerUid).get();
	if (!callerDoc.exists || callerDoc.data()?.role !== "admin") {
		throw new Error("Permission denied: Only administrators can update user profiles.");
	}

	const targetUid = context.data.uid;
	const fieldsToUpdate = { ...context.data.fieldsToUpdate };

	if (!fieldsToUpdate.email) delete fieldsToUpdate.email;
	if (!fieldsToUpdate.password) delete fieldsToUpdate.password;
	if (!fieldsToUpdate.displayName) delete fieldsToUpdate.displayName;

	if (!targetUid || !fieldsToUpdate || Object.keys(fieldsToUpdate).length === 0) {
		throw new Error("Invalid argument: UID and fields to update are required.");
	}

	try {
		await auth.updateUser(targetUid, fieldsToUpdate);
		return {
			success: true,
			message: `User ${targetUid} successfully updated in Firebase Auth.`,
		};
	}
	catch (error) {
		const code = error.code || "";
		if (code === "auth/user-not-found") {
			throw new Error("Not found: The specified user was not found in Firebase Auth.");
		}
		else if (code === "auth/email-already-exists") {
			throw new Error("Already exists: The provided email is already in use by another user.");
		}
		else if (code === "auth/invalid-email") {
			throw new Error("Invalid argument: The email address is invalid.");
		}
		else if (code === "auth/invalid-password") {
			throw new Error("Invalid argument: The password is invalid.");
		}
		else if (code === "auth/missing-password") {
			throw new Error("Invalid argument: Please provide a password.");
		}
		else {
			console.error("Error updating Auth user:", error);
			throw new Error("Internal: An error occurred while updating the user.");
		}
	}
});

exports.checkUsernameAvailability = onCall(async (context) => {
	const displayName = context.data.displayName;

	if (!displayName || typeof displayName !== "string") {
		throw new Error("Invalid argument: displayName is required and must be a string.");
	}

	const normalizedName = displayName.trim().toLowerCase();

	const snapshot = await firestore
		.collection("users")
		.where("displayNameLowerCase", "==", normalizedName)
		.limit(1)
		.get();

	return { available: snapshot.empty };
});

// Test locally with: http://localhost:5001/gamefier-86a8b/us-central1/testUnban
exports.testUnban = onRequest(async (req, res) => {
	try {
		const now = Timestamp.now();

		const snapshot = await firestore
			.collection("users")
			.where("role", "==", "banned")
			.where("banExpiresAt", "<=", now)
			.get();

		const batch = firestore.batch();
		snapshot.docs.forEach((doc) => {
			batch.update(doc.ref, {
				role: "user",
				banReason: FieldValue.delete(),
				banType: FieldValue.delete(),
				banExpiresAt: FieldValue.delete(),
				bannedBy: FieldValue.delete(),
				banAppealText: FieldValue.delete(),
				banAppealPending: FieldValue.delete(),
			});
		});

		await batch.commit();
		res.send(`Successfully unbanned ${snapshot.size} users`);
	}
	catch (err) {
		console.error("Error in testUnban:", err);
		res.status(500).send("Error during unban process.");
	}
});

if (process.env.FUNCTIONS_EMULATOR !== "true") {
	exports.unbanExpiredUsers = schedule("every 1 minutes").onRun(async () => {
		try {
			const now = Timestamp.now();

			const snapshot = await firestore
				.collection("users")
				.where("role", "==", "banned")
				.where("banExpiresAt", "<=", now)
				.get();

			const batch = firestore.batch();
			snapshot.docs.forEach((doc) => {
				batch.update(doc.ref, {
					role: "user",
					banExpiresAt: FieldValue.delete(),
				});
			});

			await batch.commit();
			console.log(`Successfully unbanned ${snapshot.size} users`);
		}
		catch (err) {
			console.error("Error in scheduled unbanExpiredUsers:", err);
		}
	});
}
