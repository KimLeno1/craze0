import admin from 'firebase-admin';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase Admin SDK
// It will pick up credentials from the environment if available
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

export const db = admin.firestore(firebaseConfig.firestoreDatabaseId);
export const auth = admin.auth();
