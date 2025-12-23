'use server';

import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { getAdminDb } from '@/firebase/admin';

type VisionTestResultPayload = {
  userId: string;
  leftEyeDistanceCm: number;
  rightEyeDistanceCm: number;
  leftEyeDegree: number;
  rightEyeDegree: number;
  testedAt: Timestamp;
};


/**
 * Adds a new vision record to the specified user's subcollection in Firestore.
 * This is a server-side action.
 */
export async function addRecord(userId: string, data: Omit<VisionTestResultPayload, 'id' | 'userId'>): Promise<void> {
  if (!userId) {
    throw new Error("User must be authenticated to add a record.");
  }
  
  const adminDb = await getAdminDb();
  if (!adminDb) {
    throw new Error("Failed to get a valid database instance.");
  }
  
  const recordsCollection = collection(adminDb, 'users', userId, 'visionTestResults');
  const newRecordRef = doc(recordsCollection);

  const fullData: VisionTestResultPayload = {
    id: newRecordRef.id, // Add the generated ID to the document data
    userId: userId,

    ...data
  };

  await setDoc(newRecordRef, fullData);
}
