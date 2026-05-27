/**
 * StopAlert.js – Incoming stop request notification for conductors
 * Displays a prominent banner when a passenger requests a stop.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

export default function StopAlert({ stopName, onAcknowledge }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>🛑</Text>
        <View style={styles.textWrap}>
          <Text style={styles.title}>Stop Requested!</Text>
          <Text style={styles.stopName}>{stopName}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.ackBtn} onPress={onAcknowledge}>
        <Text style={styles.ackText}>Acknowledge</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 6,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  content: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  icon: { fontSize: 28, marginRight: 12 },
  textWrap: { flex: 1 },
  title: { color: '#fff', fontSize: 16, fontWeight: '800' },
  stopName: { color: '#e8f5e9', fontSize: 14, marginTop: 2 },
  ackBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginLeft: 12,
  },
  ackText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
