import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

const IngredientsCategoryList = ({ ingredients, selectedIngredients, setSelectedIngredients }) => {


  // State to handle open/close for each category
  const [openCategories, setOpenCategories] = useState(
    Object.keys(ingredients).reduce((acc, category) => {
      acc[category] = false; // Initially, all categories are closed
      return acc;
    }, {})
  );

  const handleIngredientPress = (category, ingredient) => {
    setSelectedIngredients((prevSelected) => {
      const updatedCategory = prevSelected[category].includes(ingredient)
        ? prevSelected[category].filter((item) => item !== ingredient)
        : [...prevSelected[category], ingredient];

      return {
        ...prevSelected,
        [category]: updatedCategory,
      };
    });
  };

  const iconMapping = {
    Essentials: require('../assets/Icons/essentials.png'),
    Vegetables: require('../assets/Icons/vegetables.png'),
    Fruits: require('../assets/Icons/fruits.png'),
    Dairy: require('../assets/Icons/dairy.png'),
    Sweets: require('../assets/Icons/sweets.png'),
    Proteins: require('../assets/Icons/proteins.png'),
  };

  const toggleCategory = (category) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const renderCategory = (categoryName, ingredients) => {
    const isOpen = openCategories[categoryName]; // Whether the category is open or closed
    const displayedIngredients = isOpen ? ingredients : ingredients.slice(0, 15); // Show all or first 15

    return (
      <View style={styles.categoryContainer} key={categoryName}>
        <View style={styles.headingContainer}>
          <Image source={iconMapping[categoryName]} style={styles.icon} />
          <View style={styles.headingTextContainer}>
            <Text style={styles.heading}>{categoryName}</Text>
            <Text style={styles.selectedCount}>
              {selectedIngredients[categoryName].length}/{ingredients.length} selected
            </Text>
          </View>
          {/* Chevron icon */}
          <TouchableOpacity onPress={() => toggleCategory(categoryName)}>
            <Ionicons
              name={isOpen ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="#333"
              style={styles.chevronIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Ingredients list */}
        <ScrollView contentContainerStyle={styles.ingredientsContainer}>
          {displayedIngredients.map((ingredient, index) => {
            const isSelected = selectedIngredients[categoryName].includes(ingredient);
            return (
              <TouchableOpacity
                key={index}
                style={[styles.tag, isSelected && styles.selectedTag]}
                onPress={() => handleIngredientPress(categoryName, ingredient)}
              >
                <Text style={[styles.tagText, isSelected && styles.selectedText]}>
                  {ingredient}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Show remaining items with dynamic toggle button */}
          {!isOpen && ingredients.length > 15 && (
            <TouchableOpacity
              style={styles.tag}
              onPress={() => toggleCategory(categoryName)}
            >
              <Text style={styles.tagText}>{ingredients.length - 15} More</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {Object.keys(ingredients).map((category) =>
        renderCategory(category, ingredients[category])
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between', // Ensure heading and chevron are spaced apart
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  headingTextContainer: {
    flex: 1, // Take the remaining space for the text part
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedCount: {
    fontSize: 14,
    color: '#666',
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow the tags to wrap to the next line
    paddingVertical: 5,
  },
  tag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
    alignSelf: 'flex-start', // Ensure tags take their required width
  },
  selectedTag: {
    backgroundColor: '#007bff',
  },
  tagText: {
    fontSize: 14,
    color: '#333',
  },
  selectedText: {
    color: '#fff',
  },
  chevronIcon: {
    marginLeft: 10,
  },
});

export default IngredientsCategoryList;
