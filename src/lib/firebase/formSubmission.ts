import { rtdb } from './config';
import { getAuth } from 'firebase/auth';
import { ref, set, get, update, onValue, off, DataSnapshot } from 'firebase/database';
import { retryWithBackoff } from '../utils/safeDataHandling';

// Define types for form data
interface FormData {
  id: string;  // Make id required
  formId: string;  // Make formId required
  data: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

// Cache for form data to use as fallback
const formDataCache = new Map<string, FormData>();

/**
 * Saves form data to Firebase Realtime Database with retry logic
 * @param formId - The ID of the form (e.g., 'form-a', 'form-b')
 * @param formData - The form data to save
 * @returns Promise with the document reference
 */
export const saveFormData = async (formId: string, formData: Record<string, unknown>) => {
  try {
    console.log(`[saveFormData] Starting to save form ${formId}`);
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.error('[saveFormData] No authenticated user found');
      throw new Error('User not authenticated');
    }
    
    console.log(`[saveFormData] User authenticated: ${user.uid}`);
    console.log(`[saveFormData] Form data:`, formData);
    
    // Generate a unique ID for the form
    const formUniqueId = `${formId}_${Date.now()}`;
    
    // Create a reference to the user's forms in Realtime Database
    const formRef = ref(rtdb, `users/${user.uid}/forms/${formUniqueId}`);
    console.log(`[saveFormData] Reference path: users/${user.uid}/forms/${formUniqueId}`);
    
    // Save the form data with timestamps using retry logic
    console.log(`[saveFormData] Setting data in Realtime DB...`);
    
    const dataToSave: FormData = {
      id: formUniqueId,
      formId,
      data: formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Cache the data before saving to Firebase
    formDataCache.set(formUniqueId, dataToSave);
    
    await retryWithBackoff(async () => {
      await set(formRef, dataToSave);
    });
    
    console.log(`[saveFormData] Successfully saved to Realtime DB with ID: ${formUniqueId}`);
    
    return { id: formUniqueId };
  } catch (error) {
    console.error('[saveFormData] Error:', error);
    // Rethrow with more context
    if (error instanceof Error) {
      throw new Error(`Failed to save form data: ${error.message}`);
    } else {
      throw new Error('Failed to save form data: Unknown error');
    }
  }
};

/**
 * Updates existing form data in Firebase Realtime Database with retry logic
 * @param formDocId - The document ID of the form to update
 * @param formData - The updated form data
 * @returns Promise with void
 */
export const updateFormData = async (formDocId: string, formData: Record<string, unknown>) => {
  try {
    console.log(`[updateFormData] Starting to update form ${formDocId}`);
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.error('[updateFormData] No authenticated user found');
      throw new Error('User not authenticated');
    }
    
    console.log(`[updateFormData] User authenticated: ${user.uid}`);
    console.log(`[updateFormData] Form data:`, formData);
    
    // Create a reference to the specific form in Realtime Database
    const formRef = ref(rtdb, `users/${user.uid}/forms/${formDocId}`);
    console.log(`[updateFormData] Reference path: users/${user.uid}/forms/${formDocId}`);
    
    // Update the form data with a new timestamp
    console.log(`[updateFormData] Updating data in Realtime DB...`);
    
    const existingData = formDataCache.get(formDocId);
    if (!existingData) {
      throw new Error('Form not found in cache');
    }

    const dataToUpdate: FormData = {
      ...existingData,
      data: formData,
      updatedAt: new Date().toISOString(),
    };
    
    // Update the cache
    formDataCache.set(formDocId, dataToUpdate);
    
    await retryWithBackoff(async () => {
      await update(formRef, dataToUpdate);
    });
    
    console.log(`[updateFormData] Successfully updated in Realtime DB`);
  } catch (error) {
    console.error('[updateFormData] Error:', error);
    // Rethrow with more context
    if (error instanceof Error) {
      throw new Error(`Failed to update form data: ${error.message}`);
    } else {
      throw new Error('Failed to update form data: Unknown error');
    }
  }
};

/**
 * Saves data to Realtime Database (legacy function, kept for compatibility)
 * @param formId - The ID of the form
 * @param formData - The form data to save
 * @param userId - The user ID
 * @returns Promise with void
 */
