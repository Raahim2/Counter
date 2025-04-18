import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TimerProps {
    bgColor: string;
    textColor: string;
    isRunning?: boolean;
    setIsRunning?: (isRunning: boolean) => void;
    seconds?: number;
    setSeconds?: (seconds: number) => void;
}

const Timer: React.FC<TimerProps> = ({ bgColor, textColor , isRunning = false , setIsRunning = () => {} ,seconds = 0 , setSeconds = () => {} }) => {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000);
        } else if (!isRunning && intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    const handleRestart = () => {
        setSeconds(0);
        setIsRunning(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    const formatTime = (secs: number) => {
        const mins = Math.floor(secs / 60);
        const sec = secs % 60;
        return `${mins.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <View style={[
            styles.container,
            { backgroundColor: bgColor, borderColor: textColor, borderWidth: 1 }
        ]}>
            {/* Restart */}
            <TouchableOpacity onPress={handleRestart}>
                <Ionicons name="refresh" size={28} color={textColor} />
            </TouchableOpacity>

            {/* Timer */}
            <Text style={[styles.timerText, { color: textColor }]}>
                {formatTime(seconds!)}
            </Text>

            {/* Play/Pause */}
            <TouchableOpacity onPress={() => setIsRunning(!isRunning)}>
                <Ionicons
                    name={isRunning ? 'pause' : 'play'}
                    size={28}
                    color={textColor}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        width: 220,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    timerText: {
        fontSize: 28,
        fontFamily: 'digital-font',
    },
});

export default Timer;
