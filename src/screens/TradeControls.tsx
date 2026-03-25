import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';

export const TradeControls = () => {
  // We use state to disable the buttons and show a spinner while the network works
  const [isProcessing, setIsProcessing] = useState(false);

  const executeTrade = async (side: 'buy' | 'sell') => {
    setIsProcessing(true);

    try {
      const apiUrl = Platform.OS === 'android' 
        ? 'http://10.0.2.2:8080/api/v1/trades' 
        : 'http://localhost:8080/api/v1/trades';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symbol: 'BTC/USD',
          price: 500.00,
          amount: 100,
          side: side, 
        }),
      });

      if (!response.ok) {
        throw new Error('Trade execution failed');
      }

      console.log(`[Uplink] ${side.toUpperCase()} order transmitted successfully.`);
    } catch (error) {
      console.error('[Uplink Error] Signal failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      {isProcessing ? (
        <ActivityIndicator size="large" color="#00FF41" />
      ) : (
        <>
          <TouchableOpacity 
            style={[styles.button, styles.buyButton]} 
            onPress={() => executeTrade('buy')}
          >
            <Text style={styles.buttonText}>BUY</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.sellButton]} 
            onPress={() => executeTrade('sell')}
          >
            <Text style={styles.buttonText}>SELL</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 5,
    backgroundColor: '#000000',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: '#02e23a', 
  },
  sellButton: {
    backgroundColor: '#FF0055',
  },
  buttonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
});