"use client";

import React, { ReactNode, useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';

interface FormWrapperProps {
  children: ReactNode;
  formId: string;
  title: string;
  isLoading?: boolean;
  onRetry?: () => void;
}

/**
 * FormWrapper component that wraps form components with error handling,
 * loading states, and authentication checks.
 */
export default function FormWrapper({
  children,
  formId,
  title,
  isLoading = false,
  onRetry
}: FormWrapperProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  // This ensures hydration issues don't cause problems
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // If not authenticated, redirect to login
  useEffect(() => {
    if (!authLoading && !user && isClient) {
      router.push('/login');
    }
  }, [user, authLoading, router, isClient]);
  
  if (authLoading || !isClient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect in the useEffect
  }
  
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 max-w-xl mx-auto my-8">
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error in {title}</AlertTitle>
            <AlertDescription>
              An error occurred while rendering this form.
              Please try again or contact support if the problem persists.
            </AlertDescription>
          </Alert>
          <div className="flex gap-4">
            {onRetry && (
              <Button onClick={onRetry} variant="outline">
                Try Again
              </Button>
            )}
            <Button onClick={() => router.push('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      }
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading form data...</p>
        </div>
      ) : (
        <div data-form-id={formId}>
          {children}
        </div>
      )}
    </ErrorBoundary>
  );
} 