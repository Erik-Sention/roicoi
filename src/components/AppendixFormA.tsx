"use client";

import { FormCard, FormSection } from "@/components/ui/form-card";
import { FormAData } from "@/lib/utils/reportGenerator";

interface AppendixFormAProps {
  formData: FormAData;
  language?: 'sv' | 'en';
}

export function AppendixFormA({ formData, language = 'sv' }: AppendixFormAProps) {
  // Translation helper
  const t = (sv: string, en: string): string => {
    return language === 'sv' ? sv : en;
  };

  return (
    <div className="space-y-6 print:text-black">
      <FormCard id="A" label={t("Verksamhetsanalys", "Business Analysis")}>
        {/* Basic Information */}
        <div className="border rounded-md mb-4 overflow-hidden">
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 w-24 font-medium">A1</td>
                <td className="border-r p-3 w-1/3">{t("Organisationens namn:", "Organization name:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">{formData.A1 || ''}</div>
                </td>
              </tr>
              <tr>
                <td className="border-r p-3 bg-muted/20 font-medium">A2</td>
                <td className="border-r p-3">{t("Kontaktperson:", "Contact person:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">{formData.A2 || ''}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Step 1 */}
        <FormSection 
          title={t("Steg 1 - Definition av verksamheten", "Step 1 - Definition of the business")}
          description={t("Ta med t ex: Organisatorisk del, personalkategori, el dyl", "Include e.g.: Organizational part, staff category, etc.")}
        >
          <div className="border rounded-b-md overflow-hidden">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border-r p-3 bg-muted/20 w-24 font-medium">A3</td>
                  <td className="p-3">
                    <div className="p-2 bg-gray-50 rounded border min-h-[80px] whitespace-pre-wrap">
                      {formData.A3 || ''}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </FormSection>
        
        {/* Step 2 */}
        <FormSection 
          title={t("Steg 2 - Nulägesbeskrivning, psykisk hälsa", "Step 2 - Current situation description, mental health")}
          description={t("Ta med t ex: Problem, konsekvenser, ekonomi", "Include e.g.: Problems, consequences, economy")}
        >
          <div className="border rounded-b-md overflow-hidden">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border-r p-3 bg-muted/20 w-24 font-medium align-top" rowSpan={4}>A4</td>
                  <td className="p-3" colSpan={2}>
                    <div className="p-2 bg-gray-50 rounded border min-h-[100px] whitespace-pre-wrap">
                      {formData.A4_description || ''}
                    </div>
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="border-r p-3 w-1/2">{t("Andel av personalen med hög stressnivå:", "Proportion of staff with high stress level:")}</td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-50 rounded border w-20">
                        {formData.A4_stress_percentage || '0'}
                      </div>
                      <span className="ml-2">%</span>
                    </div>
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="border-r p-3">{t("Värde av produktionsbortfall, kr per år:", "Value of production loss, SEK per year:")}</td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-50 rounded border w-full">
                        {formData.A4_production_loss || '0'}
                      </div>
                      <span className="ml-2">{t("kr", "SEK")}</span>
                    </div>
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="border-r p-3">{t("Kostnad för sjukfrånvaro beroende på psykisk ohälsa, kr per år:", "Cost of sick leave due to mental illness, SEK per year:")}</td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <div className="p-2 bg-gray-50 rounded border w-full">
                        {formData.A4_sick_leave_cost || '0'}
                      </div>
                      <span className="ml-2">{t("kr", "SEK")}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </FormSection>
        
        {/* Step 3 */}
        <FormSection 
          title={t("Steg 3 - Orsaksanalys och riskbedömning", "Step 3 - Cause analysis and risk assessment")}
          description={t("Ta med t ex: Problemorsaker, bakomliggande orsaker", "Include e.g.: Problem causes, underlying causes")}
        >
          <div className="border rounded-b-md overflow-hidden">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border-r p-3 bg-muted/20 w-24 font-medium">A5</td>
                  <td className="p-3">
                    <div className="p-2 bg-gray-50 rounded border min-h-[100px] whitespace-pre-wrap">
                      {formData.A5 || ''}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </FormSection>
        
        {/* Step 4 */}
        <FormSection 
          title={t("Steg 4 - Målformulering och Behovsanalys", "Step 4 - Goal formulation and Needs analysis")}
          description={t("Ta med t ex: Mål, behov att åtgärda, prioriteringar", "Include e.g.: Goals, needs to address, priorities")}
        >
          <div className="border rounded-b-md overflow-hidden">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border-r p-3 bg-muted/20 w-24 font-medium">A6</td>
                  <td className="p-3">
                    <div className="p-2 bg-gray-50 rounded border min-h-[100px] whitespace-pre-wrap">
                      {formData.A6 || ''}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </FormSection>
        
        {/* Step 5 */}
        <FormSection 
          title={t("Steg 5 - Val av lämpliga insatser", "Step 5 - Selection of appropriate interventions")}
          description={t("Ta med t ex: Beskrivning, syfte, mål, stöd för verksamhetens mål, alternativ, genomförandeplan och insatskostnad. ALTERNATIV: fyll i B för resp. insats", "Include e.g.: Description, purpose, goals, support for business goals, alternatives, implementation plan and intervention cost. ALTERNATIVE: fill in B for each intervention")}
        >
          <div className="border rounded-b-md overflow-hidden">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border-r p-3 bg-muted/20 w-24 font-medium">A7</td>
                  <td className="p-3">
                    <div className="p-2 bg-gray-50 rounded border min-h-[120px] whitespace-pre-wrap">
                      {formData.A7 || ''}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </FormSection>
        
        {/* Step 6 */}
        <FormSection 
          title={t("Steg 6 - Ekonomiskt beslutsunderlag", "Step 6 - Economic decision basis")}
          description={t("Insatskostnaden i relation till förväntad effekt. Beräkningar görs i formulär C - J.", "Intervention cost in relation to expected effect. Calculations are made in forms C - J.")}
        >
          <div className="border rounded-b-md overflow-hidden">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border-r p-3 bg-muted/20 w-24 font-medium">A8</td>
                  <td className="p-3">
                    <div className="p-2 bg-gray-50 rounded border min-h-[80px] whitespace-pre-wrap">
                      {formData.A8 || ''}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </FormSection>
        
        {/* Step 7 */}
        <FormSection 
          title={t("Steg 7 - Rekommendation för beslut", "Step 7 - Recommendation for decision")}
          description={t("Ta med tex: vilken insats som rekommenderas alt. för- och nackdelar med vald insats för organisationen.", "Include e.g.: which intervention is recommended or pros and cons of the chosen intervention for the organization.")}
        >
          <div className="border rounded-b-md overflow-hidden">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border-r p-3 bg-muted/20 w-24 font-medium">A9</td>
                  <td className="p-3">
                    <div className="p-2 bg-gray-50 rounded border min-h-[100px] whitespace-pre-wrap">
                      {formData.A9 || ''}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </FormSection>
      </FormCard>
    </div>
  );
} 