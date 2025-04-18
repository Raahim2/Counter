import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import Recipes from '../Utils/recipy'; // Import your Recipes data

export default function Recipescreen({ onNavigateToKitchen }) {
  const [ingredientsData, setIngredientsData] = useState({
    Essentials: [],
    Vegetables: [],
    Fruits: [],
    Dairy: [],
    Sweets: [],
    Proteins: [],
  });

  // Load ingredients from AsyncStorage when the component mounts
  useEffect(() => {
    const loadSelectedIngredients = async () => {
      try {
        const storedIngredients = await AsyncStorage.getItem('selectedIngredients');
        if (storedIngredients) {
          setIngredientsData(JSON.parse(storedIngredients));
        }
      } catch (error) {
        console.error('Error loading selected ingredients from AsyncStorage:', error);
      }
    };

    loadSelectedIngredients(); // Fetch ingredients
  }, []);

  // Flattening selected ingredients
  const flattenedSelectedIngredients = Object.values(ingredientsData).flat();

  // Function to filter recipes based on selected ingredients
  const filteredRecipes = Object.keys(Recipes).filter((recipeName) => {
    const recipeIngredients = Recipes[recipeName];
    // Check if all ingredients for the recipe are available in the selected ingredients
    return recipeIngredients.every((ingredient) => flattenedSelectedIngredients.includes(ingredient));
  });

  // Count the number of filtered recipes and ingredients
  const recipeCount = filteredRecipes.length;
  const ingredientCount = new Set(flattenedSelectedIngredients).size; // Unique ingredients

  return (
    <View style={styles.container}>
      {/* Heading */}
      <Text style={styles.heading}>Suggested Recipes</Text>

      {/* Subheading */}
      <Text style={styles.subheading}>
        You can make {recipeCount} recipes with {ingredientCount} ingredients
      </Text>

      {/* Recipe List */}
      <ScrollView style={styles.recipeList}>
        {filteredRecipes.map((recipeName) => (
          <View key={recipeName} style={styles.recipeContainer}>
            <Text style={styles.recipeName}>{recipeName}</Text>
            <View style={styles.ingredientsContainer}>
              {Recipes[recipeName].map((ingredient, index) => (
                <TouchableOpacity key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{ingredient}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    flex: 1, // To take up full screen
    justifyContent: 'space-between', // Ensure content is spaced properly
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  recipeList: {
    flex: 1, // Ensure this takes up available space
    borderTopWidth: 1,
    borderTopColor: 'grey',
  },
  recipeContainer: {
    padding: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: 'grey',
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 5,
  },
  tag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    fontSize: 14,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
