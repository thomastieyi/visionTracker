'use server';

import { Timestamp, getFirestore } from 'firebase-admin/firestore';
import admin from 'firebase-admin';

// Initialize the app if it's not already initialized
if (admin.apps.length === 0) {
    // When running in a Google Cloud environment (like App Hosting), the SDK is auto-initialized.
    if (process.env.GOOGLE_CLOUD_PROJECT) {
        admin.initializeApp();
    } else {
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (!serviceAccountKey) {
            throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set for local development.');
        }
        try {
            const credentials = JSON.parse(serviceAccountKey);
            admin.initializeApp({
                credential: admin.credential.cert(credentials),
            });
        } catch (e) {
            throw new Error('Failed to parse Firebase service account key.');
        }
    }
}


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
  
  if (!adminDb) {
    throw new Error("Failed to get a valid database instance.");
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
