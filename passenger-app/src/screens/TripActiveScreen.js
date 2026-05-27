/**
 * TripActiveScreen.js – Active trip view with stop request button
 * Shows the passenger's current trip info and a big "Request Stop" button.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import StopRequestButton from '../components/StopRequestButton';
import { requestStop, getSocket } from '../services/socket';
import { useAuth } from '../context/AuthContext';

export default function TripActiveScreen({ route }) {
  const { busId, seatNumber, destination, routeName } = route.params;
  const { user } = useAuth();
  const [stopRequested, setStopRequested] = useState(false);

  const handleStopRequest = () => {
    Alert.alert(
      'Request Stop',
      `Request stop at ${destination}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Request Stop',
          onPress: () => {
            requestStop(busId, user.uid, destination);
            setStopRequested(true);

            // Listen for acknowledgment
            const socket = getSocket();
            socket?.on('stop-ack', () => {
              Alert.alert('✅ Acknowledged', 'The conductor has acknowledged your stop request.');
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tripCard}>
        <Text style={styles.heading}>🚌 Trip in Progress</Text>
        <DetailRow label="Route" value={routeName} />
        <DetailRow label="Seat" value={`#${seatNumber}`} />
        <DetailRow label="Destination" value={destination} />
      </View>

      <View style={styles.stopSection}>
        {stopRequested ? (
          <View style={styles.requestedBox}>
            <Text style={styles.requestedIcon}>✅</Text>
            <Text style={styles.requestedText}>Stop Requested</Text>
            <Text style={styles.requestedSub}>
              The conductor has been notified. Please wait.
            </Text>
          </View>
        ) : (
          <StopRequestButton onPress={handleStopRequest} />
        )}
      </View>
    </View>
  );
}

function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
    padding: 20,
    justifyContent: 'space-between',
  },
  tripCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 24,
  },
  heading: {
    fontSize: 22,
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
  detailValue: { color: '#e0e0e0', fontSize: 14, fontWeight: '600' },
  stopSection: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  requestedBox: {
    alignItems: 'center',
    padding: 24,
  },
  requestedIcon: { fontSize: 48, marginBottom: 12 },
  requestedText: {
    color: '#4CAF50',
    fontSize: 20,
    fontWeight: '800',
  },
  requestedSub: {
    color: '#888',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },
});
