'use server';

import { Timestamp, getFirestore } from 'firebase-admin/firestore';
import admin from 'firebase-admin';
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
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set for local development.');
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
initializeAdminApp();

const adminDb = getFirestore();

// This type should match the structure of the data you intend to save.
// It uses the admin Timestamp.
type VisionTestResultPayload = {
  id: string;
  userId: string;
  leftEyeDistanceCm: number;
  rightEyeDistanceCm: number;
  leftEyeDegree: number;
  rightEyeDegree: number;
  testedAt: Timestamp;
};


/**
 * Adds a new vision record to the specified user's subcollection in Firestore.
 * This is a server-side action using the Firebase Admin SDK.
 */
export async function addRecord(userId: string, data: Omit<VisionTestResultPayload, 'id' | 'userId'>) {
  if (!userId) {
    throw new Error("User must be authenticated to add a record.");
  }
  
  // Use the admin SDK's collection and doc methods.
  const recordsCollectionRef = adminDb.collection('users').doc(userId).collection('visionTestResults');
  const newRecordRef = recordsCollectionRef.doc();

  const fullData: VisionTestResultPayload = {
    id: newRecordRef.id,
    userId: userId,
    ...data
  };

  // The set operation is what writes to the database.
  await newRecordRef.set(fullData);

  // Explicitly return to signal completion of the async function.
  return;
}
