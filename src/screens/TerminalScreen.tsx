import React, { useMemo } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { OrderBookList } from '../components/OrderBookList';
import { Order } from '../types/';
import { useFPS } from '../hooks/useFPS';

// 1. The Mock API (Simulating High-Frequency Data)
// In a real app, this would be a WebSocket or REST endpoint.
const fetchOrderBook = async (): Promise<Order[]> => {
  // Simulate network latency (50ms - fast API)
  await new Promise<void>(resolve => setTimeout(() => resolve(), 50));
  
  // Generate 1,000 orders dynamically
  return Array.from({ length: 1000 }).map((_, i) => ({
    id: `order-${i}-${Date.now()}`, // Unique ID every fetch
    price: 3000 + (Math.random() * 100),
    amount: Math.random() * 5,
    total: Math.random() * 15000,
    type: Math.random() > 0.5 ? 'buy' : 'sell',
    timestamp: Date.now(),
  }));
};

export const TerminalScreen = () => {
   
    const fps = useFPS(); //for performance measure
  // 2. The Query Hook
  // This manages the fetch cycle, caching, and background refetching.
  const { data, isLoading, isError } = useQuery({
    queryKey: ['orderBook'],
    queryFn: fetchOrderBook,
    refetchInterval: 1000, // Poll every 1 second (High Frequency)
  });

  // 3. Memoized Data
  // We strictly memoize the data passed to the list to prevent
  // unnecessary re-calculations during re-renders.
  const orderData = useMemo(() => data || [], [data]);

  if (isLoading && !data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00FF41" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>CONNECTION LOST</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LIVE MARKET DATA</Text>
        <View style={styles.fpsContainer}>
     <Text style={[styles.fpsText, { color: fps < 55 ? 'red' : '#00FF41' }]}>
       {fps} FPS
     </Text>
     </View>
        <View style={styles.liveIndicator} />
      </View>
      <OrderBookList data={orderData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#00FF41',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Courier',
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FF41',
  },
  error: {
    color: '#FF0055',
    fontWeight: 'bold',
  },
  //FPS
  fpsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fpsText: {
    fontFamily: 'Courier',
    fontWeight: 'bold',
    fontSize: 14,
  },
});