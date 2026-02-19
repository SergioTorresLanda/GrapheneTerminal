export type OrderType = 'buy' | 'sell';

export interface Order {
  id: string;
  symbol: string;
  price: number;
  amount: number;
  total: number;
  side: OrderType;
  timestamp: number;
}
// The raw data stream structure
export interface OrderBookUpdate {
  bids: Order[];
  asks: Order[];
}