export const saveToRealtimeDB = async (formId: string, formData: Record<string, unknown>, userId: string) => {
  try {
    console.log(`[saveToRealtimeDB] Starting to save form ${formId} for user ${userId}`);
    
    // Create a reference to the user's form in Realtime Database
    const formRef = ref(rtdb, `users/${userId}/forms/${formId}`);
    console.log(`[saveToRealtimeDB] Reference path: users/${userId}/forms/${formId}`);
    
    // Save the data with timestamps
    console.log(`[saveToRealtimeDB] Setting data in Realtime DB...`);
    
    const existingData = formDataCache.get(formId);
    if (!existingData) {
      throw new Error('Form not found in cache');
    }

    const dataToSave: FormData = {
      ...existingData,
      data: formData,
      updatedAt: new Date().toISOString(),
    };
    
    // Cache the data
    formDataCache.set(formId, dataToSave);
    
    await retryWithBackoff(async () => {
      await set(formRef, dataToSave);
    });
    
    console.log(`[saveToRealtimeDB] Successfully saved to Realtime DB`);
  } catch (error) {
    console.error('[saveToRealtimeDB] Error:', error);
    // Rethrow with more context
    if (error instanceof Error) {
      throw new Error(`Failed to save to Realtime Database: ${error.message}`);
    } else {
      throw new Error('Failed to save to Realtime Database: Unknown error');
    }
  }
};

/**
 * Gets all forms for the current user from Realtime Database with fallback to cache
 * @returns Promise with the forms data
 */
export const getUserForms = async () => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Create a reference to the user's forms in Realtime Database
    const userFormsRef = ref(rtdb, `users/${user.uid}/forms`);
    
    // Get all forms with retry logic
    const snapshot = await retryWithBackoff(async () => {
      return await get(userFormsRef);
    });
    
    if (!snapshot.exists()) {
      return [];
    }
    
    // Convert the snapshot to an array of forms
    const forms: FormData[] = [];
    snapshot.forEach((childSnapshot) => {
      const key = childSnapshot.key;
      const val = childSnapshot.val();
      if (key) {
        const formData: FormData = {
          id: key,
          ...val,
        };
        // Update cache
        formDataCache.set(key, formData);
        forms.push(formData);
      }
    });
    
    return forms;
  } catch (error) {
    console.error('Error getting user forms:', error);
    
    // Fallback to cache if available
    if (formDataCache.size > 0) {
      console.log('Falling back to cached form data');
      return Array.from(formDataCache.values());
    }
    
    throw error;
  }
};

/**
 * Creates or updates a project with all form data in Realtime Database
 * @param projectId - The ID of the project
 * @param projectData - The project data including all forms
 * @returns Promise with void
 */
export const saveProject = async (projectId: string, projectData: Record<string, unknown>) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Create a reference to the user's project in Realtime Database
    const projectRef = ref(rtdb, `users/${user.uid}/projects/${projectId}`);
    
    // Save the project data with a timestamp
    const dataToSave = {
      ...projectData,
      updatedAt: new Date().toISOString(),
    };
    
    await retryWithBackoff(async () => {
      await set(projectRef, dataToSave);
    });
  } catch (error) {
    console.error('Error saving project:', error);
    throw error;
  }
};

/**
 * Gets a specific form by formId from Realtime Database with fallback to cache
 * @param formId - The ID of the form to get (e.g., 'form-a')
 * @returns Promise with the form data or null if not found
 */
