"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormEvent, useCallback, useState, useEffect, useRef } from "react";
import { useFormData } from "@/lib/hooks/useFormData";
import { useSharedForm } from "@/lib/context/SharedFormContext";
import FormWrapper from "@/components/FormWrapper";
import { toast } from "@/components/ui/use-toast";
import { getFormByFormId } from "@/lib/firebase/formSubmission";
import { FormattedNumberInput } from "@/components/FormattedNumberInput";
import { FormattedNumber } from "@/components/FormattedNumber";

// Real functions for fetching data from other forms
const fetchC20 = async () => {
  try {
    // Get the form C data
    const formC = await getFormByFormId('form-c');
    
    if (!formC || !formC.data || !formC.data.C20) {
      console.warn('C20 value not found in Form C');
      return 0; // Default value if not found
    }
    
    // Parse the C20 value as a number
    const c20Value = Number(formC.data.C20);
    return isNaN(c20Value) ? 0 : c20Value;
  } catch (error) {
    console.error('Error fetching C20 value:', error);
    toast({
      title: "Error fetching data",
      description: "Could not fetch C20 value from Form C",
      variant: "destructive",
    });
    return 0; // Default value on error
  }
};

const fetchG34 = async () => {
  try {
    // Get the form G data
    const formG = await getFormByFormId('form-g');
    
    if (!formG || !formG.data) {
      console.warn('Form G data not found');
      return 0; // Default value if not found
    }
    
    // In Form G, G34 is stored as G34_total
    if (!formG.data.G34_total) {
      console.warn('G34_total value not found in Form G');
      return 0; // Default value if not found
    }
    
    // Parse the G34_total value as a number
    const g34Value = Number(formG.data.G34_total);
    return isNaN(g34Value) ? 0 : g34Value;
  } catch (error) {
    console.error('Error fetching G34 value:', error);
    toast({
      title: "Error fetching data",
      description: "Could not fetch G34 value from Form G",
      variant: "destructive",
    });
    return 0; // Default value on error
  }
};

// Add calculation logic and useEffect hooks

// Function to calculate J7
const calculateJ7 = (J5: number, J6: number): number => {
  const numJ5 = Number(J5) || 0;
  // Convert percentage to decimal (e.g., 20 becomes 0.2)
  const numJ6 = (Number(J6) || 0) / 100;
  return numJ5 * numJ6;
};

// Function to calculate J9
const calculateJ9 = (J7: number, J8: number): number => {
  const numJ7 = Number(J7) || 0;
  const numJ8 = Number(J8) || 0;
  return numJ7 - numJ8;
};

// Function to calculate J11
const calculateJ11 = (J9: number, J8: number): number => {
  const numJ9 = Number(J9) || 0;
  const numJ8 = Number(J8) || 0;
  // Round to whole number
  return numJ8 === 0 ? 0 : Math.round((numJ9 / numJ8) * 100);
};

// Function to calculate J14
const calculateJ14 = (J12: number, J13: number): number => {
  const numJ12 = Number(J12) || 0;
  // Convert percentage to decimal (e.g., 20 becomes 0.2)
  const numJ13 = (Number(J13) || 0) / 100;
  // Round to whole number
  return Math.round(numJ12 * numJ13);
};

// Function to calculate J17
const calculateJ17 = (J15: number, J16: number): number => {
  const numJ15 = Number(J15) || 0;
  const numJ16 = Number(J16) || 0;
  // Round to one decimal place
  return numJ16 === 0 ? 0 : Number(((numJ15 / numJ16) * 100).toFixed(1));
};

