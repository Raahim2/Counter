import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import vector icon library
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export default function IngredientsScreen() {
  const selectedIng = {
    Essentials: [],
    Vegetables: [],
    Fruits: [],
    Dairy: [],
    Sweets: [],
    Proteins: [],
  };

  const iconMapping = {
    Essentials: require('../assets/Icons/essentials.png'),
    Vegetables: require('../assets/Icons/vegetables.png'),
    Fruits: require('../assets/Icons/fruits.png'),
    Dairy: require('../assets/Icons/dairy.png'),
    Sweets: require('../assets/Icons/sweets.png'),
    Proteins: require('../assets/Icons/proteins.png'),
  };

  const [expandedCategories, setExpandedCategories] = useState(
    Object.keys(selectedIng).reduce((acc, category) => {
      acc[category] = true;
      return acc;
    }, {})
  );

  const [ingredientsData, setIngredientsData] = useState(selectedIng);

  // Load selected ingredients from AsyncStorage when component mounts
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

    loadSelectedIngredients(); // Run the function to load ingredients
  }, []); // Empty dependency array ensures this runs only once when component mounts

  const renderSectionHeader = ({ section }) => {
    const category = section.title;
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

    const icon = iconMapping[category] || require('../assets/Icons/sweets.png');

    const isExpanded = expandedCategories[category] || false;

    return (
      <View style={styles.headerContainer}>
        <Image source={icon} style={styles.icon} />
        <Text style={styles.headerText}>{categoryName || 'Unknown Category'}</Text>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => toggleCategoryExpansion(category)}
        >
          <Icon name={isExpanded ? 'expand-less' : 'expand-more'} size={24} color="#333" />
        </TouchableOpacity>
      </View>
    );
  };

  const toggleCategoryExpansion = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const renderIngredientItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item || 'Unknown Ingredient'}</Text>
    </View>
  );

  const sections = Object.keys(ingredientsData)
    .filter((category) => ingredientsData[category].length > 0)
    .map((category) => ({
      title: category,
      data: ingredientsData[category],
    }));

  return (
    <FlatList
      data={sections}
      keyExtractor={(item, index) => `${item.title}-${index}`} // Ensure keys are unique strings
      renderItem={({ item }) => (
        <View style={styles.categoryContainer}>
          {renderSectionHeader({ section: item })}
          {expandedCategories[item.title] && (
            <FlatList
              data={item.data}
              keyExtractor={(ingredient, index) => `${item.title}-${index}`} // Ensure keys are unique strings
              renderItem={renderIngredientItem}
            />
          )}
        </View>
      )}
      ListEmptyComponent={<Text style={styles.noIngredientsText}>No ingredients available!</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth:1,
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  categoryContainer: {
    margin: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  icon: {
    width: 35,
    height: 35,
    marginRight: 15,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize',
    flex: 1,
  },
  iconButton: {
    padding: 5,
  },
  itemContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 18,
    color: '#555',
    fontWeight: '500',
  },
  noIngredientsText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#999',
    marginTop: 50,
  },
});
