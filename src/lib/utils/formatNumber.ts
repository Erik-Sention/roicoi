/**
 * Formats a number according to Swedish number format (e.g., 10 000 000 instead of 10000000)
 * This function is for display purposes only and does not modify the actual value
 * 
 * @param value - The number to format
 * @param options - Optional configuration for number formatting
 * @returns Formatted number string or empty string if value is invalid
 */
export function formatNumber(
  value: number | string | null | undefined,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  // Return empty string for null, undefined, or NaN values
  if (value === null || value === undefined || value === '') return '';
  
  // Convert string to number if needed
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Return empty string if the value is not a valid number
  if (isNaN(numValue)) return '';
  
  // Format the number using Swedish locale
  return new Intl.NumberFormat('sv-SE', {
    minimumFractionDigits: options.minimumFractionDigits,
    maximumFractionDigits: options.maximumFractionDigits,
  }).format(numValue);
}

/**
 * Safely parses a formatted number string back to a number
 * This is useful when working with user inputs that may contain formatting
 * 
 * @param formattedValue - The formatted number string to parse
 * @returns Parsed number or NaN if the input is invalid
 */
export function parseFormattedNumber(formattedValue: string): number {
  if (!formattedValue) return NaN;
  
  // Remove spaces and replace comma with dot for decimal
  const normalizedValue = formattedValue.replace(/\s/g, '').replace(',', '.');
  
  return parseFloat(normalizedValue);
} 