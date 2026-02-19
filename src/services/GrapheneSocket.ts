import { generateOrderBook } from '../utils/mockData'; 
import { Order } from '../types';
import { syncOrderBook } from '../db/sync';

type SocketStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'RECONNECTING';

class GrapheneSocket {
  private url: string = 'wss://stream.graphene.trade/v1/market'; // The "Dummy" URL
  private status: SocketStatus = 'DISCONNECTED';
  private mockInterval: ReturnType<typeof setInterval> | null = null;
  private subscribers: ((data: Order[]) => void)[] = [];

  // Simulate a connection delay
  connect() {
    console.log(`[GrapheneSocket] Initializing handshake with ${this.url}...`);
    this.status = 'CONNECTING';

    setTimeout(() => {
      this.status = 'CONNECTED';
      console.log('[GrapheneSocket] Connection established via Nitro-JSI Bridge.');
      this.startDataStream();
    }, 1200); // 1.2s fake latency
  }

  disconnect() {
    console.log('[GrapheneSocket] Closing secure channel.');
    this.status = 'DISCONNECTED';
    if (this.mockInterval) clearInterval(this.mockInterval);
  }

  subscribe(callback: (data: Order[]) => void) {
    this.subscribers.push(callback);
    // Send immediate initial snapshot
    callback(generateOrderBook()); 
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