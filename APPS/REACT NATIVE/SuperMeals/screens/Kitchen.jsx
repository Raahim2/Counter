import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, Alert, View } from 'react-native';
import IngredientsCategoryList from '../components/Items';
import ingredients from '../Utils/ingredients';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export default function KitchenScreen() {
  const [selectedIngredients, setSelectedIngredients] = useState({
    Essentials: [],
    Vegetables: [],
    Fruits: [],
    Dairy: [],
    Sweets: [],
    Proteins: [],
  });

  const allingredients = useState({
    Essentials: ingredients.essentials,
    Vegetables: ingredients.vegetables,
    Fruits: ingredients.fruits,
    Dairy: ingredients.dairy,
    Sweets: ingredients.sweets,
    Proteins: ingredients.proteins,
  });

  // Load selected ingredients from AsyncStorage when the component mounts
  useEffect(() => {
    const loadSelectedIngredients = async () => {
      try {
        const storedIngredients = await AsyncStorage.getItem('selectedIngredients');
        if (storedIngredients) {
          setSelectedIngredients(JSON.parse(storedIngredients)); // Parse the stored data if it exists
        }
      } catch (error) {
        console.error('Error loading selected ingredients from AsyncStorage:', error);
      }
    };

    loadSelectedIngredients();
  }, []); // This effect runs only once when the component mounts

  // Save selected ingredients to AsyncStorage whenever they change
  useEffect(() => {
    const saveSelectedIngredients = async () => {
      try {
        await AsyncStorage.setItem('selectedIngredients', JSON.stringify(selectedIngredients));
      } catch (error) {
        console.error('Error saving selected ingredients to AsyncStorage:', error);
      }
    };
    saveSelectedIngredients();
  }, [selectedIngredients]); // This effect runs whenever selectedIngredients changes

  const clearAllIngredients = async () => {
    Alert.alert(
      'Confirm Action',
      'Are you sure you want to clear all ingredients?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Clear action cancelled'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              // Clear data in AsyncStorage
              await AsyncStorage.setItem('selectedIngredients', JSON.stringify({
                Essentials: [],
                Vegetables: [],
                Fruits: [],
                Dairy: [],
                Sweets: [],
                Proteins: [],
              }));
              // Reset the state to the default
              setSelectedIngredients({
                Essentials: [],
                Vegetables: [],
                Fruits: [],
                Dairy: [],
                Sweets: [],
                Proteins: [],
              });
              console.log('All ingredients cleared');
            } catch (error) {
              console.error('Error clearing ingredients:', error);
            }
          },
        },
      ],
      { cancelable: true } // Allow dismissal of the alert by tapping outside
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 10 }}>

        <IngredientsCategoryList
          ingredients={allingredients[0]}
          selectedIngredients={selectedIngredients}
          setSelectedIngredients={setSelectedIngredients}
        />
        
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: 40 }}>
          <TouchableOpacity 
            style={{ backgroundColor: '#ff4d4d', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5, marginRight: 10 }} 
            onPress={clearAllIngredients}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
              Clear All Ingredients
            </Text>
          </TouchableOpacity>

          
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
