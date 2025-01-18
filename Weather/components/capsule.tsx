import React from 'react';
import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';

interface CapsuleProps {
  day: string;
  icon: ImageSourcePropType;
  temperature: number | string;
  isDark: boolean; // New prop for dark/light theme
}

const Capsule: React.FC<CapsuleProps> = ({ day, icon, temperature, isDark }) => {
  return (
    <View style={[styles.container, { borderColor: isDark ? '#fff' : '#000' }]}>
      <Text style={[styles.day, { color: isDark ? '#fff' : '#000' }]}>{day}</Text>
      <Image source={icon} style={styles.icon} />
      <Text style={[styles.temperature, { color: isDark ? '#fff' : '#000' }]}>{temperature}°</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: 'transparent', // Transparent background
    width: 75,
    height: 160,
    paddingVertical: 15,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  day: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    width: 40,
    height: 40,
    marginVertical: 10,
  },
  temperature: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Capsule;
