import { useEffect, useState } from 'react';
import { database } from '../db';
import OrderModel from '../db/Order';

export const useOrderBookFromDisk = () => {
  const [data, setData] = useState<OrderModel[]>([]);

  useEffect(() => {
    // 1. Target the table
    const ordersCollection = database.get<OrderModel>('orders');
    // 2. Query and OBSERVE 
    // .observe() creates a live pipeline from the disk to this hook
    const subscription = ordersCollection.query().observe().subscribe(newOrders => {
      // 3. Every time SQLite changes, this block auto-runs and updates React
      setData(newOrders);
    });

    // 4. Clean up the pipeline when the component unmounts
    return () => subscription.unsubscribe();
  }, []);

  return { data };
};