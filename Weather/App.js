import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, StatusBar, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // For the icons
import DayForecast from './components/dayforecast';
import WeatherDetails from './components/WeatherDeatils';
import CityModal from './components/cityModal';
import InfoModal from './components/InfoModal'; // Importing the InfoModal

const App = () => {
  const API_KEY = "OPEN_WEATHER_API";  
  const [city, setCity] = useState('Mumbai');
  const [temperature , setTemp] = useState(0);
  const [weather , setWeather] = useState("Cloudy");
  const [feelsLikeTemperature , setFeelsLikeTemp] = useState(0);
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [isDark , setIsDark] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false); // For Info Modal
  const [backgroundImage, setBackgroundImage] = useState(require('./assets/images/Bgs/clear.png')); // Default background

  // Fetch weather data based on the selected city
  const fetchWeatherData = async () => {
    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const weatherJson = await weatherResponse.json();
      console.log(weatherJson);

      // Handle error if city is not found
      if (weatherJson.cod !== 200) {
        alert(`City not found: ${city}`);
        return;
      }

      // Extract weather data
      const currentWeather = {
        temperature: Math.round(weatherJson.main.temp), // Round temperature
        weather: weatherJson.weather[0].description,
        feelsLike: Math.round(weatherJson.main.feels_like), // Round feels like
        humidity: weatherJson.main.humidity,
        windSpeed: weatherJson.wind.speed,
        visibility: weatherJson.visibility / 1000, // in km
        name: weatherJson.name,
        sys: weatherJson.sys,
        main: weatherJson.main,
        weather: weatherJson.weather,
        wind: weatherJson.wind,
      };

      // Set state for weather data
      setTemp(Math.round(weatherJson.main.temp));
      setFeelsLikeTemp(Math.round(weatherJson.main.feels_like));
      setWeather(weatherJson.weather[0].description);
      setWeatherData(currentWeather);

      // Set background image based on current weather description
      let bgImage;
      switch (weatherJson.weather[0].main) {
        case 'Clouds':
          bgImage = require('./assets/images/Bgs/cloudy.png');
          setIsDark(false);
          break;
        case 'Clear':
          bgImage = require('./assets/images/Bgs/clear.png');
          setIsDark(false);
          break;
        case 'Atmosphere':
          bgImage = require('./assets/images/Bgs/atmosphere.png');
          setIsDark(true);
          break;
        case 'Snow':
          bgImage = require('./assets/images/Bgs/snow.png');
          setIsDark(false);
          break;
        case 'Rain':
          bgImage = require('./assets/images/Bgs/rainy.png');
          setIsDark(true);
          break;
        case 'Drizzle':
          bgImage = require('./assets/images/Bgs/drizzle.png');
          setIsDark(true);
          break;
        case 'Thunderstorm':
          bgImage = require('./assets/images/Bgs/thunder.png');
          setIsDark(true);
          break;
        default:
          bgImage = require('./assets/images/Bgs/clear.png');
          setIsDark(false);
          break;
      }

      setBackgroundImage(bgImage);

      

      // Fetch forecast data for the next 7 days
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const forecastJson = await forecastResponse.json();

      const forecast = forecastJson.list.slice(0, 7).map((item) => {
        let icon;
        console.log(item.weather[0].main)
        switch (item.weather[0].main) {
          case 'Clouds':
            icon = require('./assets/images/Icons/cloudy.png');
            break;
          case 'Clear':
            icon = require('./assets/images/Icons/sunny.png');
            break;
          case 'Rain':
            icon = require('./assets/images/Icons/rainy.png');
            break;
          case 'Drizzle':
            icon = require('./assets/images/Icons/wind.png');
            break;
          case 'Snow':
            icon = require('./assets/images/Icons/snow.png');
            break;
          case 'Thunderstorm':
            icon = require('./assets/images/Icons/thunder.png');
            break;
          default:
            icon = require('./assets/images/Icons/sunny.png'); // Default icon
            break;
        }
      
        return {
          day: new Date(item.dt * 1000).toLocaleString('en-us', { weekday: 'short' }),
          icon: icon,
          temperature: Math.round(item.main.temp), // Rounded temperature
        };
      });

      setForecastData(forecast);

    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const handleCityChange = (newCity) => {
    setCity(newCity);
    setModalVisible(false);
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Top Bar with City Name, Info Icon and Plus Icon */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setInfoModalVisible(true)}>
          <MaterialIcons name="info-outline" size={32} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>

        <Text style={[styles.cityText, { color: isDark ? '#fff' : '#000' }]}>{city}</Text>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <MaterialIcons name="add-circle-outline" size={32} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>

      {weatherData && <WeatherDetails temperature={temperature} weather={weather} feelsLike={feelsLikeTemperature} isDark={isDark} />}
      <DayForecast title="7 Days Forecast" forecastData={forecastData} isDark={isDark} />
      <CityModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleCityChange}
        isDark={isDark}
        api={API_KEY}
      />
      
      {/* Info Modal */}
      <InfoModal
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
        weatherData={weatherData}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  topBar: {
    marginTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cityText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
});

export default App;
