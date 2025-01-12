import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Importing Ionicons from @expo/vector-icons

// ArrowGrid Component
const ArrowGrid = ({ onArrowPress, textColor = 'white', bgColor = '#5A6581', borderColor = 'white' }) => {
  return (
    <View style={styles.container}>
      {/* Arrow Grid: All buttons in one row */}
      <View style={styles.row}>
        {/* Left Arrow */}
        <TouchableOpacity 
          style={[styles.arrowButton, { backgroundColor: bgColor, borderColor: borderColor }]} 
          onPress={() => onArrowPress('left')}
        >
          <Ionicons name="arrow-back" size={30} color={textColor} />
        </TouchableOpacity>

        {/* Up Arrow */}
        <TouchableOpacity 
          style={[styles.arrowButton, { backgroundColor: bgColor, borderColor: borderColor }]} 
          onPress={() => onArrowPress('up')}
        >
          <Ionicons name="arrow-up" size={30} color={textColor} />
        </TouchableOpacity>

        {/* Down Arrow */}
        <TouchableOpacity 
          style={[styles.arrowButton, { backgroundColor: bgColor, borderColor: borderColor }]} 
          onPress={() => onArrowPress('down')}
        >
          <Ionicons name="arrow-down" size={30} color={textColor} />
        </TouchableOpacity>

        {/* Right Arrow */}
        <TouchableOpacity 
          style={[styles.arrowButton, { backgroundColor: bgColor, borderColor: borderColor }]} 
          onPress={() => onArrowPress('right')}
        >
          <Ionicons name="arrow-forward" size={30} color={textColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', // Ensure the container takes the full width
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', // Evenly space out the buttons in the row
    alignItems: 'center',
    width: '100%', // Full width of the container
  },
  arrowButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    padding: 8,
    borderWidth: 1, // Border width for the buttons
  },
});

export default ArrowGrid;
