"use client";

import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

/**
 * Global error component for Next.js
 * This component is automatically used by Next.js when an error occurs in a route
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log the error to an error reporting service
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-xl mx-auto">
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Something went wrong!</AlertTitle>
          <AlertDescription>
            {error.message || "An unexpected error occurred"}
          </AlertDescription>
        </Alert>
        
        <div className="flex gap-4">
          <Button onClick={reset} variant="outline">
            Try again
          </Button>
          <Button onClick={() => window.location.href = '/'}>
            Go to Home
          </Button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-4 bg-muted rounded-md overflow-auto max-h-[300px]">
            <p className="font-mono text-sm whitespace-pre-wrap">
              {error.stack}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 