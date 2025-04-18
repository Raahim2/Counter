import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Dimensions, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Sidebar from './sidebar'; // Make sure to import the Sidebar component
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const Navbar = ({setUsermesseges , setBotMesseges}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigation = useNavigation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle the sidebar open/closed
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false); // Close the sidebar
  };

  const clearchat = () =>{
    setBotMesseges([])
    setUsermesseges([])
  }

  

  return (
    <>

      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.navbar}>
        {/* Left Menu Icon */}
        {/* <TouchableOpacity onPress={toggleSidebar} style={styles.iconButton}>
          <FontAwesome name="bars" size={20} color="black" />
        </TouchableOpacity> */}
        


        {/* Title */}
        <Text style={styles.title}>Pics AI</Text>

        {/* Right Plus Icon */}
        <TouchableOpacity onPress={clearchat} style={styles.iconButton}>
          <FontAwesome name="trash" size={20} color="black" />
        </TouchableOpacity>

      </View>

      {/* Sidebar */}
      {isSidebarOpen && (
        <View style={[styles.sidebarWrapper, { width: width * 0.7 }]}>
          <Sidebar closeSidebar={closeSidebar} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    height: 60,
  },
  title: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sidebarWrapper: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#f8f8f8',
    zIndex: 1000,
  },
});

export default Navbar;
