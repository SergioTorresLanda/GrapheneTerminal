import React, { useMemo, useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Button } from 'react-native';
import { OrderBookList } from '../components/OrderBookList';
import { useFPS } from '../hooks/useFPS';
import NativeGrapheneCore from '../specs/NativeGrapheneCore';
import { useOrderStream } from '../hooks/useOrderStream'; 
import { useOrderBookFromDisk } from '../hooks/useOrderBookFromDisk'; 
import { grapheneSocket } from '../services/GrapheneSocket';
import GraphenePnLView from '../specs/GraphenePnLNativeComponent';//nitro modules

export const TerminalScreen = () => {
   
  const [battery, setBattery] = useState<number | null>(null);
  const [thermal, setThermal] = useState<string>('Checking...');
  const fps = useFPS(); // Performance Monitor

  useEffect(() => {
    const monitorSystem = async () => {
      // 1. Safety Check: If module is null (e.g., failed to link), skip.
      if (!NativeGrapheneCore) {
        console.warn("⚠️ GrapheneCore Native Module not found!");
        setThermal("N/A");
        return;
      }

      try {
        // 2. Call C++ TurboModule
        const level = await NativeGrapheneCore.getBatteryLevel();
        const temp = await NativeGrapheneCore.getThermalState();

        setBattery(level);
        setThermal(temp);
      } catch (e) {
        console.error("GrapheneCore Error:", e);
      }
    };

    monitorSystem();
    const interval = setInterval(monitorSystem, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    grapheneSocket.connect(); 

    const dummyCallback = () => {};
    grapheneSocket.subscribe(dummyCallback);

    return () => {
      grapheneSocket.unsubscribe(dummyCallback);
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
        <Text style={styles.subtitle2}>Real-Time OnChain Trading Order Book</Text>

      {/* SYSTEM STATUS BAR */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          ⚡ POWER: {battery !== null ? (battery * 100).toFixed(0) + '%' : '---'}
        </Text>
        <Text style={styles.statusText}>
          🌡 TEMP: {thermal?.toUpperCase() || '---'}
        </Text>
        <Text style={styles.statusText}>👾 FPS:{fps+'  '}
        </Text>
      </View>
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
  },
  // --- FPS & ERROR ---
  fpsText: {
    color: '#444',
    fontSize: 10,
    fontFamily: 'Courier',
    fontWeight: 'bold',
  },
  error: {
    color: '#FF0055',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  // --- FOOTER STATUS BAR ---
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 7,
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#f2d977',
  },
  statusText: {
    color: '#f2d977',
    fontFamily: 'Courier',
    fontSize: 13,
    fontWeight: 'bold',
  },
});