/**
 * LoginScreen.js – Passenger login via phone OTP
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      return Alert.alert('Invalid', 'Please enter a valid phone number');
    }
    setLoading(true);
    try {
      // TODO: Firebase phone auth – send OTP
      setStep('otp');
    } catch (err) {
      Alert.alert('Error', 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 6) {
      return Alert.alert('Invalid', 'Please enter the 6-digit OTP');
    }
    setLoading(true);
    try {
      // TODO: Verify OTP with Firebase, get idToken
      await signIn({ uid: 'passenger_dev', phone }, 'dev_token');
      navigation.replace('SeatSelection');
    } catch (err) {
      Alert.alert('Error', 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>🚌 Ndeshala</Text>
        <Text style={styles.subtitle}>
          {step === 'phone'
            ? 'Enter your phone number to get started'
            : 'Enter the OTP sent to your phone'}
        </Text>

        {step === 'phone' ? (
          <TextInput
            style={styles.input}
            placeholder="+260 97X XXX XXX"
            placeholderTextColor="#888"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        ) : (
          <TextInput
            style={styles.input}
            placeholder="6-digit OTP"
            placeholderTextColor="#888"
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
          />
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={step === 'phone' ? handleSendOTP : handleVerifyOTP}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {step === 'phone' ? 'Send OTP' : 'Verify & Continue'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#16213e',
    color: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2a2a4a',
    textAlign: 'center',
    letterSpacing: 2,
  },
  button: {
    width: '100%',
    backgroundColor: '#e94560',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
