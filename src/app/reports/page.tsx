"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportPreview } from "@/components/ReportPreview";
import { toast } from "@/components/ui/use-toast";
import { RefreshCw } from "lucide-react";

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [language, setLanguage] = useState<'sv' | 'en'>('sv'); // Default to Swedish
  
  const handleGenerateReport = () => {
    setIsGenerating(true);
    setShowPreview(true);
    setHasError(false);
  };
  
  const handleDownloadComplete = () => {
    toast({
      title: language === 'sv' ? "Rapport nedladdad" : "Report Downloaded",
      description: language === 'sv' 
        ? "Din ROI-analysrapport har laddats ned." 
        : "Your ROI analysis report has been downloaded successfully.",
    });
  };
  
  const handleError = () => {
    setHasError(true);
    setIsGenerating(false);
  };
  
  const handleRetry = () => {
    setIsGenerating(true);
    setHasError(false);
    // Force a re-render of the ReportPreview component
    setShowPreview(false);
    setTimeout(() => setShowPreview(true), 100);
  };
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">{language === 'sv' ? 'Generera rapport' : 'Generate Report'}</h1>
      
      {!showPreview ? (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{language === 'sv' ? 'ROI-analysrapport' : 'ROI Analysis Report'}</CardTitle>
              <CardDescription>
                {language === 'sv' 
                  ? 'Generera en professionell rapport baserad på din analys'
                  : 'Generate a professional report based on your analysis'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {language === 'sv'
                  ? 'Rapporten kommer att innehålla en sammanfattning av din ROI-analys, med viktiga resultat från alla formulär:'
                  : 'The report will include a summary of your ROI analysis, highlighting the key findings from all forms:'
                }
              </p>
              <div className="p-4 bg-muted rounded-md">
                <h3 className="font-semibold mb-2">{language === 'sv' ? 'Rapportinnehåll' : 'Report Contents'}</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                  <li>{language === 'sv' ? 'Risk- och kostnadsöversikt (från Formulär C)' : 'Risk & Cost Overview (from Form C)'}</li>
                  <li>{language === 'sv' ? 'Interventionskostnader (från Formulär G, H, I)' : 'Intervention Costs (from Forms G, H, I)'}</li>
                  <li>{language === 'sv' ? 'Avkastning på investering (ROI) Analys (från Formulär J)' : 'Return on Investment (ROI) Analysis (from Form J)'}</li>
                  <li>{language === 'sv' ? 'Nyckeltal och beräkningar' : 'Key metrics and calculations'}</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href="/forms/form-j">
                <Button variant="outline">{language === 'sv' ? 'Tillbaka till formulär' : 'Back to Forms'}</Button>
              </Link>
              <Button onClick={handleGenerateReport} disabled={isGenerating}>
                {isGenerating 
                  ? (language === 'sv' ? 'Genererar...' : 'Generating...') 
                  : (language === 'sv' ? 'Generera rapport' : 'Generate Report')
                }
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>{language === 'sv' ? 'Språkval' : 'Language Selection'}</CardTitle>
              <CardDescription>
                {language === 'sv' ? 'Välj språk för din rapport' : 'Choose the language for your report'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <Button 
                  variant={language === 'en' ? 'default' : 'outline'} 
                  className="flex-1"
                  onClick={() => setLanguage('en')}
                >
                  English
                </Button>
                <Button 
                  variant={language === 'sv' ? 'default' : 'outline'} 
                  className="flex-1"
                  onClick={() => setLanguage('sv')}
                >
                  Swedish
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{language === 'sv' ? 'Förhandsgranskning av rapport' : 'Report Preview'}</h2>
            <div className="flex gap-2">
              {hasError && (
                <Button 
                  variant="outline" 
                  onClick={handleRetry}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  {language === 'sv' ? 'Försök igen' : 'Retry'}
                </Button>
              )}
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                {language === 'sv' ? 'Tillbaka till alternativ' : 'Back to Options'}
              </Button>
            </div>
          </div>
          
          <ReportPreview 
            onDownload={handleDownloadComplete} 
            onError={handleError}
            language={language}
            key={`${showPreview ? 'show' : 'hide'}-${language}`} // Force re-render when language changes
          />
          
          <div className="flex justify-between mt-8">
            <Link href="/dashboard">
              <Button variant="outline">{language === 'sv' ? 'Tillbaka till Dashboard' : 'Back to Dashboard'}</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 