'use server';

import { collection, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import type { VisionRecord } from './types';
import { adminDb } from '@/firebase/admin';


// This file now interacts with Firestore for data persistence.
// The local in-memory array is no longer used.

/**
 * Adds a new vision record to the specified user's subcollection in Firestore.
 * This is a server-side action.
 */
export async function addRecord(userId: string, data: Omit<VisionRecord, 'id' | 'measuredAt'>): Promise<void> {
  if (!userId) {
    throw new Error("User must be authenticated to add a record.");
  }
  
  const recordsCollection = collection(adminDb, 'users', userId, 'records');
  const newRecordRef = doc(recordsCollection);

  await setDoc(newRecordRef, {
    ...data,
    measuredAt: serverTimestamp(),
  });
}

// The getRecords function is no longer needed on the server,
// as data will be fetched directly on the client from Firestore.
