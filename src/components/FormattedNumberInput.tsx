import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { formatNumber } from '@/lib/utils/formatNumber';

interface FormattedNumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  value: string | number | undefined | null;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (value: string) => void;
  className?: string;
  formatOnBlur?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

/**
 * A component that displays numbers in Swedish format (e.g., 10 000 000) while allowing
 * users to input numbers without formatting interference.
 * 
 * The component handles formatting only for display, while preserving the original
 * numeric value for calculations and data storage.
 */
export function FormattedNumberInput({
  value,
  onChange,
  onValueChange,
  className = '',
  formatOnBlur = true,
  disabled = false,
  readOnly = false,
  onFocus,
  onBlur,
  ...restProps
}: FormattedNumberInputProps) {
  // State to track if the input is being edited
  const [isEditing, setIsEditing] = useState(false);
  // State to store the displayed value
  const [displayValue, setDisplayValue] = useState('');

  // Update the displayed value when the input value changes
  useEffect(() => {
    if (!isEditing) {
      // If not editing, format the value for display
      setDisplayValue(formatNumber(value));
    }
  }, [value, isEditing]);

  // Handle focus event
  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setIsEditing(true);
    
    // When focused, show the raw value without formatting
    if (value !== undefined && value !== null) {
      setDisplayValue(String(value));
    }
    
    // Call the original onFocus handler if provided
    if (onFocus) {
      onFocus(e);
    }
  }, [value, onFocus]);

  // Handle blur event
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setIsEditing(false);
    
    if (formatOnBlur) {
      // Format the value when the input loses focus
      setDisplayValue(formatNumber(e.target.value));
    }
    
    // Call the original onBlur handler if provided
    if (onBlur) {
      onBlur(e);
    }
  }, [formatOnBlur, onBlur]);

  // Handle change event
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Update the displayed value
    setDisplayValue(newValue);
    
    // Call the original onChange handler if provided
    if (onChange) {
      onChange(e);
    }
    
    // Call the onValueChange handler with the raw value if provided
    if (onValueChange) {
      onValueChange(newValue);
    }
  }, [onChange, onValueChange]);

  return (
    <Input
      {...restProps}
      type="text"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={className}
      disabled={disabled}
      readOnly={readOnly}
    />
  );
} 