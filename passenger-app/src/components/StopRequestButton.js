/**
 * StopRequestButton.js – Big, prominent "Request Stop" button
 * Designed to be easy to tap while on a moving bus.
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function StopRequestButton({ onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.icon}>🛑</Text>
      <Text style={styles.text}>REQUEST STOP</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  icon: {
    fontSize: 40,
    marginBottom: 8,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
