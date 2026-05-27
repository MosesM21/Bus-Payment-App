/**
 * TripSummary.js – End-of-trip summary for conductors
 * Shows total passengers, revenue, and trip details.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import api from '../services/api';

export default function TripSummary({ navigation }) {
  const [summary, setSummary] = useState({
    totalPassengers: 0,
    totalRevenue: 0,
    cardPayments: 0,
    cashPayments: 0,
  });

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const { data } = await api.get('/payments/history');
      const payments = data.payments || [];
      setSummary({
        totalPassengers: payments.length,
        totalRevenue: payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0),
        cardPayments: payments.filter((p) => p.method === 'card').length,
        cashPayments: payments.filter((p) => p.method === 'cash').length,
      });
    } catch (err) {
      console.error('Failed to fetch summary:', err.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Trip Summary</Text>

      <View style={styles.statCard}>
        <Text style={styles.statValue}>{summary.totalPassengers}</Text>
        <Text style={styles.statLabel}>Total Passengers</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={[styles.statValue, { color: '#4CAF50' }]}>
          K{summary.totalRevenue.toFixed(2)}
        </Text>
        <Text style={styles.statLabel}>Total Revenue</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.statCard, styles.halfCard]}>
          <Text style={styles.statValue}>{summary.cardPayments}</Text>
          <Text style={styles.statLabel}>Card</Text>
        </View>
        <View style={[styles.statCard, styles.halfCard]}>
          <Text style={styles.statValue}>{summary.cashPayments}</Text>
          <Text style={styles.statLabel}>Cash</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backBtnText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  content: { padding: 20 },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  halfCard: { flex: 1, marginHorizontal: 6 },
  row: { flexDirection: 'row' },
  statValue: { fontSize: 36, fontWeight: '900', color: '#e94560' },
  statLabel: { fontSize: 14, color: '#aaa', marginTop: 4 },
  backBtn: {
    marginTop: 16,
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  backBtnText: { color: '#e0e0e0', fontSize: 16, fontWeight: '600' },
});
