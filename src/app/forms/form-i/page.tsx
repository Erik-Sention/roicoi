"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useFormData } from "@/lib/hooks/useFormData";
import { useSharedForm } from "@/lib/context/SharedFormContext";
import FormWrapper from "@/components/FormWrapper";
import { toast } from "@/components/ui/use-toast";
import { getFormByFormId } from "@/lib/firebase/formSubmission";
import Link from "next/link";
import { FormattedNumberInput } from "@/components/FormattedNumberInput";
import { FormattedNumber } from "@/components/FormattedNumber";

export default function FormI() {
  const {
    formData,
    updateField,
    saveForm,
    isLoading,
    isSaving,
  } = useFormData({
    formId: 'form-i',
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
    if (!isLoading && sharedData.organizationName && formData['I1'] !== sharedData.organizationName) {
      updateField('I1', sharedData.organizationName);
    }
  }, [isLoading, sharedData.organizationName, formData, updateField]);
  
  // Refs to track previous calculated values to prevent infinite loops
  const prevI6Ref = useRef<string | null>(null);
  const prevI8Ref = useRef<string | null>(null);
  const prevI10Ref = useRef<string | null>(null);
  const prevI13Ref = useRef<string | null>(null);
  const prevI15Ref = useRef<string | null>(null);
  const prevI17Ref = useRef<string | null>(null);
  const prevI20Ref = useRef<string | null>(null);
  const prevI22Ref = useRef<string | null>(null);
  const prevI24Ref = useRef<string | null>(null);
  const prevI25Ref = useRef<string | null>(null);
  const prevI26Ref = useRef<string | null>(null);
  
  // Add a ref to track the previous value of D11
  const prevD11Ref = useRef<string | null>(null);
  
  // State to track whether each field should use D11 or manual input
  const [useD11ForI9, setUseD11ForI9] = useState(true);
  const [useD11ForI16, setUseD11ForI16] = useState(true);
  const [useD11ForI23, setUseD11ForI23] = useState(true);
  
  // Initialize toggle states from form data when it loads
  useEffect(() => {
    if (!isLoading && formData) {
      // Set toggle states from form data, defaulting to true if not present
      setUseD11ForI9(formData.useD11ForI9 !== undefined ? Boolean(formData.useD11ForI9) : true);
      setUseD11ForI16(formData.useD11ForI16 !== undefined ? Boolean(formData.useD11ForI16) : true);
      setUseD11ForI23(formData.useD11ForI23 !== undefined ? Boolean(formData.useD11ForI23) : true);
    }
  }, [isLoading, formData]);
  
  // Update form data when toggle states change
  const handleToggleChange = useCallback((field: string, value: boolean) => {
    updateField(field, value);
    
    // If toggling on, we'll need to fetch D11 value
    if (value) {
      const fetchD11AndUpdate = async (targetField: string) => {
        try {
          const formD = await getFormByFormId('form-d');
          if (formD && formD.data && formD.data.D11) {
            const d11Value = String(formD.data.D11 || '0');
            updateField(targetField, d11Value);
          }
        } catch (error) {
          console.error(`Error fetching D11 for ${targetField}:`, error);
        }
      };
      
      if (field === 'useD11ForI9') fetchD11AndUpdate('I9');
      if (field === 'useD11ForI16') fetchD11AndUpdate('I16');
      if (field === 'useD11ForI23') fetchD11AndUpdate('I23');
    }
  }, [updateField]);
  
  // Safe parsing function to handle empty values
  const safeParseFloat = (value: string | undefined): number => {
    if (!value) return 0;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };
  
  // Calculate I6 (time in hours) when I4 (time in minutes) changes
  useEffect(() => {
    if (formData.I4 === undefined) return;
    
    const minutes = safeParseFloat(formData.I4 as string);
    const hours = (minutes / 60).toFixed(2);
    
    if (prevI6Ref.current !== hours) {
      updateField('I6', hours);
      prevI6Ref.current = hours;
    }
  }, [formData.I4, updateField]);
  
  // Calculate I8 (total time) when I6 (time in hours) or I7 (number of employees) changes
  useEffect(() => {
    if (formData.I6 === undefined || formData.I7 === undefined) return;
    
    const hours = safeParseFloat(formData.I6 as string);
    const employees = safeParseFloat(formData.I7 as string);
    const totalHours = (hours * employees).toFixed(2);
    
    if (prevI8Ref.current !== totalHours) {
      updateField('I8', totalHours);
      prevI8Ref.current = totalHours;
    }
  }, [formData.I6, formData.I7, updateField]);
  
  // Calculate I10 (total value) when I8 (total time) or I9 (hourly cost) changes
  useEffect(() => {
    if (formData.I8 === undefined || formData.I9 === undefined) return;
    
    const totalHours = safeParseFloat(formData.I8 as string);
    const hourlyCost = safeParseFloat(formData.I9 as string);
    const totalValue = Math.round(totalHours * hourlyCost).toString();
    
    if (prevI10Ref.current !== totalValue) {
      updateField('I10', totalValue);
      prevI10Ref.current = totalValue;
    }
  }, [formData.I8, formData.I9, updateField]);
  
  // Calculate I13 (time in hours) when I11 (time in minutes) changes
  useEffect(() => {
    if (formData.I11 === undefined) return;
    
    const minutes = safeParseFloat(formData.I11 as string);
    const hours = (minutes / 60).toFixed(2);
    
    if (prevI13Ref.current !== hours) {
      updateField('I13', hours);
      prevI13Ref.current = hours;
    }
  }, [formData.I11, updateField]);
  
  // Calculate I15 (total time) when I13 (time in hours) or I14 (number of managers) changes
  useEffect(() => {
    if (formData.I13 === undefined || formData.I14 === undefined) return;
    
    const hours = safeParseFloat(formData.I13 as string);
    const managers = safeParseFloat(formData.I14 as string);
    const totalHours = (hours * managers).toFixed(2);
    
    if (prevI15Ref.current !== totalHours) {
      updateField('I15', totalHours);
      prevI15Ref.current = totalHours;
    }
  }, [formData.I13, formData.I14, updateField]);
  
  // Calculate I17 (total value) when I15 (total time) or I16 (hourly cost) changes
  useEffect(() => {
    if (formData.I15 === undefined || formData.I16 === undefined) return;
    
    const totalHours = safeParseFloat(formData.I15 as string);
    const hourlyCost = safeParseFloat(formData.I16 as string);
    const totalValue = Math.round(totalHours * hourlyCost).toString();
    
    if (prevI17Ref.current !== totalValue) {
      updateField('I17', totalValue);
      prevI17Ref.current = totalValue;
    }
  }, [formData.I15, formData.I16, updateField]);
  
  // Calculate I20 (time in hours) when I18 (time in minutes) changes
  useEffect(() => {
    if (formData.I18 === undefined) return;
    
    const minutes = safeParseFloat(formData.I18 as string);
    const hours = (minutes / 60).toFixed(2);
    
    if (prevI20Ref.current !== hours) {
      updateField('I20', hours);
      prevI20Ref.current = hours;
    }
  }, [formData.I18, updateField]);
  
  // Calculate I22 (total time) when I20 (time in hours) or I21 (number of admin staff) changes
  useEffect(() => {
    if (formData.I20 === undefined || formData.I21 === undefined) return;
    
    const hours = safeParseFloat(formData.I20 as string);
    const adminStaff = safeParseFloat(formData.I21 as string);
    const totalHours = (hours * adminStaff).toFixed(2);
    
    if (prevI22Ref.current !== totalHours) {
      updateField('I22', totalHours);
      prevI22Ref.current = totalHours;
    }
  }, [formData.I20, formData.I21, updateField]);
  
  // Calculate I24 (total value) when I22 (total time) or I23 (hourly cost) changes
  useEffect(() => {
    if (formData.I22 === undefined || formData.I23 === undefined) return;
    
    const totalHours = safeParseFloat(formData.I22 as string);
    const hourlyCost = safeParseFloat(formData.I23 as string);
    const totalValue = Math.round(totalHours * hourlyCost).toString();
    
    if (prevI24Ref.current !== totalValue) {
      updateField('I24', totalValue);
      prevI24Ref.current = totalValue;
    }
  }, [formData.I22, formData.I23, updateField]);
  
  // Calculate I25 (total time) when I8, I15, or I22 changes
  useEffect(() => {
    // Only proceed if at least one of the values exists
    if (formData.I8 === undefined && formData.I15 === undefined && formData.I22 === undefined) return;
    
    const totalHoursEmployees = safeParseFloat(formData.I8 as string);
    const totalHoursManagers = safeParseFloat(formData.I15 as string);
    const totalHoursAdmin = safeParseFloat(formData.I22 as string);
    
    const totalHours = (totalHoursEmployees + totalHoursManagers + totalHoursAdmin).toFixed(2);
    
    if (prevI25Ref.current !== totalHours) {
      updateField('I25', totalHours);
      prevI25Ref.current = totalHours;
    }
  }, [formData.I8, formData.I15, formData.I22, updateField]);
  
  // Calculate I26 (total labor cost) when I10, I17, or I24 changes
  useEffect(() => {
    // Only proceed if at least one of the values exists
    if (formData.I10 === undefined && formData.I17 === undefined && formData.I24 === undefined) return;
    
    const totalValueEmployees = safeParseFloat(formData.I10 as string);
    const totalValueManagers = safeParseFloat(formData.I17 as string);
    const totalValueAdmin = safeParseFloat(formData.I24 as string);
    
    const totalValue = Math.round(totalValueEmployees + totalValueManagers + totalValueAdmin).toString();
    
    if (prevI26Ref.current !== totalValue) {
      updateField('I26', totalValue);
      prevI26Ref.current = totalValue;
    }
  }, [formData.I10, formData.I17, formData.I24, updateField]);
  
  // Debug output
  useEffect(() => {
    console.log('Form data:', formData);
    console.log('I9:', formData.I9);
    console.log('I16:', formData.I16);
    console.log('I23:', formData.I23);
  }, [formData]);
  
  // Initialize the form with default values if they don't exist
  useEffect(() => {
    // Initialize I9, I16, and I23 with default values if they don't exist
    if (formData.I9 === undefined) {
      updateField('I9', '0');
    }
    
    if (formData.I16 === undefined) {
      updateField('I16', '0');
    }
    
    if (formData.I23 === undefined) {
      updateField('I23', '0');
    }
  }, [formData, updateField]);
  
  // Add a new useEffect to fetch D11 from Form D and update I9, I16, and I23 when toggled
  useEffect(() => {
    const fetchFormD = async () => {
      try {
        // Get Form D data
        const formD = await getFormByFormId('form-d');
        
        if (formD && formD.data && formD.data.D11) {
          // Get D11 value and ensure it's a string
          const d11Value = String(formD.data.D11 || '0');
          console.log('Fetched D11 value:', d11Value);
          
          // Update I9, I16, and I23 with D11 value only if toggled to use D11
          if (useD11ForI9) {
            console.log('Updating I9 with D11 value:', d11Value);
            updateField('I9', d11Value);
          }
          
          if (useD11ForI16) {
            console.log('Updating I16 with D11 value:', d11Value);
            updateField('I16', d11Value);
          }
          
          if (useD11ForI23) {
            console.log('Updating I23 with D11 value:', d11Value);
            updateField('I23', d11Value);
          }
          
          // Update the ref to prevent infinite loops
          prevD11Ref.current = d11Value;
        } else {
          console.log('Form D or D11 value not found');
        }
      } catch (error) {
        console.error('Error fetching Form D data:', error);
      }
    };
    
    // Call the function immediately
    fetchFormD();
    
    // Set up an interval to periodically fetch Form D data
    const intervalId = setInterval(fetchFormD, 60000); // Fetch every minute
    
    // Clean up the interval on unmount
    return () => clearInterval(intervalId);
  }, [updateField, useD11ForI9, useD11ForI16, useD11ForI23]);
  
  const handleInputChange = useCallback((field: string, value: string | number) => {
    console.log(`Attempting to update ${field} with value:`, value);
    
    // Only block changes to I9, I16, and I23 if they are set to use D11
    if ((field === 'I9' && useD11ForI9) || 
        (field === 'I16' && useD11ForI16) || 
        (field === 'I23' && useD11ForI23)) {
      console.log(`Field ${field} is set to use D11, not updating manually`);
      return;
    }
    
    // Update the form data
    console.log(`Updating ${field} with value:`, value);
    updateField(field, value);
    
    // If this is a shared field, update the shared context as well
    if (field === 'I1') {
      updateSharedData('organizationName', String(value));
    } else if (field === 'I2') {
      updateSharedData('contactPerson', String(value));
    }
  }, [updateField, updateSharedData, useD11ForI9, useD11ForI16, useD11ForI23]);
  
  const onSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    saveForm();
  }, [saveForm]);

  // Log when form data is loaded
  useEffect(() => {
    if (!isLoading) {
      console.log('Form data loaded:', formData);
    }
  }, [isLoading, formData]);

  return (
    <FormWrapper
      formId="form-i"
      title="Interna kostnader för insats"
      isLoading={isLoading}
      onRetry={() => window.location.reload()}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">Laddar formulär...</div>
            <div className="text-gray-500">Vänta medan vi hämtar dina data.</div>
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Form I - Interna kostnader för insats</CardTitle>
            <CardDescription>
              Beräkna interna kostnader för insatser
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={onSubmit}>
              <div className="border rounded-md p-4">
                <h3 className="text-lg font-semibold mb-4">I – Interna kostnader för insats</h3>
                
                {/* Organization Information Section */}
                <div className="border rounded-md overflow-hidden mb-6">
                  <div className="grid grid-cols-[100px_1fr_1fr] border-b">
                    <div className="bg-muted p-2 font-medium border-r">I1</div>
                    <div className="p-2 border-r">Organisationens namn:</div>
                    <div className="p-2">
                      <Input 
                        placeholder="Ange organisationens namn" 
                        className="border-0 focus-visible:ring-0"
                        value={formData.I1 as string || sharedData.organizationName || ''}
                        onChange={(e) => handleInputChange('I1', e.target.value)}
                        disabled={isSaving}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-[100px_1fr_1fr] border-b">
                    <div className="bg-muted p-2 font-medium border-r">I2</div>
                    <div className="p-2 border-r">Kontaktperson</div>
                    <div className="p-2">
                      <Input 
                        placeholder="Ange kontaktperson" 
                        className="border-0 focus-visible:ring-0"
                        value={formData.I2 as string || sharedData.contactPerson || ''}
                        onChange={(e) => handleInputChange('I2', e.target.value)}
                        disabled={isSaving}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-[100px_1fr_1fr]">
                    <div className="bg-muted p-2 font-medium border-r">I3</div>
                    <div className="p-2 border-r">Delinsats:</div>
                    <div className="p-2">
                      <Input 
                        placeholder="Ange delinsats" 
                        className="border-0 focus-visible:ring-0"
                        value={formData.I3 as string || ''}
                        onChange={(e) => handleInputChange('I3', e.target.value)}
                        disabled={isSaving}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Section 1: Beräkning av arbetsvärde för närvarande personal */}
                <div className="mb-6">
                  <h4 className="font-medium p-2 bg-blue-50 rounded-t-md border">
                    Beräkning av arbetsvärde för närvarande personal vid arbetsplatsriktade insatser
                  </h4>
                  
                  <div className="border rounded-b-md overflow-hidden">
                    <div className="grid grid-cols-[100px_1fr_50px_1fr] border-b">
                      <div className="bg-muted p-2 font-medium border-r">I4</div>
                      <div className="p-2 border-r">Tidsåtgång insats i minuter</div>
                      <div className="p-2 border-r"></div>
                      <div className="p-2 text-right">
                        <FormattedNumberInput 
                          placeholder="0" 
                          className="border-0 focus-visible:ring-0 text-right"
                          value={formData.I4 as string || ''}
                          onChange={(e) => handleInputChange('I4', e.target.value)}
                          disabled={isSaving}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-[100px_1fr_50px_1fr] border-b">
                      <div className="bg-muted p-2 font-medium border-r">I5</div>
                      <div className="p-2 border-r"></div>
                      <div className="p-2 flex items-center justify-center border-r">÷</div>
                      <div className="p-2 text-right">
                        <FormattedNumberInput 
                          placeholder="0" 
                          className="border-0 focus-visible:ring-0 text-right"
                          value={formData.I5 as string || ''}
                          onChange={(e) => handleInputChange('I5', e.target.value)}
                          disabled={isSaving}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-[100px_1fr_50px_1fr] border-b">
                      <div className="bg-muted p-2 font-medium border-r">I6</div>
                      <div className="p-2 border-r">Tidsåtgång i timmar</div>
                      <div className="p-2 flex items-center justify-center border-r">=</div>
                      <div className="p-2 text-right">
                        <FormattedNumber 
                          value={formData.I6 as string || ''}
                          className="border-0 focus-visible:ring-0 text-right bg-gray-50 p-2"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-[100px_1fr_50px_1fr] border-b">
                      <div className="bg-muted p-2 font-medium border-r">I7</div>
                      <div className="p-2 border-r">Antal anställda medverkande i insats</div>
                      <div className="p-2 flex items-center justify-center border-r">×</div>
                      <div className="p-2 text-right">
                        <FormattedNumberInput 
                          placeholder="0" 
                          className="border-0 focus-visible:ring-0 text-right"
                          value={formData.I7 as string || ''}
                          onChange={(e) => handleInputChange('I7', e.target.value)}
                          disabled={isSaving}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-[100px_1fr_50px_1fr] border-b">
                      <div className="bg-muted p-2 font-medium border-r">I8</div>
                      <div className="p-2 border-r">Total tidsåtgång i timmar för insats</div>
                      <div className="p-2 flex items-center justify-center border-r">=</div>
                      <div className="p-2 text-right">
                        <FormattedNumber 
                          value={formData.I8 as string || ''}
                          className="border-0 focus-visible:ring-0 text-right bg-gray-50 p-2"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-[100px_1fr_50px_1fr] border-b">
                      <div className="bg-muted p-2 font-medium border-r">I9</div>
                      <div className="p-2 border-r">Genomsnittlig personalkostnad per timme</div>
                      <div className="p-2 flex items-center justify-center border-r">×</div>
                      <div className="p-2 relative text-right">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs text-gray-500">
                            {useD11ForI9 ? "Hämtar värde från D11" : "Manuellt värde"}
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={useD11ForI9}
                              onChange={() => {
                                const newValue = !useD11ForI9;
                                setUseD11ForI9(newValue);
                                handleToggleChange('useD11ForI9', newValue);
                              }}
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                            <span className="ml-2 text-xs text-gray-700">Använd D11</span>
                          </label>
                        </div>
                        {useD11ForI9 ? (
                          <FormattedNumber 
                            value={formData.I9 as string || ''}
                            className="border-0 focus-visible:ring-0 text-right bg-gray-50 p-2"
                          />
                        ) : (
                          <FormattedNumberInput 
                            placeholder="0" 
                            className="border-0 focus-visible:ring-0 text-right"
                            value={formData.I9 as string || ''}
                            onChange={(e) => handleInputChange('I9', e.target.value)}
                            disabled={isSaving}
                          />
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-[100px_1fr_50px_1fr] bg-muted/10">
                      <div className="bg-muted p-2 font-medium border-r">I10</div>
                      <div className="p-2 border-r font-medium">Summa insats, värde av arbete:</div>
                      <div className="p-2 flex items-center justify-center border-r">=</div>
                      <div className="p-2 text-right">
                        <FormattedNumber 
                          value={formData.I10 as string || ''}
                          className="border-0 focus-visible:ring-0 bg-transparent font-medium text-right"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Section 2: Beräkning av arbetsvärde för närvarande chefer */}
                <div className="mb-6">
                  <h4 className="font-medium p-2 bg-blue-50 rounded-t-md border">
                    Beräkning av arbetsvärde för närvarande chefer vid arbetsplatsriktade insatser
                  </h4>
                  
                  <div className="border rounded-b-md overflow-hidden">
                    <div className="grid grid-cols-[100px_1fr_50px_1fr] border-b">
                      <div className="bg-muted p-2 font-medium border-r">I11</div>
                      <div className="p-2 border-r">Tidsåtgång insats i minuter</div>
                      <div className="p-2 border-r"></div>
                      <div className="p-2 text-right">
                        <FormattedNumberInput 
                          placeholder="0" 
                          className="border-0 focus-visible:ring-0 text-right"
                          value={formData.I11 as string || ''}
                          onChange={(e) => handleInputChange('I11', e.target.value)}
                          disabled={isSaving}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-[100px_1fr_50px_1fr] border-b">
                      <div className="bg-muted p-2 font-medium border-r">I12</div>
                      <div className="p-2 border-r"></div>
                      <div className="p-2 flex items-center justify-center border-r">÷</div>
                      <div className="p-2 text-right">
                        <FormattedNumberInput 
                          placeholder="60" 
                          className="border-0 focus-visible:ring-0 text-right"
                          value={formData.I12 as string || '60'}
                          readOnly
                          disabled
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-[100px_1fr_50px_1fr] border-b">
                      <div className="bg-muted p-2 font-medium border-r">I13</div>
                      <div className="p-2 border-r">Tidsåtgång i timmar</div>
                      <div className="p-2 flex items-center justify-center border-r">=</div>
                      <div className="p-2 text-right">
                        <FormattedNumber 
                          value={formData.I13 as string || ''}
                          className="border-0 focus-visible:ring-0 bg-gray-50 p-2"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-[100px_1fr_50px_1fr] border-b">
                      <div className="bg-muted p-2 font-medium border-r">I14</div>
                      <div className="p-2 border-r">Antal anställda medverkande i insats</div>
                      <div className="p-2 flex items-center justify-center border-r">×</div>
                      <div className="p-2 text-right">
                        <FormattedNumberInput 
                          placeholder="0" 
                          className="border-0 focus-visible:ring-0 text-right"
                          value={formData.I14 as string || ''}
                          onChange={(e) => handleInputChange('I14', e.target.value)}
                          disabled={isSaving}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-[100px_1fr_50px_1fr] border-b">
                      <div className="bg-muted p-2 font-medium border-r">I15</div>
                      <div className="p-2 border-r">Total tidsåtgång i timmar för insats</div>
                      <div className="p-2 flex items-center justify-center border-r">=</div>
                      <div className="p-2 text-right">
                        <FormattedNumber 
                          value={formData.I15 as string || ''}
                          className="border-0 focus-visible:ring-0 bg-gray-50 p-2"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-[100px_1fr_50px_1fr] border-b">
                      <div className="bg-muted p-2 font-medium border-r">I16</div>
                      <div className="p-2 border-r">Genomsnittlig personalkostnad för chefer per timme</div>
                      <div className="p-2 flex items-center justify-center border-r">×</div>
                      <div className="p-2 relative text-right">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs text-gray-500">
                            {useD11ForI16 ? "Hämtar värde från D11" : "Manuellt värde"}
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={useD11ForI16}
                              onChange={() => {
                                const newValue = !useD11ForI16;
                                setUseD11ForI16(newValue);
                                handleToggleChange('useD11ForI16', newValue);
                              }}
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                            <span className="ml-2 text-xs text-gray-700">Använd D11</span>
                          </label>
                        </div>
                        {useD11ForI16 ? (
                          <FormattedNumber 
                            value={formData.I16 as string || ''}
                            className="border-0 focus-visible:ring-0 text-right bg-gray-50 p-2"
                          />
                        ) : (
                          <FormattedNumberInput 
                            placeholder="0" 
                            className="border-0 focus-visible:ring-0 text-right"
                            value={formData.I16 as string || ''}
                            onChange={(e) => handleInputChange('I16', e.target.value)}
                            disabled={isSaving}
                          />
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-[100px_1fr_50px_1fr] bg-muted/10">
                      <div className="bg-muted p-2 font-medium border-r">I17</div>
                      <div className="p-2 border-r font-medium">Summa insats, värde av arbete:</div>
                      <div className="p-2 flex items-center justify-center border-r">=</div>
                      <div className="p-2 text-right">
                        <FormattedNumber 
                          value={formData.I17 as string || ''}
                          className="border-0 focus-visible:ring-0 bg-transparent font-medium text-right"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Section 3: Beräkning av arbetsvärde för administration */}
                <div className="mb-6">
                  <h4 className="font-medium p-2 bg-blue-50 rounded-t-md border">
                    Beräkning av arbetsvärde för administration av arbetsplatsriktade insatser
                  </h4>
                  
                  <div className="border rounded-b-md overflow-hidden">
                    <div className="grid grid-cols-[100px_1fr_50px_1fr] border-b">
                      <div className="bg-muted p-2 font-medium border-r">I18</div>
                      <div className="p-2 border-r">Tidsåtgång insats i minuter</div>
                      <div className="p-2 border-r"></div>
                      <div className="p-2 text-right">
                        <FormattedNumberInput 
                          placeholder="0" 
                          className="border-0 focus-visible:ring-0 text-right"
                          value={formData.I18 as string || ''}
                          onChange={(e) => handleInputChange('I18', e.target.value)}
                          disabled={isSaving}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-[100px_1fr_50px_1fr] border-b">
                      <div className="bg-muted p-2 font-medium border-r">I19</div>
                      <div className="p-2 border-r"></div>
                      <div className="p-2 flex items-center justify-center border-r">÷</div>
                      <div className="p-2 text-right">
                        <FormattedNumberInput 
                          placeholder="60" 
                          className="border-0 focus-visible:ring-0 text-right"
                          value={formData.I19 as string || '60'}
                          readOnly
                          disabled
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-[100px_1fr_50px_1fr] border-b">
                      <div className="bg-muted p-2 font-medium border-r">I20</div>
                      <div className="p-2 border-r">Tidsåtgång i timmar</div>
                      <div className="p-2 flex items-center justify-center border-r">=</div>
                      <div className="p-2 text-right">
                        <FormattedNumber 
                          value={formData.I20 as string || ''}
                          className="border-0 focus-visible:ring-0 bg-gray-50 p-2"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-[100px_1fr_50px_1fr] border-b">
                      <div className="bg-muted p-2 font-medium border-r">I21</div>
                      <div className="p-2 border-r">Antal anställda medverkande i insats</div>
                      <div className="p-2 flex items-center justify-center border-r">×</div>
                      <div className="p-2 text-right">
                        <FormattedNumberInput 
                          placeholder="0" 
                          className="border-0 focus-visible:ring-0 text-right"
                          value={formData.I21 as string || ''}
                          onChange={(e) => handleInputChange('I21', e.target.value)}
                          disabled={isSaving}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-[100px_1fr_50px_1fr] border-b">
                      <div className="bg-muted p-2 font-medium border-r">I22</div>
                      <div className="p-2 border-r">Total tidsåtgång i timmar för insats</div>
                      <div className="p-2 flex items-center justify-center border-r">=</div>
                      <div className="p-2 text-right">
                        <FormattedNumber 
                          value={formData.I22 as string || ''}
                          className="border-0 focus-visible:ring-0 bg-gray-50 p-2"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-[100px_1fr_50px_1fr] border-b">
                      <div className="bg-muted p-2 font-medium border-r">I23</div>
                      <div className="p-2 border-r">Genomsnittlig personalkostnad per timme</div>
                      <div className="p-2 flex items-center justify-center border-r">×</div>
                      <div className="p-2 relative text-right">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs text-gray-500">
                            {useD11ForI23 ? "Hämtar värde från D11" : "Manuellt värde"}
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={useD11ForI23}
                              onChange={() => {
                                const newValue = !useD11ForI23;
                                setUseD11ForI23(newValue);
                                handleToggleChange('useD11ForI23', newValue);
                              }}
                            />
                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                            <span className="ml-2 text-xs text-gray-700">Använd D11</span>
                          </label>
                        </div>
                        {useD11ForI23 ? (
                          <FormattedNumber 
                            value={formData.I23 as string || ''}
                            className="border-0 focus-visible:ring-0 text-right bg-gray-50 p-2"
                          />
                        ) : (
                          <FormattedNumberInput 
                            placeholder="0" 
                            className="border-0 focus-visible:ring-0 text-right"
                            value={formData.I23 as string || ''}
                            onChange={(e) => handleInputChange('I23', e.target.value)}
                            disabled={isSaving}
                          />
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-[100px_1fr_50px_1fr] bg-muted/10">
                      <div className="bg-muted p-2 font-medium border-r">I24</div>
                      <div className="p-2 border-r font-medium">Summa insats, värde av arbete:</div>
                      <div className="p-2 flex items-center justify-center border-r">=</div>
                      <div className="p-2 text-right">
                        <FormattedNumber 
                          value={formData.I24 as string || ''}
                          className="border-0 focus-visible:ring-0 bg-transparent font-medium text-right"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Summary Section */}
                <div className="border rounded-md overflow-hidden">
                  <div className="grid grid-cols-[100px_1fr_50px_1fr] border-b">
                    <div className="bg-muted p-2 font-medium border-r">I25</div>
                    <div className="p-2 border-r font-medium">Total tidsåtgång insats</div>
                    <div className="p-2 flex items-center justify-center border-r">=</div>
                    <div className="p-2 text-right">
                      <FormattedNumber 
                        value={formData.I25 as string || ''}
                        className="border-0 focus-visible:ring-0 bg-gray-50 font-medium text-right"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-[100px_1fr_50px_1fr] bg-muted/10">
                    <div className="bg-muted p-2 font-medium border-r">I26</div>
                    <div className="p-2 border-r font-medium">Total arbetskostnad insats</div>
                    <div className="p-2 flex items-center justify-center border-r">=</div>
                    <div className="p-2 text-right">
                      <FormattedNumber 
                        value={formData.I26 as string || ''}
                        className="border-0 focus-visible:ring-0 bg-transparent font-medium text-right"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSaving}
                    asChild
                  >
                    <Link href="/forms/form-h">Tillbaka: Formulär H</Link>
                  </Button>
                  <div className="space-x-2">
                    <Button 
                      type="submit" 
                      disabled={isSaving}
                      variant="outline"
                    >
                      {isSaving ? 'Sparar...' : 'Spara'}
                    </Button>
                    <Button
                      type="button"
                      variant="default"
                      disabled={isSaving}
                      asChild
                    >
                      <Link href="/forms/form-j">Nästa: Formulär J</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </FormWrapper>
  );
} 