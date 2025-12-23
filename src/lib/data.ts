'use server';

import { Timestamp, getFirestore } from 'firebase-admin/firestore';
import admin from 'firebase-admin';

// This function initializes and returns the Firebase Admin App.
// It ensures that initialization only happens once.
function initializeAdminApp() {
  if (admin.apps.length > 0) {
    return admin.app();
  }
  return admin.initializeApp();
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
  chartLine: number;
  notes: string;
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
  
  const recordsCollectionRef = adminDb.collection('users').doc(userId).collection('visionTestResults');
  const newRecordRef = recordsCollectionRef.doc();

  const fullData: VisionTestResultPayload = {
    id: newRecordRef.id,
    userId: userId,
    ...data
  };

  await newRecordRef.set(fullData);
  
  return;
}

export async function updateRecord(userId: string, recordId: string, data: Partial<Omit<VisionTestResultPayload, 'id' | 'userId' | 'testedAt'>>) {
  if (!userId) {
    throw new Error("User must be authenticated to update a record.");
  }

  const recordRef = adminDb.collection('users').doc(userId).collection('visionTestResults').doc(recordId);

  await recordRef.update(data);
  
  return;
}

export async function deleteRecord(userId: string, recordId: string) {
  if (!userId) {
    throw new Error("User must be authenticated to delete a record.");
  }

  const recordRef = adminDb.collection('users').doc(userId).collection('visionTestResults').doc(recordId);
  await recordRef.delete();

  return;
}