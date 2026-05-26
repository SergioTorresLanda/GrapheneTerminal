import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View, Button } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/infrastructure/queryClient';

// Navigation Imports
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 1. Import your custom hook store
import { useAuthStore } from './src/db/auth';

// Screens
import { TerminalScreen } from './src/screens/TerminalScreen';
import { ProfileScreen } from './src/screens/ProfileScreen'; 
import { LoginView } from './src/screens/LoginView';
import { ProfileView } from './src/screens/ProfileView';

// Initialize the Native Stack
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* NavigationContainer manages the application state and URL linking */}
      <RootNavigator/>
    </QueryClientProvider>
  );
}

export const RootNavigator = () => {
  // 3. Selectively subscribe to only the authentication flag
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      
      <Stack.Navigator 
        screenOptions={{
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#00FF00', // Graphene Green
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        {/* 4. THE GATEKEEPER: Conditional Branch Rendering */}
        {!isAuthenticated ? (
          // Unauthenticated Stack Area
          <Stack.Screen 
            name="Login" 
            component={LoginView} 
            options={{ headerShown: false }} 
          />
        ) : (
          // Authenticated Stack Area
          <>
            <Stack.Screen 
              name="Terminal" 
              component={TerminalScreen} 
              options={({ navigation }) => ({ 
                headerBackVisible: false, // Prevents swiping back to a nonexistent login view
                title: "Market Data", 
                headerRight: () => (
                  <Button 
                    title="Profile >" 
                    color="#00FF00" 
                    onPress={() => navigation.navigate('Profile')} 
                  />
                ), 
              })}
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileView} 
              options={{ title: "Identity" }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', 
  },
  matrix: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#00FF41',
    fontSize: 18,
    fontFamily: 'Courier',
    fontWeight: 'bold',
  }
});
