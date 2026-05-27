/**
 * RouteCard.js – Route selection card for destination picker
 */

import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';

export default function RouteCard({ route, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <Text style={styles.routeName}>{route.route_name}</Text>
      </View>
      <Text style={styles.detail}>
        {route.origin} → {route.destination}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#2a2a4a',
  },
  cardSelected: {
    borderColor: '#e94560',
    backgroundColor: '#16213e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  routeName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  detail: {
    color: '#888',
    fontSize: 13,
  },
});
