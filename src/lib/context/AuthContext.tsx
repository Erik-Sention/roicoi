"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserCredential } from 'firebase/auth';
import { 
  onAuthChange, 
  signIn, 
  signOut, 
  signUp, 
  signInWithGoogle, 
  signInWithGoogleRedirect,
  getGoogleRedirectResult
} from '../firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  signInWithGoogleRedirect: () => Promise<void>;
  getGoogleRedirectResult: () => Promise<UserCredential | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
      setError(null);
    });

    // Check for redirect result when the component mounts
    const checkRedirectResult = async () => {
      try {
        const result = await getGoogleRedirectResult();
        if (result) {
          console.log("Signed in via redirect:", result.user);
        }
      } catch (error: any) {
        console.error("Error getting redirect result:", error);
        setError(error.message || "Ett fel uppstod vid inloggning med Google");
      }
    };

    checkRedirectResult();

    return () => unsubscribe();
  }, []);

  const handleAuthError = (error: any) => {
    console.error("Auth error:", error);
    let errorMessage = "Ett oväntat fel uppstod";
    
    if (error.code) {
      switch (error.code) {
        case 'auth/network-request-failed':
          errorMessage = "Nätverksfel. Kontrollera din internetanslutning";
          break;
        case 'auth/too-many-requests':
          errorMessage = "För många försök. Försök igen senare";
          break;
        case 'auth/internal-error':
          errorMessage = "Ett internt fel uppstod. Försök igen";
          break;
        default:
          errorMessage = error.message || "Ett oväntat fel uppstod";
      }
    }
    
    setError(errorMessage);
    throw error;
  };

  const wrappedSignUp = async (email: string, password: string): Promise<UserCredential> => {
    try {
      setError(null);
      const result = await signUp(email, password);
      if (!result) throw new Error("Registrering misslyckades");
      return result;
    } catch (error: any) {
      handleAuthError(error);
      throw error;
    }
  };

  const wrappedSignIn = async (email: string, password: string): Promise<UserCredential> => {
    try {
      setError(null);
      const result = await signIn(email, password);
      if (!result) throw new Error("Inloggning misslyckades");
      return result;
    } catch (error: any) {
      handleAuthError(error);
      throw error;
    }
  };

  const wrappedSignInWithGoogle = async (): Promise<UserCredential> => {
    try {
      setError(null);
      const result = await signInWithGoogle();
      if (!result) throw new Error("Google-inloggning misslyckades");
      return result;
    } catch (error: any) {
      handleAuthError(error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn: wrappedSignIn,
        signUp: wrappedSignUp,
        signInWithGoogle: wrappedSignInWithGoogle,
        signInWithGoogleRedirect,
        getGoogleRedirectResult,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 