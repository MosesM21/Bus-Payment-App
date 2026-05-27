/**
 * SeatGrid.js – Grid layout of seats for the passenger view
 * Same bus layout as conductor, but passengers can only select available seats.
 */

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import SeatTile from './SeatTile';

export default function SeatGrid({ seats, onSeatPress }) {
  const rows = [];
  for (let i = 0; i < seats.length; i += 4) {
    rows.push(seats.slice(i, i + 4));
  }

  return (
    <View style={styles.grid}>
      <View style={styles.legend}>
        <LegendItem color="#9E9E9E" label="Available" />
        <LegendItem color="#FF9800" label="Reserved" />
        <LegendItem color="#F44336" label="Occupied" />
      </View>

      {rows.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          <View style={styles.pair}>
            {row.slice(0, 2).map((seat) => (
              <SeatTile key={seat.id} seat={seat} onPress={() => onSeatPress(seat)} />
            ))}
          </View>
          <View style={styles.aisle}>
            <Text style={styles.aisleText}>│</Text>
          </View>
          <View style={styles.pair}>
            {row.slice(2, 4).map((seat) => (
              <SeatTile key={seat.id} seat={seat} onPress={() => onSeatPress(seat)} />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

function LegendItem({ color, label }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { alignItems: 'center' },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 12,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 4 },
  legendLabel: { color: '#aaa', fontSize: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pair: { flexDirection: 'row', gap: 8 },
  aisle: { width: 24, alignItems: 'center' },
  aisleText: { color: '#333', fontSize: 20 },
});
