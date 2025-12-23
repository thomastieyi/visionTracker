'use server';

import { Timestamp } from 'firebase-admin/firestore';
import { getAdminDb } from '@/firebase/admin';

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
export async function addRecord(userId: string, data: Omit<VisionTestResultPayload, 'id' | 'userId'>): Promise<void> {
  if (!userId) {
    throw new Error("User must be authenticated to add a record.");
  }
  
  // Always await the admin DB instance to ensure it's initialized.
  const adminDb = await getAdminDb();
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
