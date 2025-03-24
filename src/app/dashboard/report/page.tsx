"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, FileDown, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ReportPreview } from '@/components/ReportPreview';

export default function ReportPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSuccess, setGenerationSuccess] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  const handleGenerateReport = () => {
    setIsGenerating(true);
    setGenerationSuccess(false);
    setGenerationError(null);
    
    // This will be handled by the ReportPreview component
    console.log('Report page: Initiating report generation process');
  };
  
  const handleDownloadSuccess = () => {
    console.log('Report page: Report downloaded successfully');
    setIsGenerating(false);
    setGenerationSuccess(true);
    
    toast({
      title: "Report Generated Successfully",
      description: "Your ROI analysis report has been downloaded.",
      variant: "default",
    });
  };
  
  const handleGenerationError = () => {
    console.log('Report page: Error in report generation process');
    setIsGenerating(false);
    setGenerationError("There was an error generating the report. Please try again.");
    
    toast({
      title: "Report Generation Failed",
      description: "There was an error generating your report. Please check that all forms have been completed.",
      variant: "destructive",
    });
  };
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">ROI Analysis Report</h1>
        <Button 
          onClick={handleGenerateReport} 
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileDown className="h-4 w-4" />
              Generate Report
            </>
          )}
        </Button>
      </div>
      
      {generationError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {generationError}
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGenerateReport}
                className="mt-2"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {generationSuccess && (
        <Alert className="mb-4">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Your ROI analysis report has been generated and downloaded successfully.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Report Preview</CardTitle>
            <CardDescription>
              Preview your ROI analysis report before downloading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReportPreview 
              onDownload={handleDownloadSuccess} 
              onError={handleGenerationError} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 