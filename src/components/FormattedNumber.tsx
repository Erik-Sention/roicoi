import React from 'react';
import { formatNumber } from '@/lib/utils/formatNumber';

interface FormattedNumberProps {
  value: number | string | null | undefined;
  className?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * A component that displays numbers in Swedish format (e.g., 10 000 000)
 * This is a read-only component for displaying formatted numbers
 */
export function FormattedNumber({
  value,
  className = '',
  minimumFractionDigits,
  maximumFractionDigits,
}: FormattedNumberProps) {
  const formattedValue = formatNumber(value, {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return (
    <span className={className}>
      {formattedValue}
    </span>
  );
} 