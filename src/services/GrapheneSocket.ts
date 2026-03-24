import { generateOrderBook } from '../utils/mockData'; 
import { Order } from '../types';
import { syncOrderBook } from '../db/sync';
import { Platform } from 'react-native';

type SocketStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'RECONNECTING';

class GrapheneSocket {
  // 💡iOS Simulator uses localhost, Android Emulator uses 10.0.2.2
  private url: string = Platform.OS === 'android' 
    ? 'ws://10.0.2.2:8080/ws' 
    : 'ws://localhost:8080/ws';
  //private url: string = 'wss://stream.graphene.trade/v1/market'; // production
  private status: SocketStatus = 'DISCONNECTED';
  private ws: WebSocket | null = null;
  private mockInterval: ReturnType<typeof setInterval> | null = null; //Mock Data
  private subscribers: ((data: Order[]) => void)[] = [];

  connect() {
    console.log(`[GrapheneSocket] Initializing handshake with ${this.url}...`);
    this.status = 'CONNECTING';

  // 1. Initialize Native React Native WebSocket
    this.ws = new WebSocket(this.url);
  // 2. Handle Successful Connection
    this.ws.onopen = () => {
      this.status = 'CONNECTED';
      console.log('[GrapheneSocket] Live connection established with Go Backend.');
    };
  // 3. Handle Incoming Live Data (The Real Engine)
    this.ws.onmessage = async (event) => {
      try {
        // Parse the JSON string sent from Go
        const backendTrade = JSON.parse(event.data);

        // Transform the Go struct data to match our React Native Order/WatermelonDB type
        const newOrder: Order = {
          id: backendTrade.id.toString(), // WatermelonDB prefers string IDs
          symbol: backendTrade.symbol,
          price: backendTrade.price,
          amount: backendTrade.amount,
          total: Number((backendTrade.price * backendTrade.amount).toFixed(2)), // Calculate total on the fly
          side: backendTrade.side,
          timestamp: new Date(backendTrade.timestamp).getTime(), // Convert Go time.Time to JS milliseconds
        };

        // Wrap in array because our subscribers expect Order[]
        const delta = [newOrder];

        // Pipe to Disk (Offline-First Single Source of Truth)
        await syncOrderBook(delta); 

        // Broadcast to all UI listeners
        this.subscribers.forEach(callback => callback(delta));
        console.log("[GrapheneSocket] writing live trade:");

      } catch (error) {
        console.error("[GrapheneSocket] Error parsing live trade:", error);
      }
    };

    // 4. Handle Disconnections & Errors
    this.ws.onclose = () => {
      this.status = 'DISCONNECTED';
      console.log('[GrapheneSocket] Connection closed.');
      // In a production app, you'd trigger a reconnect() timeout here
    };

    this.ws.onerror = (error) => {
      console.error('[GrapheneSocket] WebSocket Error:', error);
    };
    /*
    setTimeout(() => {
      this.status = 'CONNECTED';
      console.log('[GrapheneSocket] Connection established via Nitro-JSI Bridge.');
      this.startDataStream();
    }, 1200); // 1.2s fake latency
    //Mock Data
    */
  }

  disconnect() {
    console.log('[GrapheneSocket] Closing secure channel manually.');
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.status = 'DISCONNECTED';
    //if (this.mockInterval) clearInterval(this.mockInterval); //Mock Data
  }

  subscribe(callback: (data: Order[]) => void) {
    this.subscribers.push(callback);
    // Send immediate initial snapshot when using Mock Data
    //callback(generateOrderBook()); 
  }

  unsubscribe(callback: (data: Order[]) => void) {
    this.subscribers = this.subscribers.filter(sub => sub !== callback);
  }

  // The "Mock Engine" - In real life, this is onMessage()
  private startDataStream() {
    if (this.mockInterval) clearInterval(this.mockInterval);

    this.mockInterval = setInterval(async () => {
      // 1. Generate new data
      const delta = generateOrderBook(); 
      
      try {
        // 2a. Pipe to Disk (Offline-First Single Source of Truth)
        // We await this so the UI only updates *after* the disk is secured.
        await syncOrderBook(delta); 
      } catch (error) {
        console.error("[Database] Sync Failed:", error);
      }
      // 2b. Broadcast to all listeners (The "Push")
      this.subscribers.forEach(callback => callback(delta));
      // 3. Log simulated heartbeat
      if (Math.random() > 0.9) console.log('[GrapheneSocket] Ping... Pong (12ms)');
      
    }, 800); // Push every 800ms (faster than polling)
  }

  getStatus() {
    return this.status;
  }
}

// Export a singleton instance (standard pattern for sockets)
export const grapheneSocket = new GrapheneSocket();