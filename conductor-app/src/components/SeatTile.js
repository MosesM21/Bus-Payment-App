/**
 * SeatTile.js – Single seat tile, colour-coded by status
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import SEAT_COLORS from '../constants/seatColors';

export default function SeatTile({ seat, onPress }) {
  const bgColor = SEAT_COLORS[seat.status] || SEAT_COLORS.available;

  return (
    <TouchableOpacity
      style={[styles.tile, { backgroundColor: bgColor }]}
      onPress={onPress}
      activeOpacity={0.7}
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
