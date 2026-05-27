/**
 * DestinationScreen.js – Route & fare picker for passengers
 * Shows available routes/stops and calculates the fare.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import RouteCard from '../components/RouteCard';
import api from '../services/api';

export default function DestinationScreen({ route, navigation }) {
  const { busId, seatId, seatNumber } = route.params;
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [stops, setStops] = useState([]);
  const [selectedStop, setSelectedStop] = useState(null);
  const [fare, setFare] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const { data } = await api.get('/routes');
      setRoutes(data.routes);
    } catch (err) {
      console.error('Failed to fetch routes:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRouteSelect = async (r) => {
    setSelectedRoute(r);
    setSelectedStop(null);
    setFare(null);
    try {
      const { data } = await api.get(`/routes/${r.id}`);
      setStops(data.stops || []);
    } catch (err) {
      console.error('Failed to fetch stops:', err.message);
    }
  };

  const handleStopSelect = async (stop) => {
    setSelectedStop(stop);
    try {
      const { data } = await api.get(
        `/routes/${selectedRoute.id}/fare?from=1&to=${stop.stop_order}`
      );
      setFare(data.fare);
    } catch (err) {
      console.error('Failed to calculate fare:', err.message);
      setFare(null);
    }
  };

  const handleContinue = () => {
    navigation.navigate('Payment', {
      busId,
      seatId,
      seatNumber,
      routeId: selectedRoute.id,
      routeName: selectedRoute.route_name,
      destination: selectedStop.stop_name,
      amount: fare?.amount || 0,
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e94560" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Seat #{seatNumber} — Choose Destination</Text>

      <Text style={styles.sectionTitle}>Select Route</Text>
      {routes.map((r) => (
        <RouteCard
          key={r.id}
          route={r}
          selected={selectedRoute?.id === r.id}
          onPress={() => handleRouteSelect(r)}
        />
      ))}

      {selectedRoute && stops.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Select Your Stop</Text>
          {stops.map((stop) => (
            <TouchableOpacity
              key={stop.id}
              style={[
                styles.stopItem,
                selectedStop?.id === stop.id && styles.stopSelected,
              ]}
              onPress={() => handleStopSelect(stop)}
            >
              <Text style={styles.stopText}>{stop.stop_name}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      {fare && (
        <View style={styles.fareBox}>
          <Text style={styles.fareLabel}>Fare</Text>
          <Text style={styles.fareAmount}>K{parseFloat(fare.amount).toFixed(2)}</Text>
        </View>
      )}

      {selectedStop && fare && (
        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
          <Text style={styles.continueBtnText}>Continue to Payment</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  content: { padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f23' },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e94560',
    marginTop: 16,
    marginBottom: 8,
  },
  stopItem: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  stopSelected: {
    borderColor: '#e94560',
    backgroundColor: '#16213e',
  },
  stopText: { color: '#e0e0e0', fontSize: 15 },
  fareBox: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  fareLabel: { color: '#aaa', fontSize: 14 },
  fareAmount: { color: '#4CAF50', fontSize: 32, fontWeight: '900', marginTop: 4 },
  continueBtn: {
    marginTop: 20,
    backgroundColor: '#e94560',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  continueBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
