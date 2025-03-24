"use client";

import { FormCard } from "@/components/ui/form-card";
import { FormAData } from "@/lib/utils/reportGenerator";

interface AppendixFormDProps {
  formData: FormAData;
  language?: 'sv' | 'en';
}

export function AppendixFormD({ formData, language = 'sv' }: AppendixFormDProps) {
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
      <FormCard id="D" label={t("Beräkning av personalkostnader", "Calculation of Personnel Costs")}>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full border-collapse">
            <tbody>
              {/* Basic Information */}
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 w-24 font-medium">D1</td>
                <td className="border-r p-3 w-1/2">{t("Genomsnittlig månadslön:", "Average monthly salary:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formatNumber(formData.D1 || '')} {t('kr', 'SEK')}
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">D2</td>
                <td className="border-r p-3">{t("Sociala avgifter inkl arb.givaravgift, tjänstepension och försäkringar (%):", "Social security contributions incl. employer's contribution, occupational pension and insurance (%):")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formData.D2 || ''} %
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">D3</td>
                <td className="border-r p-3">{t("Genomsnittliga sociala avgifter per månad:", "Average social security contributions per month:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formatNumber(
                      formData.D1 && formData.D2 
                        ? (parseFloat(formData.D1) * parseFloat(formData.D2) / 100).toFixed(0) 
                        : ''
                    )} {t('kr', 'SEK')}
                  </div>
                </td>
              </tr>
              
              {/* Beräkning av lönekostnader */}
              <tr className="border-b bg-muted/10">
                <td colSpan={3} className="p-3 font-medium">
                  {t("Beräkning av lönekostnader", "Calculation of salary costs")}
                </td>
              </tr>
              
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">D4</td>
                <td className="border-r p-3">{t("Antal anställda (motsvarande heltidstjänster/FTE):", "Number of employees (equivalent to full-time positions/FTE):")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formatNumber(formData.D4 || '')}
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">D5</td>
                <td className="border-r p-3">{t("Antal månader som beräkningen avser:", "Number of months that the calculation refers to:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formData.D5 || ''}
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">D6</td>
                <td className="border-r p-3">{t("Totala lönekostnader, kr:", "Total salary costs, SEK:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formatNumber(
                      formData.D1 && formData.D4 && formData.D5 
                        ? (parseFloat(formData.D1) * parseFloat(formData.D4) * parseFloat(formData.D5)).toFixed(0) 
                        : ''
                    )} {t('kr', 'SEK')}
                  </div>
                </td>
              </tr>
              
              {/* Beräkning av personalkringkostnader */}
              <tr className="border-b bg-muted/10">
                <td colSpan={3} className="p-3 font-medium">
                  {t("Beräkning av personalkringkostnader", "Calculation of personnel overhead costs")}
                </td>
              </tr>
              
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">D7</td>
                <td className="border-r p-3">{t("Personalkringkostnader i % av lönekostnader:", "Personnel overhead costs as % of salary costs:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formData.D7 || ''} %
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">D8</td>
                <td className="border-r p-3">{t("Totala personalkringkostnader, kr:", "Total personnel overhead costs, SEK:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formatNumber(
                      formData.D6 && formData.D7 
                        ? (parseFloat(formData.D6) * parseFloat(formData.D7) / 100).toFixed(0) 
                        : ''
                    )} {t('kr', 'SEK')}
                  </div>
                </td>
              </tr>
              
              {/* Summering */}
              <tr className="border-b bg-muted/10">
                <td colSpan={3} className="p-3 font-medium">
                  {t("Summering", "Summary")}
                </td>
              </tr>
              
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">D9</td>
                <td className="border-r p-3 font-medium">{t("Totala personalkostnader, kr. Överförs till C4:", "Total personnel costs, SEK. Transferred to C4:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border font-medium">
                    {formatNumber(formData.D9 || '')} {t('kr', 'SEK')}
                  </div>
                </td>
              </tr>
              
              {/* Beräkning av personalkostnad per arbetad timme */}
              <tr className="border-b bg-muted/10">
                <td colSpan={3} className="p-3 font-medium">
                  {t("Beräkning av personalkostnad per arbetad timme", "Calculation of personnel cost per worked hour")}
                </td>
              </tr>
              
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">D10</td>
                <td className="border-r p-3">{t("Schemalagd arbetstid (timmar) per år:", "Scheduled working hours per year:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formatNumber(formData.D10 || '')}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border-r p-3 bg-muted/20 font-medium">D11</td>
                <td className="border-r p-3 font-medium">{t("Personalkostnad kr. per arbetad timme.", "Personnel cost SEK. per worked hour.")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border font-medium">
                    {formatNumber(
                      formData.D9 && formData.D10 && formData.D4 
                        ? (parseFloat(formData.D9) / (parseFloat(formData.D10) * parseFloat(formData.D4))).toFixed(0) 
                        : ''
                    )} {t('kr', 'SEK')}
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