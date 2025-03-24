"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { getFormByFormId } from "@/lib/firebase/formSubmission";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ActivityIcon, FileDown, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Dashboard() {
  const [organizationName, setOrganizationName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [testStatus, setTestStatus] = useState<{
    message: string;
    success: boolean;
    error?: string;
  } | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const loadOrganizationName = async () => {
      try {
        // Try to get form A which contains the organization name
        const formA = await getFormByFormId("form-a");
        
        if (formA && formA.data && formA.data.A1) {
          setOrganizationName(formA.data.A1 as string);
        }
      } catch (error) {
        console.error("Error loading organization name:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrganizationName();
  }, [user, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Fel vid utloggning",
        description: "Kunde inte logga ut",
        variant: "destructive",
      });
    }
  };

  const handleTestConnections = async () => {
    setTestStatus({
      message: "Testing connections...",
      success: false
    });
    
    try {
      console.log("Dashboard: Starting connection test");
      
      // Test form data fetching
      const testFetch = async () => {
        try {
          // Import the fetchReportData function
          const { fetchReportData } = await import('@/lib/utils/reportGenerator');
          
          // Fetch report data
          console.log("Dashboard: Testing fetchReportData function");
          const data = await fetchReportData();
          
          // Check if we got any data
          if (!data) {
            throw new Error("No data returned from fetchReportData");
          }
          
          console.log("Dashboard: Successfully fetched report data:", data);
          return { success: true, data };
        } catch (error) {
          console.error("Dashboard: Error fetching report data:", error);
          return { 
            success: false, 
            error: error instanceof Error ? error.message : "Unknown error fetching data" 
          };
        }
      };
      
      // Run the test
      const result = await testFetch();
      
      if (result.success) {
        setTestStatus({
          message: "All connections working properly!",
          success: true
        });
        
        toast({
          title: "Connection Test Successful",
          description: "All data connections are working properly.",
          variant: "default",
        });
      } else {
        setTestStatus({
          message: "Connection test failed",
          success: false,
          error: result.error
        });
        
        toast({
          title: "Connection Test Failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Dashboard: Error in test connections:", error);
      
      setTestStatus({
        message: "Connection test failed",
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      
      toast({
        title: "Connection Test Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleTestConnections}
            className="flex items-center gap-2"
          >
            {testStatus?.message === "Testing connections..." ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <ActivityIcon className="h-4 w-4" />
                Test Connections
              </>
            )}
          </Button>
          <Button asChild>
            <Link href="/dashboard/report">
              <FileDown className="mr-2 h-4 w-4" />
              Generate Report
            </Link>
          </Button>
        </div>
      </div>
      
      {testStatus && (
        <Alert variant={testStatus.success ? "default" : "destructive"} className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{testStatus.success ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>
            {testStatus.message}
            {testStatus.error && (
              <div className="mt-2 text-sm">
                <p>Error details: {testStatus.error}</p>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="container max-w-md py-16">
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Välkommen</CardTitle>
              <CardDescription>
                {organizationName ? `Fortsätt med ditt arbete för ${organizationName}` : 'Fortsätt med ditt arbete'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center p-8">
                  <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4">Laddar...</p>
                </div>
              ) : (
                <Link href="/forms/form-a" className="w-full">
                  <Button className="w-full py-6 text-lg">
                    {organizationName ? `Fortsätt med ${organizationName}` : 'Starta nytt formulär'}
                  </Button>
                </Link>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Logga ut
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 