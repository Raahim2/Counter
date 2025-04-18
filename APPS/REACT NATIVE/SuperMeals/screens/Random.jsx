import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Recipes from '../Utils/recipy'; // Ensure this path is correct based on your project structure
import { Ionicons } from '@expo/vector-icons';

const RandomScreen = () => {
  const [randomRecipe, setRandomRecipe] = useState(null);

  // Function to generate a random recipe
  const generateRandomRecipe = () => {
    const recipeNames = Object.keys(Recipes);
    const randomIndex = Math.floor(Math.random() * recipeNames.length);
    const randomRecipeName = recipeNames[randomIndex];
    const ingredients = Recipes[randomRecipeName];

    setRandomRecipe({ name: randomRecipeName, ingredients: ingredients });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>


      <View style={styles.card}>
        {randomRecipe ? (
          <>
            <Text style={styles.recipeName}>{randomRecipe.name}</Text>
            <Text style={styles.ingredientsHeader}>Ingredients:</Text>
            {randomRecipe.ingredients.map((ingredient, index) => (
              <Text key={index} style={styles.ingredient}>
                <Ionicons name="checkmark-circle" size={18} color="#28a745" /> {ingredient}
              </Text>
            ))}
          </>
        ) : (
          <Text style={styles.instructions}>Press the button below to generate a random recipe!</Text>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={generateRandomRecipe}>
        <Text style={styles.buttonText}>Generate Recipe</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 30,
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  recipeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 10,
  },
  ingredientsHeader: {
    fontSize: 20,
    fontWeight: '600',
    color: '#7f8c8d',
    marginBottom: 10,
  },
  ingredient: {
    fontSize: 18,
    color: '#2ecc71',
    marginBottom: 5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructions: {
    fontSize: 18,
    color: '#34495e',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
    elevation: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default RandomScreen;
