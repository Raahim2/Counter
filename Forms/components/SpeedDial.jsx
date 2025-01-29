import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SpeedDialMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <View style={styles.container}>
      {menuOpen && (
        <View style={styles.menu}>
          <SpeedDialButton icon="share-variant" />
          <SpeedDialButton icon="printer" />
          <SpeedDialButton icon="download" />
          <SpeedDialButton icon="content-copy" />
        </View>
      )}
      <TouchableOpacity style={styles.fab} onPress={toggleMenu}>
        <MaterialCommunityIcons
          name={menuOpen ? 'close' : 'plus'}
          size={24}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
};

const SpeedDialButton = ({ icon }) => {
  return (
    <TouchableOpacity style={styles.button}>
      <MaterialCommunityIcons name={icon} size={24} color="#4B5563" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    alignItems: 'center',
  },
  menu: {
    marginBottom: 16,
    alignItems: 'center',
  },
  button: {
    width: 52,
    height: 52,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 12, // Space between buttons
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
});

export default SpeedDialMenu;
