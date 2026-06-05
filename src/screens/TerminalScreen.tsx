import React, { useMemo, useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Button , Platform} from 'react-native';
import { OrderBookList } from '../components/OrderBookList';
import { TradeControls } from '../screens/TradeControls';
import { useOrderStream } from '../hooks/useOrderStream'; 
import { useOrderBookFromDisk } from '../hooks/useOrderBookFromDisk'; 
import { grapheneSocket } from '../services/GrapheneSocket';
import GraphenePnLView from '../specs/GraphenePnLNativeComponent';//nitro modules
import { database } from '../db';
import OrderModel from '../db/Order'; 
import { Q } from '@nozbe/watermelondb';
import { syncOrderBook } from '../db/sync';
import Config from "react-native-config";

const baseUrl = Config.API_URL || '';

export const TerminalScreen = () => {

  useEffect(() => {
    let isMounted = true; // Prevents state updates if the user closes the screen instantly
    

    const bootSequence = async () => {
      try {
       // 1. Check Disk: Find the latest trade (sorted by timestamp to get the newest row)
        const latestOrders = await database.get<OrderModel>('orders').query(
          Q.sortBy('timestamp', Q.desc),
          Q.take(1)
        ).fetch();
        
        // Extract the ID of the last known trade (fallback to 0 if DB is empty)
        const lastKnownId = latestOrders.length > 0 ? parseInt(latestOrders[0].id, 10) : 0;
        console.log(`[Boot] Last known trade ID: ${lastKnownId}`);

        // 2. Catch Up: Ask Go for the exact missing sequence
        const apiUrl = baseUrl ? `${baseUrl}/api/v1/trades?last_id=${lastKnownId}` : '';
        console.log("--- DEBUGGING URL ---");
        console.log("TerminalScreen URL :", apiUrl );
       // const apiUrl = Platform.OS === 'android' 
         // ? `http://10.0.2.2:8080/api/v1/trades?last_id=${lastKnownId}` 
          //: `http://localhost:8080/api/v1/trades?last_id=${lastKnownId}`;

        const response = await fetch(apiUrl);
        const missedTrades = await response.json();

        // 3. Sync: If Go sent us trades we missed while offline, save them to SQLite
        if (missedTrades && missedTrades.length > 0) {
          console.log(`[Boot] Catching up on ${missedTrades.length} missed trades...`);
          
          const formattedTrades = missedTrades.map((t: any) => ({
            id: t.id.toString(),
            symbol: t.symbol,
            price: t.price,
            amount: t.amount,
            total: Number((t.price * t.amount).toFixed(2)),
            side: t.side,
            timestamp: new Date(t.timestamp).getTime(),
          }));

          await syncOrderBook(formattedTrades);
        } else {
          console.log('[Boot] App is completely up to date. No missed trades.');
        }

        // 4. Go Live: Now that history is perfect, open the live pipe
        if (isMounted) {
          grapheneSocket.connect();
        }

      } catch (error) {
        console.error("[Boot] Initialization failed:", error);
      }
    };

    // Execute the boot sequence
    bootSequence();

    // The Cleanup
    return () => {
      isMounted = false;
      grapheneSocket.disconnect(); 
    };
  }, []);
  
  // --- DIRECT WEBSOCKET LOGIC ---
  //const { data, status } = useOrderStream();

  // --- PERSISTANCE LAYER SQLite LOGIC ---
  // The UI is now reading directly from SQLite!
  const { data } = useOrderBookFromDisk();   
  var status = 'CONNECTED';

  // Memoize data to prevent list flicker
  const orderData = useMemo(() => data || [], [data]);

  // --- CONDITIONAL RENDERING STATES ---
  // 1. Connecting State
  if (status === 'CONNECTING' && (!data || data.length === 0)) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00FF41" />
        <Text style={[styles.statusText, { marginTop: 10 }]}>
          ESTABLISHING UPLINK...
        </Text>
      </View>
    );
  }

  // 2. Disconnected/Error State
  if (status === 'DISCONNECTED' && (!data || data.length === 0)) {
    return (
      <View style={styles.center}>
        <Text style={[styles.error, { color: '#FF0055' }]}>
          SIGNAL LOST
        </Text>
        <Text style={styles.statusText}>
          RETRYING CONNECTION...
        </Text>
      </View>
    );
  }

  // 3. Main Render
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>GRAPHENE|TERMINAL</Text>
        {/* Status Badge */}
        <View style={styles.rightHeader}>
          <View style={styles.connectionBadge}>
            <View style={[
              styles.indicator, 
              { backgroundColor: status === 'CONNECTED' ? '#00FF41' : '#FF0055' }
            ]} />
            <Text style={styles.connectionText}>{status}</Text>
          </View>
        </View>
      </View>
        <Text style={styles.subtitle}>| Pair | E. Price | Size USD | Leverage |</Text>

      {/* DATA LIST */}
      <OrderBookList data={orderData} />
        <Text style={styles.subtitle2}>Real-Time Global Order Book</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  // --- HEADER STYLES ---
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#E0E0E0',
    fontFamily: 'Courier',
    letterSpacing: 1.2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#E0E0E0',
    fontFamily: 'Courier',
    letterSpacing: 1.0,
    textAlign: 'center',
    paddingVertical: 5
  },
  subtitle2: {
    fontSize: 14,
    fontWeight: '900',
    color: '#f2d977',
    fontFamily: 'Courier',
    letterSpacing: 1.0,
    textAlign: 'center',
    paddingVertical: 5
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  // --- CONNECTION BADGE ---
  connectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  connectionText: {
    color: '#888',
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: 'bold',
  }

});