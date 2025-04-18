import React from 'react';
import {  StyleSheet, SafeAreaView } from 'react-native';
import BottomNavigation from './components/BottomNav';
import { StatusBar } from 'react-native';

export default function App() {
  
  return (
    <SafeAreaView style={styles.container}>
      <BottomNavigation/>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#ffffff"  
        translucent={false} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
