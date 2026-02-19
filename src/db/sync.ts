import { database } from './index';
import OrderModel from './Order';
import { Order as OrderType } from '../types';

export const syncOrderBook = async (incomingOrders: OrderType[]) => {
  // .write() opens a secure Native SQL Transaction
  await database.write(async () => {
    const ordersCollection = database.get<OrderModel>('orders');

    // 1. Fetch current orders (The old snapshot)
    const existingOrders = await ordersCollection.query().fetch();
    
    // 2. Prepare Deletions: Queue up the old rows for destruction
    const deleteOperations = existingOrders.map(order => 
      order.prepareDestroyPermanently()
    );

    // 3. Prepare Insertions: Queue up the new rows
    const createOperations = incomingOrders.map(order =>
      ordersCollection.prepareCreate(record => {
        // We inject the exact data from the WebSocket
        record.symbol = order.symbol;
        record.price = order.price;
        record.amount = order.amount;
        record.total = order.total;
        record.side = order.side;
        record.timestamp = order.timestamp;
      })
    );

    // 4. THE MAGIC: Execute everything in ONE operation
    await database.batch(...deleteOperations, ...createOperations);
  });
};