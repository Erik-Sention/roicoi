"use client";

import { FormCard, FormSection } from "@/components/ui/form-card";
import { FormAData } from "@/lib/utils/reportGenerator";

interface AppendixFormBProps {
  formData: FormAData;
  language?: 'sv' | 'en';
}

export function AppendixFormB({ formData, language = 'sv' }: AppendixFormBProps) {
  // Translation helper
  const t = (sv: string, en: string): string => {
    return language === 'sv' ? sv : en;
  };

  return (
    <div className="space-y-6 print:text-black">
      <FormCard id="B" label={t("Verksamhetsanalys - insats", "Business Analysis - Intervention")}>
        {/* Basic Information */}
        <div className="border rounded-md mb-4 overflow-hidden">
          <table className="w-full border-collapse">
            <tbody>
              <tr className="border-b">
                <td className="border-r p-3 bg-muted/20 w-24 font-medium">B1</td>
                <td className="border-r p-3 w-1/3">{t("Organisationens namn:", "Organization name:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">{formData.A1 || ''}</div>
                </td>
              </tr>
              <tr>
                <td className="border-r p-3 bg-muted/20 font-medium">B2</td>
                <td className="border-r p-3">{t("Kontaktperson:", "Contact person:")}</td>
                <td className="p-3">
                  <div className="p-2 bg-gray-50 rounded border">{formData.A2 || ''}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Intervention Name */}
        <FormSection 
          title={t("Insatsnamn", "Intervention Name")}
          description=""
        >
          <div className="border rounded-b-md overflow-hidden">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border-r p-3 bg-muted/20 w-24 font-medium">B3</td>
                  <td className="p-3">
                    <div className="p-2 bg-gray-50 rounded border min-h-[40px] whitespace-pre-wrap">
                      {formData.B3 || ''}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </FormSection>
        
        {/* Intervention Description */}
        <FormSection 
          title={t("Vilka insatser avses", "Which interventions are intended")}
          description=""
        >
          <div className="border rounded-b-md overflow-hidden">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border-r p-3 bg-muted/20 w-24 font-medium">B4</td>
                  <td className="p-3">
                    <div className="p-2 bg-gray-50 rounded border min-h-[80px] whitespace-pre-wrap">
                      {formData.B4 || ''}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </FormSection>
        
        {/* Purpose */}
        <FormSection 
          title={t("Syfte med insatserna", "Purpose of the interventions")}
          description=""
        >
          <div className="border rounded-b-md overflow-hidden">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border-r p-3 bg-muted/20 w-24 font-medium">B5</td>
                  <td className="p-3">
                    <div className="p-2 bg-gray-50 rounded border min-h-[80px] whitespace-pre-wrap">
                      {formData.B5 || ''}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </FormSection>
        
        {/* Support for Business Goals */}
        <FormSection 
          title={t("Stöd för verksamhetens övergripande mål", "Support for the business's overall goals")}
          description=""
        >
          <div className="border rounded-b-md overflow-hidden">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border-r p-3 bg-muted/20 w-24 font-medium">B6</td>
                  <td className="p-3">
                    <div className="p-2 bg-gray-50 rounded border min-h-[80px] whitespace-pre-wrap">
                      {formData.B6 || ''}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </FormSection>
        
        {/* Alternative Approaches */}
        <FormSection 
          title={t("Alternativa ansatser", "Alternative approaches")}
          description=""
        >
          <div className="border rounded-b-md overflow-hidden">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border-r p-3 bg-muted/20 w-24 font-medium">B7</td>
                  <td className="p-3">
                    <div className="p-2 bg-gray-50 rounded border min-h-[80px] whitespace-pre-wrap">
                      {formData.B7 || ''}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </FormSection>
        
        {/* Goals */}
        <FormSection 
          title={t("Mål med insatserna", "Goals with the interventions")}
          description=""
        >
          <div className="border rounded-b-md overflow-hidden">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border-r p-3 bg-muted/20 w-24 font-medium">B8</td>
                  <td className="p-3">
                    <div className="p-2 bg-gray-50 rounded border min-h-[80px] whitespace-pre-wrap">
                      {formData.B8 || ''}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </FormSection>
        
        {/* Target Group */}
        <FormSection 
          title={t("Målgrupp", "Target group")}
          description=""
        >
          <div className="border rounded-b-md overflow-hidden">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border-r p-3 bg-muted/20 w-24 font-medium">B9</td>
                  <td className="p-3">
                    <div className="p-2 bg-gray-50 rounded border min-h-[80px] whitespace-pre-wrap">
                      {formData.B9 || ''}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </FormSection>
        
        {/* Expected Effect Timeline */}
        <FormSection 
          title={t("När nås förväntad effekt av insatsen", "When is the expected effect of the intervention reached")}
          description=""
        >
          <div className="border rounded-b-md overflow-hidden">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border-r p-3 bg-muted/20 w-24 font-medium">B10</td>
                  <td className="p-3">
                    <div className="p-2 bg-gray-50 rounded border min-h-[80px] whitespace-pre-wrap">
                      {formData.B10 || ''}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </FormSection>
        
        {/* Implementation Plan */}
        <FormSection 
          title={t("Genomförandeplan", "Implementation plan")}
          description=""
        >
          <div className="border rounded-b-md overflow-hidden">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border-r p-3 bg-muted/20 w-24 font-medium">B11</td>
                  <td className="p-3">
                    <div className="p-2 bg-gray-50 rounded border min-h-[80px] whitespace-pre-wrap">
                      {formData.B11 || ''}
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