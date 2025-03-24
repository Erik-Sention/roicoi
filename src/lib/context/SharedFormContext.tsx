"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getFormByFormId, updateFormData, saveFormData } from '../firebase/formSubmission';
import { toast } from '@/components/ui/use-toast';
import { retryWithBackoff } from '../utils/safeDataHandling';

// Define the shape of our shared form data
interface SharedFormData {
  organizationName: string;
  contactPerson: string;
  totalPersonnelCosts: string;
  totalShortSickLeaveCost: string;
  totalLongSickLeaveCost: string;
}

// Define the context interface
interface SharedFormContextType {
  sharedData: SharedFormData;
  updateSharedData: (field: keyof SharedFormData, value: string) => void;
  isLoading: boolean;
  error: Error | null;
  resetError: () => void;
}

// Create the context with default values
const SharedFormContext = createContext<SharedFormContextType>({
  sharedData: {
    organizationName: '',
    contactPerson: '',
    totalPersonnelCosts: '',
    totalShortSickLeaveCost: '',
    totalLongSickLeaveCost: '',
  },
  updateSharedData: () => {},
  isLoading: true,
  error: null,
  resetError: () => {},
});

// Custom hook to use the shared form context
export const useSharedForm = () => useContext(SharedFormContext);

interface SharedFormProviderProps {
  children: ReactNode;
}

// Debounce utility function with proper TypeScript typing
function useDebounce<T extends (...args: Parameters<T>) => Promise<void>>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}

