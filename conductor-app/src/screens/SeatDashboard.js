/**
 * SeatDashboard.js – Main colour-coded seat view for conductors
 * Shows a real-time grid of all seats with colour-coded status.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import SeatGrid from '../components/SeatGrid';
import StopAlert from '../components/StopAlert';
import api from '../services/api';
import { connectSocket, joinBus, getSocket } from '../services/socket';

const BUS_ID = 1; // TODO: Make dynamic from route params

export default function SeatDashboard({ navigation }) {
  const [seats, setSeats] = useState([]);
  const [stopAlert, setStopAlert] = useState(null);

  useEffect(() => {
    fetchSeats();
    setupSocket();

    return () => {
      const socket = getSocket();
      if (socket) {
        socket.off('seat-changed');
        socket.off('stop-requested');
      }
    };
  }, []);

  const fetchSeats = async () => {
    try {
      const { data } = await api.get(`/seats/${BUS_ID}`);
      setSeats(data.seats);
    } catch (err) {
      console.error('Failed to fetch seats:', err.message);
    }
  };

  const setupSocket = () => {
    const socket = connectSocket();
    joinBus(BUS_ID);

    socket.on('seat-changed', (data) => {
      setSeats((prev) =>
        prev.map((s) =>
          s.seat_number === data.seatNumber ? { ...s, status: data.status } : s
        )
      );
    });

    socket.on('stop-requested', (data) => {
      setStopAlert(data);
      // Auto-dismiss after 10 seconds
      setTimeout(() => setStopAlert(null), 10000);
    });
  };

  const handleSeatPress = (seat) => {
    Alert.alert(
      `Seat ${seat.seat_number}`,
      `Status: ${seat.status}\n${seat.passenger_id ? `Passenger: ${seat.passenger_id}` : ''}`,
      [
        { text: 'Cancel', style: 'cancel' },
        seat.status !== 'available'
          ? {
              text: 'Release Seat',
              onPress: () => releaseSeat(seat),
              style: 'destructive',
            }
          : null,
      ].filter(Boolean)
    );
  };

  const releaseSeat = async (seat) => {
    try {
      await api.patch(`/seats/${seat.id}/release`);
    } catch (err) {
      Alert.alert('Error', 'Failed to release seat');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Bus #{BUS_ID} – Live Seats</Text>

      {stopAlert && (
        <StopAlert
          stopName={stopAlert.stopName}
          onAcknowledge={() => {
            const socket = getSocket();
            socket?.emit('stop-acknowledged', { busId: BUS_ID });
            setStopAlert(null);
          }}
        />
      )}

      <SeatGrid seats={seats} onSeatPress={handleSeatPress} />

      <TouchableOpacity
        style={styles.summaryBtn}
        onPress={() => navigation.navigate('TripSummary')}
      >
        <Text style={styles.summaryBtnText}>View Trip Summary</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  content: { padding: 16 },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryBtn: {
    marginTop: 24,
    backgroundColor: '#533483',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  summaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
