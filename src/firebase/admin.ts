'use server';

import admin from 'firebase-admin';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { firebaseConfig } from '@/firebase/config';

// This function initializes and returns the Firebase Admin App.
// It ensures that initialization only happens once.
function initializeAdminApp() {
  // If the app is already initialized, return the existing app.
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // When running in a Google Cloud environment (like App Hosting), the SDK is auto-initialized.
  // The GOOGLE_CLOUD_PROJECT variable is a standard indicator of such an environment.
  if (process.env.GOOGLE_CLOUD_PROJECT) {
    return admin.initializeApp();
  }
  
  // For other environments (like local development), use a service account key.
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Required for local development.');
  }

  try {
    const credentials = JSON.parse(serviceAccountKey);
    return admin.initializeApp({
      credential: admin.credential.cert(credentials),
      projectId: firebaseConfig.projectId, // Explicitly set project ID
    });
  } catch (error: any) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY or initializing Firebase Admin:', error.message);
    throw new Error('Failed to initialize Firebase Admin SDK. Ensure the service account key is a valid JSON string.');
  }
}

// Initialize the app once at the module level.
const adminApp = initializeAdminApp();

// Create the db and auth instances once.
export const adminDb: Firestore = getFirestore(adminApp);
export const adminAuth: Auth = getAuth(adminApp);
