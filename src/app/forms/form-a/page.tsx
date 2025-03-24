"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormCard, FormSection } from "@/components/ui/form-card";
import { FormEvent, useCallback } from "react";
import { useFormData } from "@/lib/hooks/useFormData";
import { useSharedForm } from "@/lib/context/SharedFormContext";
import FormWrapper from "@/components/FormWrapper";
import { toast } from "@/components/ui/use-toast";
import { safeParseNumber } from "@/lib/utils/safeDataHandling";
import { FormattedNumberInput } from "@/components/FormattedNumberInput";

export default function FormA() {
  const {
    formData,
    updateField,
    saveForm,
    isLoading,
    isSaving,
    hasUnsavedChanges
  } = useFormData({
    formId: 'form-a',
    initialData: {},
    autoSaveInterval: 30000, // Auto-save after 30 seconds of inactivity
    onSaveSuccess: () => {
      toast({
        title: "Form saved",
        description: "Your form data has been saved successfully.",
      });
    },
    onSaveError: (error) => {
      toast({
        title: "Error saving form",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const { sharedData, updateSharedData } = useSharedForm();
  
  const handleInputChange = useCallback((field: string, value: string | number) => {
    // Update the form data
    updateField(field, value);
    
    // If this is a shared field, update the shared context as well
    if (field === 'A1') {
      updateSharedData('organizationName', String(value));
    } else if (field === 'A2') {
      updateSharedData('contactPerson', String(value));
    }
  }, [updateField, updateSharedData]);
  
  const onSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    saveForm();
  }, [saveForm]);
  
  return (
    <FormWrapper
      formId="form-a"
      title="A - Verksamhetsanalys"
      isLoading={isLoading}
      onRetry={() => window.location.reload()}
    >
      <div className="space-y-6">
        <form onSubmit={onSubmit}>
          <FormCard id="A" label="Verksamhetsanalys">
            {/* Basic Information */}
            <div className="border rounded-md mb-4 overflow-hidden">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b">
                    <td className="border-r p-3 bg-muted/20 w-24 font-medium">A1</td>
                    <td className="border-r p-3 w-1/3">Organisationens namn:</td>
                    <td className="p-3">
                      <Input 
                        placeholder="Ange organisationens namn" 
                        className="w-full"
                        value={formData.A1 as string || sharedData.organizationName || ''}
                        onChange={(e) => handleInputChange('A1', e.target.value)}
                        disabled={isSaving}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border-r p-3 bg-muted/20 font-medium">A2</td>
                    <td className="border-r p-3">Kontaktperson:</td>
                    <td className="p-3">
                      <Input 
                        placeholder="Ange kontaktperson" 
                        className="w-full"
                        value={formData.A2 as string || sharedData.contactPerson || ''}
                        onChange={(e) => handleInputChange('A2', e.target.value)}
                        disabled={isSaving}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Step 1 */}
            <FormSection 
              title="Steg 1 - Definition av verksamheten"
              description="Ta med t ex: Organisatorisk del, personalkategori, el dyl"
            >
              <div className="border rounded-b-md overflow-hidden">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border-r p-3 bg-muted/20 w-24 font-medium">A3</td>
                      <td className="p-3">
                        <Textarea 
                          placeholder="Beskriv verksamheten" 
                          className="w-full min-h-[80px]"
                          value={formData.A3 as string || ''}
                          onChange={(e) => handleInputChange('A3', e.target.value)}
                          disabled={isSaving}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </FormSection>
            
            {/* Step 2 */}
            <FormSection 
              title="Steg 2 - Nulägesbeskrivning, psykisk hälsa"
              description="Ta med t ex: Problem, konsekvenser, ekonomi"
            >
              <div className="border rounded-b-md overflow-hidden">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border-r p-3 bg-muted/20 w-24 font-medium align-top" rowSpan={4}>A4</td>
                      <td className="p-3" colSpan={2}>
                        <Textarea 
                          placeholder="Beskriv nuläget gällande psykisk hälsa" 
                          className="w-full min-h-[100px]"
                          value={formData.A4_description as string || ''}
                          onChange={(e) => handleInputChange('A4_description', e.target.value)}
                          disabled={isSaving}
                        />
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="border-r p-3 w-1/2">Andel av personalen med hög stressnivå:</td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <FormattedNumberInput 
                            placeholder="0" 
                            className="w-20"
                            value={formData.A4_stress_percentage as string || ''}
                            onChange={(e) => handleInputChange('A4_stress_percentage', safeParseNumber(e.target.value, 0))}
                            disabled={isSaving}
                          />
                          <span className="ml-2">%</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="border-r p-3">Värde av produktionsbortfall, kr per år:</td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <FormattedNumberInput 
                            placeholder="0" 
                            className="w-full"
                            value={formData.A4_production_loss as string || ''}
                            onChange={(e) => handleInputChange('A4_production_loss', safeParseNumber(e.target.value, 0))}
                            disabled={isSaving}
                          />
                          <span className="ml-2">kr</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="border-r p-3">Kostnad för sjukfrånvaro beroende på psykisk ohälsa, kr per år:</td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <FormattedNumberInput 
                            placeholder="0" 
                            className="w-full"
                            value={formData.A4_sick_leave_cost as string || ''}
                            onChange={(e) => handleInputChange('A4_sick_leave_cost', safeParseNumber(e.target.value, 0))}
                            disabled={isSaving}
                          />
                          <span className="ml-2">Kr</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </FormSection>
            
            {/* Step 3 */}
            <FormSection 
              title="Steg 3 - Orsaksanalys och riskbedömning"
              description="Ta med t ex: Problemorsaker, bakomliggande orsaker"
            >
              <div className="border rounded-b-md overflow-hidden">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border-r p-3 bg-muted/20 w-24 font-medium">A5</td>
                      <td className="p-3">
                        <Textarea 
                          placeholder="Beskriv orsaker och risker" 
                          className="w-full min-h-[100px]"
                          value={formData.A5 as string || ''}
                          onChange={(e) => handleInputChange('A5', e.target.value)}
                          disabled={isSaving}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </FormSection>
            
            {/* Step 4 */}
            <FormSection 
              title="Steg 4 - Målformulering och Behovsanalys"
              description="Ta med t ex: Mål, behov att åtgärda, prioriteringar"
            >
              <div className="border rounded-b-md overflow-hidden">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border-r p-3 bg-muted/20 w-24 font-medium">A6</td>
                      <td className="p-3">
                        <Textarea 
                          placeholder="Beskriv mål och behov" 
                          className="w-full min-h-[100px]"
                          value={formData.A6 as string || ''}
                          onChange={(e) => handleInputChange('A6', e.target.value)}
                          disabled={isSaving}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </FormSection>
            
            {/* Step 5 */}
            <FormSection 
              title="Steg 5 - Val av lämpliga insatser"
              description="Ta med t ex: Beskrivning, syfte, mål, stöd för verksamhetens mål, alternativ, genomförandeplan och insatskostnad. ALTERNATIV: fyll i B för resp. insats"
            >
              <div className="border rounded-b-md overflow-hidden">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border-r p-3 bg-muted/20 w-24 font-medium">A7</td>
                      <td className="p-3">
                        <Textarea 
                          placeholder="Beskriv lämpliga insatser" 
                          className="w-full min-h-[120px]"
                          value={formData.A7 as string || ''}
                          onChange={(e) => handleInputChange('A7', e.target.value)}
                          disabled={isSaving}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </FormSection>
            
            {/* Step 6 */}
            <FormSection 
              title="Steg 6 - Ekonomiskt beslutsunderlag"
              description="Insatskostnaden i relation till förväntad effekt. Beräkningar görs i formulär C - J."
            >
              <div className="border rounded-b-md overflow-hidden">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border-r p-3 bg-muted/20 w-24 font-medium">A8</td>
                      <td className="p-3">
                        <Textarea 
                          placeholder="Ekonomiskt beslutsunderlag" 
                          className="w-full min-h-[80px]"
                          value={formData.A8 as string || ''}
                          onChange={(e) => handleInputChange('A8', e.target.value)}
                          disabled={isSaving}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </FormSection>
            
            {/* Step 7 */}
            <FormSection 
              title="Steg 7 - Rekommendation för beslut"
              description="Ta med tex: vilken insats som rekommenderas alt. för- och nackdelar med vald insats för organisationen."
            >
              <div className="border rounded-b-md overflow-hidden">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border-r p-3 bg-muted/20 w-24 font-medium">A9</td>
                      <td className="p-3">
                        <Textarea 
                          placeholder="Rekommendation för beslut" 
                          className="w-full min-h-[100px]"
                          value={formData.A9 as string || ''}
                          onChange={(e) => handleInputChange('A9', e.target.value)}
                          disabled={isSaving}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </FormSection>
            
            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                onClick={() => window.history.back()}
              >
                Tillbaka
              </Button>
              
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isSaving || !hasUnsavedChanges}
                >
                  {isSaving ? 'Sparar...' : 'Spara'}
                </Button>
                
                <Button
                  type="button"
                  variant="default"
                  disabled={isSaving}
                  asChild
                >
                  <Link href="/forms/form-b">Nästa: Formulär B</Link>
                </Button>
              </div>
            </div>
          </FormCard>
        </form>
      </div>
    </FormWrapper>
  );
} 