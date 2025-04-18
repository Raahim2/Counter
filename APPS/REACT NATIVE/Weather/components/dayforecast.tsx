import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Capsule from './capsule';

interface DayForecastProps {
  title: string;
  forecastData: { day: string, icon: any, temperature: number | string }[];
  isDark: boolean; // Add isDark prop for theme control
}

const DayForecast: React.FC<DayForecastProps> = ({ title, forecastData, isDark }) => {
  return (
    <View style={styles.forecastContainer}>
      <Text style={[styles.forecastTitle, { color: isDark ? '#fff' : '#000' }]}>{title}</Text>
      <ScrollView horizontal={true} contentContainerStyle={{ flexDirection: 'row' }} showsHorizontalScrollIndicator={false}>
        {forecastData.map((data, index) => (
          <Capsule
            key={index}
            day={data.day}
            icon={data.icon}
            temperature={data.temperature}
            isDark={isDark} // Pass isDark to Capsule
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  forecastContainer: {
    padding: 10,
    marginBottom: 20,
  },
  forecastTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default DayForecast;
