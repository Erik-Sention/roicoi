"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormCard } from "@/components/ui/form-card";
import { FormEvent, useCallback, useEffect } from "react";
import { useFormData } from "@/lib/hooks/useFormData";
import { useSharedForm } from "@/lib/context/SharedFormContext";
import FormWrapper from "@/components/FormWrapper";
import { toast } from "@/components/ui/use-toast";

export default function FormB() {
  const {
    formData,
    updateField,
    saveForm,
    isLoading,
    isSaving,
    hasUnsavedChanges
  } = useFormData({
    formId: 'form-b',
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
    if (!isLoading && sharedData.organizationName && formData['B1'] !== sharedData.organizationName) {
      updateField('B1', sharedData.organizationName);
    }
  }, [isLoading, sharedData.organizationName, formData, updateField]);
  
  const handleInputChange = useCallback((field: string, value: string | number) => {
    // Update the form data
    updateField(field, value);
    
    // If this is a shared field, update the shared context as well
    if (field === 'B1') {
      updateSharedData('organizationName', String(value));
    } else if (field === 'B2') {
      updateSharedData('contactPerson', String(value));
    }
  }, [updateField, updateSharedData]);
  
  const onSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    saveForm();
  }, [saveForm]);
  
  return (
    <FormWrapper
      formId="form-b"
      title="B - Verksamhetsanalys - insats"
      isLoading={isLoading}
      onRetry={() => window.location.reload()}
    >
      <div className="space-y-6">
        <form onSubmit={onSubmit}>
          <FormCard id="B" label="Verksamhetsanalys - insats">
            {/* Basic Information */}
            <div className="border rounded-md mb-4 overflow-hidden">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b">
                    <td className="border-r p-3 bg-muted/20 w-24 font-medium">B1</td>
                    <td className="border-r p-3 w-1/3">Organisationens namn:</td>
                    <td className="p-3">
                      <Input 
                        placeholder="Ange organisationens namn" 
                        className="w-full"
                        value={formData.B1 as string || sharedData.organizationName || ''}
                        onChange={(e) => handleInputChange('B1', e.target.value)}
                        disabled={isSaving}
                      />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="border-r p-3 bg-muted/20 font-medium">B2</td>
                    <td className="border-r p-3">Kontaktperson:</td>
                    <td className="p-3">
                      <Input 
                        placeholder="Ange kontaktperson" 
                        className="w-full"
                        value={formData.B2 as string || sharedData.contactPerson || ''}
                        onChange={(e) => handleInputChange('B2', e.target.value)}
                        disabled={isSaving}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border-r p-3 bg-muted/20 font-medium">B3</td>
                    <td className="border-r p-3">Insatsnamn:</td>
                    <td className="p-3">
                      <Input 
                        placeholder="Ange insatsens namn" 
                        className="w-full"
                        value={formData.B3 as string || ''}
                        onChange={(e) => handleInputChange('B3', e.target.value)}
                        disabled={isSaving}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Vilka insatser avses? */}
            <div className="mb-6">
              <div className="bg-muted/30 p-3 rounded-t-md border border-b-0">
                <h4 className="font-medium">Vilka insatser avses? –</h4>
                <p className="text-sm text-muted-foreground mt-1">Beskriv insatsen och de delinsatser den eventuellt består av så tydligt som möjligt</p>
              </div>
              <div className="border rounded-b-md overflow-hidden">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border-r p-3 bg-muted/20 w-24 font-medium">B4</td>
                      <td className="p-3">
                        <Textarea 
                          placeholder="Beskriv insatsen och dess delinsatser" 
                          className="w-full min-h-[100px]"
                          value={formData.B4 as string || ''}
                          onChange={(e) => handleInputChange('B4', e.target.value)}
                          disabled={isSaving}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Syfte med insatserna */}
            <div className="mb-6">
              <div className="bg-muted/30 p-3 rounded-t-md border border-b-0">
                <h4 className="font-medium">Syfte med insatserna –</h4>
                <p className="text-sm text-muted-foreground mt-1">Beskriv vad insatsen skall leda till för organisationen, verksamheten och/eller personalen</p>
              </div>
              <div className="border rounded-b-md overflow-hidden">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border-r p-3 bg-muted/20 w-24 font-medium">B5</td>
                      <td className="p-3">
                        <Textarea 
                          placeholder="Beskriv syftet med insatsen" 
                          className="w-full min-h-[100px]"
                          value={formData.B5 as string || ''}
                          onChange={(e) => handleInputChange('B5', e.target.value)}
                          disabled={isSaving}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Stöd för verksamhetens övergripande mål */}
            <div className="mb-6">
              <div className="bg-muted/30 p-3 rounded-t-md border border-b-0">
                <h4 className="font-medium">Stöd för verksamhetens övergripande mål</h4>
                <p className="text-sm text-muted-foreground mt-1">Beskriv vilka verksamhetsmål som stöds av den definierade insatsen samt ev på vilket sätt de övergripande mål stöds</p>
              </div>
              <div className="border rounded-b-md overflow-hidden">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border-r p-3 bg-muted/20 w-24 font-medium">B6</td>
                      <td className="p-3">
                        <Textarea 
                          placeholder="Beskriv hur insatsen stödjer verksamhetens mål" 
                          className="w-full min-h-[80px]"
                          value={formData.B6 as string || ''}
                          onChange={(e) => handleInputChange('B6', e.target.value)}
                          disabled={isSaving}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Alternativa ansatser */}
            <div className="mb-6">
              <div className="bg-muted/30 p-3 rounded-t-md border border-b-0">
                <h4 className="font-medium">Alternativa ansatser –</h4>
                <p className="text-sm text-muted-foreground mt-1">Beskriv de alternativ som analyserats, och motivera vald ansats</p>
              </div>
              <div className="border rounded-b-md overflow-hidden">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border-r p-3 bg-muted/20 w-24 font-medium">B7</td>
                      <td className="p-3">
                        <Textarea 
                          placeholder="Beskriv alternativa ansatser" 
                          className="w-full min-h-[100px]"
                          value={formData.B7 as string || ''}
                          onChange={(e) => handleInputChange('B7', e.target.value)}
                          disabled={isSaving}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Mål med insatserna */}
            <div className="mb-6">
              <div className="bg-muted/30 p-3 rounded-t-md border border-b-0">
                <h4 className="font-medium">Mål med insatserna –</h4>
                <p className="text-sm text-muted-foreground mt-1">Beskriv vad insatsen skall leda till för organisationen, verksamheten och/eller personalen</p>
              </div>
              <div className="border rounded-b-md overflow-hidden">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border-r p-3 bg-muted/20 w-24 font-medium">B8</td>
                      <td className="p-3">
                        <Textarea 
                          placeholder="Beskriv målen med insatsen" 
                          className="w-full min-h-[100px]"
                          value={formData.B8 as string || ''}
                          onChange={(e) => handleInputChange('B8', e.target.value)}
                          disabled={isSaving}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Målgrupp */}
            <div className="mb-6">
              <div className="bg-muted/30 p-3 rounded-t-md border border-b-0">
                <h4 className="font-medium">Målgrupp –</h4>
                <p className="text-sm text-muted-foreground mt-1">Beskriv vilka som skall nås av insatsen samt på vilket sätt de nås</p>
              </div>
              <div className="border rounded-b-md overflow-hidden">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border-r p-3 bg-muted/20 w-24 font-medium">B9</td>
                      <td className="p-3">
                        <Textarea 
                          placeholder="Beskriv målgruppen" 
                          className="w-full min-h-[80px]"
                          value={formData.B9 as string || ''}
                          onChange={(e) => handleInputChange('B9', e.target.value)}
                          disabled={isSaving}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* När nås förväntad effekt av insatsen? */}
            <div className="mb-6">
              <div className="bg-muted/30 p-3 rounded-t-md border border-b-0">
                <h4 className="font-medium">När nås förväntad effekt av insatsen?</h4>
                <p className="text-sm text-muted-foreground mt-1">Beskriv när effekten av insatsen kan nås – tidshorisont, kan vara olika effekt vid olika tidshorisonter</p>
              </div>
              <div className="border rounded-b-md overflow-hidden">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border-r p-3 bg-muted/20 w-24 font-medium">B10</td>
                      <td className="p-3">
                        <Textarea 
                          placeholder="Beskriv när förväntad effekt nås" 
                          className="w-full min-h-[80px]"
                          value={formData.B10 as string || ''}
                          onChange={(e) => handleInputChange('B10', e.target.value)}
                          disabled={isSaving}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Genomförandeplan */}
            <div className="mb-6">
              <div className="bg-muted/30 p-3 rounded-t-md border border-b-0">
                <h4 className="font-medium">Genomförandeplan –</h4>
                <p className="text-sm text-muted-foreground mt-1">Beskriv hur insatsen skall genomföras; aktiviteter, tidplan, ansvar</p>
              </div>
              <div className="border rounded-b-md overflow-hidden">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="border-r p-3 bg-muted/20 w-24 font-medium">B11</td>
                      <td className="p-3">
                        <Textarea 
                          placeholder="Beskriv genomförandeplanen" 
                          className="w-full min-h-[100px]"
                          value={formData.B11 as string || ''}
                          onChange={(e) => handleInputChange('B11', e.target.value)}
                          disabled={isSaving}
                        />
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
                <Link href="/forms/form-a">Tillbaka: Formulär A</Link>
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
                  <Link href="/forms/form-c">Nästa: Formulär C</Link>
                </Button>
              </div>
            </div>
          </FormCard>
        </form>
      </div>
    </FormWrapper>
  );
} 