export default function FormJ() {
  const {
    formData,
    updateField,
    saveForm,
    isLoading,
    isSaving,
    hasUnsavedChanges
  } = useFormData({
    formId: 'form-j',
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
    if (!isLoading && sharedData.organizationName && formData['J1'] !== sharedData.organizationName) {
      updateField('J1', sharedData.organizationName);
    }
  }, [isLoading, sharedData.organizationName, formData, updateField]);
  
  const handleInputChange = useCallback((field: string, value: string | number) => {
    // Update the form data
    updateField(field, value);
    
    // If this is a shared field, update the shared context as well
    if (field === 'J1') {
      updateSharedData('organizationName', String(value));
    } else if (field === 'J2') {
      updateSharedData('contactPerson', String(value));
    }
  }, [updateField, updateSharedData]);
  
  const onSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    saveForm();
  }, [saveForm]);

  // State to track fetch/manual mode for each field
  const [useFetchJ5, setUseFetchJ5] = useState(true);
  const [useFetchJ8, setUseFetchJ8] = useState(true);
  const [useFetchJ12, setUseFetchJ12] = useState(true);
  const [useFetchJ15, setUseFetchJ15] = useState(true);
  const [useFetchJ16, setUseFetchJ16] = useState(true);

  const [C20, setC20] = useState(0);
  const [G34, setG34] = useState(0);

  const prevC20 = useRef<number | null>(null);
  const prevG34 = useRef<number | null>(null);
  
  // Initialize toggle states from form data when it loads
  useEffect(() => {
    if (!isLoading && formData) {
      // Set toggle states from form data, defaulting to true if not present
      setUseFetchJ5(formData.useFetchJ5 !== undefined ? Boolean(formData.useFetchJ5) : true);
      setUseFetchJ8(formData.useFetchJ8 !== undefined ? Boolean(formData.useFetchJ8) : true);
      setUseFetchJ12(formData.useFetchJ12 !== undefined ? Boolean(formData.useFetchJ12) : true);
      setUseFetchJ15(formData.useFetchJ15 !== undefined ? Boolean(formData.useFetchJ15) : true);
      setUseFetchJ16(formData.useFetchJ16 !== undefined ? Boolean(formData.useFetchJ16) : true);
    }
  }, [isLoading, formData]);
  
  // Update form data when toggle states change
  const handleToggleChange = useCallback((field: string, value: boolean) => {
    updateField(field, value);
    
    // If toggling on, we'll need to fetch and update the appropriate value
    if (value) {
      if (field === 'useFetchJ5' || field === 'useFetchJ12' || field === 'useFetchJ16') {
        // These fields use C20
        updateField(field.replace('useFetch', ''), String(C20));
      } else if (field === 'useFetchJ8' || field === 'useFetchJ15') {
        // These fields use G34
        updateField(field.replace('useFetch', ''), String(G34));
      }
    }
  }, [updateField, C20, G34]);

  // Fetch data from C20 and G34 when needed
  useEffect(() => {
    const fetchData = async () => {
      const newC20 = await fetchC20();
      const newG34 = await fetchG34();

      if (prevC20.current !== newC20) {
        setC20(newC20);
        prevC20.current = newC20;
      }

      if (prevG34.current !== newG34) {
        setG34(newG34);
        prevG34.current = newG34;
      }
    };

    fetchData();
  }, []);

  // Update fields when "Fetch Data" is selected
  useEffect(() => {
    if (useFetchJ5) updateField('J5', C20);
    if (useFetchJ8) updateField('J8', G34);
    if (useFetchJ12) updateField('J12', C20);
    if (useFetchJ15) updateField('J15', G34);
    if (useFetchJ16) updateField('J16', C20);
  }, [C20, G34, useFetchJ5, useFetchJ8, useFetchJ12, useFetchJ15, useFetchJ16, updateField]);

  // Ensure J10 updates when J8 changes (J10 is always readonly)
  useEffect(() => {
    updateField('J10', formData.J8);
  }, [formData.J8, updateField]);

  // useEffect for J7, J9, J11
  useEffect(() => {
    try {
      const j5Value = Number(formData.J5) || 0;
      const j6Value = Number(formData.J6) || 0;
      const j8Value = Number(formData.J8) || 0;
      
      const newJ7 = calculateJ7(j5Value, j6Value);
      const newJ9 = calculateJ9(newJ7, j8Value);
      const newJ11 = calculateJ11(newJ9, j8Value);
      
      updateField('J7', newJ7);
      updateField('J9', newJ9);
      updateField('J11', newJ11);
    } catch (error) {
      console.error("Error calculating J7, J9, J11:", error);
    }
  }, [formData.J5, formData.J6, formData.J8, updateField]);

  // useEffect for J14
  useEffect(() => {
    try {
      const j12Value = Number(formData.J12) || 0;
      const j13Value = Number(formData.J13) || 0;
      
      const newJ14 = calculateJ14(j12Value, j13Value);
      updateField('J14', newJ14);
    } catch (error) {
      console.error("Error calculating J14:", error);
    }
  }, [formData.J12, formData.J13, updateField]);

  // useEffect for J17
  useEffect(() => {
    try {
      const j15Value = Number(formData.J15) || 0;
      const j16Value = Number(formData.J16) || 0;
      
      const newJ17 = calculateJ17(j15Value, j16Value);
      updateField('J17', newJ17);
    } catch (error) {
      console.error("Error calculating J17:", error);
    }
  }, [formData.J15, formData.J16, updateField]);

  return (
    <FormWrapper
      formId="form-j"
      title="Return on investment (ROI)"
      isLoading={isLoading}
      onRetry={() => window.location.reload()}
    >
      <Card>
        <CardHeader>
          <CardTitle>J - Return on investment (ROI)</CardTitle>
          <CardDescription>
            Calculate return on investment for interventions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Main form table */}
            <div className="border rounded-md overflow-hidden">
              {/* Header row */}
              <div className="bg-muted p-3 font-semibold text-lg border-b">
                J - Return on investment (ROI)
              </div>
              
              {/* Organization name row */}
              <div className="grid grid-cols-[50px_1fr_1fr] border-b">
                <div className="p-2 font-medium border-r">J1</div>
                <div className="p-2 border-r">Organisationens namn:</div>
                <div className="p-2">
                  <Input 
                    placeholder="Demo Alltjänst AB" 
                    className="border-0 focus-visible:ring-0"
                    value={formData.J1 as string || sharedData.organizationName || ''}
                    onChange={(e) => handleInputChange('J1', e.target.value)}
                    disabled={isSaving}
                  />
                </div>
              </div>
              
              {/* Contact person row */}
              <div className="grid grid-cols-[50px_1fr_1fr] border-b">
                <div className="p-2 font-medium border-r">J2</div>
                <div className="p-2 border-r">Kontaktperson</div>
                <div className="p-2">
                  <Input 
                    placeholder="Anna Andersson" 
                    className="border-0 focus-visible:ring-0"
                    value={formData.J2 as string || sharedData.contactPerson || ''}
                    onChange={(e) => handleInputChange('J2', e.target.value)}
                    disabled={isSaving}
                  />
                </div>
              </div>
              
              {/* Time period row */}
              <div className="grid grid-cols-[50px_1fr_1fr] border-b">
                <div className="p-2 font-medium border-r">J3</div>
                <div className="p-2 border-r">Tidsperiod (12 månader)</div>
                <div className="p-2 flex items-center gap-2">
                  <Input 
                    type="text" 
                    placeholder="2017-12-31" 
                    className="border-0 focus-visible:ring-0"
                    value={formData.J3_start as string || ''}
                    onChange={(e) => handleInputChange('J3_start', e.target.value)}
                    disabled={isSaving}
                  />
                  <span className="mx-2">–</span>
                  <Input 
                    type="text" 
                    placeholder="2017-12-31" 
                    className="border-0 focus-visible:ring-0"
                    value={formData.J3_end as string || ''}
                    onChange={(e) => handleInputChange('J3_end', e.target.value)}
                    disabled={isSaving}
                  />
                </div>
              </div>
              
              {/* Description row */}
              <div className="grid grid-cols-[50px_1fr] border-b">
                <div className="p-2 font-medium border-r">J4</div>
                <div className="p-2">
                  <div className="p-2 text-sm">
                    Beskriv insatsen som beräkningen avser
                  </div>
                  <div className="p-2 italic">
                    Summering av alla insatser, se formulär G samt respektive underformulär H1-H5 och I1-I5.
                  </div>
                </div>
              </div>
              
              {/* Calculation Alternative 1 */}
              <div className="bg-muted p-2 font-semibold border-b">
                Beräkningsalternativ 1
              </div>
              <div className="p-2 text-sm border-b">
                (investeringen är känd, effekten är känd, <span className="font-semibold">beräkna ROI</span>)
              </div>
              
              {/* J5 - Total cost for mental health issues */}
              <div className="grid grid-cols-[50px_1fr_1fr] border-b">
                <div className="p-2 font-medium border-r">J5</div>
                <div className="p-2 border-r">Total kostnad för psykisk ohälsa, kr per år</div>
                <div className="p-2 relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-gray-500">
                      {useFetchJ5 ? "Hämtar värde från C20" : "Manuellt värde"}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={useFetchJ5}
                        onChange={() => {
                          const newValue = !useFetchJ5;
                          setUseFetchJ5(newValue);
                          handleToggleChange('useFetchJ5', newValue);
                        }}
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-2 text-xs text-gray-700">Använd C20</span>
                    </label>
                  </div>
                  <FormattedNumberInput
                    placeholder=""
                    className={`border-0 focus-visible:ring-0 text-right ${useFetchJ5 ? 'bg-gray-50' : ''}`}
                    value={formData.J5 as string || ''}
                    onChange={(e) => handleInputChange('J5', e.target.value)}
                    readOnly={useFetchJ5}
                    disabled={isSaving || useFetchJ5}
                  />
                </div>
              </div>
              
              {/* J6 - Reduced percentage of personnel with high stress */}
              <div className="grid grid-cols-[50px_1fr_50px_1fr] border-b">
                <div className="p-2 font-medium border-r">J6</div>
                <div className="p-2 border-r">Minskad andel av personal med hög stressnivå</div>
                <div className="p-2 flex items-center justify-center border-r">*</div>
                <div className="p-2">
                  <FormattedNumberInput 
                    placeholder="" 
                    className="border-0 focus-visible:ring-0 text-right"
                    value={formData.J6 as string || ''}
                    onChange={(e) => handleInputChange('J6', e.target.value)}
                    disabled={isSaving}
                  />
                </div>
              </div>
              
              {/* J7 - Economic benefit of intervention */}
              <div className="grid grid-cols-[50px_1fr_50px_1fr] border-b">
                <div className="p-2 font-medium border-r">J7</div>
                <div className="p-2 border-r">Ekonomisk nytta av insatsen, kr per år</div>
                <div className="p-2 flex items-center justify-center border-r">=</div>
                <div className="p-2">
                  <div className="border-0 focus-visible:ring-0 text-right bg-gray-50 p-2">
                    <FormattedNumber value={formData.J7 as string || ''} />
                  </div>
                </div>
              </div>
              
              {/* J8 - Total cost for intervention */}
              <div className="grid grid-cols-[50px_1fr_1fr] border-b">
                <div className="p-2 font-medium border-r">J8</div>
                <div className="p-2 border-r">Total kostnad för insatsen, kr</div>
                <div className="p-2 relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-gray-500">
                      {useFetchJ8 ? "Hämtar värde från G34" : "Manuellt värde"}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={useFetchJ8}
                        onChange={() => {
                          const newValue = !useFetchJ8;
                          setUseFetchJ8(newValue);
                          handleToggleChange('useFetchJ8', newValue);
                        }}
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-2 text-xs text-gray-700">Använd G34</span>
                    </label>
                  </div>
                  <FormattedNumberInput
                    placeholder=""
                    className={`border-0 focus-visible:ring-0 text-right ${useFetchJ8 ? 'bg-gray-50' : ''}`}
                    value={formData.J8 as string || ''}
                    onChange={(e) => handleInputChange('J8', e.target.value)}
                    readOnly={useFetchJ8}
                    disabled={isSaving || useFetchJ8}
                  />
                </div>
              </div>
              
              {/* J9 - Economic surplus of intervention */}
              <div className="grid grid-cols-[50px_1fr_50px_1fr] border-b">
                <div className="p-2 font-medium border-r">J9</div>
                <div className="p-2 border-r">Ekonomiskt överskott av insatsen (år 1)</div>
                <div className="p-2 flex items-center justify-center border-r">=</div>
                <div className="p-2">
                  <div className="border-0 focus-visible:ring-0 text-right bg-gray-50 p-2">
                    <FormattedNumber value={formData.J9 as string || ''} />
                  </div>
                </div>
              </div>
              
              {/* J10 - Total cost for intervention */}
              <div className="grid grid-cols-[50px_1fr_50px_1fr] border-b">
                <div className="p-2 font-medium border-r">J10</div>
                <div className="p-2 border-r">Total kostnad för insatsen, kr</div>
                <div className="p-2 flex items-center justify-center border-r">/</div>
                <div className="p-2 relative">
                  <div className="absolute top-1 right-2 text-xs text-gray-500">
                    Förs över från J8
                  </div>
                  <div className="border-0 focus-visible:ring-0 text-right bg-gray-50 p-2">
                    <FormattedNumber value={formData.J10 as string || ''} />
                  </div>
                </div>
              </div>
              
              {/* J11 - Return on investment */}
              <div className="grid grid-cols-[50px_1fr_50px_1fr] border-b">
                <div className="p-2 font-medium border-r">J11</div>
                <div className="p-2 border-r">Return on investment (ROI), %, alt 1.</div>
                <div className="p-2 flex items-center justify-center border-r">=</div>
                <div className="p-2">
                  <div className="border-0 focus-visible:ring-0 text-right bg-gray-50 p-2">
                    <FormattedNumber value={formData.J11 as string || ''} />
                  </div>
                </div>
              </div>
              
              {/* Calculation Alternative 2 */}
              <div className="bg-muted p-2 font-semibold border-b">
                Beräkningsalternativ 2
              </div>
              <div className="p-2 text-sm border-b">
                (investeringen är okänd, effekten är känd, <span className="font-semibold">beräkna maximal insatskostnad</span>)
              </div>
              
              {/* J12 - Reduced sick leave days */}
              <div className="grid grid-cols-[50px_1fr_1fr] border-b">
                <div className="p-2 font-medium border-r">J12</div>
                <div className="p-2 border-r">Minskade sjukdagar</div>
                <div className="p-2 relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-gray-500">
                      {useFetchJ12 ? "Hämtar värde från C20" : "Manuellt värde"}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={useFetchJ12}
                        onChange={() => {
                          const newValue = !useFetchJ12;
                          setUseFetchJ12(newValue);
                          handleToggleChange('useFetchJ12', newValue);
                        }}
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-2 text-xs text-gray-700">Använd C20</span>
                    </label>
                  </div>
                  <FormattedNumberInput
                    placeholder=""
                    className={`border-0 focus-visible:ring-0 text-right ${useFetchJ12 ? 'bg-gray-50' : ''}`}
                    value={formData.J12 as string || ''}
                    onChange={(e) => handleInputChange('J12', e.target.value)}
                    readOnly={useFetchJ12}
                    disabled={isSaving || useFetchJ12}
                  />
                </div>
              </div>
              
              {/* J13 - Cost per sick leave day */}
              <div className="grid grid-cols-[50px_1fr_50px_1fr] border-b">
                <div className="p-2 font-medium border-r">J13</div>
                <div className="p-2 border-r">Kostnad per sjukdag, kr</div>
                <div className="p-2 flex items-center justify-center border-r"></div>
                <div className="p-2">
                  <FormattedNumberInput 
                    placeholder="" 
                    className="border-0 focus-visible:ring-0 text-right"
                    value={formData.J13 as string || ''}
                    onChange={(e) => handleInputChange('J13', e.target.value)}
                    disabled={isSaving}
                  />
                </div>
              </div>
              
              {/* J14 - Economic benefit of reduced sick leave */}
              <div className="grid grid-cols-[50px_1fr_50px_1fr] border-b">
                <div className="p-2 font-medium border-r">J14</div>
                <div className="p-2 border-r">Ekonomisk nytta av minskad sjukfrånvaro, kr</div>
                <div className="p-2 flex items-center justify-center border-r">=</div>
                <div className="p-2">
                  <div className="border-0 focus-visible:ring-0 text-right bg-gray-50 p-2">
                    <FormattedNumber value={formData.J14 as string || ''} />
                  </div>
                </div>
              </div>
              
              {/* Calculation Alternative 3 */}
              <div className="bg-muted p-2 font-semibold border-b">
                Beräkningsalternativ 3
              </div>
              <div className="p-2 text-sm border-b">
                (investeringen är känd, effekten okänd, <span className="font-semibold">beräkna minsta effekt för att nå break-even</span>)
              </div>
              
              {/* J15 - Reduced staff turnover */}
              <div className="grid grid-cols-[50px_1fr_1fr] border-b">
                <div className="p-2 font-medium border-r">J15</div>
                <div className="p-2 border-r">Minskad personalomsättning, antal personer</div>
                <div className="p-2 relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-gray-500">
                      {useFetchJ15 ? "Hämtar värde från G34" : "Manuellt värde"}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={useFetchJ15}
                        onChange={() => {
                          const newValue = !useFetchJ15;
                          setUseFetchJ15(newValue);
                          handleToggleChange('useFetchJ15', newValue);
                        }}
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-2 text-xs text-gray-700">Använd G34</span>
                    </label>
                  </div>
                  <FormattedNumberInput
                    placeholder=""
                    className={`border-0 focus-visible:ring-0 text-right ${useFetchJ15 ? 'bg-gray-50' : ''}`}
                    value={formData.J15 as string || ''}
                    onChange={(e) => handleInputChange('J15', e.target.value)}
                    readOnly={useFetchJ15}
                    disabled={isSaving || useFetchJ15}
                  />
                </div>
              </div>
              
              {/* J16 - Cost per staff turnover */}
              <div className="grid grid-cols-[50px_1fr_1fr] border-b">
                <div className="p-2 font-medium border-r">J16</div>
                <div className="p-2 border-r">Kostnad per personalomsättning, kr</div>
                <div className="p-2 relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-gray-500">
                      {useFetchJ16 ? "Hämtar värde från C20" : "Manuellt värde"}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={useFetchJ16}
                        onChange={() => {
                          const newValue = !useFetchJ16;
                          setUseFetchJ16(newValue);
                          handleToggleChange('useFetchJ16', newValue);
                        }}
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-2 text-xs text-gray-700">Använd C20</span>
                    </label>
                  </div>
                  <FormattedNumberInput
                    placeholder=""
                    className={`border-0 focus-visible:ring-0 text-right ${useFetchJ16 ? 'bg-gray-50' : ''}`}
                    value={formData.J16 as string || ''}
                    onChange={(e) => handleInputChange('J16', e.target.value)}
                    readOnly={useFetchJ16}
                    disabled={isSaving || useFetchJ16}
                  />
                </div>
              </div>
              
              {/* J17 - Minimum percentage reduction for break-even */}
              <div className="grid grid-cols-[50px_1fr_50px_1fr]">
                <div className="p-2 font-medium border-r">J17</div>
                <div className="p-2 border-r">Minskad andel av personal med hög stressnivå för break even, %, alt 3.</div>
                <div className="p-2 flex items-center justify-center border-r">=</div>
                <div className="p-2">
                  <div className="border-0 focus-visible:ring-0 text-right bg-gray-50 p-2">
                    <FormattedNumber value={formData.J17 as string || ''} />
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
                <Link href="/forms/form-i">Tillbaka: Formulär I</Link>
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
                  <Link href="/dashboard">Slutför och gå till Dashboard</Link>
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </FormWrapper>
  );
} 