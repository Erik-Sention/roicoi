"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Download, RefreshCw } from "lucide-react";
import { fetchReportData, generatePDFReport, FormAData, formatNumber } from '@/lib/utils/reportGenerator';
import { toast } from "@/components/ui/use-toast";
import styles from './ReportPreview.module.css';
import { ReportAppendix } from './ReportAppendix';

interface ReportPreviewProps {
  onDownload?: () => void;
  onError?: () => void;
  language?: 'sv' | 'en';
}

export function ReportPreview({ onDownload, onError, language = 'sv' }: ReportPreviewProps) {
  const [reportData, setReportData] = useState<FormAData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [missingForms, setMissingForms] = useState<string[]>([]);
  
  // Translation helper
  const t = useCallback((sv: string, en: string) => {
    return language === 'sv' ? sv : en;
  }, [language]);
  
  const loadReportData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setMissingForms([]);
    
    try {
      console.log('ReportPreview: Starting to load report data...');
      // Check if the user is authenticated
      const data = await fetchReportData();
      
      // Validate that we have at least some data
      if (!data) {
        throw new Error(t(
          'Ingen rapportdata tillgänglig. Se till att du har fyllt i alla formulär.',
          'No report data available. Please make sure you have completed all the forms.'
        ));
      }
      
      // Check for missing or incomplete forms
      const missing: string[] = [];
      
      // Check Form A (basic information)
      if (!data.A1 && !data.A2) {
        missing.push(t('Form A (Verksamhetsanalys)', 'Form A (Business Analysis)'));
      }
      
      // Check Form B (insats)
      if (!data.B3 && !data.B4) {
        missing.push(t('Form B (Verksamhetsanalys - insats)', 'Form B (Business Analysis - intervention)'));
      }
      
      // Check Form C (ekonomiska konsekvenser)
      if (!data.C7 && !data.C20) {
        missing.push(t('Form C (Beräkningsmodell för ekonomiska konsekvenser)', 'Form C (Economic Impact Calculation Model)'));
      }
      
      // Set missing forms
      if (missing.length > 0) {
        console.warn('Missing or incomplete forms:', missing);
        setMissingForms(missing);
      }
      
      // Set the report data
      console.log('ReportPreview: Report data loaded successfully:', data);
      setReportData(data);
    } catch (err) {
      console.error('ReportPreview: Error loading report data:', err);
      
      // Set a user-friendly error message
      setError(err instanceof Error 
        ? err 
        : new Error(t(
            'Misslyckades med att ladda rapportdata. Se till att du har fyllt i alla formulär.',
            'Failed to load report data. Please make sure you have completed all the forms.'
          ))
      );
      
      // Show error toast
      toast({
        title: t("Fel vid laddning av rapportdata", "Error Loading Report Data"),
        description: err instanceof Error 
          ? err.message 
          : t(
              "Misslyckades med att ladda rapportdata. Försök igen.",
              "Failed to load report data. Please try again."
            ),
        variant: "destructive",
      });
      
      // Call the onError callback if provided
      if (onError) {
        onError();
      }
    } finally {
      setIsLoading(false);
    }
  }, [onError, t]);
  
  useEffect(() => {
    loadReportData();
  }, [loadReportData]);
  
  const handleDownload = async () => {
    if (!reportData) return;
    
    try {
      console.log('ReportPreview: Starting to generate PDF...');
      // Create a new instance of jsPDF
      const doc = await generatePDFReport(reportData, language);
      
      // Save the PDF with a formatted filename
      const filename = language === 'sv' 
        ? `ROI_Analysrapport_${new Date().toISOString().split('T')[0]}.pdf`
        : `ROI_Analysis_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      
      console.log(`ReportPreview: Saving PDF as ${filename}...`);
      doc.save(filename);
      
      console.log('ReportPreview: PDF generated and saved successfully');
      // Call the onDownload callback if provided
      if (onDownload) {
        onDownload();
      }
    } catch (err) {
      console.error('ReportPreview: Error generating PDF:', err);
      
      // Set the error state to display the error message
      setError(err instanceof Error 
        ? err 
        : new Error(t(
            'Misslyckades med att generera PDF. Se till att all nödvändig data är tillgänglig.',
            'Failed to generate PDF. Please make sure all required data is available.'
          ))
      );
      
      // Show error toast
      toast({
        title: t("Fel vid generering av rapport", "Error Generating Report"),
        description: err instanceof Error 
          ? err.message 
          : t(
              "Misslyckades med att generera PDF. Försök igen.",
              "Failed to generate PDF. Please try again."
            ),
        variant: "destructive",
      });
      
      // Call the onError callback if provided
      if (onError) {
        onError();
      }
    }
  };
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/2" />
            
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t('Fel', 'Error')}</AlertTitle>
        <AlertDescription>
          {error.message}
          <div className="mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadReportData}
              className="mt-2"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('Försök igen', 'Retry')}
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!reportData) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t('Ingen data', 'No Data')}</AlertTitle>
        <AlertDescription>
          {t(
            'Ingen rapportdata tillgänglig. Se till att du har fyllt i alla formulär.',
            'No report data available. Please make sure you have completed all the forms.'
          )}
          <div className="mt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadReportData}
              className="mt-2"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('Uppdatera', 'Refresh')}
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className={`space-y-8 ${styles.reportContainer}`}>
          {missingForms.length > 0 && (
            <Alert variant="warning" className={`mb-4 ${styles.warningAlert}`}>
              <AlertCircle className={`h-4 w-4 ${styles.warningIcon}`} />
              <AlertTitle>{t('Varning: Saknade eller ofullständiga formulär', 'Warning: Missing or incomplete forms')}</AlertTitle>
              <AlertDescription>
                <p>{t('Följande formulär verkar saknas eller är ofullständiga:', 'The following forms appear to be missing or incomplete:')}</p>
                <ul className="list-disc list-inside mt-2">
                  {missingForms.map((form, index) => (
                    <li key={index}>{form}</li>
                  ))}
                </ul>
                <p className="mt-2">{t('Rapporten kommer att genereras med standardvärden för dessa formulär.', 'The report will be generated with default values for these forms.')}</p>
              </AlertDescription>
            </Alert>
          )}
          
          {/* Cover Page & Executive Summary */}
          <div className="text-center mb-8">
            <h2 className={`text-2xl font-bold ${styles.titleText}`}>{t('ROI-analysrapport', 'ROI Analysis Report')}</h2>
            <p className={`mt-2 ${styles.bodyText}`}>
              {reportData.A1 || t('Organisationsnamn', 'Organization Name')}
            </p>
            <p className={styles.bodyText}>
              {t('Kontaktperson', 'Contact Person')}: {reportData.A2 || t('Ej angivet', 'Not specified')}
            </p>
            <p className={styles.bodyText}>
              {t('Datum', 'Date')}: {new Date().toLocaleDateString(language === 'sv' ? 'sv-SE' : 'en-US')}
            </p>
          </div>
          
          {/* Executive Summary */}
          <div className="mb-8">
            <div className="bg-slate-100 p-3 rounded-t-md border-b border-slate-300">
              <h3 className={`text-lg font-semibold ${styles.titleText}`}>{t('Sammanfattning', 'Executive Summary')}</h3>
            </div>
            <div className="border border-t-0 border-slate-200 rounded-b-md p-4">
              <p className={`mb-4 ${styles.bodyText}`}>
                {t(
                  `Denna rapport presenterar en analys av de ekonomiska konsekvenserna av psykisk ohälsa inom ${reportData.A1 || 'organisationen'} samt förväntad avkastning på investeringar i förebyggande åtgärder. Analysen visar att organisationen förlorar cirka ${formatNumber(reportData.C20) || '0'} kr per år på grund av psykisk ohälsa, men kan uppnå en ROI på ${reportData.J11 || '0'}% genom att investera i förebyggande insatser.`,
                  `This report presents an analysis of the economic impact of mental health issues within ${reportData.A1 || 'the organization'} and the expected return on investment in preventive measures. The analysis shows that the organization loses approximately ${formatNumber(reportData.C20) || '0'} SEK per year due to mental health issues, but can achieve an ROI of ${reportData.J11 || '0'}% by investing in preventive measures.`
                )}
              </p>
              
              {/* Key Metrics */}
              <h4 className="font-semibold mb-3 mt-4">{t('Nyckeltal', 'Key Metrics')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                  <p className="text-sm text-slate-500">{t('Total kostnad för psykisk ohälsa per år', 'Total cost of mental health issues per year')}</p>
                  <p className="text-xl font-bold">{formatNumber(reportData.C20) || '0'} {t('kr', 'SEK')}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                  <p className="text-sm text-slate-500">{t('ROI för förebyggande insatser', 'ROI for preventive measures')}</p>
                  <p className="text-xl font-bold">{reportData.J11 || '0'}%</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                  <p className="text-sm text-slate-500">{t('Investering i förebyggande insatser', 'Investment in preventive measures')}</p>
                  <p className="text-xl font-bold">{formatNumber(reportData.G34 || reportData.G34_total) || '0'} {t('kr', 'SEK')}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                  <p className="text-sm text-slate-500">{t('Förväntad ekonomisk nytta per år', 'Expected economic benefit per year')}</p>
                  <p className="text-xl font-bold">{formatNumber(reportData.J7) || '0'} {t('kr', 'SEK')}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Business Analysis - Understanding the Problem */}
          <div className="mb-8">
            <div className="bg-slate-100 p-3 rounded-t-md border-b border-slate-300">
              <h3 className={`text-lg font-semibold ${styles.titleText}`}>Nuvarande situation och riskanalys</h3>
            </div>
            <div className="border border-t-0 border-slate-200 rounded-b-md p-4">
              <p className={`mb-4 ${styles.bodyText}`}>
                Företaget {reportData.A1 || 'Ej angivet'} har identifierat utmaningar relaterade till psykisk ohälsa bland personalen. {reportData.A4_description || reportData.A4 || 'Ej angivet'}
              </p>
              
              {/* Key Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                  <p className="text-sm text-slate-500">Andel av personalen med hög stressnivå</p>
                  <p className="text-xl font-bold">{reportData.C7 || '0'}%</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                  <p className="text-sm text-slate-500">Produktionsbortfall vid hög stressnivå</p>
                  <p className="text-xl font-bold">{reportData.C8 || '0'}%</p>
                </div>
              </div>
              
              {/* Simulated Bar Chart */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Andel av personalen med hög stressnivå</h4>
                <div className="h-10 bg-slate-100 rounded-md relative overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 absolute left-0 top-0"
                    style={{ width: `${reportData.C7 || '0'}%` }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                    {reportData.C7 || '0'}% med hög stress
                </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Economic Impact - The Financial Costs of Inaction */}
          <div className="mb-8">
            <div className="bg-slate-100 p-3 rounded-t-md border-b border-slate-300">
              <h3 className={`text-lg font-semibold ${styles.titleText}`}>{t('Ekonomiska konsekvenser av psykisk ohälsa', 'Economic Impact of Mental Health Issues')}</h3>
            </div>
            <div className="border border-t-0 border-slate-200 rounded-b-md p-4">
              <p className={`mb-4 ${styles.bodyText}`}>
                {t(
                  `Om inga åtgärder vidtas kommer företaget att förlora cirka ${formatNumber(reportData.C20) || '0'} kr per år på grund av psykisk ohälsa. Produktionsbortfall står för ${formatNumber(reportData.C18) || '0'} kr, medan sjukfrånvarokostnader beräknas uppgå till ${formatNumber(reportData.C19) || '0'} kr.`,
                  `If no action is taken, the company will lose approximately ${formatNumber(reportData.C20) || '0'} SEK per year due to mental health issues. Production loss accounts for ${formatNumber(reportData.C18) || '0'} SEK, while sick leave costs are estimated at ${formatNumber(reportData.C19) || '0'} SEK.`
                )}
              </p>
              
              {/* Financial Breakdown Table */}
              <div className="overflow-hidden border rounded-md mb-6">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('Ekonomisk påverkan', 'Economic Impact')}</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">{t('Värde (SEK/år)', 'Value (SEK/year)')}</th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">{t('Andel', 'Percentage')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-900">{t('Produktionsbortfall', 'Production Loss')}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-900 text-right">{formatNumber(reportData.C18) || '0'} {t('kr', 'SEK')}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-900 text-right">
                        {reportData.C18 && reportData.C20 ? Math.round((parseFloat(reportData.C18) / parseFloat(reportData.C20)) * 100) : 0}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-900">{t('Korttidssjukfrånvaro', 'Short-term Sick Leave')}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-900 text-right">{formatNumber(reportData.C13) || '0'} {t('kr', 'SEK')}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-900 text-right">
                        {reportData.C13 && reportData.C20 ? Math.round((parseFloat(reportData.C13) / parseFloat(reportData.C20)) * 100) : 0}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-900">{t('Långtidssjukfrånvaro', 'Long-term Sick Leave')}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-900 text-right">{formatNumber(reportData.C16) || '0'} {t('kr', 'SEK')}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-900 text-right">
                        {reportData.C16 && reportData.C20 ? Math.round((parseFloat(reportData.C16) / parseFloat(reportData.C20)) * 100) : 0}%
                      </td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-900">{t('Totalt', 'Total')}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-900 text-right">{formatNumber(reportData.C20) || '0'} {t('kr', 'SEK')}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-900 text-right">100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Improved Visual Distribution */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3">{t('Visuell fördelning', 'Visual Distribution')}</h4>
                
                {/* Horizontal stacked bar chart */}
                <div className="h-10 bg-slate-100 rounded-md overflow-hidden relative">
                  {/* Calculate percentages */}
                  {(() => {
                    const total = parseFloat(reportData.C20 || '0');
                    const productionLoss = parseFloat(reportData.C18 || '0');
                    const shortTermSickLeave = parseFloat(reportData.C13 || '0');
                    const longTermSickLeave = parseFloat(reportData.C16 || '0');
                    
                    const productionLossPercent = total > 0 ? (productionLoss / total) * 100 : 0;
                    const shortTermPercent = total > 0 ? (shortTermSickLeave / total) * 100 : 0;
                    const longTermPercent = total > 0 ? (longTermSickLeave / total) * 100 : 0;
                    
                    return (
                      <>
                        <div 
                          className="h-full bg-blue-500 absolute left-0 top-0 flex items-center justify-center"
                          style={{ width: `${productionLossPercent}%` }}
                        >
                          {productionLossPercent >= 10 && (
                            <span className="text-xs text-white font-medium">{Math.round(productionLossPercent)}%</span>
                          )}
                        </div>
                        <div 
                          className="h-full bg-green-500 absolute top-0 flex items-center justify-center"
                          style={{ left: `${productionLossPercent}%`, width: `${shortTermPercent}%` }}
                        >
                          {shortTermPercent >= 10 && (
                            <span className="text-xs text-white font-medium">{Math.round(shortTermPercent)}%</span>
                          )}
                        </div>
                        <div 
                          className="h-full bg-red-500 absolute top-0 flex items-center justify-center"
                          style={{ left: `${productionLossPercent + shortTermPercent}%`, width: `${longTermPercent}%` }}
                        >
                          {longTermPercent >= 10 && (
                            <span className="text-xs text-white font-medium">{Math.round(longTermPercent)}%</span>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
                
                {/* Legend */}
                <div className="flex flex-wrap mt-3 gap-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 mr-2"></div>
                    <span className="text-sm">{t('Produktionsbortfall', 'Production Loss')}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 mr-2"></div>
                    <span className="text-sm">{t('Korttidssjukfrånvaro', 'Short-term Sick Leave')}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 mr-2"></div>
                    <span className="text-sm">{t('Långtidssjukfrånvaro', 'Long-term Sick Leave')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recommended Interventions & Strategy */}
          <div className="mb-8">
            <div className="bg-slate-100 p-3 rounded-t-md border-b border-slate-300">
              <h3 className={`text-lg font-semibold ${styles.titleText}`}>Föreslagna insatser och förväntad effekt</h3>
            </div>
            <div className="border border-t-0 border-slate-200 rounded-b-md p-4">
              <p className={`mb-4 ${styles.bodyText}`}>
                För att adressera dessa utmaningar har företaget valt att implementera {reportData.B3 || 'insatser'} som första åtgärd. {reportData.B5 || 'Syftet är att identifiera anställda med hög stressnivå och vidta åtgärder för att minska risken för sjukskrivning och utbrändhet.'} {reportData.B8 || ''}
              </p>
              
              {/* Intervention Table */}
              <div className="overflow-hidden border rounded-md mb-6">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Insats</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Detaljer</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-900">Insatsnamn</td>
                      <td className="px-4 py-2 text-sm text-slate-900">{reportData.B3 || 'Ej angivet'}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-900">Syfte</td>
                      <td className="px-4 py-2 text-sm text-slate-900">{reportData.B5 || 'Ej angivet'}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-900">Förväntad effekt</td>
                      <td className="px-4 py-2 text-sm text-slate-900">Sänkt stressnivå med {reportData.J6 || '0'}%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-900">Kostnad (SEK)</td>
                      <td className="px-4 py-2 text-sm text-slate-900">{formatNumber(reportData.G34 || reportData.G34_total) || '0'} kr</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Financial Return - ROI Analysis */}
          <div className="mb-8">
            <div className="bg-slate-100 p-3 rounded-t-md border-b border-slate-300">
              <h3 className={`text-lg font-semibold ${styles.titleText}`}>Förväntad ekonomisk nytta och ROI</h3>
            </div>
            <div className="border border-t-0 border-slate-200 rounded-b-md p-4">
              <p className={`mb-4 ${styles.bodyText}`}>
                Genom att investera {formatNumber(reportData.G34 || reportData.G34_total) || '0'} kr i stressförebyggande åtgärder förväntas företaget minska sjukskrivningskostnaderna och produktionsbortfallet avsevärt. Beräkningarna visar att den förväntade ekonomiska nyttan är {formatNumber(reportData.J7) || '0'} kr per år, vilket resulterar i en ROI på {reportData.J11 || '0'}%.
              </p>
              
              {/* Financial Impact Summary */}
              <div className="overflow-hidden border rounded-md mb-6">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nyckeltal</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Värde</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-900">Total investering</td>
                      <td className="px-4 py-2 text-sm text-slate-900">{formatNumber(reportData.G34 || reportData.G34_total) || '0'} kr</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-900">Förväntad besparing</td>
                      <td className="px-4 py-2 text-sm text-slate-900">{formatNumber(reportData.J7) || '0'} kr</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-900">ROI (%)</td>
                      <td className="px-4 py-2 text-sm text-slate-900">{reportData.J11 || '0'}%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-900">Break-even nivå (%)</td>
                      <td className="px-4 py-2 text-sm text-slate-900">{reportData.J17 || '0'}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Simulated Bar Chart */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Investering vs. Förväntad nytta</h4>
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="h-24 bg-slate-100 rounded-md relative">
                      <div 
                        className="w-full bg-blue-500 absolute bottom-0 left-0"
                        style={{ 
                          height: `${Math.min(100, (parseFloat(reportData.G34 || reportData.G34_total || '0') / Math.max(parseFloat(reportData.G34 || reportData.G34_total || '0'), parseFloat(reportData.J7 || '0'))) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-center mt-2 text-sm">Investering</p>
                    <p className="text-center font-medium">{formatNumber(reportData.G34 || reportData.G34_total) || '0'} kr</p>
                </div>
                <div>
                    <div className="h-24 bg-slate-100 rounded-md relative">
                      <div 
                        className="w-full bg-green-500 absolute bottom-0 left-0"
                        style={{ 
                          height: `${Math.min(100, (parseFloat(reportData.J7 || '0') / Math.max(parseFloat(reportData.G34 || reportData.G34_total || '0'), parseFloat(reportData.J7 || '0'))) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-center mt-2 text-sm">Förväntad nytta (år 1)</p>
                    <p className="text-center font-medium">{formatNumber(reportData.J7) || '0'} kr</p>
                  </div>
                </div>
              </div>
                </div>
              </div>
              
          {/* Conclusion & Next Steps */}
          <div className="mb-8">
            <div className="bg-slate-100 p-3 rounded-t-md border-b border-slate-300">
              <h3 className={`text-lg font-semibold ${styles.titleText}`}>Slutsats och nästa steg</h3>
                </div>
            <div className="border border-t-0 border-slate-200 rounded-b-md p-4">
              <p className={`mb-4 ${styles.bodyText}`}>
                Denna rapport visar att psykisk ohälsa har en betydande ekonomisk påverkan på företaget, men att strategiska insatser kan minska dessa kostnader och förbättra arbetsmiljön. Vi rekommenderar att {reportData.B3 || 'insatsen'} genomförs inom nästa 3 månader, med en uppföljande analys efter 12 månader.
              </p>
              
              {/* Action Plan Table */}
              <div className="overflow-hidden border rounded-md">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Åtgärd</th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tidsplan</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    <tr>
                      <td className="px-4 py-2 text-sm text-slate-900">Implementera {reportData.B3 || 'insats'}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-900">Nästa 3 mån</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm text-slate-900">Analysera resultat</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-900">12 mån efter start</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 text-sm text-slate-900">Justera åtgärdsplan</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-900">Baserat på resultat</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Add the appendix section back */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">{t('Appendix', 'Appendix')}</h2>
            <ReportAppendix formData={reportData} language={language} />
          </div>
          
          {/* Download button */}
          <div className="flex justify-end mt-6">
            <Button 
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {t('Ladda ner rapport', 'Download Report')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 