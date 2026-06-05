import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

const CHART_POINTS = 20; // How many seconds of history to show

export const LiveAssetTicker = ({ selectedPair, initialPrice }) => {
  const [price, setPrice] = useState(initialPrice);
  const [history, setHistory] = useState(Array(CHART_POINTS).fill(initialPrice));
  const [isUp, setIsUp] = useState(true);

  // 1. Reset when the user picks a new asset from your picker
  useEffect(() => {
    setPrice(initialPrice);
    setHistory(Array(CHART_POINTS).fill(initialPrice));
  }, [selectedPair, initialPrice]);

  // 2. The Heartbeat: Random fluctuation every 1000ms
  useEffect(() => {
    const interval = setInterval(() => {
      setPrice((prev) => {
        // Calculate random fluctuation between -0.1% and +0.1%
        const volatility = Math.random() * 0.002 - 0.001; 
        const newPrice = prev + (prev * volatility);
        
        setIsUp(newPrice >= prev);
        
        // Push new price to history, slice off the oldest one
        setHistory((prevHistory) => [...prevHistory.slice(1), newPrice]);
        
        return newPrice;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 3. SVG Path Math: Map history values to X/Y coordinates
  const minPrice = Math.min(...history);
  const maxPrice = Math.max(...history);
  const range = maxPrice - minPrice || 1; // Prevent division by zero
  
  const graphWidth = 150; 
  const graphHeight = 40; 
  
  const points = history.map((val, index) => {
    const x = (index / (CHART_POINTS - 1)) * graphWidth;
    const y = graphHeight - ((val - minPrice) / range) * graphHeight;
    return `${x},${y}`;
  }).join(' ');

  // Graphene Terminal color palette
  const trendColor = isUp ? '#00b894' : '#d63031'; 

  return (
    <View style={styles.container}>
      {/* Far Left: Current Price */}
      <View style={styles.priceContainer}>
        <Text style={styles.assetText}>{selectedPair} / USD</Text>
        <Text style={[styles.priceText, { color: trendColor }]}>
          ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
      </View>

      {/* Right Side: The Sparkline */}
      <View style={styles.chartContainer}>
        <Svg width={graphWidth} height={graphHeight}>
          <Polyline
            points={points}
            fill="none"
            stroke={trendColor}
            strokeWidth="2"
          />
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#1E1E1E', // Match your dark UI
    borderRadius: 8,
    marginVertical: 15,
  },
  priceContainer: {
    flexDirection: 'column',
  },
  assetText: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  chartContainer: {
    width: 150,
    height: 40,
  }
});