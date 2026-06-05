import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const FONT_SIZE = 18;
const COLUMNS = Math.floor(width / FONT_SIZE);

// A single falling column of characters
// In MatrixRain.js - The Column Component
const MatrixColumn = ({ index, totalColumns }) => {
  const translateY = useRef(new Animated.Value(-height)).current;
  const [chars, setChars] = useState('');

  useEffect(() => {
    const length = 20 + Math.floor(Math.random() * 20); 
    const charArray = Array(length).fill(0).map(() => 
      String.fromCharCode(0x30A0 + Math.random() * 96)
    );
    // 3. Set the state
    setChars(charArray.join('\n'));
    // 1. Calculate a staggered start time so columns don't all hit at once
    // We distribute the columns across the 6-second duration
    const stagger = (6000 / totalColumns) * index;

    Animated.loop(
      Animated.sequence([
        // Move from top to bottom
        Animated.timing(translateY, {
          toValue: height,
          duration: 6000, // Constant 6 seconds
          delay: stagger, // Staggered start based on index
          useNativeDriver: true,
        }),
        // Snap back to top instantly
        Animated.timing(translateY, {
          toValue: -height,
          duration: 0,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [index, totalColumns, translateY]);

  return (
    <Animated.View style={{ transform: [{ translateY }] }}>
      <Text style={styles.matrixText}>{chars}</Text>
    </Animated.View>
  );
};

export const MatrixRain = () => {
  const columns = Array(COLUMNS).fill(0);

  return (
    <View style={styles.container}>
      {columns.map((_, index) => (
        <View key={index} style={{ width: FONT_SIZE }}>
          <MatrixColumn index={index} totalColumns={COLUMNS} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#000',
    overflow: 'hidden'
  },
  matrixText: {
    color: '#00FF41', // Classic Matrix Green
    fontSize: FONT_SIZE,
    fontFamily: 'Courier', // Monospace font for exact vertical alignment
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 255, 65, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8, // Adds the glowing effect
  },
});