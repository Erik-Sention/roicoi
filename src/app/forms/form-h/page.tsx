"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormEvent, useCallback, useEffect, useRef } from "react";
import { useFormData } from "@/lib/hooks/useFormData";
import { useSharedForm } from "@/lib/context/SharedFormContext";
import FormWrapper from "@/components/FormWrapper";
import { toast } from "@/components/ui/use-toast";
import { safeParseNumber } from "@/lib/utils/safeDataHandling";
import { FormattedNumberInput } from "@/components/FormattedNumberInput";
import { FormattedNumber } from "@/components/FormattedNumber";

export default function FormH() {
  const {
    formData,
    setFormData,
    updateField,
    saveForm,
    isLoading,
    isSaving,
    hasUnsavedChanges
  } = useFormData({
    formId: 'form-h',
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
    if (!isLoading && sharedData.organizationName && formData['H1'] !== sharedData.organizationName) {
      updateField('H1', sharedData.organizationName);
    }
  }, [isLoading, sharedData.organizationName, formData, updateField]);
  
  // Use ref to track previous calculated values to avoid unnecessary updates
  const prevCalculatedValuesRef = useRef<Record<string, string>>({});
  
  // Calculate derived values whenever input values change
  useEffect(() => {
    // Only run calculations if we have the necessary input values
    if (!formData) return;
    
    try {
      // Parse input values with fallbacks to 0
      const h4Value = safeParseNumber(formData.H4 as string, 0);
      const h5Value = safeParseNumber(formData.H5 as string, 0);
      const h6Value = safeParseNumber(formData.H6 as string, 0);
      const h7Value = safeParseNumber(formData.H7 as string, 0);
      const h8Value = safeParseNumber(formData.H8 as string, 0);
      const h9Value = safeParseNumber(formData.H9 as string, 0);
      
      // Calculate total external costs
      const totalExternalCosts = h4Value + h5Value + h6Value + h7Value + h8Value + h9Value;
      
      // Create a new calculated values object
      const newCalculatedValues = {
        H10: totalExternalCosts.toFixed(0)
      } as Record<string, string>;
      
      // Check if any values have changed before updating state
      const hasChanges = Object.keys(newCalculatedValues).some(
        key => prevCalculatedValuesRef.current[key] !== newCalculatedValues[key]
      );
      
      if (hasChanges) {
        // Update the form data with new calculated values
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
    formData.H4, formData.H5, formData.H6, 
    formData.H7, formData.H8, formData.H9,
    setFormData
  ]);
  
  const handleInputChange = useCallback((field: string, value: string | number) => {
    // Update the form data
    updateField(field, value);
    
    // If this is a shared field, update the shared context as well
    if (field === 'H1') {
      updateSharedData('organizationName', String(value));
    } else if (field === 'H2') {
      updateSharedData('contactPerson', String(value));
    }
  }, [updateField, updateSharedData]);
  
  const onSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    saveForm();
  }, [saveForm]);
  
  return (
    <FormWrapper
      formId="form-h"
      title="Externa kostnader för insats"
      isLoading={isLoading}
      onRetry={() => window.location.reload()}
    >
      <Card>
        <CardHeader>
          <CardTitle>Form H - Externa kostnader för insats</CardTitle>
          <CardDescription>
            Beräkna externa kostnader för insatser
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={onSubmit}>
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-semibold mb-4 bg-blue-50 p-2">H – Externa kostnader för insats</h3>
              
              <div className="border border-slate-200 rounded-md overflow-hidden mb-6">
                {/* H1 - Organisationsnamn */}
                <div className="grid grid-cols-[60px_1fr_1fr] border-b border-slate-200">
                  <div className="bg-slate-100 p-2 font-medium border-r border-slate-200">H1</div>
                  <div className="p-2 border-r border-slate-200">Organisationens namn:</div>
                  <div className="p-2">
                    <Input 
                      placeholder="Ange organisationens namn" 
                      className="border-0 focus-visible:ring-0"
                      value={formData.H1 as string || sharedData.organizationName || ''}
                      onChange={(e) => handleInputChange('H1', e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                </div>
                
                {/* H2 - Kontaktperson */}
                <div className="grid grid-cols-[60px_1fr_1fr] border-b border-slate-200">
                  <div className="bg-slate-100 p-2 font-medium border-r border-slate-200">H2</div>
                  <div className="p-2 border-r border-slate-200">Kontaktperson</div>
                  <div className="p-2">
                    <Input 
                      placeholder="Ange kontaktperson" 
                      className="border-0 focus-visible:ring-0"
                      value={formData.H2 as string || sharedData.contactPerson || ''}
                      onChange={(e) => handleInputChange('H2', e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                </div>
                
                {/* H3 - Delinsats */}
                <div className="grid grid-cols-[60px_1fr_1fr] border-b border-slate-200">
                  <div className="bg-slate-100 p-2 font-medium border-r border-slate-200">H3</div>
                  <div className="p-2 border-r border-slate-200">Delinsats:</div>
                  <div className="p-2">
                    <Input 
                      placeholder="Ange delinsats" 
                      className="border-0 focus-visible:ring-0"
                      value={formData.H3 as string || ''}
                      onChange={(e) => handleInputChange('H3', e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                </div>
              </div>
              
              <div className="border border-slate-200 rounded-md overflow-hidden mb-6">
                {/* H4 - Fast avgift för insats/offert */}
                <div className="grid grid-cols-[60px_1fr_60px_1fr] border-b border-slate-200">
                  <div className="bg-slate-100 p-2 font-medium border-r border-slate-200">H4</div>
                  <div className="p-2 border-r border-slate-200">
                    <div>Fast avgift för insats/offert</div>
                    <Input 
                      placeholder="Ange beskrivning" 
                      className="border-0 focus-visible:ring-0 mt-1"
                      value={formData.H4_desc as string || ''}
                      onChange={(e) => handleInputChange('H4_desc', e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="p-2 flex items-center justify-center border-r border-slate-200">+</div>
                  <div className="p-2">
                    <FormattedNumberInput
                      placeholder="0"
                      className="border-0 focus-visible:ring-0"
                      value={formData.H4 as string || ''}
                      onChange={(e) => handleInputChange('H4', safeParseNumber(e.target.value, 0))}
                      disabled={isSaving}
                    />
                  </div>
                </div>
                
                {/* H5 - Inhyrd personal */}
                <div className="grid grid-cols-[60px_1fr_60px_1fr] border-b border-slate-200">
                  <div className="bg-slate-100 p-2 font-medium border-r border-slate-200">H5</div>
                  <div className="p-2 border-r border-slate-200">
                    <div>Inhyrd personal</div>
                    <Input 
                      placeholder="Ange beskrivning" 
                      className="border-0 focus-visible:ring-0 mt-1"
                      value={formData.H5_desc as string || ''}
                      onChange={(e) => handleInputChange('H5_desc', e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="p-2 flex items-center justify-center border-r border-slate-200">+</div>
                  <div className="p-2">
                    <FormattedNumberInput
                      placeholder="0"
                      className="border-0 focus-visible:ring-0"
                      value={formData.H5 as string || ''}
                      onChange={(e) => handleInputChange('H5', safeParseNumber(e.target.value, 0))}
                      disabled={isSaving}
                    />
                  </div>
                </div>
                
                {/* H6 - Lokalhyra */}
                <div className="grid grid-cols-[60px_1fr_60px_1fr] border-b border-slate-200">
                  <div className="bg-slate-100 p-2 font-medium border-r border-slate-200">H6</div>
                  <div className="p-2 border-r border-slate-200">
                    <div>Lokalhyra</div>
                    <Input 
                      placeholder="Ange beskrivning" 
                      className="border-0 focus-visible:ring-0 mt-1"
                      value={formData.H6_desc as string || ''}
                      onChange={(e) => handleInputChange('H6_desc', e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="p-2 flex items-center justify-center border-r border-slate-200">+</div>
                  <div className="p-2">
                    <FormattedNumberInput
                      placeholder="0"
                      className="border-0 focus-visible:ring-0"
                      value={formData.H6 as string || ''}
                      onChange={(e) => handleInputChange('H6', safeParseNumber(e.target.value, 0))}
                      disabled={isSaving}
                    />
                  </div>
                </div>
                
                {/* H7 - Resor */}
                <div className="grid grid-cols-[60px_1fr_60px_1fr] border-b border-slate-200">
                  <div className="bg-slate-100 p-2 font-medium border-r border-slate-200">H7</div>
                  <div className="p-2 border-r border-slate-200">
                    <div>Resor</div>
                    <Input 
                      placeholder="Ange beskrivning" 
                      className="border-0 focus-visible:ring-0 mt-1"
                      value={formData.H7_desc as string || ''}
                      onChange={(e) => handleInputChange('H7_desc', e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="p-2 flex items-center justify-center border-r border-slate-200">+</div>
                  <div className="p-2">
                    <FormattedNumberInput
                      placeholder="0"
                      className="border-0 focus-visible:ring-0"
                      value={formData.H7 as string || ''}
                      onChange={(e) => handleInputChange('H7', safeParseNumber(e.target.value, 0))}
                      disabled={isSaving}
                    />
                  </div>
                </div>
                
                {/* H8 - Utrustning och inventarier */}
                <div className="grid grid-cols-[60px_1fr_60px_1fr] border-b border-slate-200">
                  <div className="bg-slate-100 p-2 font-medium border-r border-slate-200">H8</div>
                  <div className="p-2 border-r border-slate-200">
                    <div>Utrustning och inventarier</div>
                    <Input 
                      placeholder="Ange beskrivning" 
                      className="border-0 focus-visible:ring-0 mt-1"
                      value={formData.H8_desc as string || ''}
                      onChange={(e) => handleInputChange('H8_desc', e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="p-2 flex items-center justify-center border-r border-slate-200">+</div>
                  <div className="p-2">
                    <FormattedNumberInput
                      placeholder="0"
                      className="border-0 focus-visible:ring-0"
                      value={formData.H8 as string || ''}
                      onChange={(e) => handleInputChange('H8', safeParseNumber(e.target.value, 0))}
                      disabled={isSaving}
                    />
                  </div>
                </div>
                
                {/* H9 - Övriga externa tjänster */}
                <div className="grid grid-cols-[60px_1fr_60px_1fr] border-b border-slate-200">
                  <div className="bg-slate-100 p-2 font-medium border-r border-slate-200">H9</div>
                  <div className="p-2 border-r border-slate-200">
                    <div>Övriga externa tjänster</div>
                    <Input 
                      placeholder="Ange beskrivning" 
                      className="border-0 focus-visible:ring-0 mt-1"
                      value={formData.H9_desc as string || ''}
                      onChange={(e) => handleInputChange('H9_desc', e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="p-2 flex items-center justify-center border-r border-slate-200">+</div>
                  <div className="p-2">
                    <FormattedNumberInput
                      placeholder="0"
                      className="border-0 focus-visible:ring-0"
                      value={formData.H9 as string || ''}
                      onChange={(e) => handleInputChange('H9', safeParseNumber(e.target.value, 0))}
                      disabled={isSaving}
                    />
                  </div>
                </div>
                
                {/* H10 - Summa externa kostnader */}
                <div className="grid grid-cols-[60px_1fr_60px_1fr] bg-slate-50">
                  <div className="bg-slate-100 p-2 font-medium border-r border-slate-200">H10</div>
                  <div className="p-2 border-r border-slate-200 font-medium">Summa externa kostnader</div>
                  <div className="p-2 flex items-center justify-center border-r border-slate-200">=</div>
                  <div className="p-2">
                    <FormattedNumber
                      value={formData.H10 as string || '0'}
                      className="border-0 focus-visible:ring-0 bg-transparent font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                asChild
              >
                <Link href="/forms/form-g">Tillbaka: Formulär G</Link>
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
                  <Link href="/forms/form-i">Nästa: Formulär I</Link>
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </FormWrapper>
  );
} 