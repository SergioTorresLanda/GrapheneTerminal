import React from 'react';
import { StatusBar, StyleSheet, Image } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/infrastructure/queryClient';

// Navigation Imports
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// 1. Import your custom hook store
import { useAuthStore } from './src/db/auth';

// Screens
import { TerminalScreen } from './src/screens/TerminalScreen';
import { HomeScreen } from './src/screens/HomeScreen'; 
import { LoginView } from './src/screens/LoginView';
import { ProfileView } from './src/screens/ProfileView';
import { TradingScreen } from './src/screens/TradingScreen';

// 1. PLACE LOGS HERE (Global Scope)
console.log("--- DEBUGGING IMPORTS ---");
console.log("TerminalScreen:", typeof TerminalScreen);
console.log("-------------------------");
// Initialize the Native Stack and Bottom Nav
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ICON_MAP = {
  'Home': require('./src/assets/home48.png'),
  'Trade Live': require('./src/assets/trade48.png'),
  'Order Book': require('./src/assets/book48.png'),
  'Profile': require('./src/assets/profile48.png'),
};

export default function App() {

  return (
    <QueryClientProvider client={queryClient}>
      {/* NavigationContainer manages the application state and URL linking */}
      <RootNavigator/>
    </QueryClientProvider>
  );
}

// 1. The Authenticated Bottom Tab Area
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
        // 1. Dynamic Icon Logic
        tabBarIcon: ({ focused }) => {

          const iconSource = ICON_MAP[route.name];
      
          return <Image 
              source={iconSource} 
              style={{ width: 36, height: 36, tintColor: focused ? '#00C853' : '#888' }} 
            />
        },
        tabBarLabelStyle: {
          fontSize: 12,      
          fontWeight: 'bold',  
          paddingBottom: 2,  
        },
        tabBarActiveTintColor: '#00C853',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { 
          backgroundColor: '#121212', // Kraken dark theme
          borderTopColor: '#333',
          paddingBottom: 20,
          paddingTop: 5,
        },
        headerStyle: { backgroundColor: '#121212' },
        headerTintColor: '#FFF',
        headerTitleStyle: { fontWeight: 'bold' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Trade Live" component={TradingScreen} />
      <Tab.Screen name="Order Book" component={TerminalScreen} />
      <Tab.Screen name="Profile" component={ProfileView} />
    </Tab.Navigator>
  );
};

export const RootNavigator = () => {
  // 3. Selectively subscribe to only the authentication flag
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      
      <Stack.Navigator 
        screenOptions={{
          headerShown: false
          //headerStyle: { backgroundColor: '#000' },
          //headerTintColor: '#00FF00', // Graphene Green
          //headerTitleStyle: { fontWeight: 'bold' },
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
            <Stack.Screen 
              name="MainApp" 
              component={MainTabNavigator} 
            />
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
