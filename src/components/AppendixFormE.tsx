"use client";

import { FormCard } from "@/components/ui/form-card";
import { FormAData } from "@/lib/utils/reportGenerator";

interface AppendixFormEProps {
  formData: FormAData;
  language?: 'sv' | 'en';
}

export function AppendixFormE({ formData, language = 'sv' }: AppendixFormEProps) {
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
      <FormCard id="E" label={t("Beräkning av kostnader för kort sjukfrånvaro (dag 1–14)", "Calculation of costs for short-term sick leave (day 1-14)")}>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full border-collapse">
            <tbody>
              {/* Basic Information */}
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 w-24 font-medium">E1</td>
                <td className="border-r p-3 w-1/2">{t("Genomsnittlig månadslön:", "Average monthly salary:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formatNumber(formData.E1 || '')} {t('kr', 'SEK')}
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">E2</td>
                <td className="border-r p-3">{t("Kostnad för kort sjukfrånvaro per sjukdag % av månadslön:", "Cost for short-term sick leave per sick day % of monthly salary:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formData.E2 || ''} %
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">E3</td>
                <td className="border-r p-3">{t("Kostnad för kort sjukfrånvaro per sjukdag, kr:", "Cost for short-term sick leave per sick day, SEK:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formatNumber(
                      formData.E1 && formData.E2 
                        ? (parseFloat(formData.E1) * parseFloat(formData.E2) / 100).toFixed(0) 
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
                <td className="border-r p-3 bg-muted/20 font-medium">E4</td>
                <td className="border-r p-3">{t("Antal anställda (motsvarande heltidstjänster/FTE):", "Number of employees (equivalent to full-time positions/FTE):")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formatNumber(formData.E4 || '')}
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">E5</td>
                <td className="border-r p-3">{t("Antal schemalagda arbetsdagar per år, per anställd:", "Number of scheduled working days per year, per employee:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formatNumber(formData.E5 || '')}
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">E6</td>
                <td className="border-r p-3">{t("Sjukfrånvaro, kort (dag 1-14) i % av schemalagd arbetstid:", "Sick leave, short (day 1-14) in % of scheduled working time:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formData.E6 || ''} %
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">E7</td>
                <td className="border-r p-3">{t("Antal sjukdagar totalt (kort sjukfrånvaro):", "Total number of sick days (short-term sick leave):")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formatNumber(
                      formData.E4 && formData.E5 && formData.E6 
                        ? (parseFloat(formData.E4) * parseFloat(formData.E5) * parseFloat(formData.E6) / 100).toFixed(0) 
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
                <td className="border-r p-3 bg-muted/20 font-medium">E8</td>
                <td className="border-r p-3 font-medium">{t("Totala kostnader, kort sjukfrånvaro, överförs till C11:", "Total costs, short-term sick leave, transferred to C11:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border font-medium">
                    {formatNumber(formData.E8 || '')} {t('kr', 'SEK')}
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