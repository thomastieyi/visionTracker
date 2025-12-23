'use server';

import admin from 'firebase-admin';
import { App, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { firebaseConfig } from '@/firebase/config';

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApp();
  }

  // When running in a Firebase or Google Cloud environment, the SDK is automatically initialized.
  // Otherwise, we need to initialize it manually with the service account key.
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    return initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
    });
  } 
  
  // For local development, we can use the project ID from the client-side config.
  // This relies on `firebase login` and `gcloud auth application-default login`
  if (process.env.NODE_ENV === 'development') {
     return initializeApp({
       projectId: firebaseConfig.projectId,
     });
  }

  // If none of the above, try to initialize without credentials.
  // This will work in some Google Cloud environments.
  return initializeApp();
}

export async function getAdminDb(): Promise<Firestore> {
  return getFirestore(getAdminApp());
}

export async function getAdminAuth(): Promise<Auth> {
  return getAuth(getAdminApp());
}
