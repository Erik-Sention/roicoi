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
          <AlertTitle>Page Not Found</AlertTitle>
          <AlertDescription>
            The page you are looking for does not exist or has been moved.
          </AlertDescription>
        </Alert>
        
        <div className="flex gap-4">
          <Button onClick={() => window.history.back()} variant="outline">
            Go Back
          </Button>
          <Button asChild>
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 