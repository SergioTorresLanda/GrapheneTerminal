import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// 1. Import our global authentication store
import { useAuthStore } from '../db/auth';
import { clearOrdersOnly } from '../db/sync';

export const ProfileView = () => {
  // 2. SELECTOR: Extract ONLY the unique signOut action to keep things lean
  const signOut = useAuthStore((state) => state.signOut);
  const user = useAuthStore((state) => state.user);

  // 3. MEMOIZED ACTION: Prevent function re-allocation during state passes
  const handleSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>OPERATOR_IDENTITY:</Text>
        <Text style={styles.value}>{user?.email ?? 'UNKNOWN_TERMINAL_NODE'}</Text>
        <Text style={styles.uid}>UID: {user?.id ?? 'N/A'}</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={clearOrdersOnly}>
        <Text style={styles.logoutText}>REMOVE_TRADES_HISTORY</Text>
      </TouchableOpacity>
      {/* THE ACTION: Triggers declarative navigation via store mutation */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
        <Text style={styles.logoutText}>TERMINATE_SESSION</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'space-between', // Pushes the logout button to the bottom area
    padding: 30, 
    backgroundColor: '#000' // Keeping it pure dark theme
  },
  card: {
    borderWidth: 1,
    borderColor: '#004400',
    padding: 20,
    marginTop: 40,
    backgroundColor: '#050505',
  },
  label: { 
    color: '#00FF00', 
    fontSize: 12, 
    fontFamily: 'Courier', 
    letterSpacing: 1,
    marginBottom: 5
  },
  value: { 
    color: '#FFF', 
    fontSize: 18, 
    fontFamily: 'Courier', 
    fontWeight: 'bold',
    marginBottom: 15
  },
  uid: {
    color: '#333',
    fontSize: 10,
    fontFamily: 'Courier',
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#FF0055', // Matrix/Graphene Warning Red
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutText: {
    color: '#FF0055',
    fontWeight: 'bold',
    fontFamily: 'Courier',
    letterSpacing: 2
  }
});