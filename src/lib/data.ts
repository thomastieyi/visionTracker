'use server';

import { Timestamp } from 'firebase-admin/firestore';
import { getAdminDb } from '@/firebase/admin';

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
  
  const adminDb = await getAdminDb();
  if (!adminDb) {
    throw new Error("Failed to get a valid database instance.");
  }
  
  // Use the adminDb instance to reference the collection and create a new document
  const recordsCollectionRef = adminDb.collection('users').doc(userId).collection('visionTestResults');
  const newRecordRef = recordsCollectionRef.doc();

  const fullData: VisionTestResultPayload = {
    id: newRecordRef.id, // Add the generated ID to the document data
    userId: userId,
    ...data
  };

  await newRecordRef.set(fullData);
}
