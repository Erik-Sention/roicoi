/**
 * Safely get a value from an object with a fallback
 * @param data - The data object to get the value from
 * @param fallback - The fallback value if the data is null or undefined
 * @returns The data or fallback value
 */
export const safeGet = <T>(data: T | null | undefined, fallback: T): T => {
  return data !== null && data !== undefined ? data : fallback;
};

/**
 * Safely parse a number from a string with a fallback
 * @param value - The string value to parse
 * @param fallback - The fallback value if parsing fails
 * @returns The parsed number or fallback value
 */
export const safeParseNumber = (value: string | null | undefined, fallback: number = 0): number => {
  if (value === null || value === undefined || value === '') return fallback;
  const parsed = Number(value);
  return isNaN(parsed) ? fallback : parsed;
};

/**
 * Safely parse a JSON string with a fallback
 * @param jsonString - The JSON string to parse
 * @param fallback - The fallback value if parsing fails
 * @returns The parsed object or fallback value
 */
export const safeParseJSON = <T>(jsonString: string | null | undefined, fallback: T): T => {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return fallback;
  }
};

/**
 * Safely execute a function with error handling
 * @param fn - The function to execute
 * @param fallback - The fallback value if the function throws an error
 * @returns The result of the function or fallback value
 */
export const safeExecute = async <T>(fn: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    console.error('Error executing function:', error);
    return fallback;
  }
};

/**
 * Retry a function with exponential backoff
 * @param fn - The function to retry
 * @param maxRetries - The maximum number of retries
 * @param baseDelay - The base delay in milliseconds
 * @returns The result of the function
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 300
): Promise<T> => {
  let lastError: unknown;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      console.warn(`Attempt ${attempt + 1}/${maxRetries} failed:`, error);
      lastError = error;
      
      // Calculate delay with exponential backoff and jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 100;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

/**
 * Create a cached version of a function
 * @param fn - The function to cache
 * @param ttl - Time to live in milliseconds
 * @returns The cached function
 */
export const createCachedFunction = <T>(
  fn: () => Promise<T>,
  ttl: number = 60000 // 1 minute default
): () => Promise<T> => {
  let cachedResult: T | null = null;
  let cachedTime: number = 0;
  
  return async () => {
    const now = Date.now();
    
    if (cachedResult && now - cachedTime < ttl) {
      return cachedResult;
    }
    
    const result = await fn();
    cachedResult = result;
    cachedTime = now;
    return result;
  };
}; 