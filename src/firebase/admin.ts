import admin from 'firebase-admin';
import { App, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let adminApp: App;

if (getApps().length === 0) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    // Running in production
    adminApp = initializeApp({
      credential: admin.credential.cert(
        JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      ),
    });
  } else {
    // Running in emulator
    process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';
    adminApp = initializeApp({
      projectId: 'demo-project', // can be any string
    });
  }
} else {
  adminApp = getApp();
}

const adminDb = getFirestore(adminApp);
const adminAuth = admin.auth();

export { adminApp, adminDb, adminAuth };
