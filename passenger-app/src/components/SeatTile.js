/**
 * SeatTile.js – Single seat tile for the passenger view
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const SEAT_COLORS = {
  available: '#9E9E9E',
  reserved: '#FF9800',
  occupied: '#F44336',
  stopping: '#4CAF50',
};

export default function SeatTile({ seat, onPress }) {
  const bgColor = SEAT_COLORS[seat.status] || SEAT_COLORS.available;
  const isAvailable = seat.status === 'available';

  return (
    <TouchableOpacity
      style={[styles.tile, { backgroundColor: bgColor, opacity: isAvailable ? 1 : 0.6 }]}
      onPress={onPress}
      activeOpacity={isAvailable ? 0.7 : 1}
    >
      <Text style={styles.number}>{seat.seat_number}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  number: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
});
