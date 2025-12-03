import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';

import { useUser } from './context/userContext';

const BG = '#001F22';
const TEAL = '#00756F';
const TEXT = '#FFFFFF';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

const { setEmail: setUserEmail, setName: setUserName, setCustomerId } = useUser();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing info', 'Please enter email and password.');
      return;
    }

    try {
      setLoading(true);

      const trimmedEmail = email.trim();

      const { data, error } = await supabase
        .from('customer')
        .select('customerid, name, email, password')
        .eq('email', trimmedEmail)
        .eq('password', password)
        .limit(2);

      console.log('Supabase login rows:', data);
      console.log('Supabase login error:', error);

      if (error) {
        Alert.alert('Login error', error.message);
        return;
      }

      if (!data || data.length === 0) {
        Alert.alert('Login failed', 'Invalid email or password.');
        return;
      }

      if (data.length > 1) {
        console.warn('⚠️ Multiple customers with same email+password', data);
      }

      const customer = data[0];
console.log('Logged in as customer:', customer);

      setUserEmail(customer.email);
        setUserName(customer.name);
            setCustomerId(String(customer.customerid)); 

    router.replace('/home');

    } catch (err: any) {
      console.error('Unexpected login error:', err);
      Alert.alert('Error', 'Something went wrong while logging in.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToSignUp = () => {
    router.replace('/signup');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.inner}>
          <Text style={styles.title}>Pet Shop</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#A7D6D3"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#A7D6D3"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Logging in...' : 'Log In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footer} onPress={handleGoToSignUp}>
            <Text style={styles.footerText}>
              No account? <Text style={styles.footerLink}>Sign up instead</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: TEXT,
    textAlign: 'center',
    marginBottom: 40,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT,
    marginBottom: 6,
  },
  input: {
    backgroundColor: TEAL,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: TEXT,
    fontSize: 16,
  },
  button: {
    marginTop: 24,
    backgroundColor: TEAL,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: TEXT,
    textDecorationLine: 'underline',
  },
  footerLink: {
    fontWeight: '600',
  },
});
