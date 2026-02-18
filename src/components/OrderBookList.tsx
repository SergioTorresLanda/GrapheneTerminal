import React, { useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';
import { Order } from '../types/';
import { OrderBookItem } from './OrderBookItem';
import { View, StyleSheet } from 'react-native';

interface Props {
  data: Order[];
}

export const OrderBookList = ({ data }: Props) => {
  
  // Stable Render Function
  // We define this OUTSIDE the render loop or use useCallback to prevent 
  // creating a new function on every render (which kills recycling).
  const renderItem = useCallback(({ item }: { item: Order }) => {
    return <OrderBookItem item={item} />;
  }, []);

  //Stable Key Extractor
  const keyExtractor = useCallback((item: Order) => item.id, []);

  return (
    <View style={styles.container}>
        
      <FlashList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        
        // CRITICAL PERFORMANCE PROPS
        estimatedItemSize={41} // Height of our row (padding 12*2 + font ~14 + border)
        drawDistance={200} // Render items 200px off-screen for smoother scrolling
        
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000',
  },
  listContent: {
    paddingBottom: 20,
  }
});