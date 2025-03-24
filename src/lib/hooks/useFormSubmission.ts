import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { saveFormData, updateFormData, getFormByFormId, getFormById } from '../firebase/formSubmission';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '../context/AuthContext';

/**
 * Debounce utility function
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
function useDebounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      func(...args);
    }, delay);
  }, [func, delay]);
}

/**
 * Custom hook for managing form state and submission
 * @param formId - The ID of the form (e.g., 'form-a', 'form-b')
 * @param initialData - Initial form data (optional)
 * @param formDocId - Document ID if updating an existing form (optional)
 * @param nextFormPath - Path to navigate to after successful submission (optional)
 * @returns Form state and handlers
 */
export function useFormSubmission(
  formId: string,
  initialData: Record<string, unknown> = {},
  formDocId?: string,
  nextFormPath?: string
) {
  const [formData, setFormData] = useState<Record<string, unknown>>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();
  
  // Använd en ref för att hålla koll på om vi har hämtat data
  const dataFetchedRef = useRef(false);
  // Använd en ref för att hålla koll på formDocId
  const formDocIdRef = useRef(formDocId);
  // Track if form data has changed since last save
  const hasUnsavedChangesRef = useRef(false);

  // Hämta tidigare sparad data när komponenten laddas
  useEffect(() => {
    // Undvik att hämta data mer än en gång
    if (dataFetchedRef.current) return;
    
    const fetchSavedData = async () => {
      if (!user) {
        console.log('User not authenticated, skipping data fetch');
        setIsLoading(false);
        return;
      }

      try {
        console.log(`Fetching saved data for form ${formId}`);
        
        // Om vi har ett formDocId, använd det för att hämta det specifika dokumentet
        if (formDocIdRef.current) {
          console.log(`Using provided formDocId: ${formDocIdRef.current}`);
          
          // Hämta det specifika dokumentet med formDocId
          try {
            const doc = await getFormById(formDocIdRef.current);
            if (doc) {
              console.log('Found form data by ID:', doc);
              // The document returned by getFormById has the data directly spread into it
              setFormData(doc.data || {});
            } else {
              console.log('No form found with the provided ID, using initial data');
              setFormData(initialData);
            }
          } catch (fetchError) {
            console.error('Error fetching form by ID:', fetchError);
            setFormData(initialData);
          }
          
          setIsLoading(false);
          dataFetchedRef.current = true;
          return;
        }
        
        // Annars, försök hitta ett befintligt formulär med samma formId
        const savedForm = await getFormByFormId(formId);
        
        if (savedForm) {
          console.log('Found saved form data:', savedForm);
          // Använd den sparade datan om den finns
          setFormData(savedForm.data || {});
          // Spara formDocId för framtida uppdateringar
          formDocIdRef.current = savedForm.id;
        } else {
          console.log('No saved form data found, using initial data');
          // Använd initialData om ingen sparad data hittades
          setFormData(initialData);
        }
      } catch (err) {
        console.error('Error fetching saved form data:', err);
        // Vid fel, använd initialData
        setFormData(initialData);
      } finally {
        setIsLoading(false);
        dataFetchedRef.current = true;
      }
    };

    fetchSavedData();
  }, [formId, initialData, user]);

  // Auto-save form data
  const saveFormChanges = async () => {
    if (!user || !hasUnsavedChangesRef.current) {
      return;
    }

    try {
      console.log('Auto-saving form changes...');
      if (formDocIdRef.current) {
        await updateFormData(formDocIdRef.current, formData);
        console.log('Auto-saved existing form');
      } else {
        const result = await saveFormData(formId, formData);
        console.log('Auto-saved new form with ID:', result.id);
        formDocIdRef.current = result.id;
      }
      hasUnsavedChangesRef.current = false;
    } catch (err) {
      console.error('Error auto-saving form:', err);
    }
  };

  // Create debounced version of saveFormChanges (increase to 3 seconds to reduce database writes)
  const debouncedSaveChanges = useDebounce(saveFormChanges, 3000);

  // Batch updates to reduce number of state changes
  const batchedUpdates = useRef<Record<string, unknown>>({});
  const batchUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Process batched updates
  const processBatchedUpdates = () => {
    if (Object.keys(batchedUpdates.current).length === 0) {
      return;
    }

    setFormData((prev) => {
      const newData = { ...prev, ...batchedUpdates.current };
      batchedUpdates.current = {};
      return newData;
    });
    
    // Mark that we have unsaved changes
    hasUnsavedChangesRef.current = true;
    
    // Trigger debounced save
    debouncedSaveChanges();
  };

  // Handle input change with batching
  const handleInputChange = (fieldId: string, value: unknown) => {
    console.log(`Field changed: ${fieldId} = `, value);
    
    // Add to batch
    batchedUpdates.current[fieldId] = value;
    
    // Clear existing timeout
    if (batchUpdateTimeoutRef.current) {
      clearTimeout(batchUpdateTimeoutRef.current);
    }
    
    // Set new timeout to process batch
    batchUpdateTimeoutRef.current = setTimeout(processBatchedUpdates, 50);
  };

  // Handle form submission
  const handleSubmit = async (e?: React.FormEvent) => {
    console.log('Form submission started');
    if (e) {
      e.preventDefault();
    }

    if (!user) {
      console.log('User not authenticated');
      setError('Du måste vara inloggad för att spara formulär');
      toast({
        title: 'Fel',
        description: 'Du måste vara inloggad för att spara formulär',
        variant: 'destructive',
      });
      return;
    }

    console.log('User authenticated:', user.uid);
    console.log('Form data to submit:', formData);
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Attempting to save form data...');
      if (formDocIdRef.current) {
        console.log('Updating existing form:', formDocIdRef.current);
        // Update existing form
        await updateFormData(formDocIdRef.current, formData);
        console.log('Form updated successfully');
        toast({
          title: 'Formulär uppdaterat',
          description: 'Dina ändringar har sparats.',
        });
      } else {
        console.log('Saving new form:', formId);
        // Save new form
        const result = await saveFormData(formId, formData);
        console.log('Form saved successfully with ID:', result.id);
        // Uppdatera formDocId för framtida uppdateringar
        formDocIdRef.current = result.id;
        toast({
          title: 'Formulär sparat',
          description: 'Dina svar har sparats i databasen.',
        });
      }
      
      // Reset unsaved changes flag
      hasUnsavedChangesRef.current = false;

      // Navigate to next form if provided
      if (nextFormPath) {
        console.log('Navigating to:', nextFormPath);
        router.push(nextFormPath);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'Ett fel uppstod vid sparande av formuläret');
      toast({
        title: 'Fel',
        description: err instanceof Error ? err.message : 'Ett fel uppstod vid sparande av formuläret',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      console.log('Form submission completed');
    }
  };

  // Manual auto-save function (can be called externally if needed)
  const autoSave = async () => {
    if (hasUnsavedChangesRef.current) {
      await saveFormChanges();
    }
    return formDocIdRef.current;
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    autoSave,
    isSubmitting,
    isLoading,
    error,
  };
} 