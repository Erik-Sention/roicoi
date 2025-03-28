import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  User,
  AuthError
} from 'firebase/auth';
import { auth } from './config';

// Create a Google provider instance
const googleProvider = new GoogleAuthProvider();

// Optional: Add scopes if needed
// googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');

/**
 * Sign up a new user with email and password
 * @param email - User's email
 * @param password - User's password
 * @returns Promise with UserCredential
 */
export const signUp = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Sign in an existing user with email and password
 * @param email - User's email
 * @param password - User's password
 * @returns Promise with UserCredential
 */
export const signIn = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Sign in with Google using a popup
 * @returns Promise with UserCredential
 */
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    // Add scopes if needed
    provider.addScope('https://www.googleapis.com/auth/userinfo.email');
    provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    
    const result = await signInWithPopup(auth, provider);
    return result;
  } catch (error: unknown) {
    console.error("Google sign-in error:", error);
    if (error instanceof Error) {
      if ('code' in error) {
        const authError = error as AuthError;
        switch (authError.code) {
          case 'auth/popup-closed-by-user':
            throw new Error("Inloggningsfönstret stängdes innan inloggningen slutfördes");
          case 'auth/popup-blocked':
            throw new Error("Inloggningsfönstret blockerades. Tillåt popup-fönster för denna webbplats");
          case 'auth/cancelled-popup-request':
            throw new Error("Inloggningen avbröts");
          case 'auth/account-exists-with-different-credential':
            throw new Error("Ett konto med denna e-postadress finns redan. Logga in med ett annat sätt");
          default:
            throw new Error(`Google-inloggning misslyckades: ${authError.message}`);
        }
      }
    }
    throw error;
  }
};

/**
 * Sign in with Google using a redirect (better for mobile)
 */
export const signInWithGoogleRedirect = () => {
  return signInWithRedirect(auth, googleProvider);
};

/**
 * Get the result of a redirect sign-in
 * @returns Promise with UserCredential
 */
export const getGoogleRedirectResult = async () => {
  return getRedirectResult(auth);
};

/**
 * Sign out the current user
 * @returns Promise<void>
 */
export const signOut = async () => {
  return firebaseSignOut(auth);
};

/**
 * Subscribe to auth state changes
 * @param callback - Function to call when auth state changes
 * @returns Unsubscribe function
 */
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
}; 