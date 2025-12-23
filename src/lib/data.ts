'use server';

import { Timestamp, getFirestore } from 'firebase-admin/firestore';
import admin from 'firebase-admin';

// Initialize the app if it's not already initialized.
// In a managed Google Cloud environment, initializeApp() without arguments
// will automatically use the available service account credentials.
if (admin.apps.length === 0) {
  admin.initializeApp();
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
