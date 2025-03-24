# Number Formatting Implementation

This document describes the implementation of Swedish number formatting in the ROICOI application.

## Overview

The application now displays numbers in the Swedish format (e.g., `10 000 000` instead of `10000000`) while preserving the original numeric values for calculations and data storage.

## Components

### 1. Utility Functions (`formatNumber.ts`)

- `formatNumber`: Formats a number according to Swedish number format
- `parseFormattedNumber`: Safely parses a formatted number string back to a number

### 2. UI Components

- `FormattedNumberInput`: A component for displaying and editing numbers with Swedish formatting
- `FormattedNumber`: A read-only component for displaying formatted numbers

## Implementation Details

### How It Works

1. **Display Only Formatting**: Numbers are formatted only for display purposes. The actual stored values remain unchanged for calculations.
2. **Non-Destructive Approach**: The formatting is applied using utility functions that format numbers only when rendering them in the UI.
3. **User Input Handling**: When users focus on an input field, they see the raw value without formatting. When they blur the field, the value is formatted for display.

### Key Features

- **Safe Calculations**: All calculations use the raw numeric values, not the formatted strings.
- **Seamless User Experience**: Users can enter numbers freely without interference from formatting.
- **Consistent Display**: All numbers are displayed in the Swedish format throughout the application.

## Usage

### Using the `FormattedNumberInput` Component

```tsx
import { FormattedNumberInput } from "@/components/FormattedNumberInput";

// In your component:
<FormattedNumberInput
  value={someNumericValue}
  onChange={(e) => handleChange(e.target.value)}
  className="your-class-name"
/>
```

### Using the `FormattedNumber` Component (Read-Only)

```tsx
import { FormattedNumber } from "@/components/FormattedNumber";

// In your component:
<FormattedNumber value={someNumericValue} />
```

### Using the Utility Function Directly

```tsx
import { formatNumber } from "@/lib/utils/formatNumber";

// Format a number:
const formattedValue = formatNumber(12345.67); // Returns "12 345,67"
```

## Implementation Notes

- The formatting is applied using the `Intl.NumberFormat` API with the `sv-SE` locale.
- The components handle edge cases such as null, undefined, and NaN values gracefully.
- The implementation ensures that all calculations and data storage use the raw numeric values, not the formatted strings. 