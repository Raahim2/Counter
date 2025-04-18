import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import KitchenScreen from '../screens/Kitchen';
import IngredientsScreen from '../screens/Ingredients';
import RecipyScreen from '../screens/Recipy';
import CameraScreen from '../screens/Camera';
import RandomScreen from '../screens/Random';

export default function BottomNavigation() {
  const [currentScreen, setCurrentScreen] = useState(1); // Initial screen is 1

  // Screen titles
  const screenTitles = {
    1: 'Kitchen',
    2: 'Ingredients',
    3: 'Camera',
    4: 'Recipes',
    5: 'Random',
  };

  // Function to set the color based on the current screen
  const getIconColor = (screen) => {
    return currentScreen === screen ? '#007bff' : '#555555';
  };

  // Function to render the currently active screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 1:
        return <KitchenScreen />;
      case 2:
        return <IngredientsScreen />;
      case 3:
        return <CameraScreen />;
      case 4:
        return <RecipyScreen />;
      case 5:
        return <RandomScreen />;
      default:
        return <KitchenScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{screenTitles[currentScreen]}</Text>
      </View>

      {/* Current Screen */}
      <View style={styles.screenContainer}>{renderScreen()}</View>

      {/* Bottom Navigation */}
      <View style={styles.navbar}>
        {/* Kitchen Button */}
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen(1)}>
          <Ionicons name="restaurant" size={24} color={getIconColor(1)} />
          <Text style={styles.navText}>Kitchen</Text>
        </TouchableOpacity>

        {/* Ingredients Button */}
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen(2)}>
          <Ionicons name="fast-food" size={24} color={getIconColor(2)} />
          <Text style={styles.navText}>Ingredients</Text>
        </TouchableOpacity>

        {/* Center Camera Button */}
        <View style={styles.centerButtonContainer}>
          <TouchableOpacity style={styles.centerButton} onPress={() => setCurrentScreen(3)}>
            <View style={styles.centerButtonIcon}>
              <Ionicons name="camera" size={24} color="#ffffff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Recipes Button */}
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen(4)}>
          <Ionicons name="book" size={24} color={getIconColor(4)} />
          <Text style={styles.navText}>Recipes</Text>
        </TouchableOpacity>

        {/* Random Button */}
        <TouchableOpacity style={styles.navItem} onPress={() => setCurrentScreen(5)}>
          <Ionicons name="cube" size={24} color={getIconColor(5)} />
          <Text style={styles.navText}>Random</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    backgroundColor: '#ffffff', 
    height: 56, 
    justifyContent: 'center',
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerText: {
    color: '#000',
    fontSize: 18, 
    fontWeight: '500',
    marginLeft: 16, 
  },
  screenContainer: {
    flex: 1,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
    elevation: 5,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    color: '#555555',
    fontSize: 12,
    marginTop: 4,
  },
  centerButtonContainer: {
    position: 'absolute',
    bottom: 25,
    left: '50%',
    transform: [{ translateX: -35 }],
    zIndex: 1,
  },
  centerButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButtonIcon: {
    backgroundColor: '#007bff',
    color: '#ffffff',
    borderRadius: 35,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ffffff',
    borderWidth: 5,
  },
});
