'use server';

import { collection, doc, setDoc } from 'firebase/firestore';
import { getAdminDb } from '@/firebase/admin';

type VisionTestResultPayload = {
  userId: string;
  leftEyeDistanceCm: number;
  rightEyeDistanceCm: number;
  leftEyeDegree: number;
  rightEyeDegree: number;
  testedAt: FirebaseFirestore.Timestamp;
};


/**
 * Adds a new vision record to the specified user's subcollection in Firestore.
 * This is a server-side action.
 */
export async function addRecord(userId: string, data: Omit<VisionTestResultPayload, 'id'>): Promise<void> {
  if (!userId) {
    throw new Error("User must be authenticated to add a record.");
  }
  
  const adminDb = await getAdminDb();
  const recordsCollection = collection(adminDb, 'users', userId, 'visionTestResults');
  const newRecordRef = doc(recordsCollection);

  await setDoc(newRecordRef, {
    id: newRecordRef.id, // Add the generated ID to the document data
    ...data,
  });
}
