import { database } from './index';
import OrderModel from './Order';
import { Order as OrderType } from '../types';

export const syncOrderBook = async (incomingOrders: OrderType[]) => {
  // .write() opens a secure Native SQL Transaction
  await database.write(async () => {
    const ordersCollection = database.get<OrderModel>('orders');

    // 1. Fetch current orders (The old snapshot) -static polling ! (Mock Data)
   // const existingOrders = await ordersCollection.query().fetch();
    
    // 2. Prepare Deletions: Queue up the old rows for destruction (Mock Data)
   /* const deleteOperations = existingOrders.map(order => 
      order.prepareDestroyPermanently()
    );*/

    // 3. Prepare Insertions: Queue up the new rows
    const createOperations = incomingOrders.map(order =>
      ordersCollection.prepareCreate(record => {
        //instantiates memory-only record objects inside the JS runtime (an $O(1)$ synchronous memory operation).
        // We inject the exact data from the WebSocket
        record.symbol = order.symbol;
        record.price = order.price;
        record.amount = order.amount;
        record.total = order.total;
        record.side = order.side;
        record.timestamp = order.timestamp;
      })
    );
    
    console.log('[SQLite] Appending ${incomingOrders.length} new trades to the ledger.');

    // 4. THE MAGIC: Execute everything in ONE operation
    await database.batch(...createOperations);//...deleteOperations, 
    //sends the entire array of operations across the JSI boundary to SQLite to be committed in a single disk I/O operation. 
    // This allows you to append dozens or hundreds of orders with near-zero overhead.
  });
  
};

export const handleDeleteDB = async () => {
   //here the logics to delete everyhting...
}

export const clearOrdersOnly = async (): Promise<void> => {
  await database.write(async () => {
    const ordersCollection = database.get('orders');
    
    // Fetch only the keys/IDs from SQLite, not the full property models
    const allOrders = await ordersCollection.query().fetch();
    
    // Prepare them all for destruction in memory
    const purgeOperations = allOrders.map(order => order.prepareDestroyPermanently());
    
    // Send the batch command across the JSI boundary in a single transaction
    await database.batch(...purgeOperations);
  });
};

//Data Synchronization Layer / Repository Pattern
//highly optimized, transactional gateway to mutate the local database
