import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/infrastructure/queryClient';

// Navigation Imports
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import { TerminalScreen } from './src/screens/TerminalScreen';
import { ProfileScreen } from './src/screens/ProfileScreen'; 

// Initialize the Native Stack
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <TerminalScreen />
      </SafeAreaView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', 
  },
  matrix: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#00FF41',
    fontSize: 18,
    fontFamily: 'Courier',
    fontWeight: 'bold',
  }
});
