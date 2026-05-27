/**
 * App.js – Passenger App entry point
 * Sets up navigation and auth context provider.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import SeatSelectionScreen from './src/screens/SeatSelectionScreen';
import DestinationScreen from './src/screens/DestinationScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import TripActiveScreen from './src/screens/TripActiveScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerStyle: { backgroundColor: '#1a1a2e' },
            headerTintColor: '#e0e0e0',
            headerTitleStyle: { fontWeight: '700' },
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SeatSelection"
            component={SeatSelectionScreen}
            options={{ title: 'Select a Seat' }}
          />
          <Stack.Screen
            name="Destination"
            component={DestinationScreen}
            options={{ title: 'Choose Destination' }}
          />
          <Stack.Screen
            name="Payment"
            component={PaymentScreen}
            options={{ title: 'Payment' }}
          />
          <Stack.Screen
            name="TripActive"
            component={TripActiveScreen}
            options={{ title: 'Your Trip', headerBackVisible: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
