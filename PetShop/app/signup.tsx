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
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';

const BG = '#001F22';
const TEAL = '#00756F';
const TEXT = '#FFFFFF';

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Missing info', 'Please fill out name, email, and password.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      const trimmedEmail = email.trim();

      const { data: existing, error: existingError } = await supabase
        .from('customer')
        .select('customerid')
        .eq('email', trimmedEmail)
        .maybeSingle();

      if (existingError) {
        console.error('Error checking existing customer:', existingError);
        Alert.alert('Error', 'Could not verify email uniqueness.');
        return;
      }

      if (existing) {
        Alert.alert(
          'Email in use',
          'An account with this email already exists. Please log in instead.'
        );
        return;
      }

      const { data, error } = await supabase
        .from('customer')
        .insert([
          {
            name,
            email: trimmedEmail,
            password,
            
          },
        ])
        .select('customerid');

      if (error) {
        console.error('Error creating customer:', error);
        Alert.alert('Sign up failed', error.message);
        return;
      }

      console.log('Created customer:', data);

      Alert.alert(
        'Account created',
        'Your account has been created. You can now log in.',
        [{ text: 'OK', onPress: () => router.replace('/login') }]
      );
    } catch (err: any) {
      console.error('Unexpected sign up error:', err);
      Alert.alert('Error', 'Something went wrong while creating your account.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToLogin = () => {
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Create Account</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor="#A7D6D3"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Mobile</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone number"
              placeholderTextColor="#A7D6D3"
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={setMobile}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#A7D6D3"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Street address"
              placeholderTextColor="#A7D6D3"
              value={address}
              onChangeText={setAddress}
              multiline
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

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor="#A7D6D3"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.footer} onPress={handleGoToLogin}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text style={styles.footerLink}>Log in instead</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: TEXT,
    textAlign: 'center',
    marginBottom: 32,
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
  multilineInput: {
    minHeight: 60,
    textAlignVertical: 'top',
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
    textAlign: 'center',
  },
  footerLink: {
    fontWeight: '600',
  },
});
