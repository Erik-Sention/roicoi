"use client";

import React, { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AuthProvider } from "@/lib/context/AuthContext";
import { SharedFormProvider } from "@/lib/context/SharedFormContext";
import { Toaster } from "@/components/ui/toaster";

interface ClientLayoutProps {
  children: ReactNode;
}

/**
 * ClientLayout component that wraps all client components with an ErrorBoundary
 * to prevent the entire app from crashing when an error occurs.
 */
export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 max-w-xl mx-auto my-8">
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>
              An unexpected error occurred while rendering this component.
              Please try refreshing the page or contact support if the problem persists.
            </AlertDescription>
          </Alert>
          <div className="flex gap-4">
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh Page
            </Button>
            <Button onClick={() => window.location.href = '/'}>
              Go to Home
            </Button>
          </div>
        </div>
      }
    >
      <AuthProvider>
        <SharedFormProvider>
          <main className="min-h-screen bg-background">
            {children}
          </main>
          <Toaster />
        </SharedFormProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
} 