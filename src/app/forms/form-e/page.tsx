"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FormCard } from "@/components/ui/form-card";
import { FormEvent, useCallback, useEffect, useRef } from "react";
import { useFormData } from "@/lib/hooks/useFormData";
import { useSharedForm } from "@/lib/context/SharedFormContext";
import FormWrapper from "@/components/FormWrapper";
import { toast } from "@/components/ui/use-toast";
import { safeParseNumber } from "@/lib/utils/safeDataHandling";
import { FormattedNumberInput } from "@/components/FormattedNumberInput";
import { FormattedNumber } from "@/components/FormattedNumber";

export default function FormE() {
  const {
    formData,
    setFormData,
    updateField,
    saveForm,
    isLoading,
    isSaving,
    hasUnsavedChanges
  } = useFormData({
    formId: 'form-e',
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
  
  const { updateSharedData } = useSharedForm();
  
  // Use a ref to track the previous value of E8 to prevent infinite loops
  const prevE8Ref = useRef<string>('');
  
  // Use a ref to track previous calculated values to avoid unnecessary updates
  const prevCalculatedValuesRef = useRef<Record<string, string>>({});
  
  // Calculate derived values whenever input values change
  useEffect(() => {
    // Only run calculations if we have the necessary input values
    if (!formData) return;
    
    try {
      // Parse input values with fallbacks to 0
      const monthlyWage = safeParseNumber(formData.E1 as string, 0);
      const shortSickLeavePercentage = safeParseNumber(formData.E2 as string, 0);
      const numEmployees = safeParseNumber(formData.E4 as string, 0);
      const workdaysPerYear = safeParseNumber(formData.E5 as string, 0);
      const sickLeavePercentage = safeParseNumber(formData.E6 as string, 0);
      
      // E3 - Calculate cost per sick day (E1 × E2)
      const costPerSickDay = monthlyWage * (shortSickLeavePercentage / 100);
      
      // E7 - Calculate total sick days per year (E4 × E5 × E6)
      const totalSickDays = numEmployees * workdaysPerYear * (sickLeavePercentage / 100);
      
      // E8 - Calculate total cost for short sick leave per year (E3 × E7)
      const totalCostShortSickLeave = costPerSickDay * totalSickDays;
      
      // Create a new calculated values object
      const newCalculatedValues: Record<string, string> = {
        E3: costPerSickDay.toFixed(0),
        E7: totalSickDays.toFixed(0),
        E8: totalCostShortSickLeave.toFixed(0)
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
    formData.E1, 
    formData.E2, 
    formData.E4, 
    formData.E5,
    formData.E6,
    setFormData
  ]);
  
  // Share E8 value with other forms via SharedFormContext
  useEffect(() => {
    if (!formData || !formData.E8) return;
    
    const currentE8 = formData.E8 as string;
    
    // Only update shared data if E8 has actually changed
    if (currentE8 !== prevE8Ref.current) {
      console.log(`E8 changed from ${prevE8Ref.current} to ${currentE8}`);
      
      // Update the ref with the new value
      prevE8Ref.current = currentE8;
      
      // Share E8 value with other forms via SharedFormContext
      updateSharedData('totalShortSickLeaveCost', currentE8);
    }
  }, [formData, formData?.E8, updateSharedData]);
  
  const handleInputChange = useCallback((field: string, value: string | number) => {
    // Update the form data
    updateField(field, value);
  }, [updateField]);
  
  const onSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    saveForm();
  }, [saveForm]);
  
  return (
    <FormWrapper
      formId="form-e"
      title="E – Beräkning av kostnader för kort sjukfrånvaro (dag 1–14)"
      isLoading={isLoading}
      onRetry={() => window.location.reload()}
    >
      <div className="space-y-6">
        <form onSubmit={onSubmit}>
          <FormCard id="E" label="Beräkning av kostnader för kort sjukfrånvaro (dag 1–14)">
            <div className="border rounded-md overflow-hidden">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b">
                    <td className="border-r p-3 bg-muted/20 w-24 font-medium">E1</td>
                    <td className="border-r p-3 w-1/2">Genomsnittlig månadslön</td>
                    <td className="p-3 w-1/2">
                      <div className="flex items-center justify-end">
                        <FormattedNumberInput 
                          placeholder="0" 
                          className="w-32 text-right"
                          value={formData.E1 as string || ''}
                          onChange={(e) => handleInputChange('E1', safeParseNumber(e.target.value, 0))}
                          disabled={isSaving}
                          min="0"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border-r p-3 bg-muted/20 font-medium">E2</td>
                    <td className="border-r p-3">Kostnad för kort sjukfrånvaro per sjukdag % av månadslön</td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <span className="mr-2">*</span>
                        <FormattedNumberInput 
                          placeholder="0" 
                          className="w-32 text-right"
                          value={formData.E2 as string || ''}
                          onChange={(e) => handleInputChange('E2', safeParseNumber(e.target.value, 0))}
                          disabled={isSaving}
                          min="0"
                          max="100"
                        />
                        <span className="ml-2">%</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border-r p-3 bg-muted/20 font-medium">E3</td>
                    <td className="border-r p-3">Kostnad för kort sjukfrånvaro per sjukdag, kr</td>
                    <td className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="mr-2">=</span>
                        <div className="flex items-center">
                          <FormattedNumber 
                            value={formData.E3 as string || ''}
                            className="w-32 text-right"
                          />
                          <span className="ml-2">→</span>
                          <FormattedNumber 
                            value={formData.E3 as string || ''}
                            className="w-32 ml-2 text-right"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border-r p-3 bg-muted/20 font-medium">E4</td>
                    <td className="border-r p-3">Antal anställda (motsvarande heltidstjänster/FTE)</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end">
                        <FormattedNumberInput 
                          placeholder="0" 
                          className="w-32 text-right"
                          value={formData.E4 as string || ''}
                          onChange={(e) => handleInputChange('E4', safeParseNumber(e.target.value, 0))}
                          disabled={isSaving}
                          min="0"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border-r p-3 bg-muted/20 font-medium">E5</td>
                    <td className="border-r p-3">Antal schemalagda arbetsdagar per år, per anställd</td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <span className="mr-2">*</span>
                        <FormattedNumberInput 
                          placeholder="0" 
                          className="w-32 text-right"
                          value={formData.E5 as string || ''}
                          onChange={(e) => handleInputChange('E5', safeParseNumber(e.target.value, 0))}
                          disabled={isSaving}
                          min="0"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border-r p-3 bg-muted/20 font-medium">E6</td>
                    <td className="border-r p-3">Sjukfrånvaro, kort (dag 1-14) i % av schemalagd arbetstid</td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <span className="mr-2">*</span>
                        <FormattedNumberInput 
                          placeholder="0" 
                          className="w-32 text-right"
                          value={formData.E6 as string || ''}
                          onChange={(e) => handleInputChange('E6', safeParseNumber(e.target.value, 0))}
                          disabled={isSaving}
                          min="0"
                          max="100"
                          step="0.01"
                        />
                        <span className="ml-2">%</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border-r p-3 bg-muted/20 font-medium">E7</td>
                    <td className="border-r p-3">Antal sjukdagar totalt (kort sjukfrånvaro)</td>
                    <td className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="mr-2">=</span>
                        <div className="flex items-center">
                          <FormattedNumber 
                            value={formData.E7 as string || ''}
                            className="w-32 text-right"
                          />
                          <span className="ml-2">→</span>
                          <span className="ml-2">*</span>
                          <FormattedNumber 
                            value={formData.E7 as string || ''}
                            className="w-32 ml-2 text-right"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border-r p-3 bg-muted/20 font-medium">E8</td>
                    <td className="border-r p-3">Totala kostnader, kort sjukfrånvaro, överförs till C11</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end">
                        <span className="mr-2">=</span>
                        <FormattedNumber 
                          value={formData.E8 as string || ''}
                          className="w-32 text-right"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                asChild
              >
                <Link href="/forms/form-d">Tillbaka: Formulär D</Link>
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
                  <Link href="/forms/form-f">Nästa: Formulär F</Link>
                </Button>
              </div>
            </div>
          </FormCard>
        </form>
      </div>
    </FormWrapper>
  );
} 