export function SharedFormProvider({ children }: SharedFormProviderProps) {
  const [sharedData, setSharedData] = useState<SharedFormData>({
    organizationName: '',
    contactPerson: '',
    totalPersonnelCosts: '',
    totalShortSickLeaveCost: '',
    totalLongSickLeaveCost: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  
  // Cache for shared data to use as fallback
  const sharedDataCacheRef = useRef<SharedFormData>({
    organizationName: '',
    contactPerson: '',
    totalPersonnelCosts: '',
    totalShortSickLeaveCost: '',
    totalLongSickLeaveCost: '',
  });
  
  // Load shared data from Firebase when the component mounts
  useEffect(() => {
    const loadSharedData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setError(null);
        
        // Try to fetch shared data from form-a, which contains the organization name and contact person
        const formA = await retryWithBackoff(async () => {
          return await getFormByFormId('form-a');
        });
        
        // Try to fetch shared data from form-d, which contains the total personnel costs
        const formD = await retryWithBackoff(async () => {
          return await getFormByFormId('form-d');
        });
        
        // Try to fetch shared data from form-e, which contains the total short sick leave cost
        const formE = await retryWithBackoff(async () => {
          return await getFormByFormId('form-e');
        });
        
        // Try to fetch shared data from form-f, which contains the total long sick leave cost
        const formF = await retryWithBackoff(async () => {
          return await getFormByFormId('form-f');
        });
        
        let newSharedData = { ...sharedDataCacheRef.current };
        
        if (formA && formA.data) {
          // Extract organization name and contact person from form-a
          const organizationName = formA.data.A1 as string || '';
          const contactPerson = formA.data.A2 as string || '';
          
          newSharedData = {
            ...newSharedData,
            organizationName,
            contactPerson,
          };
        }
        
        if (formD && formD.data) {
          // Extract total personnel costs from form-d
          const totalPersonnelCosts = formD.data.D9 as string || '';
          
          newSharedData = {
            ...newSharedData,
            totalPersonnelCosts,
          };
        }
        
        if (formE && formE.data) {
          // Extract total short sick leave cost from form-e
          const totalShortSickLeaveCost = formE.data.E8 as string || '';
          
          newSharedData = {
            ...newSharedData,
            totalShortSickLeaveCost,
          };
        }
        
        if (formF && formF.data) {
          // Extract total long sick leave cost from form-f
          const totalLongSickLeaveCost = formF.data.F8 as string || '';
          
          newSharedData = {
            ...newSharedData,
            totalLongSickLeaveCost,
          };
        }
        
        setSharedData(newSharedData);
        
        // Update cache
        sharedDataCacheRef.current = newSharedData;
      } catch (err) {
        console.error('Error loading shared form data:', err);
        
        // Set error state
        setError(err instanceof Error ? err : new Error('Failed to load shared form data'));
        
        // Use cached data as fallback
        setSharedData(sharedDataCacheRef.current);
        
        // Show error toast
        toast({
          title: 'Error loading shared data',
          description: err instanceof Error ? err.message : 'An unknown error occurred',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSharedData();
  }, [user]);
  
  // Function to update Firebase with shared data (will be debounced)
  const updateFirebase = async (field: keyof SharedFormData, value: string) => {
    // Don't try to update Firebase if user is not authenticated
    if (!user) return;
    
    try {
      setError(null);
      
      // Find all forms that need to be updated
      const formIds = ['form-a', 'form-b', 'form-c', 'form-d', 'form-e', 'form-f', 'form-g', 'form-h', 'form-i', 'form-j'];
      
      // For each form, update the relevant fields
      for (const formId of formIds) {
        try {
          // Get the current form data
          const form = await retryWithBackoff(async () => {
            return await getFormByFormId(formId);
          });
          
          if (form) {
            // Update the form data with the new shared data
            const updatedData = { ...form.data };
            
            // Map shared data fields to form fields
            if (field === 'organizationName') {
              if (formId === 'form-a') updatedData.A1 = value;
              if (formId === 'form-b') updatedData.B1 = value;
              if (formId === 'form-c') updatedData.C1 = value;
              // Add mappings for other forms as needed
            } else if (field === 'contactPerson') {
              if (formId === 'form-a') updatedData.A2 = value;
              if (formId === 'form-b') updatedData.B2 = value;
              if (formId === 'form-c') updatedData.C2 = value;
              // Add mappings for other forms as needed
            } else if (field === 'totalPersonnelCosts') {
              if (formId === 'form-d') updatedData.D9 = value;
              if (formId === 'form-c') updatedData.C4 = value;
            } else if (field === 'totalShortSickLeaveCost') {
              if (formId === 'form-e') updatedData.E8 = value;
              if (formId === 'form-c') updatedData.C11 = value;
            } else if (field === 'totalLongSickLeaveCost') {
              if (formId === 'form-f') updatedData.F8 = value;
              if (formId === 'form-c') updatedData.C14 = value;
            }
            
            // Update the form in Firebase
            await retryWithBackoff(async () => {
              await updateFormData(form.id!, updatedData);
            });
          } else {
            // If the form doesn't exist yet, create it with the shared data
            const newFormData: Record<string, unknown> = {};
            
            // Map shared data fields to form fields
            if (field === 'organizationName') {
              if (formId === 'form-a') newFormData.A1 = value;
              if (formId === 'form-b') newFormData.B1 = value;
              if (formId === 'form-c') newFormData.C1 = value;
              // Add mappings for other forms as needed
            } else if (field === 'contactPerson') {
              if (formId === 'form-a') newFormData.A2 = value;
              if (formId === 'form-b') newFormData.B2 = value;
              if (formId === 'form-c') newFormData.C2 = value;
              // Add mappings for other forms as needed
            } else if (field === 'totalPersonnelCosts') {
              if (formId === 'form-d') newFormData.D9 = value;
              if (formId === 'form-c') newFormData.C4 = value;
            } else if (field === 'totalShortSickLeaveCost') {
              if (formId === 'form-e') newFormData.E8 = value;
              if (formId === 'form-c') newFormData.C11 = value;
            } else if (field === 'totalLongSickLeaveCost') {
              if (formId === 'form-f') newFormData.F8 = value;
              if (formId === 'form-c') newFormData.C14 = value;
            }
            
            // Only create the form if we have data to save
            if (Object.keys(newFormData).length > 0) {
              await retryWithBackoff(async () => {
                await saveFormData(formId, newFormData);
              });
            }
          }
        } catch (formError) {
          console.error(`Error updating ${formId}:`, formError);
          // Continue with other forms even if one fails
        }
      }
    } catch (err) {
      console.error('Error updating shared form data:', err);
      
      // Set error state
      setError(err instanceof Error ? err : new Error('Failed to update shared form data'));
      
      // Show error toast
      toast({
        title: 'Error updating shared data',
        description: err instanceof Error ? err.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    }
  };
  
  // Debounce the update function to avoid too many Firebase calls
  const debouncedUpdateFirebase = useDebounce(updateFirebase, 1000);
  
  // Function to update shared data
  const updateSharedData = useCallback((field: keyof SharedFormData, value: string) => {
    // Update local state immediately
    setSharedData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Update cache
    sharedDataCacheRef.current = {
      ...sharedDataCacheRef.current,
      [field]: value
    };
    
    // Update Firebase with debounce
    debouncedUpdateFirebase(field, value);
  }, [debouncedUpdateFirebase]);
  
  // Function to reset error state
  const resetError = useCallback(() => {
    setError(null);
  }, []);
  
  return (
    <SharedFormContext.Provider value={{ sharedData, updateSharedData, isLoading, error, resetError }}>
      {children}
    </SharedFormContext.Provider>
  );
} 