import { Order } from '../types';

const ASSETS = ['BTC-USD', 'ETH-USD', 'SOL-USD', 'XRP-USD', 'ADA-USD'];

// Helper to generate a random price movement
const fluctuator = (basePrice: number) => {
  const volatility = basePrice * 0.02; // 2% swing
  const change = (Math.random() * volatility * 2) - volatility;
  return Number((basePrice + change).toFixed(2));
};

const BASE_PRICES: Record<string, number> = {
  'BTC-USD': 64230.50,
  'ETH-USD': 1950.12,
  'SOL-USD': 85.60,
  'XRP-USD': 1.42,
  'ADA-USD': 550,
};

export const generateOrderBook = (): Order[] => {
  return Array.from({ length: 50 }).map((_, i) => {
    const symbol = ASSETS[Math.floor(Math.random() * ASSETS.length)];
    const basePrice = BASE_PRICES[symbol];
    const volatility = basePrice * 0.02;
    
    const price = Number((basePrice + (Math.random() * volatility * 2 - volatility)).toFixed(2));
    const amount = Number((Math.random() * 10).toFixed(4));
    
    const total = Number((price * amount).toFixed(2));

    return {
      id: `order-${i}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      symbol: symbol,
      price: price,
      amount: amount,
      total: total,
      side: Math.random() > 0.5 ? 'buy' : 'sell',
      timestamp: Date.now(),
    };
  });
};