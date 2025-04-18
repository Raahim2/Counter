import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const BottomNav: React.FC<{ 
    decreaseCount: () => void; 
    resetCount: () => void; 
    handleEditCounter: () => void; 
    toggleTheme: () => void; 
    currentTheme: { bg: string; text: string }; 
    vibrationEnabled: boolean; 
    setVibrationEnabled: (value: boolean) => void; 
}> = ({ 
    decreaseCount, 
    resetCount, 
    handleEditCounter, 
    toggleTheme, 
    currentTheme, 
    vibrationEnabled, 
    setVibrationEnabled 
}) => {
        return (
        <View style={[styles.bottomNav, { backgroundColor: currentTheme.bg }]}>
              <Ionicons name="remove" size={30} color={currentTheme.text} onPress={decreaseCount}  />
              <Ionicons name="refresh" size={30} color={currentTheme.text} onPress={resetCount} />
              <Ionicons name="create" size={30} color={currentTheme.text} onPress={handleEditCounter}  />
              <Ionicons
                name="color-palette"
                size={30}
                color={currentTheme.text}
                onPress={toggleTheme}
              />
              <Ionicons
                name={vibrationEnabled ? "volume-high" : "volume-mute"}
                size={30}
                color={currentTheme.text}
                style={styles.iconRight}
                onPress={() => setVibrationEnabled(!vibrationEnabled)}
              />
            </View>
    );
};

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#fff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
      },
      bottomNavIcon: {
        textShadowColor: 'rgba(255, 255, 255, 0.8)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
      },
      iconRight: {
        marginRight: 10,
      }
});

export default BottomNav;