"use client";

import { FormCard } from "@/components/ui/form-card";
import { FormAData } from "@/lib/utils/reportGenerator";

interface AppendixFormCProps {
  formData: FormAData;
  language?: 'sv' | 'en';
}

export function AppendixFormC({ formData, language = 'sv' }: AppendixFormCProps) {
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
      <FormCard id="C" label={t("Beräkningsmodell för ekonomiska konsekvenser", "Economic Impact Calculation Model")}>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full border-collapse">
            <tbody>
              {/* Basic Information */}
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 w-24 font-medium">C1</td>
                <td className="border-r p-3 w-1/2">{t("Organisationens namn:", "Organization name:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">{formData.A1 || ''}</div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">C2</td>
                <td className="border-r p-3">{t("Kontaktperson:", "Contact person:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">{formData.A2 || ''}</div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">C3</td>
                <td className="border-r p-3">{t("Tidsperiod (12 månader):", "Time period (12 months):")}</td>
                <td className="p-3 flex items-center">
                  <div className="p-2 bg-gray-50 rounded border flex-1">{formData.G3_start || ''}</div>
                  <div className="px-2">-</div>
                  <div className="p-2 bg-gray-50 rounded border flex-1">{formData.G3_end || ''}</div>
                </td>
              </tr>
              
              {/* Beräkning av kostnad för produktionsbortfall pga psykisk ohälsa */}
              <tr className="border-b bg-muted/10">
                <td colSpan={3} className="p-3 font-medium">
                  {t("Beräkning av kostnad för produktionsbortfall pga psykisk ohälsa", "Calculation of cost for production loss due to mental illness")}
                </td>
              </tr>
              
              {/* Personnel Costs - Fields */}
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">C4</td>
                <td className="border-r p-3">{t("Totala personalkostnader (lön + sociala + kringkostnader), kr per år:", "Total personnel costs (salary + social + overhead), SEK per year:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formatNumber(formData.D9)} {t('kr', 'SEK')}
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">C5</td>
                <td className="border-r p-3">{t("Vinst i företaget, kr per år:", "Company profit, SEK per year:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formatNumber(formData.C5 || '0')} {t('kr', 'SEK')}
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">C6</td>
                <td className="border-r p-3">{t("Summa, värde av arbete:", "Sum, value of work:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formatNumber(
                      formData.D9 && (formData.C5 || '0')
                        ? (parseFloat(formData.D9) + parseFloat(formData.C5 || '0')).toFixed(0) 
                        : formData.D9 || '0'
                    )} {t('kr', 'SEK')}
                  </div>
                </td>
              </tr>
              
              {/* Production Loss - Fields */}
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">C7</td>
                <td className="border-r p-3">{t("Andel av personalen med hög stressnivå (%):", "Proportion of staff with high stress level (%):")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formData.C7 || '0'} %
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">C8</td>
                <td className="border-r p-3">{t("Produktionsbortfall vid hög stressnivå (%):", "Production loss at high stress level (%):")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formData.C8 || '0'} %
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">C9</td>
                <td className="border-r p-3">{t("Totalt produktionsbortfall:", "Total production loss:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formData.C7 && formData.C8 
                      ? ((parseFloat(formData.C7) / 100) * (parseFloat(formData.C8) / 100) * 100).toFixed(1) 
                      : '0'} %
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">C10</td>
                <td className="border-r p-3">{t("Värde av produktionsbortfall (för över till ruta C18):", "Value of production loss (transfer to box C18):")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formatNumber(formData.C18 || '0')} {t('kr', 'SEK')}
                  </div>
                </td>
              </tr>
              
              {/* Short-term Sick Leave - Section Header */}
              <tr className="border-b bg-muted/10">
                <td colSpan={3} className="p-3 font-medium">
                  {t("Beräkning av kostnad för sjukfrånvaro pga psykisk ohälsa", "Calculation of cost for sick leave due to mental illness")}
                </td>
              </tr>
              
              {/* Short-term Sick Leave - Fields */}
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">C11</td>
                <td className="border-r p-3">{t("Total kostnad för kort sjukfrånvaro (dag 1-14), kr per år:", "Total cost of short-term sick leave (day 1-14), SEK per year:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formatNumber(formData.E8 || '0')} {t('kr', 'SEK')}
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">C12</td>
                <td className="border-r p-3">{t("Andel av kort sjukfrånvaro som beror på psykisk ohälsa:", "Proportion of short-term sick leave due to mental illness:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formData.C12 || '0'} %
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">C13</td>
                <td className="border-r p-3">{t("Kostnad för kort sjukfrånvaro beroende på psykisk ohälsa, kr per år:", "Cost of short-term sick leave due to mental illness, SEK per year:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formatNumber(
                      formData.E8 && formData.C12 
                        ? (parseFloat(formData.E8) * parseFloat(formData.C12) / 100).toFixed(0) 
                        : '0'
                    )} {t('kr', 'SEK')}
                  </div>
                </td>
              </tr>
              
              {/* Long-term Sick Leave - Fields */}
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">C14</td>
                <td className="border-r p-3">{t("Total kostnad för lång sjukfrånvaro (dag 15--), kr per år:", "Total cost of long-term sick leave (day 15--), SEK per year:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formatNumber(formData.F8 || '0')} {t('kr', 'SEK')}
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">C15</td>
                <td className="border-r p-3">{t("Andel av lång sjukfrånvaro som beror på psykisk ohälsa:", "Proportion of long-term sick leave due to mental illness:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formData.C15 || '0'} %
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">C16</td>
                <td className="border-r p-3">{t("Kostnad för lång sjukfrånvaro beroende på psykisk ohälsa, kr per år:", "Cost of long-term sick leave due to mental illness, SEK per year:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formatNumber(
                      formData.F8 && formData.C15 
                        ? (parseFloat(formData.F8) * parseFloat(formData.C15) / 100).toFixed(0) 
                        : '0'
                    )} {t('kr', 'SEK')}
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">C17</td>
                <td className="border-r p-3">{t("Kostnad för sjukfrånvaro beroende på psykisk ohälsa, kr per år:", "Cost of sick leave due to mental illness, SEK per year:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formatNumber(formData.C19 || '0')} {t('kr', 'SEK')}
                  </div>
                </td>
              </tr>
              
              {/* Total Cost - Section Header */}
              <tr className="border-b bg-muted/10">
                <td colSpan={3} className="p-3 font-medium">
                  {t("Summering av kostnad pga psykisk ohälsa", "Summary of cost due to mental illness")}
                </td>
              </tr>
              
              {/* Total Cost - Fields */}
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">C18</td>
                <td className="border-r p-3">{t("Värde av produktionsbortfall, kr per år:", "Value of production loss, SEK per year:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formatNumber(formData.C18 || '0')} {t('kr', 'SEK')}
                  </div>
                </td>
              </tr>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 font-medium">C19</td>
                <td className="border-r p-3">{t("Kostnad för sjukfrånvaro beroende på psykisk ohälsa, kr per år:", "Cost of sick leave due to mental illness, SEK per year:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">
                    {formatNumber(formData.C19 || '0')} {t('kr', 'SEK')}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border-r p-3 bg-muted/20 font-medium">C20</td>
                <td className="border-r p-3 font-medium">{t("Total kostnad för psykisk ohälsa, kr per år:", "Total cost of mental illness, SEK per year:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border font-medium">
                    {formatNumber(formData.C20 || '0')} {t('kr', 'SEK')}
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