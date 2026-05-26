// src/screens/LoginView.tsx
import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useAuthStore } from '../db/auth';

export const LoginView = () => {
  const [email, setEmail] = useState('');
  
  // SELECTORS: Only subscribe to the specific 'signIn' action
  const signIn = useAuthStore((state) => state.signIn);

  // MEMOIZED HANDLER: Prevent function recreation on every render
  const handleLogin = useCallback(() => {
    if (email.length > 3) {
      signIn(email);
    }
  }, [email, signIn]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GRAPHENE_TERMINAL_v1.0</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Operator Email"
        placeholderTextColor="#004400"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>ESTABLISH_CONNECTION</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 40, 
    backgroundColor: '#000' 
  },
  title: { 
    color: '#00FF00', 
    fontSize: 18, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 40,
    letterSpacing: 2
  },
  input: {
    borderWidth: 1,
    borderColor: '#00FF00',
    color: '#00FF00',
    padding: 15,
    marginBottom: 20,
    fontFamily: 'Courier', // For that terminal feel
  },
  button: {
    backgroundColor: '#00FF00',
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  }
});