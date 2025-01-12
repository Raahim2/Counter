import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font'; // Import the useFonts hook

const Button = ({ text, onPress, bgColor = 'white', borderColor = 'black', textColor = 'black' }) => {
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
    padding: 12,
    paddingVertical: 20,
    borderWidth: 1,  // Border width remains constant
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  buttonText: {
    fontSize: 30,
    // fontWeight: 'bold',
  },
});

export default Button;
