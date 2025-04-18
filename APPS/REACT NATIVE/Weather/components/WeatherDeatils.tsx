import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface WeatherDetailsProps {
  temperature: number | string;
  weather: string;
  feelsLike: number | string;
  isDark: boolean; // New prop to control theme
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ temperature, weather, feelsLike, isDark }) => {
  return (
    <View style={styles.weatherContainer}>
      <Text style={[styles.temperatureText, { color: isDark ? '#fff' : '#000' }]}>{temperature}°</Text>
      <Text style={[styles.weatherText, { color: isDark ? '#fff' : '#000' }]}>{weather}</Text>
      <Text style={[styles.feelsLikeText, { color: isDark ? '#fff' : '#000' }]}>
        Feels like {feelsLike}°
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  weatherContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  temperatureText: {
    fontSize: 80,
    fontWeight: 'bold',
  },
  weatherText: {
    fontSize: 30,
  },
  feelsLikeText: {
    fontSize: 20,
  },
});

export default WeatherDetails;
