/**
 * PaymentScreen.js – Payment method selection and processing
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { createPaymentIntent, recordCashPayment } from '../services/stripeService';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function PaymentScreen({ route, navigation }) {
  const { busId, seatId, seatNumber, routeId, routeName, destination, amount } = route.params;
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCardPayment = async () => {
    setLoading(true);
    try {
      const clientSecret = await createPaymentIntent({ amount, seatId, routeId });
      // TODO: Open Stripe payment sheet using @stripe/stripe-react-native
      // For now, simulate success
      Alert.alert('Success', 'Card payment processed!');
      await reserveAndNavigate();
    } catch (err) {
      Alert.alert('Error', 'Card payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCashPayment = async () => {
    setLoading(true);
    try {
      await recordCashPayment({ seatId, routeId, amount });
      Alert.alert('Success', 'Cash payment recorded!');
      await reserveAndNavigate();
    } catch (err) {
      Alert.alert('Error', 'Failed to record cash payment');
    } finally {
      setLoading(false);
    }
  };

  const reserveAndNavigate = async () => {
    try {
      await api.patch(`/seats/${seatId}/reserve`, {
        passengerId: user.uid,
        destination,
      });
      navigation.replace('TripActive', {
        busId,
        seatId,
        seatNumber,
        destination,
        routeName,
      });
    } catch (err) {
      console.error('Reserve failed:', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.heading}>Payment Summary</Text>
        <DetailRow label="Route" value={routeName} />
        <DetailRow label="Destination" value={destination} />
        <DetailRow label="Seat" value={`#${seatNumber}`} />
        <View style={styles.divider} />
        <DetailRow label="Total" value={`K${parseFloat(amount).toFixed(2)}`} bold />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#e94560" style={{ marginTop: 32 }} />
      ) : (
        <View style={styles.methods}>
          <TouchableOpacity style={styles.cardBtn} onPress={handleCardPayment}>
            <Text style={styles.btnIcon}>💳</Text>
            <Text style={styles.btnText}>Pay with Card</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cashBtn} onPress={handleCashPayment}>
            <Text style={styles.btnIcon}>💵</Text>
            <Text style={styles.btnText}>Pay with Cash</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function DetailRow({ label, value, bold }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, bold && styles.detailBold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
    padding: 20,
  },
  summaryCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: { color: '#888', fontSize: 14 },
  detailValue: { color: '#e0e0e0', fontSize: 14 },
  detailBold: { fontWeight: '900', color: '#4CAF50', fontSize: 18 },
  divider: {
    height: 1,
    backgroundColor: '#2a2a4a',
    marginVertical: 12,
  },
  methods: { marginTop: 32, gap: 16 },
  cardBtn: {
    backgroundColor: '#533483',
    borderRadius: 14,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  cashBtn: {
    backgroundColor: '#16213e',
    borderRadius: 14,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  btnIcon: { fontSize: 24 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
