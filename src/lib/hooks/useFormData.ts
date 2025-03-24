"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { 
  saveFormData, 
  updateFormData, 
  getFormByFormId, 
  getFormById,
  setupFormListener
} from '../firebase/formSubmission';
import { retryWithBackoff } from '../utils/safeDataHandling';

// Define types for form data
interface FormData {
  [key: string]: unknown;
}

interface FormResponse {
  id: string;
  formId: string;
  data: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

interface UseFormDataOptions {
  formId: string;
  initialData?: FormData;
  formDocId?: string;
  autoSaveInterval?: number;
  onSaveSuccess?: (data: FormData) => void;
  onSaveError?: (error: Error) => void;
  onLoadSuccess?: (data: FormData) => void;
  onLoadError?: (error: Error) => void;
}

interface UseFormDataReturn {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateField: (field: string, value: unknown) => void;
  saveForm: () => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
  error: Error | null;
  hasUnsavedChanges: boolean;
  resetForm: () => void;
}

/**
 * Custom hook for managing form data with Firebase integration
 * @param options - Configuration options for the hook
 * @returns Form state and handlers
 */
export function useFormData({
  formId,
  initialData = {},
  formDocId,
  autoSaveInterval = 5000,
  onSaveSuccess,
  onSaveError,
  onLoadSuccess,
  onLoadError
}: UseFormDataOptions): UseFormDataReturn {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [originalData, setOriginalData] = useState<FormData>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  
  const { user } = useAuth();
  const formDocIdRef = useRef<string | undefined>(formDocId);
  const dataFetchedRef = useRef<boolean>(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  
  // Function to save form data
  const saveForm = useCallback(async () => {
    if (!user || !hasUnsavedChanges) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      if (formDocIdRef.current) {
        // Update existing form
        await retryWithBackoff(async () => {
          await updateFormData(formDocIdRef.current!, formData);
        });
      } else {
        // Create new form
        const result = await retryWithBackoff(async () => {
          return await saveFormData(formId, formData);
        });
        
        // Update formDocId ref with the new ID
        if (result && result.id) {
          formDocIdRef.current = result.id;
        }
      }
      
      // Update original data to match current data
      setOriginalData(formData);
      setHasUnsavedChanges(false);
      
      if (onSaveSuccess) {
        onSaveSuccess(formData);
      }
      
      // Show success toast
      toast({
        title: 'Form saved',
        description: 'Your form data has been saved successfully.',
      });
    } catch (err) {
      console.error('Error saving form data:', err);
      setError(err instanceof Error ? err : new Error('Failed to save form data'));
      
      if (onSaveError && err instanceof Error) {
        onSaveError(err);
      }
      
      // Show error toast
      toast({
        title: 'Error saving form data',
        description: err instanceof Error ? err.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [formId, formData, user, hasUnsavedChanges, onSaveSuccess, onSaveError]);
  
  // Load form data when component mounts
  useEffect(() => {
    if (!user || dataFetchedRef.current) return;
    
    const loadFormData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let loadedData: FormResponse | null = null;
        
        // If we have a formDocId, use it to fetch the specific form
        if (formDocIdRef.current) {
          const result = await retryWithBackoff(async () => {
            return await getFormById(formDocIdRef.current!);
          });
          if (result && result.id) {
            loadedData = result as FormResponse;
          }
        } else {
          // Otherwise, try to find a form with the matching formId
          const result = await retryWithBackoff(async () => {
            return await getFormByFormId(formId);
          });
          if (result && result.id) {
            loadedData = result as FormResponse;
          }
          
          // If we found a form, update the formDocId ref
          if (loadedData) {
            formDocIdRef.current = loadedData.id;
          }
        }
        
        if (loadedData && loadedData.data) {
          setFormData(loadedData.data as FormData);
          setOriginalData(loadedData.data as FormData);
          
          if (onLoadSuccess) {
            onLoadSuccess(loadedData.data as FormData);
          }
        } else {
          // If no data was found, use the initial data
          setFormData(initialData);
          setOriginalData(initialData);
        }
        
        dataFetchedRef.current = true;
      } catch (err) {
        console.error('Error loading form data:', err);
        setError(err instanceof Error ? err : new Error('Failed to load form data'));
        
        if (onLoadError && err instanceof Error) {
          onLoadError(err);
        }
        
        // Use initial data as fallback
        setFormData(initialData);
        setOriginalData(initialData);
        
        // Show error toast
        toast({
          title: 'Error loading form data',
          description: err instanceof Error ? err.message : 'An unknown error occurred',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFormData();
    
    // Set up real-time listener for form updates
    if (formDocIdRef.current) {
      unsubscribeRef.current = setupFormListener(formDocIdRef.current, (data) => {
        if (data && data.data) {
          // Only update if the data is different from what we have
          const newData = data.data as FormData;
          setFormData(prev => {
            // Don't update if we're in the middle of saving
            if (isSaving) return prev;
            
            // Check if the data is different
            const isEqual = JSON.stringify(prev) === JSON.stringify(newData);
            if (!isEqual) {
              setOriginalData(newData);
              return newData;
            }
            return prev;
          });
        }
      });
    }
    
    // Clean up listener on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [user, formId, initialData, onLoadSuccess, onLoadError, isSaving]);
  
  // Update hasUnsavedChanges when formData changes
  useEffect(() => {
    const isEqual = JSON.stringify(formData) === JSON.stringify(originalData);
    setHasUnsavedChanges(!isEqual);
  }, [formData, originalData]);
  
  // Set up auto-save timer
  useEffect(() => {
    if (!hasUnsavedChanges || !autoSaveInterval) return;
    
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    
    autoSaveTimerRef.current = setTimeout(() => {
      saveForm();
    }, autoSaveInterval);
    
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [hasUnsavedChanges, autoSaveInterval, saveForm]);
  
  // Function to update a single field
  const updateField = useCallback((field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);
  
  // Function to reset form to original data
  const resetForm = useCallback(() => {
    setFormData(originalData);
    setHasUnsavedChanges(false);
  }, [originalData]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
      
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);
  
  return {
    formData,
    setFormData,
    updateField,
    saveForm,
    isLoading,
    isSaving,
    error,
    hasUnsavedChanges,
    resetForm
  };
} 