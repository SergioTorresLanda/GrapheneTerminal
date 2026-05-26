import { Order } from '../types';

const BASE_URL = 'http://localhost:8080/api/v1';

export const TradeService = {
  getHistory: async (): Promise<Order[]> => {
    const response = await fetch(`${BASE_URL}/trades`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },
  
  // Example of a Mutation (POST)
  executeTrade: async (trade: Partial<Order>): Promise<Order> => {
    const response = await fetch(`${BASE_URL}/trades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trade),
    });
    return response.json();
  }
};