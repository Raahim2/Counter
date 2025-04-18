import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, FlatList, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import ingredients from '../Utils/ingredients'; // Assuming you have this file

const CameraScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [detectedItems, setDetectedItems] = useState([]);
  const [showNoIngredients, setShowNoIngredients] = useState(false); // State to manage "No ingredient" message
  
  // Function to pick an image
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      detectObjects(result.assets[0].uri); // Call function to detect objects
    }
  };

  // Function to simulate object detection and return ingredients randomly
  const detectObjects = async (imageUri) => {
    console.log(imageUri);

    // Simulate an object detection API call with random ingredients
    setTimeout(() => {
      const randomChance = Math.random();
      
      if (randomChance < 0.75) {
        setShowNoIngredients(true); // 75% chance to show "No ingredient detected"
        setDetectedItems([]); // Clear the detected items
      } else {
        const randomIngredients = getRandomIngredients();
        setDetectedItems(randomIngredients); // 25% chance to show detected ingredients
        setShowNoIngredients(false); // Hide "No ingredient detected"
      }
    }, 2000); // Simulate delay
  };

  // Function to get 2-3 random ingredients from the lists
  const getRandomIngredients = () => {
    const allIngredients = [
      ...ingredients.essentials,
      ...ingredients.vegetables,
      ...ingredients.fruits,
      ...ingredients.sweets,
      ...ingredients.dairy,
      ...ingredients.proteins
    ];

    const randomItems = [];
    const numberOfItems = Math.floor(Math.random() * 2) + 2; // Randomly pick 2 or 3 items

    while (randomItems.length < numberOfItems) {
      const randomIndex = Math.floor(Math.random() * allIngredients.length);
      const item = allIngredients[randomIndex];
      if (!randomItems.includes(item)) {
        randomItems.push(item);
      }
    }

    return randomItems;
  };

  return (
    <View style={styles.container}>
      {selectedImage ? (
        <Image source={{ uri: selectedImage }} style={styles.image} />
      ) : (
        <Text style={styles.placeholderText}>No image uploaded</Text>
      )}

      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>

      {showNoIngredients ? (
        <Text style={styles.noIngredientsText}>No ingredients detected</Text>
      ) : (
        detectedItems.length > 0 && (
          <View style={styles.foodListContainer}>
            <Text style={styles.foodListTitle}>Detected Ingredients:</Text>
            <FlatList
              data={detectedItems}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.foodItem}>
                  <Ionicons name="checkmark-circle" size={18} color="#2ecc71" />
                  <Text style={styles.foodItemText}>{item}</Text>
                </View>
              )}
            />
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    borderRadius: 10,
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  noIngredientsText: {
    fontSize: 18,
    color: '#ff4747',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  foodListContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '100%',
    maxHeight: '30%',
    elevation: 5,
  },
  foodListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  foodItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
});

export default CameraScreen;
