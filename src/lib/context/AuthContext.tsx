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

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });

    // Check for redirect result when the component mounts
    const checkRedirectResult = async () => {
      try {
        const result = await getGoogleRedirectResult();
        // If we have a result, the user has been signed in via redirect
        if (result) {
          // You can do something with the result here if needed
          console.log("Signed in via redirect:", result.user);
        }
      } catch (error) {
        console.error("Error getting redirect result:", error);
      }
    };

    checkRedirectResult();

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
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