'use client';
import {
  Auth,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

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

/**
 * Signs in a user with email and password.
 * This is a blocking function, it will return a promise that resolves when the user is signed in.
 * @param authInstance The Firebase Auth instance.
 * @param email The user's email.
 * @param password The user's password.
 */
export async function initiateEmailSignIn(authInstance: Auth, email: string, password: string) {
  return signInWithEmailAndPassword(authInstance, email, password);
}

/**
 * Creates a new user with email and password.
 * This is a blocking function, it will return a promise that resolves when the user is created.
 * @param authInstance The Firebase Auth instance.
 * @param email The user's email.
 * @param password The user's password.
 */
export async function initiateEmailSignUp(authInstance: Auth, email: string, password: string) {
  return createUserWithEmailAndPassword(authInstance, email, password);
}
