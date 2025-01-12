import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as Font from 'expo-font';

const loadFonts = () => Font.loadAsync({
  'Digital-7': require('../assets/digital-7.ttf'),
});

const Screen = ({ input, output, bgColor = 'rgb(170 176 174)', textColor = 'white' }) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontLoaded(true));
  }, []);

  // Show loading message while font is loading
  if (!fontLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={[styles.screen, { backgroundColor: bgColor }]}>
      <Text style={[styles.inputText, { color: textColor }]}>
        {input}
      </Text>
      <Text style={[styles.outputText, { color: textColor }]}>
        {output}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'flex-end',  // Position the output at the bottom
    alignItems: 'flex-start',     // Align the input to the left
    padding: 10,
  },
  customText: {
    fontSize: 50,
    fontFamily: 'Digital-7', // Ensure this matches the font name inside the .ttf file
  },
  inputText: {
    fontSize: 50,
    alignSelf: 'flex-start',
    fontFamily: 'Digital-7', // Ensure this matches the correct font name
  },
  outputText: {
    fontSize: 60,
    alignSelf: 'flex-end',
    fontFamily: 'Digital-7', // Ensure this matches the correct font name
  },
});

export default Screen;
