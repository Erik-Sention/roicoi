'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * Global not-found component for Next.js
 * This component is automatically used by Next.js when a route is not found
 */
export default function NotFound() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-xl mx-auto">
        <Alert className="mb-6">
          <AlertTitle>Sidan kunde inte hittas</AlertTitle>
          <AlertDescription>
            Sidan du letar efter finns inte eller har flyttats.
          </AlertDescription>
        </Alert>
        
        <div className="flex gap-4">
          <Button onClick={() => window.history.back()} variant="outline">
            Gå tillbaka
          </Button>
          <Button asChild>
            <Link href="/">Gå till startsidan</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 