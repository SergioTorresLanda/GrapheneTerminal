export type OrderType = 'buy' | 'sell';

export interface Order {
  id: string;
  price: number;
  amount: number;
  total: number;
  type: OrderType;
  timestamp: number;
}

// The raw data stream structure
export interface OrderBookUpdate {
  bids: Order[];
  asks: Order[];
}