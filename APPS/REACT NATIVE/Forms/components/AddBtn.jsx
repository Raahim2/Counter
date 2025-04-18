import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const AddBtn = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigation = useNavigation(); // Get the navigation object

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handlePress = () => {
    // Generate a unique form ID (for example purposes, using Date.now())
    const formId = Date.now();
    // Navigate to the Form Page with the form ID
    navigation.navigate('Form', { formId });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.fab} onPress={toggleMenu}>
        <MaterialCommunityIcons
          name={menuOpen ? 'close' : 'plus'}
          size={24}
          color="white"
        />
      </TouchableOpacity>
      {/* Conditional rendering for additional buttons */}
      {menuOpen && (
        <TouchableOpacity style={styles.menuItem} onPress={handlePress}>
          <MaterialCommunityIcons name="form-textbox" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    alignItems: 'center',
  },
  fab: {
    width: 56,
    height: 56,
    backgroundColor: '#6200ee',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  menuItem: {
    marginTop: 10,
    width: 56,
    height: 56,
    backgroundColor: '#6200ee',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default AddBtn;
