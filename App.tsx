import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/infrastructure/queryClient';
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { TerminalScreen } from './src/screens/TerminalScreen';

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
