'use client';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { errorEmitter } from './error-emitter';

/**
 * Initiates the Google Sign-In flow using a popup.
 * This is a non-blocking function. It triggers the popup and allows the UI to remain responsive.
 * Auth state changes are handled by the global onAuthStateChanged listener in the FirebaseProvider.
 *
 * @param authInstance - The Firebase Auth instance.
 */
export function initiateGoogleSignIn(authInstance: Auth): void {
  const provider = new GoogleAuthProvider();
  // The signInWithPopup promise is intentionally not awaited here.
  // This makes the function non-blocking. The onAuthStateChanged listener
  // will handle the result of the authentication attempt.
  signInWithPopup(authInstance, provider).catch((error) => {
    // Although we're not blocking, we should still handle potential immediate errors,
    // like a user closing the popup or network issues.
    // For this app, we'll log it, but you could also emit a global error event.
    console.error('Google Sign-In popup error:', error);
    // You could potentially emit a specific 'login-failed' event here if needed.
  });
}

/**
 * Initiates the user logout process.
 * This is a non-blocking function. It triggers the sign-out and allows the UI to update optimistically.
 * The global onAuthStateChanged listener will handle the user state becoming null.
 *
 * @param authInstance - The Firebase Auth instance.
 */
export function initiateLogout(authInstance: Auth): void {
  // The signOut promise is not awaited, making the logout action non-blocking.
  // The UI can react immediately (e.g., redirect to home page), and the
  // onAuthStateChanged listener will confirm the user is null.
  signOut(authInstance).catch((error) => {
    // Handle potential errors during sign-out, such as network problems.
    console.error('Logout failed:', error);
    // You could emit a global 'logout-failed' event here for the UI to handle.
  });
}
