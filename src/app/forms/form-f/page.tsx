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

export default function FormF() {
  const {
    formData,
    setFormData,
    updateField,
    saveForm,
    isLoading,
    isSaving,
    hasUnsavedChanges
  } = useFormData({
    formId: 'form-f',
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
  
  // Use a ref to track the previous value of F8 to prevent infinite loops
  const prevF8Ref = useRef<string>('');
  
  // Use a ref to track previous calculated values to avoid unnecessary updates
  const prevCalculatedValuesRef = useRef<Record<string, string>>({});
  
  // Calculate derived values whenever input values change
  useEffect(() => {
    // Only run calculations if we have the necessary input values
    if (!formData) return;
    
    try {
      // Parse input values with fallbacks to 0
      const monthlyWage = safeParseNumber(formData.F1 as string, 0);
      const longSickLeavePercentage = safeParseNumber(formData.F2 as string, 0);
      const numEmployees = safeParseNumber(formData.F4 as string, 0);
      const workdaysPerYear = safeParseNumber(formData.F5 as string, 0);
      const sickLeavePercentage = safeParseNumber(formData.F6 as string, 0);
      
      // F3 - Calculate cost per sick day (F1 × F2)
      const costPerSickDay = monthlyWage * (longSickLeavePercentage / 100);
      
      // F7 - Calculate total sick days per year (F4 × F5 × F6)
      const totalSickDays = numEmployees * workdaysPerYear * (sickLeavePercentage / 100);
      
      // F8 - Calculate total cost for long sick leave per year (F3 × F7)
      const totalCostLongSickLeave = costPerSickDay * totalSickDays;
      
      // Create a new calculated values object
      const newCalculatedValues: Record<string, string> = {
        F3: costPerSickDay.toFixed(0),
        F7: totalSickDays.toFixed(0),
        F8: totalCostLongSickLeave.toFixed(0)
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
    formData.F1, 
    formData.F2, 
    formData.F4, 
    formData.F5,
    formData.F6,
    setFormData
  ]);
  
  // Share F8 value with other forms via SharedFormContext
  useEffect(() => {
    if (!formData || !formData.F8) return;
    
    const currentF8 = formData.F8 as string;
    
    // Only update shared data if F8 has actually changed
    if (currentF8 !== prevF8Ref.current) {
      console.log(`F8 changed from ${prevF8Ref.current} to ${currentF8}`);
      
      // Update the ref with the new value
      prevF8Ref.current = currentF8;
      
      // Share F8 value with other forms via SharedFormContext
      updateSharedData('totalLongSickLeaveCost', currentF8);
    }
  }, [formData, formData?.F8, updateSharedData]);
  
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
      formId="form-f"
      title="F – Beräkning av kostnader för lång sjukfrånvaro (dag 15 – )"
      isLoading={isLoading}
      onRetry={() => window.location.reload()}
    >
      <div className="space-y-6">
        <form onSubmit={onSubmit}>
          <FormCard id="F" label="F – Beräkning av kostnader för lång sjukfrånvaro (dag 15 – )">
            <div className="border rounded-md overflow-hidden">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b">
                    <td className="border-r p-3 bg-muted/20 w-24 font-medium">F1</td>
                    <td className="border-r p-3 w-1/2">Genomsnittlig månadslön</td>
                    <td className="border-r p-3 text-center"></td>
                    <td className="p-3">
                      <div className="flex items-center justify-end">
                        <FormattedNumberInput
                          type="number" 
                          placeholder="0" 
                          className="w-32 text-right"
                          value={formData.F1 as string || ''}
                          onChange={(e) => handleInputChange('F1', safeParseNumber(e.target.value, 0))}
                          disabled={isSaving}
                          min="0"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border-r p-3 bg-muted/20 font-medium">F2</td>
                    <td className="border-r p-3">Kostnad för lång sjukfrånvaro per sjukdag i % av månadslön</td>
                    <td className="border-r p-3 text-center">*</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end">
                        <FormattedNumberInput
                          type="number" 
                          placeholder="0" 
                          className="w-32 text-right"
                          value={formData.F2 as string || ''}
                          onChange={(e) => handleInputChange('F2', safeParseNumber(e.target.value, 0))}
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
                    <td className="border-r p-3 bg-muted/20 font-medium">F3</td>
                    <td className="border-r p-3">Kostnad för lång sjukfrånvaro per sjukdag, kr</td>
                    <td className="border-r p-3 text-center">=</td>
                    <td className="p-3">
                      <div className="flex items-center justify-between">
                        <FormattedNumber
                          value={formData.F3 as string || ''}
                          className="w-32 text-right"
                        />
                        <span className="ml-2">→</span>
                        <FormattedNumberInput
                          placeholder="0" 
                          className="w-32 ml-2 text-right"
                          value={formData.F3 as string || ''}
                          onChange={(e) => handleInputChange('F3', safeParseNumber(e.target.value, 0))}
                          disabled={isSaving}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border-r p-3 bg-muted/20 font-medium">F4</td>
                    <td className="border-r p-3">Antal anställda (motsvarande heltidstjänster/FTE)</td>
                    <td className="border-r p-3 text-center"></td>
                    <td className="p-3">
                      <div className="flex items-center justify-end">
                        <FormattedNumberInput
                          type="number" 
                          placeholder="0" 
                          className="w-32 text-right"
                          value={formData.F4 as string || ''}
                          onChange={(e) => handleInputChange('F4', safeParseNumber(e.target.value, 0))}
                          disabled={isSaving}
                          min="0"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border-r p-3 bg-muted/20 font-medium">F5</td>
                    <td className="border-r p-3">Antal schemalagda arbetsdagar per år, per anställd</td>
                    <td className="border-r p-3 text-center">*</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end">
                        <FormattedNumberInput
                          type="number" 
                          placeholder="0" 
                          className="w-32 text-right"
                          value={formData.F5 as string || ''}
                          onChange={(e) => handleInputChange('F5', safeParseNumber(e.target.value, 0))}
                          disabled={isSaving}
                          min="0"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border-r p-3 bg-muted/20 font-medium">F6</td>
                    <td className="border-r p-3">Sjukfrånvaro, lång (dag 15--) i % av schemalagd arbetstid</td>
                    <td className="border-r p-3 text-center">*</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end">
                        <FormattedNumberInput
                          type="number" 
                          placeholder="0" 
                          className="w-32 text-right"
                          value={formData.F6 as string || ''}
                          onChange={(e) => handleInputChange('F6', safeParseNumber(e.target.value, 0))}
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
                    <td className="border-r p-3 bg-muted/20 font-medium">F7</td>
                    <td className="border-r p-3">Antal sjukdagar totalt (lång sjukfrånvaro)</td>
                    <td className="border-r p-3 text-center">=</td>
                    <td className="p-3">
                      <div className="flex items-center justify-between">
                        <FormattedNumber
                          value={formData.F7 as string || ''}
                          className="w-32 text-right"
                        />
                        <span className="ml-2">→</span>
                        <span className="ml-2">*</span>
                        <FormattedNumberInput
                          placeholder="0" 
                          className="w-32 ml-2 text-right"
                          value={formData.F7 as string || ''}
                          onChange={(e) => handleInputChange('F7', safeParseNumber(e.target.value, 0))}
                          disabled={isSaving}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border-r p-3 bg-muted/20 font-medium">F8</td>
                    <td className="border-r p-3">Totala kostnader, lång sjukfrånvaro, överförs till C14</td>
                    <td className="border-r p-3 text-center">=</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end">
                        <FormattedNumber
                          value={formData.F8 as string || ''}
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
                <Link href="/forms/form-e">Tillbaka: Formulär E</Link>
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
                  <Link href="/forms/form-g">Nästa: Formulär G</Link>
                </Button>
              </div>
            </div>
          </FormCard>
        </form>
      </div>
    </FormWrapper>
  );
} 