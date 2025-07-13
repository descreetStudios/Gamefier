const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.updateUserAuth = functions.https.onCall(async (request) => {
  // 1. Check authentication
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The request must be authenticated.');
  }

  const callerUid = request.auth.uid;

  // 2. Check authorization from Firestore
  const callerDoc = await admin.firestore().collection('users').doc(callerUid).get();

  if (!callerDoc.exists || callerDoc.data().role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only administrators can update user profiles.');
  }

  // 3. Extract data from client
  const targetUid = request.data.uid;
  const fieldsToUpdate = request.data.fieldsToUpdate;

  if (!fieldsToUpdate.email) {
    delete fieldsToUpdate.email;
  }
  if (!fieldsToUpdate.password) {
    delete fieldsToUpdate.password;
  }
  if (!fieldsToUpdate.displayName) {
    delete fieldsToUpdate.displayName;
  }

  if (!targetUid || !fieldsToUpdate || Object.keys(fieldsToUpdate).length === 0) {
    throw new functions.https.HttpsError('invalid-argument', 'UID and fields to update are required.');
  }

  // 4. Perform update
  try {
    await admin.auth().updateUser(targetUid, fieldsToUpdate);

    return {
      success: true,
      message: `User ${targetUid} successfully updated in Firebase Auth.`
    };

  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      throw new functions.https.HttpsError('not-found', 'The specified user was not found in Firebase Auth.');
    } else if (error.code === 'auth/email-already-exists') {
      throw new functions.https.HttpsError('already-exists', 'The provided email is already in use by another user.');
    } else if (error.code === 'auth/invalid-email') {
      throw new functions.https.HttpsError('invalid-argument', 'The email address is invalid.');
    } else if (error.code === 'auth/invalid-password') {
      throw new functions.https.HttpsError('invalid-argument', 'The password is invalid.');
    } else if (error.code === 'auth/missing-password') {
      throw new functions.https.HttpsError('invalid-argument', 'Please provide a password.');
    } else {
      console.error("Error updating Auth user:", error);
      throw new functions.https.HttpsError('internal', 'An internal error occurred while updating the user.');
    }
  }
});