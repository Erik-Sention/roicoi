"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormCard } from "@/components/ui/form-card";
import { FormEvent, useCallback, useEffect, useRef } from "react";
import { useFormData } from "@/lib/hooks/useFormData";
import { useSharedForm } from "@/lib/context/SharedFormContext";
import FormWrapper from "@/components/FormWrapper";
import { toast } from "@/components/ui/use-toast";
import { safeParseNumber } from "@/lib/utils/safeDataHandling";
import { FormattedNumberInput } from "@/components/FormattedNumberInput";
import { FormattedNumber } from "@/components/FormattedNumber";

export default function FormC() {
  const {
    formData,
    setFormData,
    updateField,
    saveForm,
    isLoading,
    isSaving,
    hasUnsavedChanges
  } = useFormData({
    formId: 'form-c',
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
  
  // Sync organization name with sharedData
  useEffect(() => {
    if (!isLoading && sharedData.organizationName && formData['C1'] !== sharedData.organizationName) {
      updateField('C1', sharedData.organizationName);
    }
  }, [isLoading, sharedData.organizationName, formData, updateField]);
  
  // Use a ref to track the previous value of totalPersonnelCosts to prevent infinite loops
  const prevTotalPersonnelCostsRef = useRef<string>('');
  
  // Use a ref to track the previous value of totalShortSickLeaveCost to prevent infinite loops
  const prevTotalShortSickLeaveCostRef = useRef<string>('');
  
  // Use a ref to track the previous value of totalLongSickLeaveCost to prevent infinite loops
  const prevTotalLongSickLeaveCostRef = useRef<string>('');
  
  // Use a ref to track previous calculated values to avoid unnecessary updates
  const prevCalculatedValuesRef = useRef<Record<string, string>>({});
  
  // Update C4 from shared data whenever it changes
  useEffect(() => {
    if (!sharedData.totalPersonnelCosts) return;
    
    // Only update C4 if the shared value has actually changed
    if (sharedData.totalPersonnelCosts !== prevTotalPersonnelCostsRef.current) {
      console.log(`totalPersonnelCosts changed from ${prevTotalPersonnelCostsRef.current} to ${sharedData.totalPersonnelCosts}`);
      
      // Update the ref with the new value
      prevTotalPersonnelCostsRef.current = sharedData.totalPersonnelCosts;
      
      // Update C4 with the value from D9 (via sharedData)
      updateField('C4', safeParseNumber(sharedData.totalPersonnelCosts, 0));
    }
  }, [sharedData.totalPersonnelCosts, updateField]);
  
  // Update C11 from shared data whenever it changes
  useEffect(() => {
    if (!sharedData.totalShortSickLeaveCost) return;
    
    // Only update C11 if the shared value has actually changed
    if (sharedData.totalShortSickLeaveCost !== prevTotalShortSickLeaveCostRef.current) {
      console.log(`totalShortSickLeaveCost changed from ${prevTotalShortSickLeaveCostRef.current} to ${sharedData.totalShortSickLeaveCost}`);
      
      // Update the ref with the new value
      prevTotalShortSickLeaveCostRef.current = sharedData.totalShortSickLeaveCost;
      
      // Update C11 with the value from E8 (via sharedData)
      updateField('C11', safeParseNumber(sharedData.totalShortSickLeaveCost, 0));
    }
  }, [sharedData.totalShortSickLeaveCost, updateField]);
  
  // Update C14 from shared data whenever it changes
  useEffect(() => {
    if (!sharedData.totalLongSickLeaveCost) return;
    
    // Only update C14 if the shared value has actually changed
    if (sharedData.totalLongSickLeaveCost !== prevTotalLongSickLeaveCostRef.current) {
      console.log(`totalLongSickLeaveCost changed from ${prevTotalLongSickLeaveCostRef.current} to ${sharedData.totalLongSickLeaveCost}`);
      
      // Update the ref with the new value
      prevTotalLongSickLeaveCostRef.current = sharedData.totalLongSickLeaveCost;
      
      // Update C14 with the value from F8 (via sharedData)
      updateField('C14', safeParseNumber(sharedData.totalLongSickLeaveCost, 0));
    }
  }, [sharedData.totalLongSickLeaveCost, updateField]);
  
  // Calculate derived values whenever input values change
  useEffect(() => {
    // Only run calculations if we have the necessary input values
    if (!formData) return;
    
    try {
      // Parse input values with fallbacks to 0
      const totalPersonnelCosts = safeParseNumber(formData.C4 as string, 0);
      const companyProfit = safeParseNumber(formData.C5 as string, 0);
      
      // Calculate C6 - Sum of work value
      const workValue = totalPersonnelCosts + companyProfit;
      
      // C7 - Percentage of personnel with high stress level
      const stressPercentage = safeParseNumber(formData.C7 as string, 0);
      
      // C8 - Production loss at high stress level
      const productionLossPercentage = safeParseNumber(formData.C8 as string, 0);
      
      // C9 - Total production loss
      const totalProductionLoss = (stressPercentage / 100) * (productionLossPercentage / 100);
      const totalProductionLossPercentage = totalProductionLoss * 100;
      
      // C10 - Value of production loss
      const productionLossValue = workValue * totalProductionLoss;
      
      // C11 - Total cost for short sick leave
      const shortSickLeaveCost = safeParseNumber(formData.C11 as string, 0);
      
      // C12 - Percentage of short sick leave due to mental health
      const shortSickLeavePercentage = safeParseNumber(formData.C12 as string, 0);
      
      // C13 - Cost for short sick leave due to mental health
      const shortSickLeaveMentalCost = shortSickLeaveCost * (shortSickLeavePercentage / 100);
      
      // C14 - Total cost for long sick leave
      const longSickLeaveCost = safeParseNumber(formData.C14 as string, 0);
      
      // C15 - Percentage of long sick leave due to mental health
      const longSickLeavePercentage = safeParseNumber(formData.C15 as string, 0);
      
      // C16 - Cost for long sick leave due to mental health
      const longSickLeaveMentalCost = longSickLeaveCost * (longSickLeavePercentage / 100);
      
      // C17 - Cost for sick leave due to mental health
      const totalSickLeaveMentalCost = shortSickLeaveMentalCost + longSickLeaveMentalCost;
      
      // C18 - Value of production loss (same as C10)
      
      // C19 - Cost for sick leave due to mental health (same as C17)
      
      // C20 - Total cost for mental health
      const totalMentalHealthCost = productionLossValue + totalSickLeaveMentalCost;
      
      // Create a new calculated values object
      const newCalculatedValues: Record<string, string> = {
        C6: workValue.toFixed(0),
        C9: totalProductionLossPercentage.toFixed(1),
        C10: productionLossValue.toFixed(0),
        C13: shortSickLeaveMentalCost.toFixed(0),
        C16: longSickLeaveMentalCost.toFixed(0),
        C17: totalSickLeaveMentalCost.toFixed(0),
        C18: productionLossValue.toFixed(0),
        C19: totalSickLeaveMentalCost.toFixed(0),
        C20: totalMentalHealthCost.toFixed(0)
      };
      
      // Check if any values have changed before updating state
      const hasChanges = Object.keys(newCalculatedValues).some(
        key => prevCalculatedValuesRef.current[key] !== newCalculatedValues[key]
      );
      
      if (hasChanges) {
        // Update calculated fields without triggering a re-render loop
        setFormData(prev => ({
          ...prev,
          ...newCalculatedValues
        }));
        
        // Update the ref with new values
        prevCalculatedValuesRef.current = newCalculatedValues;
      }
    } catch (error) {
      console.error("Error in calculations:", error);
      // Don't update the form data if there's an error
    }
  }, [
    formData,
    formData.C4, 
    formData.C5,
    formData.C7,
    formData.C8,
    formData.C11,
    formData.C12,
    formData.C14,
    formData.C15,
    setFormData
  ]);
  
  const handleInputChange = useCallback((field: string, value: string | number) => {
    // Update the form data
    updateField(field, value);
    
    // If this is a shared field, update the shared context as well
    if (field === 'C1') {
      updateSharedData('organizationName', String(value));
    } else if (field === 'C2') {
      updateSharedData('contactPerson', String(value));
    }
  }, [updateField, updateSharedData]);
  
  const onSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    saveForm();
  }, [saveForm]);
  
  return (
    <FormWrapper
      formId="form-c"
      title="C - Beräkningsmodell för ekonomiska konsekvenser av psykisk ohälsa"
      isLoading={isLoading}
      onRetry={() => window.location.reload()}
    >
      <div className="space-y-6">
        <form onSubmit={onSubmit}>
          <FormCard id="C" label="Beräkningsmodell för ekonomiska konsekvenser av psykisk ohälsa">
            {/* Basic Information */}
            <div className="border rounded-md mb-4 overflow-hidden">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b">
                    <td className="border-r p-3 bg-muted/20 w-24 font-medium">C1</td>
                    <td className="border-r p-3 w-1/3">Organisationens namn:</td>
                    <td className="p-3">
                      <Input 
                        placeholder="Ange organisationens namn" 
                        className="w-full"
                        value={formData.C1 as string || sharedData.organizationName || ''}
                        onChange={(e) => handleInputChange('C1', e.target.value)}
                        disabled={isSaving}
                      />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border-r p-3 bg-muted/20 font-medium">C2</td>
                    <td className="border-r p-3">Kontaktperson:</td>
                    <td className="p-3">
                      <Input 
                        placeholder="Ange kontaktperson" 
                        className="w-full"
                        value={formData.C2 as string || sharedData.contactPerson || ''}
                        onChange={(e) => handleInputChange('C2', e.target.value)}
                        disabled={isSaving}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border-r p-3 bg-muted/20 font-medium">C3</td>
                    <td className="border-r p-3">Tidperiod (12 månader)</td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <Input 
                          type="date" 
                          placeholder="Startdatum" 
                          className="w-full"
                          value={formData.C3_start as string || ''}
                          onChange={(e) => handleInputChange('C3_start', e.target.value)}
                          disabled={isSaving}
                        />
                        <span className="mx-2">-</span>
                        <Input 
                          type="date" 
                          placeholder="Slutdatum" 
                          className="w-full"
                          value={formData.C3_end as string || ''}
                          onChange={(e) => handleInputChange('C3_end', e.target.value)}
                          disabled={isSaving}
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Beräkning av kostnad för produktionsbortfall pga psykisk ohälsa */}
            <div className="mb-6">
              <div className="bg-muted/30 p-3 rounded-t-md border border-b-0">
                <h4 className="font-medium">Beräkning av kostnad för produktionsbortfall pga psykisk ohälsa</h4>
              </div>
              <div className="border rounded-b-md overflow-hidden">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b">
                      <td className="border-r p-3 bg-muted/20 w-24 font-medium">C4</td>
                      <td className="border-r p-3 w-1/2">Totala personalkostnader (lön + sociala + kringkostnader), kr per år</td>
                      <td className="border-r p-3 w-10 text-center">+</td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <FormattedNumber 
                            value={formData.C4 as string || sharedData.totalPersonnelCosts || ''}
                            className="w-full p-2 bg-gray-50"
                          />
                          <div className="ml-2 text-xs text-muted-foreground">
                            Förs ev. över från D9
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="border-r p-3 bg-muted/20 font-medium">C5</td>
                      <td className="border-r p-3">Vinst i företaget, kr per år</td>
                      <td className="border-r p-3 text-center">+</td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <FormattedNumberInput 
                            placeholder="0" 
                            className="w-full"
                            value={formData.C5 as string || ''}
                            onChange={(e) => handleInputChange('C5', safeParseNumber(e.target.value, 0))}
                            disabled={isSaving}
                          />
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="border-r p-3 bg-muted/20 font-medium">C6</td>
                      <td className="border-r p-3">Summa, värde av arbete:</td>
                      <td className="border-r p-3 text-center">=</td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <FormattedNumber 
                            value={formData.C6 as string || ''}
                            className="w-full p-2 bg-gray-50"
                          />
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="border-r p-3 bg-muted/20 font-medium">C7</td>
                      <td className="border-r p-3">Andel av personal med hög stressnivå</td>
                      <td className="border-r p-3 text-center"></td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <FormattedNumberInput 
                            placeholder="0" 
                            className="w-full"
                            value={formData.C7 as string || ''}
                            onChange={(e) => handleInputChange('C7', safeParseNumber(e.target.value, 0))}
                            disabled={isSaving}
                          />
                          <span className="ml-2">%</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="border-r p-3 bg-muted/20 font-medium">C8</td>
                      <td className="border-r p-3">Produktionsbortfall vid hög stressnivå</td>
                      <td className="border-r p-3 text-center"></td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <FormattedNumberInput 
                            placeholder="0" 
                            className="w-full"
                            value={formData.C8 as string || ''}
                            onChange={(e) => handleInputChange('C8', safeParseNumber(e.target.value, 0))}
                            disabled={isSaving}
                          />
                          <span className="ml-2">%</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="border-r p-3 bg-muted/20 font-medium">C9</td>
                      <td className="border-r p-3">Totalt produktionsbortfall</td>
                      <td className="border-r p-3 text-center">=</td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <FormattedNumber 
                            value={formData.C9 as string || ''}
                            className="w-full p-2 bg-gray-50"
                          />
                          <span className="ml-2">%</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="border-r p-3 bg-muted/20 font-medium">C10</td>
                      <td className="border-r p-3">Värde av produktionsbortfall, kr per år</td>
                      <td className="border-r p-3 text-center">=</td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <FormattedNumber 
                            value={formData.C10 as string || ''}
                            className="w-full p-2 bg-gray-50"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Beräkning av kostnad för sjukfrånvaro pga psykisk ohälsa */}
            <div className="mb-6">
              <div className="bg-muted/30 p-3 rounded-t-md border border-b-0">
                <h4 className="font-medium">Beräkning av kostnad för sjukfrånvaro pga psykisk ohälsa</h4>
              </div>
              <div className="border rounded-b-md overflow-hidden">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b">
                      <td className="border-r p-3 bg-muted/20 w-24 font-medium">C11</td>
                      <td className="border-r p-3 w-1/2">Total kostnad för korttidssjukfrånvaro, kr per år</td>
                      <td className="border-r p-3 text-center"></td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <FormattedNumberInput 
                            placeholder="0" 
                            className="w-full"
                            value={formData.C11 as string || sharedData.totalShortSickLeaveCost || ''}
                            onChange={(e) => handleInputChange('C11', safeParseNumber(e.target.value, 0))}
                            disabled={isSaving}
                          />
                          <div className="ml-2 text-xs text-muted-foreground">
                            Förs ev. över från E9
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="border-r p-3 bg-muted/20 font-medium">C12</td>
                      <td className="border-r p-3">Andel av korttidssjukfrånvaro som beror på psykisk ohälsa</td>
                      <td className="border-r p-3 text-center"></td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <FormattedNumberInput 
                            placeholder="0" 
                            className="w-full"
                            value={formData.C12 as string || ''}
                            onChange={(e) => handleInputChange('C12', safeParseNumber(e.target.value, 0))}
                            disabled={isSaving}
                          />
                          <span className="ml-2">%</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="border-r p-3 bg-muted/20 font-medium">C13</td>
                      <td className="border-r p-3">Kostnad för korttidssjukfrånvaro pga psykisk ohälsa, kr per år</td>
                      <td className="border-r p-3 text-center">=</td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <FormattedNumber 
                            value={formData.C13 as string || ''}
                            className="w-full p-2 bg-gray-50"
                          />
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="border-r p-3 bg-muted/20 font-medium">C14</td>
                      <td className="border-r p-3">Total kostnad för långtidssjukfrånvaro, kr per år</td>
                      <td className="border-r p-3 text-center"></td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <FormattedNumberInput 
                            placeholder="0" 
                            className="w-full"
                            value={formData.C14 as string || sharedData.totalLongSickLeaveCost || ''}
                            onChange={(e) => handleInputChange('C14', safeParseNumber(e.target.value, 0))}
                            disabled={isSaving}
                          />
                          <div className="ml-2 text-xs text-muted-foreground">
                            Förs ev. över från F9
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="border-r p-3 bg-muted/20 font-medium">C15</td>
                      <td className="border-r p-3">Andel av långtidssjukfrånvaro som beror på psykisk ohälsa</td>
                      <td className="border-r p-3 text-center"></td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <FormattedNumberInput 
                            placeholder="0" 
                            className="w-full"
                            value={formData.C15 as string || ''}
                            onChange={(e) => handleInputChange('C15', safeParseNumber(e.target.value, 0))}
                            disabled={isSaving}
                          />
                          <span className="ml-2">%</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="border-r p-3 bg-muted/20 font-medium">C16</td>
                      <td className="border-r p-3">Kostnad för långtidssjukfrånvaro pga psykisk ohälsa, kr per år</td>
                      <td className="border-r p-3 text-center">=</td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <FormattedNumber 
                            value={formData.C16 as string || ''}
                            className="w-full p-2 bg-gray-50"
                          />
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="border-r p-3 bg-muted/20 font-medium">C17</td>
                      <td className="border-r p-3">Kostnad för sjukfrånvaro pga psykisk ohälsa, kr per år</td>
                      <td className="border-r p-3 text-center">=</td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <FormattedNumber 
                            value={formData.C17 as string || ''}
                            className="w-full p-2 bg-gray-50"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Summering av kostnad pga psykisk ohälsa */}
            <div className="mb-6">
              <div className="bg-muted/30 p-3 rounded-t-md border border-b-0">
                <h4 className="font-medium">Summering av kostnad pga psykisk ohälsa</h4>
              </div>
              <div className="border rounded-b-md overflow-hidden">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b">
                      <td className="border-r p-3 bg-muted/20 w-24 font-medium">C18</td>
                      <td className="border-r p-3 w-1/2">Värde av produktionsbortfall, kr per år</td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <FormattedNumber 
                            value={formData.C18 as string || ''}
                            className="w-full p-2 bg-gray-50"
                          />
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="border-r p-3 bg-muted/20 font-medium">C19</td>
                      <td className="border-r p-3">Kostnad för sjukfrånvaro pga psykisk ohälsa, kr per år</td>
                      <td className="border-r p-3 text-center">+</td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <FormattedNumber 
                            value={formData.C19 as string || ''}
                            className="w-full p-2 bg-gray-50"
                          />
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border-r p-3 bg-muted/20 font-medium">C20</td>
                      <td className="border-r p-3">Total kostnad för psykisk ohälsa, kr per år</td>
                      <td className="border-r p-3 text-center">=</td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <FormattedNumber 
                            value={formData.C20 as string || ''}
                            className="w-full p-2 bg-gray-50"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                asChild
              >
                <Link href="/forms/form-b">Tillbaka: Formulär B</Link>
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
                  <Link href="/forms/form-d">Nästa: Formulär D</Link>
                </Button>
              </div>
            </div>
          </FormCard>
        </form>
      </div>
    </FormWrapper>
  );
} 