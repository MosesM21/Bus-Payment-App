/**
 * SeatSelectionScreen.js – Passenger seat selection
 * Shows available seats on the bus and lets the passenger pick one.
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import SeatGrid from '../components/SeatGrid';
import api from '../services/api';
import { connectSocket, joinBus, getSocket } from '../services/socket';

const BUS_ID = 1; // TODO: Make dynamic

export default function SeatSelectionScreen({ navigation }) {
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    fetchSeats();
    const socket = connectSocket();
    joinBus(BUS_ID);

    socket.on('seat-changed', (data) => {
      setSeats((prev) =>
        prev.map((s) =>
          s.seat_number === data.seatNumber ? { ...s, status: data.status } : s
        )
      );
    });

    return () => socket.off('seat-changed');
  }, []);

  const fetchSeats = async () => {
    try {
      const { data } = await api.get(`/seats/${BUS_ID}`);
      setSeats(data.seats);
    } catch (err) {
      console.error('Failed to fetch seats:', err.message);
    }
  };

  const handleSeatPress = (seat) => {
    if (seat.status !== 'available') {
      return Alert.alert('Unavailable', 'This seat is already taken');
    }

    Alert.alert(
      `Seat ${seat.seat_number}`,
      'Would you like to select this seat?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Select',
          onPress: () =>
            navigation.navigate('Destination', {
              busId: BUS_ID,
              seatId: seat.id,
              seatNumber: seat.seat_number,
            }),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Choose Your Seat</Text>
      <Text style={styles.subtext}>Tap an available (grey) seat to select it</Text>
      <SeatGrid seats={seats} onSeatPress={handleSeatPress} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  content: { padding: 16, alignItems: 'center' },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  subtext: {
    fontSize: 13,
    color: '#888',
    marginBottom: 20,
  },
});
