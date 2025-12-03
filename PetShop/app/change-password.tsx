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
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useUser } from './context/userContext';

const BG = '#001F22';
const TEAL = '#00756F';
const TEXT = '#FFFFFF';

export default function ChangePasswordScreen() {
  const { email } = useUser();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!email) {
      Alert.alert('Error', 'No user email found. Please log in again.');
      router.replace('/login');
      return;
    }

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      Alert.alert('Missing info', 'Please fill out all fields.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert('Mismatch', 'New passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('customer')
        .select('customerid, password')
        .eq('email', email)
        .maybeSingle();

      if (error) {
        console.error('Error loading customer for password change:', error);
        Alert.alert('Error', 'Could not verify your account.');
        return;
      }

      if (!data) {
        Alert.alert('Error', 'Account not found. Please log in again.');
        router.replace('/login');
        return;
      }

      if (data.password !== currentPassword) {
        Alert.alert('Incorrect password', 'Your current password is wrong.');
        return;
      }

      const { error: updateError } = await supabase
        .from('customer')
        .update({ password: newPassword })
        .eq('customerid', data.customerid);

      if (updateError) {
        console.error('Error updating password:', updateError);
        Alert.alert('Error', 'Could not update password.');
        return;
      }

      Alert.alert(
        'Success',
        'Your password has been changed. Please log in again.',
        [{ text: 'OK', onPress: () => router.replace('/login') }]
      );
    } catch (err: any) {
      console.error('Unexpected change password error:', err);
      Alert.alert('Error', 'Something went wrong while changing your password.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.inner}>
          <Text style={styles.title}>Change Password</Text>

          <Text style={styles.emailText}>
            {email ? `For: ${email}` : 'No email (please log in)'}
          </Text>

          {/* Current password */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Current Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Current password"
              placeholderTextColor="#A7D6D3"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="New password"
              placeholderTextColor="#A7D6D3"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              placeholderTextColor="#A7D6D3"
              secureTextEntry
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={TEXT} style={{ marginTop: 24 }} />
          ) : (
            <>
              <TouchableOpacity
                style={styles.buttonPrimary}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Save Password</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={handleCancel}
              >
                <Text style={styles.buttonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
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
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT,
    marginBottom: 8,
  },
  emailText: {
    fontSize: 14,
    color: TEXT,
    marginBottom: 24,
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
  buttonPrimary: {
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
  buttonSecondary: {
    marginTop: 12,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: TEXT,
  },
  buttonSecondaryText: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '600',
  },
});
