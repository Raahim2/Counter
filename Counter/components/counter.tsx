import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useFonts } from 'expo-font';
import Timer from './timer';

const { width } = Dimensions.get('window');
const circleDiameter = width * 0.9;
const radius = circleDiameter / 2;
const strokeWidth = 10;

const CircularCounter: React.FC<{  count: number, lapLimit: number, textClr?: string, bgClr?: string, glow?: boolean }> = ({ count, lapLimit, textClr = '#4CAF50', bgClr = '#ddd', glow = false }) => {

  const adjustedCount = count ;
  const progress = ((adjustedCount - 1) % lapLimit) / lapLimit;
  const percentage = Math.round(progress * 100);

  const circumference = 2 * Math.PI * (radius - strokeWidth / 2);

  const angle = progress * 2 * Math.PI;
  const circleX = radius + (radius - strokeWidth / 2) * Math.cos(angle);
  const circleY = radius + (radius - strokeWidth / 2) * Math.sin(angle);

  const [fontsLoaded] = useFonts({
    'digital-font': require('../assets/fonts/digital-7.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  const getFontSize = () => {
    if (adjustedCount >= 10000000) {
      return 80;
    } else if (adjustedCount >= 1000000) {
      return 90;
    } else if (adjustedCount >= 100000) {
      return 110;
    } else if (adjustedCount >= 10000) {
      return 130;
    } else if (adjustedCount >= 1000) {
      return 150;
    } else if (adjustedCount >= 100) {
      return 200;
    } else {
      return 200;
    }
  };

  const glowStyle = glow ? {
    textShadowColor: textClr,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  } : {};

 

  return (
    <View style={styles.container}>
     
      <View style={styles.counterWrapper}>
        <Svg width={circleDiameter} height={circleDiameter} viewBox={`0 0 ${circleDiameter} ${circleDiameter}`}>
          <Circle
            cx={radius}
            cy={radius}
            r={radius - strokeWidth / 2}
            stroke='#ddd'
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <Circle
            cx={radius}
            cy={radius}
            r={radius - strokeWidth / 2}
            stroke={textClr}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress * circumference}
            strokeLinecap="round"
          />
        </Svg>
        <Text style={[styles.counterText, { fontSize: getFontSize(), color: textClr }, glowStyle]}>{adjustedCount}</Text>

        <View
          style={[
            styles.percentageCircle,
            { backgroundColor: bgClr, left: circleX - 25, top: circleY - 25 },
            glow ? { shadowColor: textClr, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 10, elevation: 20 } : {}
          ]}
        >
          <Text style={[styles.percentageText, { color: textClr }, glowStyle]}>{percentage}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  counterWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  counterText: {
    position: 'absolute',
    fontFamily: 'digital-font',
  },
  percentageCircle: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 24,
    fontFamily: 'digital-font'
  },
});

export default CircularCounter;