export const getFormByFormId = async (formId: string): Promise<FormData | null> => {
  try {
    console.log(`[getFormByFormId] Getting form ${formId}`);
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.error('[getFormByFormId] No authenticated user found');
      throw new Error('User not authenticated');
    }
    
    console.log(`[getFormByFormId] User authenticated: ${user.uid}`);
    
    // Create a reference to the user's forms in Realtime Database
    const userFormsRef = ref(rtdb, `users/${user.uid}/forms`);
    
    // Get all forms with retry logic
    const snapshot = await retryWithBackoff(async () => {
      return await get(userFormsRef);
    });
    
    if (!snapshot.exists()) {
      console.log(`[getFormByFormId] No forms found for user ${user.uid}`);
      return null;
    }
    
    // Find the form with the matching formId
    let matchingForm: FormData | null = null;
    
    // Check cache first
    const cacheKey = `form_${formId}`;
    const cachedForm = formDataCache.get(cacheKey);
    
    if (cachedForm) {
      console.log(`[getFormByFormId] Found form in cache with ID: ${cachedForm.id}`);
      return cachedForm;
    }
    
    // If not in cache, search in the forms
    const formsData = snapshot.val() as Record<string, Omit<FormData, 'id'>> | null;
    if (formsData) {
      for (const [key, value] of Object.entries(formsData)) {
        if (value.formId === formId) {
          matchingForm = {
            ...value,
            id: key
          };
          formDataCache.set(cacheKey, matchingForm);
          break;
        }
      }
    }
    
    if (matchingForm) {
      console.log(`[getFormByFormId] Found form with ID: ${matchingForm.id}`);
      return matchingForm;
    } else {
      console.log(`[getFormByFormId] No form found with formId: ${formId}`);
      
      // Check cache for matching formId
      for (const [key, value] of formDataCache.entries()) {
        if (value.formId === formId) {
          console.log(`[getFormByFormId] Found form in cache with ID: ${key}`);
          return value;
        }
      }
      
      return null;
    }
  } catch (error) {
    console.error('[getFormByFormId] Error:', error);
    
    // Check cache for matching formId
    for (const [key, value] of formDataCache.entries()) {
      if (value.formId === formId) {
        console.log(`[getFormByFormId] Found form in cache with ID: ${key}`);
        return value;
      }
    }
    
    throw error;
  }
};

/**
 * Gets a specific form by document ID from Realtime Database with fallback to cache
 * @param formDocId - The document ID of the form to get
 * @returns Promise with the form data or null if not found
 */
export const getFormById = async (formDocId: string) => {
  try {
    console.log(`[getFormById] Getting form with ID ${formDocId}`);
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.error('[getFormById] No authenticated user found');
      throw new Error('User not authenticated');
    }
    
    console.log(`[getFormById] User authenticated: ${user.uid}`);
    
    // Create a reference to the specific form in Realtime Database
    const formRef = ref(rtdb, `users/${user.uid}/forms/${formDocId}`);
    
    // Get the form with retry logic
    const snapshot = await retryWithBackoff(async () => {
      return await get(formRef);
    });
    
    if (!snapshot.exists()) {
      console.log(`[getFormById] No form found with ID: ${formDocId}`);
      
      // Check cache
      if (formDataCache.has(formDocId)) {
        console.log(`[getFormById] Found form in cache with ID: ${formDocId}`);
        return formDataCache.get(formDocId);
      }
      
      return null;
    }
    
    const formData = {
      id: formDocId,
      ...snapshot.val(),
    };
    
    // Update cache
    formDataCache.set(formDocId, formData);
    
    console.log(`[getFormById] Found form with ID: ${formDocId}`);
    return formData;
  } catch (error) {
    console.error('[getFormById] Error:', error);
    
    // Check cache
    if (formDataCache.has(formDocId)) {
      console.log(`[getFormById] Found form in cache with ID: ${formDocId}`);
      return formDataCache.get(formDocId);
    }
    
    throw error;
  }
};

/**
 * Sets up a real-time listener for a form with proper cleanup
 * @param formDocId - The document ID of the form to listen to
 * @param callback - The callback function to call when the data changes
 * @returns A function to unsubscribe from the listener
 */
export const setupFormListener = (formDocId: string, callback: (data: FormData | null) => void) => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    console.error('[setupFormListener] No authenticated user found');
    return () => {}; // Return empty cleanup function
  }
  
  // Create a reference to the specific form in Realtime Database
  const formRef = ref(rtdb, `users/${user.uid}/forms/${formDocId}`);
  
  // Set up the listener
  const handleSnapshot = (snapshot: DataSnapshot) => {
    if (snapshot.exists()) {
      const formData: FormData = {
        id: formDocId,
        ...snapshot.val(),
      };
      
      // Update cache
      formDataCache.set(formDocId, formData);
      
      callback(formData);
    } else {
      callback(null);
    }
  };
  
  // Register the listener
  onValue(formRef, handleSnapshot, (error) => {
    console.error('[setupFormListener] Error:', error);
    
    // Fallback to cache if available
    if (formDataCache.has(formDocId)) {
      console.log(`[setupFormListener] Found form in cache with ID: ${formDocId}`);
      callback(formDataCache.get(formDocId) || null);
    } else {
      callback(null);
    }
  });
  
  // Return a function to unsubscribe from the listener
  return () => {
    off(formRef, 'value', handleSnapshot);
  };
}; 