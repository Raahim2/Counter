import { Vibration } from 'react-native';
import { TouchableWithoutFeedback , Text} from 'react-native';
import React, { useState, useEffect } from 'react';
import {View, StyleSheet,  Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'react-native';

import CircularCounter from './components/counter';
import BottomNav from './components/bottomnav';
import EditCounter from './components/editcountermodal';
import CreateCounterModal from './components/createcountermodal';
import Sidebar from './components/sidebar';
import Header from './components/header';
import Timer from './components/timer';

interface CounterState {
  id: string;
  count: number;
  counterName: string;
  lapLimit: number;
  multiplier?: number;
}

const COUNTERS_KEY = 'countersData';

export default function RootLayout() {
  const [counters, setCounters] = useState<CounterState[]>([]);
  const [activeCounter, setActiveCounter] = useState<CounterState | null>(null);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newCounterName, setNewCounterName] = useState<string>('');
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editedCounter, setEditedCounter] = useState<CounterState | null>(null);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const [themeIndex, setThemeIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  

  const colorThemes = [
    { bg: '#000000', text: '#00FFFF' }, // Neon Cyan
    { bg: '#000000', text: '#FFFFFF' }, // Basic Dark Theme
    { bg: '#0D0221', text: '#FF6EC7' }, // Deep Blue with Neon Pink
    { bg: '#1B003B', text: '#FF4500' }, // Midnight Purple with Neon Orange
    { bg: '#001F3F', text: '#7FFF00' }, // Dark Navy with Electric Green
    { bg: '#2C003E', text: '#00BFFF' }, // Dark Violet with Bright Blue
    { bg: '#1a001a', text: '#FF00FF' }, // Dark Purple with Pink
    { bg: '#1a001a', text: '#39FF14' }, // Dark Purple with Green
    { bg: '#0F0F0F', text: '#FFD700' }, // Near Black with Neon Gold
    { bg: '#000814', text: '#00FF7F' }, // Deep Black-Blue with Neon Mint
  ];

  const currentTheme = colorThemes[themeIndex];

  const toggleTheme = () => {
    setThemeIndex((prevIndex) => (prevIndex + 1) % colorThemes.length);
  };

  // Load counters on component mount
  useEffect(() => {
    const loadCounters = async () => {
      const savedCounters = await AsyncStorage.getItem(COUNTERS_KEY);
      if (savedCounters) {
        const parsedCounters: CounterState[] = JSON.parse(savedCounters);
        setCounters(parsedCounters);
        setActiveCounter(parsedCounters[0] || null);
      } else {
        const defaultCounter: CounterState = {
          id: `${Date.now()}`,
          counterName: 'Counter',
          count: 0,
          lapLimit: 100,
          multiplier: 1,
        };
        setCounters([defaultCounter]);
        setActiveCounter(defaultCounter);
        await AsyncStorage.setItem(COUNTERS_KEY, JSON.stringify([defaultCounter]));
      }
    };
    loadCounters();
  }, []);

  // Save counters to AsyncStorage
  const saveCounters = async (updatedCounters: CounterState[]) => {
    try {
      await AsyncStorage.setItem(COUNTERS_KEY, JSON.stringify(updatedCounters));
    } catch (error) {
      console.error('Error saving counters:', error);
    }
  };

  // Create a new counter
  const handleCreateCounter = () => {
    if (newCounterName.trim() === '') return;

    const newCounter: CounterState = {
      id: `${Date.now()}`,
      counterName: newCounterName,
      count: 0,
      lapLimit: 100,
      multiplier: 1,
    };
    const updatedCounters = [...counters, newCounter];
    setCounters(updatedCounters);
    saveCounters(updatedCounters);
    setNewCounterName('');
    setShowCreateModal(false);
  };

  // Select a counter
  const handleSelectCounter = (counter: CounterState) => {
    setSeconds(0);
    setIsRunning(false);
    setActiveCounter(counter);
    setShowSidebar(false);
  };

  const handleEditCounter = () => {
    if (activeCounter) {
      setEditedCounter({ ...activeCounter });  // Copy the active counter data immediately
      setShowEditModal(true);  // Show the modal after setting the editedCounter
    }
  };

  // Handle saving the updated counter
  const handleSaveCounter = () => {
    if (editedCounter && activeCounter) {
      const updatedCounters = counters.map((counter) =>
        counter.id === activeCounter.id ? { ...editedCounter } : counter
      );
      setCounters(updatedCounters);
      saveCounters(updatedCounters);
      setActiveCounter(editedCounter);
      setShowEditModal(false);
    }
  };

  // Handle deleting the counter
  const handleDeleteCounter = () => {
    if (activeCounter) {
      const updatedCounters = counters.filter((counter) => counter.id !== activeCounter.id);
      setCounters(updatedCounters);
      saveCounters(updatedCounters);
      setActiveCounter(null);
      setShowEditModal(false);
    }
  };

  // Increase count
  const increaseCount = async () => {
    if (!activeCounter) return;

    if(!isRunning){
      setIsRunning(true);
    }

    // Continue increasing even after lapLimit
    const newCount = activeCounter.count + (activeCounter.multiplier ?? 1);
    const updatedCounters = counters.map((counter) =>
      counter.id === activeCounter.id ? { ...counter, count: newCount } : counter
    );
    setCounters(updatedCounters);
    saveCounters(updatedCounters);
    setActiveCounter({ ...activeCounter, count: newCount });

    if (vibrationEnabled) {
      Vibration.vibrate(75);
    }
  };

  const resetCount = () => {
    if (!activeCounter) return;

    // Show confirmation alert
    Alert.alert(
      "Are you sure?",
      "Do you want to reset the counter?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            // Reset count to 0
            const newCount = 0;
            const updatedCounters = counters.map((counter) =>
              counter.id === activeCounter.id
                ? { ...counter, count: newCount } // Reset only the count
                : counter
            );

            // Update the state and save the counters
            setCounters(updatedCounters);
            saveCounters(updatedCounters);
            setActiveCounter({ ...activeCounter, count: newCount });
          },
        },
      ]
    );
  };

  // Decrease count
  const decreaseCount = () => {
    if (!activeCounter) return;

    const newCount = activeCounter.count === 0 ? 0 : activeCounter.count - activeCounter.multiplier!;
    const updatedCounters = counters.map((counter) =>
      counter.id === activeCounter.id ? { ...counter, count: newCount } : counter
    );
    setCounters(updatedCounters);
    saveCounters(updatedCounters);
    setActiveCounter({ ...activeCounter, count: newCount });
  };

  const handleInputChange = (field: 'count' | 'lapLimit' | 'multiplier', value: string) => {
    const parsedValue = value === '' ? 0 : parseInt(value, 10);
    if (isNaN(parsedValue)) return; 

    if (editedCounter) {
      setEditedCounter({ ...editedCounter, [field]: parsedValue });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={increaseCount}>
      <View style={[styles.container, { backgroundColor: currentTheme.bg }]}>
        <StatusBar backgroundColor={currentTheme.bg} barStyle={currentTheme.bg === '#FFFFFF' ? 'dark-content' : 'light-content'} />
        
        {/* Header */}
        <Header
          currentTheme={currentTheme}
          activeCounter={activeCounter}
          setShowSidebar={setShowSidebar} 
        />
    

  
        {/* Counter Display */}
        {activeCounter && (
          <>
            {/* Timer */} 
            <Timer 
              isRunning={isRunning}
              setIsRunning={setIsRunning} 
              bgColor={currentTheme.bg}
              textColor={currentTheme.text}
              seconds={seconds}
              setSeconds={setSeconds}
            />
                        
            <CircularCounter
              textClr={currentTheme.text}
              bgClr={currentTheme.bg}
              glow={true}
              count={activeCounter.count}
              lapLimit={activeCounter.lapLimit}
              
            />
          </>
        )}
  
        {/* Sidebar */}
        <Sidebar
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          counters={counters}
          setShowCreateModal={setShowCreateModal}
          handleSelectCounter={handleSelectCounter}
          bgColor={currentTheme.bg}
          textColor={currentTheme.text}
          
        />  
  
        {/* Create Counter Modal */}
        <CreateCounterModal
          showCreateModal={showCreateModal}
          newCounterName={newCounterName}
          setNewCounterName={setNewCounterName}
          handleCreateCounter={handleCreateCounter}
          setShowCreateModal={setShowCreateModal}
          bgColor={currentTheme.bg}
          textColor={currentTheme.text}
        />  
  
        {/* Edit Counter Modal */}
        <EditCounter
          showEditModal={showEditModal}
          editedCounter={editedCounter}
          setEditedCounter={setEditedCounter}
          handleInputChange={handleInputChange}
          handleSaveCounter={handleSaveCounter}
          setShowEditModal={setShowEditModal}
          handleDeleteCounter={handleDeleteCounter}
          bgColor={currentTheme.bg}
          textColor={currentTheme.text}
        />
  
        {/* Bottom Info Bar */}
        {activeCounter && (
          <View style={styles.bottomInfo}>
            <Text style={[styles.lapText, { color: currentTheme.text }]}>
              Laps: {Math.floor((activeCounter.count - 1) / activeCounter.lapLimit) + 1}
            </Text>
            <Text style={[styles.lapText, { color: currentTheme.text }]}>
              {((activeCounter.count - 1) % activeCounter.lapLimit) + 1}/{activeCounter.lapLimit}
            </Text>
          </View>
        )}
  
        {/* Bottom Nav */}
        <BottomNav
          decreaseCount={decreaseCount}
          resetCount={resetCount}
          handleEditCounter={handleEditCounter}
          toggleTheme={toggleTheme}
          currentTheme={currentTheme}
          vibrationEnabled={vibrationEnabled}
          setVibrationEnabled={setVibrationEnabled}
        />
  
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  bottomInfo: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    top: 66,
  },
  lapText: {
    fontSize: 35,
    fontFamily: 'digital-font',
  },
});
