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

export default function FormD() {
  const {
    formData,
    setFormData,
    updateField,
    saveForm,
    isLoading,
    isSaving,
    hasUnsavedChanges
  } = useFormData({
    formId: 'form-d',
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
  
  // Use a ref to track the previous value of D9 to prevent infinite loops
  const prevD9Ref = useRef<string>('');
  
  // Use a ref to track previous calculated values to avoid unnecessary updates
  const prevCalculatedValuesRef = useRef<Record<string, string>>({});
  
  // Calculate derived values whenever input values change
  useEffect(() => {
    // Only run calculations if we have the necessary input values
    if (!formData) return;
    
    try {
      // Parse input values with fallbacks to 0
      const monthlyWage = safeParseNumber(formData.D1 as string, 0);
      const socialFeesPercentage = safeParseNumber(formData.D2 as string, 0);
      const numEmployees = safeParseNumber(formData.D4 as string, 0);
      const numMonths = safeParseNumber(formData.D5 as string, 0) || 12; // Default to 12 months if not specified
      const overheadPercentage = safeParseNumber(formData.D7 as string, 0);
      const workHoursPerYear = safeParseNumber(formData.D10 as string, 0);
      
      // D3 - Calculate social fees per month
      const socialFeesPerMonth = monthlyWage * (socialFeesPercentage / 100);
      
      // D6 - Calculate total wage costs using the correct formula: (D1 + D3) × D4 × D5
      const totalWageCosts = (monthlyWage + socialFeesPerMonth) * numEmployees * numMonths;
      
      // D8 - Calculate total personnel overhead costs
      const totalPersonnelOverheadCosts = totalWageCosts * (overheadPercentage / 100);
      
      // D9 - Calculate total personnel costs
      const totalPersonnelCosts = totalWageCosts + totalPersonnelOverheadCosts;
      const totalPersonnelCostsStr = totalPersonnelCosts.toFixed(0);
      
      // D11 - Calculate personnel cost per worked hour
      let costPerWorkedHour = 0;
      if (workHoursPerYear > 0 && numEmployees > 0) {
        costPerWorkedHour = totalPersonnelCosts / (workHoursPerYear * numEmployees);
      }
      
      // Create a new calculated values object
      const newCalculatedValues: Record<string, string> = {
        D3: socialFeesPerMonth.toFixed(0),
        D6: totalWageCosts.toFixed(0),
        D8: totalPersonnelOverheadCosts.toFixed(0),
        D9: totalPersonnelCostsStr,
        D11: costPerWorkedHour.toFixed(0)
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
    formData.D1, 
    formData.D2, 
    formData.D4, 
    formData.D5,
    formData.D7,
    formData.D10,
    setFormData
  ]);
  
  // Separate useEffect to handle sharing D9 value to prevent infinite loops
  useEffect(() => {
    if (!formData || !formData.D9) return;
    
    const currentD9 = formData.D9 as string;
    
    // Only update shared data if D9 has actually changed
    if (currentD9 !== prevD9Ref.current) {
      console.log(`D9 changed from ${prevD9Ref.current} to ${currentD9}`);
      
      // Update the ref with the new value
      prevD9Ref.current = currentD9;
      
      // Share D9 value with other forms via SharedFormContext
      updateSharedData('totalPersonnelCosts', currentD9);
    }
  }, [formData, formData?.D9, updateSharedData]);
  
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
      formId="form-d"
      title="D – Beräkning av personalkostnader"
      isLoading={isLoading}
      onRetry={() => window.location.reload()}
    >
      <div className="space-y-6">
        <form onSubmit={onSubmit}>
          <FormCard id="D" label="Beräkning av personalkostnader">
            <div className="border rounded-md overflow-hidden">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b">
                    <td className="border-r p-3 bg-muted/20 w-24 font-medium">D1</td>
                    <td className="border-r p-3 w-1/2">Genomsnittlig månadslön</td>
                    <td className="p-3 w-1/2">
                      <div className="flex items-center justify-between">
                        <span className="mr-2"></span>
                        <div className="flex items-center">
                          <FormattedNumberInput 
                            placeholder="0" 
                            className="w-32 text-right"
                            value={formData.D1 as string || ''}
                            onChange={(e) => handleInputChange('D1', safeParseNumber(e.target.value, 0))}
                            disabled={isSaving}
                          />
                          <span className="ml-2">→</span>
                          <span className="ml-2">+</span>
                          <FormattedNumber 
                            value={formData.D1 as string || ''}
                            className="w-32 ml-2 text-right"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border-r p-3 bg-muted/20 font-medium">D2</td>
                    <td className="border-r p-3">Sociala avgifter inkl arb.givaravgift, tjänstepension och försäkringar (%).</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end">
                        <span className="mr-2">*</span>
                        <FormattedNumberInput 
                          placeholder="0" 
                          className="w-32 text-right"
                          value={formData.D2 as string || ''}
                          onChange={(e) => handleInputChange('D2', safeParseNumber(e.target.value, 0))}
                          disabled={isSaving}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border-r p-3 bg-muted/20 font-medium">D3</td>
                    <td className="border-r p-3">Genomsnittliga sociala avgifter per månad</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end">
                        <span className="mr-2">=</span>
                        <FormattedNumber 
                          value={formData.D3 as string || ''}
                          className="w-32 text-right"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border-r p-3 bg-muted/20 font-medium">D4</td>
                    <td className="border-r p-3">Antal anställda (motsvarande heltidstjänster/FTE)</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end">
                        <span className="mr-2">*</span>
                        <FormattedNumberInput 
                          placeholder="0" 
                          className="w-32 text-right"
                          value={formData.D4 as string || ''}
                          onChange={(e) => handleInputChange('D4', safeParseNumber(e.target.value, 0))}
                          disabled={isSaving}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border-r p-3 bg-muted/20 font-medium">D5</td>
                    <td className="border-r p-3">Antal månader som beräkningen avser</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end">
                        <span className="mr-2">=</span>
                        <FormattedNumber 
                          value={formData.D5 as string || ''}
                          className="w-32 text-right"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border-r p-3 bg-muted/20 font-medium">D6</td>
                    <td className="border-r p-3">Totala lönekostnader, kr.</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end">
                        <span className="mr-2">*</span>
                        <FormattedNumberInput 
                          placeholder="0" 
                          className="w-32 text-right"
                          value={formData.D6 as string || ''}
                          onChange={(e) => handleInputChange('D6', safeParseNumber(e.target.value, 0))}
                          disabled={isSaving}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border-r p-3 bg-muted/20 font-medium">D7</td>
                    <td className="border-r p-3">Personalkringkostnader i % av lönekostnader</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end">
                        <span className="mr-2">*</span>
                        <FormattedNumberInput 
                          placeholder="0" 
                          className="w-32 text-right"
                          value={formData.D7 as string || ''}
                          onChange={(e) => handleInputChange('D7', safeParseNumber(e.target.value, 0))}
                          disabled={isSaving}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border-r p-3 bg-muted/20 font-medium">D8</td>
                    <td className="border-r p-3">Totala personalkringkostnader, kr</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end">
                        <span className="mr-2">+</span>
                        <FormattedNumber 
                          value={formData.D8 as string || ''}
                          className="w-32 text-right"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border-r p-3 bg-muted/20 font-medium">D9</td>
                    <td className="border-r p-3">Totala personalkostnader, kr. Överförs till C4</td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <FormattedNumber 
                          value={formData.D9 as string || ''}
                          className="w-full p-2 bg-gray-50"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border-r p-3 bg-muted/20 font-medium">D10</td>
                    <td className="border-r p-3">Schemalagd arbetstid (timmar) per år</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end">
                        <FormattedNumberInput 
                          placeholder="0" 
                          className="w-32 text-right"
                          value={formData.D10 as string || ''}
                          onChange={(e) => handleInputChange('D10', safeParseNumber(e.target.value, 0))}
                          disabled={isSaving}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="border-r p-3 bg-muted/20 font-medium">D11</td>
                    <td className="border-r p-3">Personalkostnad kr: per arbetad timme</td>
                    <td className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="mr-2">=</span>
                        <div className="text-right">
                          <div className="text-xs">Beräkna D9 / D4 /D10</div>
                          <FormattedNumber 
                            value={formData.D11 as string || ''}
                            className="w-32 text-right"
                          />
                        </div>
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
                <Link href="/forms/form-c">Tillbaka: Formulär C</Link>
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
                  <Link href="/forms/form-e">Nästa: Formulär E</Link>
                </Button>
              </div>
            </div>
          </FormCard>
        </form>
      </div>
    </FormWrapper>
  );
} 