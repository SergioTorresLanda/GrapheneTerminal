import React, { useMemo, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import NativeGrapheneCore from '../specs/NativeGrapheneCore';
import { useFPS } from '../hooks/useFPS';
import { MatrixRain } from '../components/MatrixRain';

export const HomeScreen = ({ navigation }: any) => {

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

  return (
    <View style={styles.container}>
        <MatrixRain />
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
      <View style={styles.subcontainer}>
        <Text style={styles.text}>Owner: Sergio Torres Landa G.</Text>
        <Text style={styles.text}>Role: Sr. React Native Architect</Text>
        <Text style={styles.text}>Status: Ready to join Kraken</Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  subcontainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  text: { color: '#02e23a', fontSize: 20, fontFamily: 'Courier', marginVertical: 5 },
    // --- FOOTER STATUS BAR ---
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
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
  }
});