"use client";

import { FormCard } from "@/components/ui/form-card";
import { FormAData } from "@/lib/utils/reportGenerator";

interface AppendixFormFProps {
  formData: FormAData;
  language?: 'sv' | 'en';
}

export function AppendixFormF({ formData, language = 'sv' }: AppendixFormFProps) {
  // Translation helper
  const t = (sv: string, en: string): string => {
    return language === 'sv' ? sv : en;
  };

  // Helper function to format numbers with thousand separators
  const formatNumber = (value: string | number | undefined | null): string => {
    if (value === undefined || value === null || value === '') {
      return '';
    }
    
    const num = typeof value === 'string' ? parseFloat(value.replace(/\s/g, '').replace(',', '.')) : value;
    if (isNaN(num)) {
      return '';
    }
    
    return num.toLocaleString(language === 'sv' ? 'sv-SE' : 'en-US');
  };

  return (
    <div className="space-y-6 print:text-black">
      <FormCard id="F" label={t("Beräkning av kostnader för lång sjukfrånvaro (dag 15 och framåt)", "Calculation of costs for long-term sick leave (day 15 and onwards)")}>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full border-collapse">
            <tbody>
              {/* Basic Information */}
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 w-24 font-medium">F1</td>
                <td className="border-r p-3 w-1/2">{t("Genomsnittlig månadslön:", "Average monthly salary:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formatNumber(formData.F1 || '')} {t('kr', 'SEK')}
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">F2</td>
                <td className="border-r p-3">{t("Kostnad för lång sjukfrånvaro per sjukdag i % av månadslön:", "Cost for long-term sick leave per sick day % of monthly salary:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formData.F2 || ''} %
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">F3</td>
                <td className="border-r p-3">{t("Kostnad för lång sjukfrånvaro per sjukdag, kr:", "Cost for long-term sick leave per sick day, SEK:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formatNumber(
                      formData.F1 && formData.F2 
                        ? (parseFloat(formData.F1) * parseFloat(formData.F2) / 100).toFixed(0) 
                        : ''
                    )} {t('kr', 'SEK')}
                  </div>
                </td>
              </tr>
              
              {/* Beräkning av antal sjukdagar */}
              <tr className="border-b bg-muted/10">
                <td colSpan={3} className="p-3 font-medium">
                  {t("Beräkning av antal sjukdagar", "Calculation of number of sick days")}
                </td>
              </tr>
              
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">F4</td>
                <td className="border-r p-3">{t("Antal anställda (motsvarande heltidstjänster/FTE):", "Number of employees (equivalent to full-time positions/FTE):")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formatNumber(formData.F4 || '')}
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">F5</td>
                <td className="border-r p-3">{t("Antal schemalagda arbetsdagar per år, per anställd:", "Number of scheduled working days per year, per employee:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formatNumber(formData.F5 || '')}
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">F6</td>
                <td className="border-r p-3">{t("Sjukfrånvaro, lång (dag 15 och framåt) i % av schemalagd arbetstid:", "Sick leave, long (day 15 and onwards) in % of scheduled working time:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formData.F6 || ''} %
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">F7</td>
                <td className="border-r p-3">{t("Antal sjukdagar totalt (lång sjukfrånvaro):", "Total number of sick days (long-term sick leave):")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formatNumber(
                      formData.F4 && formData.F5 && formData.F6 
                        ? (parseFloat(formData.F4) * parseFloat(formData.F5) * parseFloat(formData.F6) / 100).toFixed(0) 
                        : ''
                    )}
                  </div>
                </td>
              </tr>
              
              {/* Summering */}
              <tr className="border-b bg-muted/10">
                <td colSpan={3} className="p-3 font-medium">
                  {t("Summering", "Summary")}
                </td>
              </tr>
              
              <tr>
                <td className="border-r p-3 bg-muted/20 font-medium">F8</td>
                <td className="border-r p-3 font-medium">{t("Totala kostnader, lång sjukfrånvaro, överförs till C14:", "Total costs, long-term sick leave, transferred to C14:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border font-medium">
                    {formatNumber(formData.F8 || '')} {t('kr', 'SEK')}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </FormCard>
    </div>
  );
} 