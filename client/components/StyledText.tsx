import React from 'react';
import { Text, StyleSheet, TextProps, Platform } from 'react-native';
import { BALOO2_WEIGHTS, getBaloo2Weight } from '../utils/FontConfig';

interface StyledTextProps extends TextProps {
  children: React.ReactNode;
  bold?: boolean;
  weight?: 'normal' | 'medium' | 'bold' | 'extraBold' | string;
}

const StyledText: React.FC<StyledTextProps> = ({ children, style, bold, weight, ...props }) => {
  // Determine the font weight to use
  let fontWeight = BALOO2_WEIGHTS.normal;
  
  if (weight) {
    fontWeight = getBaloo2Weight(weight);
  } else if (bold) {
    fontWeight = BALOO2_WEIGHTS.bold;
  }
  
  const textStyle = [
    styles.text,
    { fontWeight },
    style
  ];
  
  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Baloo2',
    // fontWeight will be set dynamically in the component
  },
});

export default StyledText; 