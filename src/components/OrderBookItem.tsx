import React, { memo, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Order } from '../types';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence
} from 'react-native-reanimated';

interface Props {
  item: Order;
}

const OrderBookItemComponent = ({ item }: Props) => {
  const isBuy = item.type === 'buy';
  
  const flashOpacity = useSharedValue(0);

  useEffect(() => {
    // 2. The Sequence: Snap to 0.5 (visible) -> Fade to 0 (hidden)
    flashOpacity.value = withSequence(
      withTiming(0.5, { duration: 0 }), // Instant Flash
      withTiming(0, { duration: 500 })  // Smooth Fade
    );
  }, [item.id]); // Trigger on ID change

  // 3. The Animated Style (Pure GPU Opacity)
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  return (
    <View style={styles.row}>
      {/* THE FLASH LAYER: An absolute overlay that fades out */}
      <Animated.View 
        style={[
          StyleSheet.absoluteFill, 
          animatedStyle, 
          { backgroundColor: isBuy ? '#00FF41' : '#FF0055' }
        ]} 
      />

      {/* THE DATA LAYERS (Rendered on top of the flash) */}
      <Text style={[styles.cell, styles.price, isBuy ? styles.buy : styles.sell]}>
        {item.price.toFixed(2)}
      </Text>
      <Text style={[styles.cell, styles.amount]}>
        {item.amount.toFixed(4)}
      </Text>
      <Text style={[styles.cell, styles.total]}>
        {item.total.toFixed(2)}
      </Text>
    </View>
  );
};

// 4. Strict Memoization
export const OrderBookItem = memo(OrderBookItemComponent, (prev, next) => {
  return prev.item.id === next.item.id;
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#333',
    backgroundColor: '#000',
    // Important: overflow hidden ensures the flash doesn't bleed out
    overflow: 'hidden', 
  },
  cell: {
    fontFamily: 'Courier',
    fontSize: 14,
    color: '#FFF',
    // ZIndex ensures text sits ON TOP of the flash layer
    zIndex: 1, 
  },
  price: { flex: 1, fontWeight: 'bold' },
  amount: { flex: 1, textAlign: 'right', color: '#888' },
  total: { flex: 1, textAlign: 'right', color: '#888' },
  buy: { color: '#00FF41' },
  sell: { color: '#FF0055' },
});