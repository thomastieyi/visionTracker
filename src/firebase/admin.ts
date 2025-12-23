'use server';

import admin from 'firebase-admin';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { firebaseConfig } from '@/firebase/config';

// This function initializes and returns the Firebase Admin App.
// It ensures that initialization only happens once.
function initializeAdminApp() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // When running in a Firebase or Google Cloud environment, the SDK is automatically initialized.
  // Otherwise, we need to initialize it manually with credentials.
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountKey) {
    try {
      return admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(serviceAccountKey)),
      });
    } catch (error) {
      console.error('Error initializing Firebase Admin with service account key:', error);
      throw new Error('Failed to initialize Firebase Admin SDK with provided credentials.');
    }
  }

  // For local development without a service account key, we can rely on Application Default Credentials.
  // This requires running `gcloud auth application-default login` first.
  if (process.env.NODE_ENV === 'development') {
    return admin.initializeApp({
      projectId: firebaseConfig.projectId,
    });
  }
  
  // If no credentials are provided and it's not a known Google environment, initialization will fail.
  // This will be caught by the functions below.
  return admin.initializeApp();
}

/**
 * Gets the initialized Firestore Admin instance.
 * @returns {Promise<Firestore>} A promise that resolves with the Firestore instance.
 */
export async function getAdminDb(): Promise<Firestore> {
  const app = initializeAdminApp();
  return getFirestore(app);
}

/**
 * Gets the initialized Firebase Auth Admin instance.
 * @returns {Promise<Auth>} A promise that resolves with the Auth instance.
 */
export async function getAdminAuth(): Promise<Auth> {
  const app = initializeAdminApp();
  return getAuth(app);
}
