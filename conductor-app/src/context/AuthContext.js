/**
 * AuthContext.js – Conductor app authentication context
 * Manages Firebase auth state and provides user/token to the app tree.
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore saved session on mount
    (async () => {
      try {
        const savedToken = await AsyncStorage.getItem('authToken');
        const savedUser = await AsyncStorage.getItem('authUser');
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error('Failed to restore auth session:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = async (firebaseUser, idToken) => {
    setUser(firebaseUser);
    setToken(idToken);
    await AsyncStorage.setItem('authToken', idToken);
    await AsyncStorage.setItem('authUser', JSON.stringify(firebaseUser));
  };

  const signOut = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('authUser');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
