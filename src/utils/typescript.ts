import { Order } from '../types';
//1. Discriminated Unions (Algebraic Data Types)
//Using a common literal property (a "discriminator") to allow 
// TypeScript to safely narrow down a specific object type within a union.
type OrderState = 
  | { status: 'PENDING' }
  | { status: 'FILLED'; executionPrice: number; filledTimestamp: number }
  | { status: 'REJECTED'; reason: string };

function handleOrder(order: OrderState) {
  if (order.status === 'FILLED') {
    // TypeScript automatically knows 'executionPrice' exists here!
    console.log(order.executionPrice); 
  }
}

//2. Utility Types (Pick, Omit, Partial, Readonly)
//Built-in transformations that allow you to derive new types 
// from existing interfaces without repeating code.

// Create a read-only type for your UI rows so components can't accidentally mutate state
type ReadonlyOrder = Readonly<Order>;

// Create a preview type that only includes a few properties
type OrderPreview = Pick<Order, 'symbol' | 'price' | 'side'>;


//3. Type Guards & Type Narrowing (is keyword)
//Creating runtime check functions that return a type predicate,
// informing the TypeScript compiler that a variable belongs to a specific type if the function returns true.

// Custom Type Guard
export function isValidOrder(payload: any): payload is Order {
  return (
    typeof payload?.symbol === 'string' &&
    typeof payload?.price === 'number' &&
    (payload?.side === 'buy' || payload?.side === 'sell')
  );
}

// Usage at your network perimeter
if (isValidOrder(rawNetworkData)) {
  // Inside this block, rawNetworkData is strictly typed as 'Order'
  syncOrderBook([rawNetworkData]);
}

//4. Generics
// Creating reusable components, functions, or hooks that operate over a variety 
// of types rather than a single concrete one, while still preserving strict type safety.

// A generic API response structure
interface ApiResponse<T> {
  data: T;
  error?: string;
  statusCode: number;
}

// Usage for different data structures
const orderResponse: ApiResponse<Order[]> = { data: [], statusCode: 200 };
const profileResponse: ApiResponse<UserProfile> = { data: userObj, statusCode: 200 };