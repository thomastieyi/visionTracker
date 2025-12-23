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

  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    return initializeApp({
      credential: admin.credential.cert(
        JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      ),
    });
  } 
  
  if (process.env.NODE_ENV === 'development') {
    return initializeApp({
      projectId: firebaseConfig.projectId,
    });
  }

  return initializeApp();
}

export async function getAdminDb(): Promise<Firestore> {
  return getFirestore(getAdminApp());
}

export async function getAdminAuth(): Promise<Auth> {
  return getAuth(getAdminApp());
}
