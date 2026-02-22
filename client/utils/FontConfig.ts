import { Text, TextInput } from 'react-native';

/**
 * Font configuration utility for Baloo2
 * Sets up default font family and weight mappings for the entire app
 */

// Baloo2 variable font weight mappings
export const BALOO2_WEIGHTS = {
  normal: '500',    // Baloo2 minimum weight
  medium: '600',    // SemiBold
  bold: '700',      // Bold  
  extraBold: '800', // ExtraBold
} as const;

/**
 * Configure default font settings for all Text and TextInput components
 * This should be called once at app startup
 */
export const setupDefaultFont = () => {
  // Set default font for Text components
  const originalTextDefaultProps = Text.defaultProps;
  
  Text.defaultProps = {
    ...originalTextDefaultProps,
    style: [
      {
        fontFamily: 'Baloo2',
        fontWeight: BALOO2_WEIGHTS.normal,
      },
      originalTextDefaultProps?.style,
    ],
  };

  // Set default font for TextInput components
  const originalTextInputDefaultProps = TextInput.defaultProps;
  
  TextInput.defaultProps = {
    ...originalTextInputDefaultProps,
    style: [
      {
        fontFamily: 'Baloo2',
        fontWeight: BALOO2_WEIGHTS.normal,
      },
      originalTextInputDefaultProps?.style,
    ],
  };

  console.log('✅ Baloo2 set as default font for all Text and TextInput components');
};

/**
 * Helper function to get the correct Baloo2 weight
 */
export const getBaloo2Weight = (weight: string | number): string => {
  // Handle numeric weights
  if (typeof weight === 'number') {
    if (weight < 550) return BALOO2_WEIGHTS.normal;
    if (weight < 650) return BALOO2_WEIGHTS.medium;
    if (weight < 750) return BALOO2_WEIGHTS.bold;
    return BALOO2_WEIGHTS.extraBold;
  }

  // Handle string weights
  switch (weight.toLowerCase()) {
    case 'normal':
    case '400':
    case '500':
      return BALOO2_WEIGHTS.normal;
    case 'medium':
    case '600':
      return BALOO2_WEIGHTS.medium;
    case 'bold':
    case '700':
      return BALOO2_WEIGHTS.bold;
    case 'extrabold':
    case '800':
    case '900': // Map 900 to 800 since Baloo2 doesn't support 900
      return BALOO2_WEIGHTS.extraBold;
    default:
      return BALOO2_WEIGHTS.normal;
  }
};

/**
 * Style helper for creating Baloo2 text styles with proper weight mapping
 */
export const createBaloo2Style = (options: {
  fontSize?: number;
  color?: string;
  weight?: keyof typeof BALOO2_WEIGHTS | 'bold' | string | number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  [key: string]: any;
} = {}) => {
  const { weight = 'normal', ...otherProps } = options;
  
  return {
    fontFamily: 'Baloo2',
    fontWeight: getBaloo2Weight(weight),
    ...otherProps,
  };
};

/**
 * Pre-defined Baloo2 text styles for common use cases
 */
export const Baloo2Styles = {
  normal: createBaloo2Style(),
  medium: createBaloo2Style({ weight: 'medium' }),
  bold: createBaloo2Style({ weight: 'bold' }),
  extraBold: createBaloo2Style({ weight: 'extraBold' }),
  
  // Common text styles
  heading: createBaloo2Style({ weight: 'bold', fontSize: 24 }),
  subheading: createBaloo2Style({ weight: 'medium', fontSize: 18 }),
  body: createBaloo2Style({ weight: 'normal', fontSize: 16 }),
  caption: createBaloo2Style({ weight: 'normal', fontSize: 14 }),
};
