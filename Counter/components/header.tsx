import React from 'react';
import { View, Text, StyleSheet } from 'react-native';  
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
    currentTheme: {
        text: string;
    };
    activeCounter?: {
        counterName: string;
    } | null;
    setShowSidebar: (show: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ currentTheme, activeCounter, setShowSidebar }) => {
    return (
        <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons
                    name="menu"
                    size={30}
                    color={currentTheme.text}
                    style={styles.iconLeft}
                    onPress={() => setShowSidebar(true)}
                />
                {activeCounter ? (
                    <Text style={[styles.counterTitle, { color: currentTheme.text, marginLeft: 10 }]}>
                        {activeCounter.counterName}
                    </Text>
                ) : (
                    <Text style={[styles.counterTitle, { color: currentTheme.text, marginLeft: 10 }]}>
                        Default Counter
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1, 
        borderBottomColor: '#fff',
        paddingBottom: 10,
      },
      iconLeft: {
        marginLeft: 10,
      },
      
      counterTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
      },
});

export default Header;