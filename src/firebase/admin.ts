'use server';

import admin from 'firebase-admin';
import { App, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from '@/firebase/config';

let adminApp: App;

// This logic is flawed for Vercel/Next.js environment as serverless functions
// might not share the same global state.
if (getApps().length === 0) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    // This will run in the deployed environment where the service account is set
    adminApp = initializeApp({
      credential: admin.credential.cert(
        JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      ),
      // Optionally add databaseURL if you have RTDB
      // databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`
    });
  } else if (process.env.NODE_ENV === 'development') {
    // This will run in local development
    // It uses a fallback for local dev where service account key might not be set.
    // Ensure you have run `gcloud auth application-default login`
    // or have set GOOGLE_APPLICATION_CREDENTIALS env var.
    adminApp = initializeApp({
      projectId: firebaseConfig.projectId,
    });
  } else {
    // Fallback for other environments or if in dev but without local auth setup
    // This will likely fail if no other config is provided, but it's a safe default
     adminApp = initializeApp();
  }
} else {
  adminApp = getApp();
}

const adminDb = getFirestore(adminApp);
const adminAuth = admin.auth(adminApp);

export { adminApp, adminDb, adminAuth };
