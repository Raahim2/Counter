import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font'; // Import the useFonts hook

// SmallButton Component
const SmallButton = ({ text, bgColor = '#5A6581', borderColor = 'white', textColor = 'white', onPress }) => {
  // Load the custom digital font
  const [fontsLoaded] = useFonts({
    'digital-font': require('../assets/digital-7.ttf'), // Path to your custom font file
  });

  // Ensure the font is loaded before rendering the button
  if (!fontsLoaded) {
    return null; // Or show a loading spinner while fonts are loading
  }

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bgColor, borderColor: borderColor }]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color: textColor, fontFamily: 'digital-font' }]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: "white",  // Default border color (which can be overridden)
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0, // Spacing between buttons
    padding: 8,
    paddingVertical: 15,
  },
  buttonText: {
    fontSize: 20, // Smaller font size
  },
});

export default SmallButton;
