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

export default function FormG() {
  const {
    formData,
    setFormData,
    updateField,
    saveForm,
    isLoading,
    isSaving,
    hasUnsavedChanges
  } = useFormData({
    formId: 'form-g',
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
  
  // Use refs to track previous values and avoid unnecessary updates
  const prevCalculatedValuesRef = useRef<Record<string, string>>({});
  
  // Calculate derived values whenever input values change
  useEffect(() => {
    // Only run calculations if we have the necessary input values
    if (!formData) return;
    
    try {
      // Calculate totals for each section
      
      // Section 1 (G4-G8)
      const section1ExternalCosts = [
        safeParseNumber(formData.G5_external as string, 0),
        safeParseNumber(formData.G6_external as string, 0),
        safeParseNumber(formData.G7_external as string, 0),
        safeParseNumber(formData.G8_external as string, 0)
      ];
      
      const section1InternalCosts = [
        safeParseNumber(formData.G5_internal as string, 0),
        safeParseNumber(formData.G6_internal as string, 0),
        safeParseNumber(formData.G7_internal as string, 0),
        safeParseNumber(formData.G8_internal as string, 0)
      ];
      
      const section1ExternalTotal = section1ExternalCosts.reduce((sum, cost) => sum + cost, 0);
      const section1InternalTotal = section1InternalCosts.reduce((sum, cost) => sum + cost, 0);
      const section1Total = section1ExternalTotal + section1InternalTotal;
      
      // Section 2 (G10-G14)
      const section2ExternalCosts = [
        safeParseNumber(formData.G11_external as string, 0),
        safeParseNumber(formData.G12_external as string, 0),
        safeParseNumber(formData.G13_external as string, 0),
        safeParseNumber(formData.G14_external as string, 0)
      ];
      
      const section2InternalCosts = [
        safeParseNumber(formData.G11_internal as string, 0),
        safeParseNumber(formData.G12_internal as string, 0),
        safeParseNumber(formData.G13_internal as string, 0),
        safeParseNumber(formData.G14_internal as string, 0)
      ];
      
      const section2ExternalTotal = section2ExternalCosts.reduce((sum, cost) => sum + cost, 0);
      const section2InternalTotal = section2InternalCosts.reduce((sum, cost) => sum + cost, 0);
      const section2Total = section2ExternalTotal + section2InternalTotal;
      
      // Section 3 (G16-G20)
      const section3ExternalCosts = [
        safeParseNumber(formData.G17_external as string, 0),
        safeParseNumber(formData.G18_external as string, 0),
        safeParseNumber(formData.G19_external as string, 0),
        safeParseNumber(formData.G20_external as string, 0)
      ];
      
      const section3InternalCosts = [
        safeParseNumber(formData.G17_internal as string, 0),
        safeParseNumber(formData.G18_internal as string, 0),
        safeParseNumber(formData.G19_internal as string, 0),
        safeParseNumber(formData.G20_internal as string, 0)
      ];
      
      const section3ExternalTotal = section3ExternalCosts.reduce((sum, cost) => sum + cost, 0);
      const section3InternalTotal = section3InternalCosts.reduce((sum, cost) => sum + cost, 0);
      const section3Total = section3ExternalTotal + section3InternalTotal;
      
      // Section 4 (G22-G26)
      const section4ExternalCosts = [
        safeParseNumber(formData.G23_external as string, 0),
        safeParseNumber(formData.G24_external as string, 0),
        safeParseNumber(formData.G25_external as string, 0),
        safeParseNumber(formData.G26_external as string, 0)
      ];
      
      const section4InternalCosts = [
        safeParseNumber(formData.G23_internal as string, 0),
        safeParseNumber(formData.G24_internal as string, 0),
        safeParseNumber(formData.G25_internal as string, 0),
        safeParseNumber(formData.G26_internal as string, 0)
      ];
      
      const section4ExternalTotal = section4ExternalCosts.reduce((sum, cost) => sum + cost, 0);
      const section4InternalTotal = section4InternalCosts.reduce((sum, cost) => sum + cost, 0);
      const section4Total = section4ExternalTotal + section4InternalTotal;
      
      // Section 5 (G28-G32)
      const section5ExternalCosts = [
        safeParseNumber(formData.G29_external as string, 0),
        safeParseNumber(formData.G30_external as string, 0),
        safeParseNumber(formData.G31_external as string, 0),
        safeParseNumber(formData.G32_external as string, 0)
      ];
      
      const section5InternalCosts = [
        safeParseNumber(formData.G29_internal as string, 0),
        safeParseNumber(formData.G30_internal as string, 0),
        safeParseNumber(formData.G31_internal as string, 0),
        safeParseNumber(formData.G32_internal as string, 0)
      ];
      
      const section5ExternalTotal = section5ExternalCosts.reduce((sum, cost) => sum + cost, 0);
      const section5InternalTotal = section5InternalCosts.reduce((sum, cost) => sum + cost, 0);
      const section5Total = section5ExternalTotal + section5InternalTotal;
      
      // Calculate grand totals
      const totalExternalCosts = section1ExternalTotal + section2ExternalTotal + section3ExternalTotal + section4ExternalTotal + section5ExternalTotal;
      const totalInternalCosts = section1InternalTotal + section2InternalTotal + section3InternalTotal + section4InternalTotal + section5InternalTotal;
      const grandTotal = totalExternalCosts + totalInternalCosts;
      
      // Create a new calculated values object
      const newCalculatedValues = {
        // Section 1 totals
        G9_external: section1ExternalTotal.toFixed(0),
        G9_internal: section1InternalTotal.toFixed(0),
        G9_total: section1Total.toFixed(0),
        
        // Section 2 totals
        G15_external: section2ExternalTotal.toFixed(0),
        G15_internal: section2InternalTotal.toFixed(0),
        G15_total: section2Total.toFixed(0),
        
        // Section 3 totals
        G21_external: section3ExternalTotal.toFixed(0),
        G21_internal: section3InternalTotal.toFixed(0),
        G21_total: section3Total.toFixed(0),
        
        // Section 4 totals
        G27_external: section4ExternalTotal.toFixed(0),
        G27_internal: section4InternalTotal.toFixed(0),
        G27_total: section4Total.toFixed(0),
        
        // Section 5 totals
        G33_external: section5ExternalTotal.toFixed(0),
        G33_internal: section5InternalTotal.toFixed(0),
        G33_total: section5Total.toFixed(0),
        
        // Grand total
        G34_external: totalExternalCosts.toFixed(0),
        G34_internal: totalInternalCosts.toFixed(0),
        G34_total: grandTotal.toFixed(0)
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
    // Section 1 dependencies
    formData.G5_external, formData.G5_internal,
    formData.G6_external, formData.G6_internal,
    formData.G7_external, formData.G7_internal,
    formData.G8_external, formData.G8_internal,
    
    // Section 2 dependencies
    formData.G11_external, formData.G11_internal,
    formData.G12_external, formData.G12_internal,
    formData.G13_external, formData.G13_internal,
    formData.G14_external, formData.G14_internal,
    
    // Section 3 dependencies
    formData.G17_external, formData.G17_internal,
    formData.G18_external, formData.G18_internal,
    formData.G19_external, formData.G19_internal,
    formData.G20_external, formData.G20_internal,
    
    // Section 4 dependencies
    formData.G23_external, formData.G23_internal,
    formData.G24_external, formData.G24_internal,
    formData.G25_external, formData.G25_internal,
    formData.G26_external, formData.G26_internal,
    
    // Section 5 dependencies
    formData.G29_external, formData.G29_internal,
    formData.G30_external, formData.G30_internal,
    formData.G31_external, formData.G31_internal,
    formData.G32_external, formData.G32_internal,
    
    setFormData
  ]);
  
  const handleInputChange = useCallback((field: string, value: string | number) => {
    // Update the form data
    updateField(field, value);
    
    // If this is a shared field, update the shared context as well
    if (field === 'G1') {
      updateSharedData('organizationName', String(value));
    } else if (field === 'G2') {
      updateSharedData('contactPerson', String(value));
    }
  }, [updateField, updateSharedData]);
  
  const onSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    saveForm();
  }, [saveForm]);
  
  // Helper function to render an insatsnamn row (header row without cost fields)
  const renderInsatsRow = (id: string) => (
    <div className="grid grid-cols-[1fr_1fr_1fr] border-b bg-muted/5">
      <div className="p-2 flex items-center col-span-3">
        <span className="bg-muted px-2 py-1 mr-2 font-medium">{id}</span>
        <span>Insatsnamn:</span>
        <Input 
          placeholder="Ange insatsnamn" 
          className="ml-2 border-0 focus-visible:ring-0 w-1/2"
          value={formData[`${id}_name`] as string || ''}
          onChange={(e) => handleInputChange(`${id}_name`, e.target.value)}
          disabled={isSaving}
        />
      </div>
    </div>
  );
  
  // Helper function to render a delinsats row
  const renderDelinsatsRow = (id: string) => (
    <div className="grid grid-cols-[1fr_1fr_1fr] border-b">
      <div className="p-2 flex items-center">
        <span className="bg-muted px-2 py-1 mr-2 font-medium">{id}</span>
        <span>Delinsats:</span>
        <Input 
          placeholder="Ange delinsats" 
          className="ml-2 border-0 focus-visible:ring-0"
          value={formData[`${id}_name`] as string || ''}
          onChange={(e) => handleInputChange(`${id}_name`, e.target.value)}
          disabled={isSaving}
        />
      </div>
      <div className="p-2">
        <FormattedNumberInput 
          placeholder="0" 
          className="border-0 focus-visible:ring-0"
          value={formData[`${id}_external`] as string || ''}
          onChange={(e) => handleInputChange(`${id}_external`, safeParseNumber(e.target.value, 0))}
          disabled={isSaving}
        />
      </div>
      <div className="p-2">
        <FormattedNumberInput 
          placeholder="0" 
          className="border-0 focus-visible:ring-0"
          value={formData[`${id}_internal`] as string || ''}
          onChange={(e) => handleInputChange(`${id}_internal`, safeParseNumber(e.target.value, 0))}
          disabled={isSaving}
        />
      </div>
    </div>
  );
  
  // Helper function to render a subtotal row
  const renderSubtotalRow = (id: string) => (
    <div className="grid grid-cols-[1fr_1fr_1fr] border-b bg-muted/10">
      <div className="p-2 flex items-center font-medium">
        <span className="bg-muted px-2 py-1 mr-2">{id}</span>
        <span>Delsumma:</span>
      </div>
      <div className="p-2 font-medium">
        <FormattedNumber 
          value={formData[`${id}_external`] as string || '0'}
          className="border-0 focus-visible:ring-0 bg-transparent font-medium"
        />
      </div>
      <div className="p-2 font-medium">
        <FormattedNumber 
          value={formData[`${id}_internal`] as string || '0'}
          className="border-0 focus-visible:ring-0 bg-transparent font-medium"
        />
      </div>
    </div>
  );
  
  // Helper function to render a total row for each section
  const renderSectionTotalRow = (id: string) => (
    <div className="grid grid-cols-[1fr_2fr] border-b bg-muted/20">
      <div className="p-2 flex items-center font-medium">
        <span className="bg-muted px-2 py-1 mr-2">{id}</span>
        <span>Totalt för insatsen:</span>
      </div>
      <div className="p-2 font-medium">
        <FormattedNumber 
          value={formData[`${id}_total`] as string || '0'}
          className="border-0 focus-visible:ring-0 bg-transparent font-medium"
        />
      </div>
    </div>
  );
  
  // Helper function to render the grand total row
  const renderGrandTotalRow = (id: string) => (
    <div className="grid grid-cols-[1fr_1fr_1fr] bg-muted/20 border-t-2 border-t-black">
      <div className="p-2 flex items-center font-medium">
        <span className="bg-muted px-2 py-1 mr-2">{id}</span>
        <span>TOTALT:</span>
      </div>
      <div className="p-2 font-medium">
        <FormattedNumber 
          value={formData[`${id}_external`] as string || '0'}
          className="border-0 focus-visible:ring-0 bg-transparent font-medium"
        />
      </div>
      <div className="p-2 font-medium">
        <FormattedNumber 
          value={formData[`${id}_internal`] as string || '0'}
          className="border-0 focus-visible:ring-0 bg-transparent font-medium"
        />
      </div>
    </div>
  );
  
  // Helper function to render the final grand total row
  const renderFinalTotalRow = (id: string) => (
    <div className="grid grid-cols-[1fr_2fr] bg-muted/30 border-t-2 border-t-black">
      <div className="p-2 flex items-center font-medium">
        <span className="bg-muted px-2 py-1 mr-2">{id}</span>
        <span>TOTALT ALLA INSATSER:</span>
      </div>
      <div className="p-2 font-medium">
        <FormattedNumber 
          value={formData[`${id}_total`] as string || '0'}
          className="border-0 focus-visible:ring-0 bg-transparent font-medium"
        />
      </div>
    </div>
  );
  
  return (
    <FormWrapper
      formId="form-g"
      title="Sammanfattning av Insatskostnader"
      isLoading={isLoading}
      onRetry={() => window.location.reload()}
    >
      <Card>
        <CardHeader>
          <CardTitle>Form G - Sammanfattning av Insatskostnader</CardTitle>
          <CardDescription>
            Sammanställning av kostnader för insatser
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={onSubmit}>
            <div className="border rounded-md p-4">
              <h3 className="text-lg font-semibold mb-4">G - Sammanfattning av Insatskostnader</h3>
              
              <div className="border rounded-md overflow-hidden mb-6">
                <div className="grid grid-cols-[100px_1fr_1fr] border-b">
                  <div className="bg-muted p-2 font-medium border-r">G1</div>
                  <div className="p-2 border-r">Organisationens namn:</div>
                  <div className="p-2">
                    <Input 
                      placeholder="Ange organisationens namn" 
                      className="border-0 focus-visible:ring-0"
                      value={formData.G1 as string || sharedData.organizationName || ''}
                      onChange={(e) => handleInputChange('G1', e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-[100px_1fr_1fr] border-b">
                  <div className="bg-muted p-2 font-medium border-r">G2</div>
                  <div className="p-2 border-r">Kontaktperson</div>
                  <div className="p-2">
                    <Input 
                      placeholder="Ange kontaktperson" 
                      className="border-0 focus-visible:ring-0"
                      value={formData.G2 as string || sharedData.contactPerson || ''}
                      onChange={(e) => handleInputChange('G2', e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-[100px_1fr_1fr_50px_1fr]">
                  <div className="bg-muted p-2 font-medium border-r">G3</div>
                  <div className="p-2 border-r">Tidperiod (12 månader)</div>
                  <div className="p-2 border-r">
                    <Input 
                      type="date" 
                      placeholder="Startdatum" 
                      className="border-0 focus-visible:ring-0"
                      value={formData.G3_start as string || ''}
                      onChange={(e) => handleInputChange('G3_start', e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="p-2 flex items-center justify-center border-r">-</div>
                  <div className="p-2">
                    <Input 
                      type="date" 
                      placeholder="Slutdatum" 
                      className="border-0 focus-visible:ring-0"
                      value={formData.G3_end as string || ''}
                      onChange={(e) => handleInputChange('G3_end', e.target.value)}
                      disabled={isSaving}
                    />
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground mb-2">För varje rad, skapa eventuellt en blankett H resp. I</div>
              
              {/* Column headers for costs */}
              <div className="grid grid-cols-[1fr_1fr_1fr] gap-0 mb-2 border rounded-md overflow-hidden">
                <div className="p-2"></div>
                <div className="p-2 text-center font-medium bg-muted/10">Externa kostnader</div>
                <div className="p-2 text-center font-medium bg-muted/10">Interna kostnader</div>
              </div>
              
              {/* Section 1 (G4-G8) */}
              <div className="border rounded-md overflow-hidden mb-4">
                {renderInsatsRow('G4')}
                {renderDelinsatsRow('G5')}
                {renderDelinsatsRow('G6')}
                {renderDelinsatsRow('G7')}
                {renderDelinsatsRow('G8')}
                {renderSubtotalRow('G9')}
                {renderSectionTotalRow('G9')}
                </div>
                
              {/* Section 2 (G10-G14) */}
              <div className="border rounded-md overflow-hidden mb-4">
                {renderInsatsRow('G10')}
                {renderDelinsatsRow('G11')}
                {renderDelinsatsRow('G12')}
                {renderDelinsatsRow('G13')}
                {renderDelinsatsRow('G14')}
                {renderSubtotalRow('G15')}
                {renderSectionTotalRow('G15')}
                </div>
                
              {/* Section 3 (G16-G20) */}
              <div className="border rounded-md overflow-hidden mb-4">
                {renderInsatsRow('G16')}
                {renderDelinsatsRow('G17')}
                {renderDelinsatsRow('G18')}
                {renderDelinsatsRow('G19')}
                {renderDelinsatsRow('G20')}
                {renderSubtotalRow('G21')}
                {renderSectionTotalRow('G21')}
                </div>
                
              {/* Section 4 (G22-G26) */}
              <div className="border rounded-md overflow-hidden mb-4">
                {renderInsatsRow('G22')}
                {renderDelinsatsRow('G23')}
                {renderDelinsatsRow('G24')}
                {renderDelinsatsRow('G25')}
                {renderDelinsatsRow('G26')}
                {renderSubtotalRow('G27')}
                {renderSectionTotalRow('G27')}
                </div>
                
              {/* Section 5 (G28-G32) */}
              <div className="border rounded-md overflow-hidden mb-4">
                {renderInsatsRow('G28')}
                {renderDelinsatsRow('G29')}
                {renderDelinsatsRow('G30')}
                {renderDelinsatsRow('G31')}
                {renderDelinsatsRow('G32')}
                {renderSubtotalRow('G33')}
                {renderSectionTotalRow('G33')}
                </div>
                
              {/* Grand Total (G34) */}
              <div className="border rounded-md overflow-hidden mb-4">
                {renderGrandTotalRow('G34')}
                {renderFinalTotalRow('G34')}
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                asChild
              >
                <Link href="/forms/form-f">Tillbaka: Formulär F</Link>
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
                  <Link href="/forms/form-h">Nästa: Formulär H</Link>
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </FormWrapper>
  );
} 