import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import BottomNav from './components/BottomNav';
import { supabase } from '../lib/supabase';
import { useUser } from './context/userContext';
import { useCart } from './context/cartContext';

const BG = '#001F22';
const TEAL = '#00756F';
const TEXT = '#FFFFFF';

type PaymentInfoRow = {
  paymentid: string;
  customerid: string;
  cardnumber: string;
  cardexpiration: string;
  cvv: string;
  cardholder: string;
  billingaddress: string;
};

export default function PaymentScreen() {
  const { customerId, email } = useUser();
  const { items, clearCart } = useCart();

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfoRow | null>(null);
  const [loading, setLoading] = useState(false);

  const [cardholderInput, setCardholderInput] = useState('');
  const [cardnumberInput, setCardnumberInput] = useState('');
  const [cardexpirationInput, setCardexpirationInput] = useState('');
  const [cvvInput, setCvvInput] = useState('');
  const [billingaddressInput, setBillingaddressInput] = useState('');

  const total = useMemo(
    () => items.reduce((sum, p) => sum + p.price, 0),
    [items]
  );

  useEffect(() => {
    const loadPaymentInfo = async () => {
      if (!customerId) {
        console.warn('No customerId in context – redirecting to login');
        Alert.alert('Error', 'Please log in again.', [
          { text: 'OK', onPress: () => router.replace('/login') },
        ]);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('paymentinfo')
          .select(
            'paymentid, customerid, cardnumber, cardexpiration, cvv, cardholder, billingaddress'
          )
          .eq('customerid', customerId)
          .maybeSingle();

        if (error) {
          console.error('Error loading payment info:', error);
          Alert.alert('Error', 'Could not load payment information.');
          return;
        }

        if (!data) {
          setPaymentInfo(null);
          return;
        }

        setPaymentInfo(data as PaymentInfoRow);
      } catch (err: any) {
        console.error('Unexpected payment info error:', err);
        Alert.alert('Error', 'Something went wrong loading payment info.');
      } finally {
        setLoading(false);
      }
    };

    loadPaymentInfo();
  }, [customerId]);

  const maskCardNumber = (card: string) => {
    if (!card) return '';
    const last4 = card.replace(/\s+/g, '').slice(-4);
    return `**** **** **** ${last4}`;
  };

 
  const handleConfirm = async () => {
    if (!customerId) {
      Alert.alert('Error', 'Not logged in.');
      router.replace('/login');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Cart empty', 'No pets to purchase.');
      return;
    }

    if (total <= 0) {
      Alert.alert('Error', 'Total amount is invalid.');
      return;
    }

    let paymentIdToUse: string | null = paymentInfo?.paymentid ?? null;

    if (!paymentInfo) {
      if (
        !cardholderInput ||
        !cardnumberInput ||
        !cardexpirationInput ||
        !cvvInput ||
        !billingaddressInput
      ) {
        Alert.alert(
          'Missing info',
          'Please fill out all payment fields before confirming.'
        );
        return;
      }

      try {
        const { data, error } = await supabase
          .from('paymentinfo')
          .insert([
            {
              customerid: customerId,
              cardnumber: cardnumberInput,
              cardexpiration: cardexpirationInput,
              cvv: cvvInput,
              cardholder: cardholderInput,
              billingaddress: billingaddressInput,
            },
          ])
          .select();

        if (error) {
          console.error('Error saving payment info:', error);
          Alert.alert(
            'Error',
            'Could not save payment information. Please try again.'
          );
          return;
        }

        if (data && data.length > 0) {
          const saved = data[0] as PaymentInfoRow;
          setPaymentInfo(saved);
          paymentIdToUse = saved.paymentid;
        }
      } catch (err) {
        console.error('Unexpected error saving payment info:', err);
        Alert.alert(
          'Error',
          'Something went wrong while saving your payment info.'
        );
        return;
      }
    }

    if (!paymentIdToUse) {
      Alert.alert(
        'Error',
        'No payment method available to use for this order.'
      );
      return;
    }

    try {
      const rows = items.map(pet => ({
        customerid: customerId,
        employeeid: null, // optional
        paymentid: paymentIdToUse,
        petid: Number(pet.id),
        orderdate: new Date().toISOString().slice(0, 10),
        totalamount: total,
      }));

      const { error } = await supabase.from('orderinfo').insert(rows);
      if (error) {
        console.error('Order insert error:', error);
      }

      const petIds = items.map(pet => Number(pet.id));
      const { error: petError } = await supabase
        .from('pet')
        .update({ adoptionstatus: 'adopted' })
        .in('petid', petIds);

      if (petError) {
        console.error('Error updating pet adoption status:', petError);
      }
    } catch (err) {
      console.error('Unexpected order error:', err);
    }

    clearCart();
    router.replace('/confirmation');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Payment</Text>
          {email && <Text style={styles.subHeader}>Customer: {email}</Text>}
        </View>

        <View style={styles.content}>
          {loading && (
            <ActivityIndicator
              size="large"
              color={TEXT}
              style={{ marginTop: 20 }}
            />
          )}

          {!loading && paymentInfo && (
            <>
              <View style={styles.cardBox}>
                <Text style={styles.label}>Cardholder</Text>
                <Text style={styles.value}>{paymentInfo.cardholder}</Text>

                <Text style={styles.label}>Card Number</Text>
                <Text style={styles.value}>
                  {maskCardNumber(paymentInfo.cardnumber)}
                </Text>

                <Text style={styles.label}>Expiration</Text>
                <Text style={styles.value}>{paymentInfo.cardexpiration}</Text>

                <Text style={styles.label}>Billing Address</Text>
                <Text style={styles.value}>{paymentInfo.billingaddress}</Text>
              </View>
            </>
          )}

          {!loading && !paymentInfo && (
            <>
              <View style={styles.cardBox}>
                <Text style={styles.label}>Cardholder</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Name on card"
                  placeholderTextColor="#A7D6D3"
                  value={cardholderInput}
                  onChangeText={setCardholderInput}
                />

                <Text style={styles.label}>Card Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor="#A7D6D3"
                  keyboardType="number-pad"
                  value={cardnumberInput}
                  onChangeText={setCardnumberInput}
                />

                <View style={styles.rowHalf}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.label}>Expiration</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="MM/YY"
                      placeholderTextColor="#A7D6D3"
                      value={cardexpirationInput}
                      onChangeText={setCardexpirationInput}
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={styles.label}>CVV</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="123"
                      placeholderTextColor="#A7D6D3"
                      keyboardType="number-pad"
                      secureTextEntry
                      value={cvvInput}
                      onChangeText={setCvvInput}
                    />
                  </View>
                </View>

                <Text style={styles.label}>Billing Address</Text>
                <TextInput
                  style={[styles.input, styles.multiline]}
                  placeholder="Street, City, State, ZIP"
                  placeholderTextColor="#A7D6D3"
                  multiline
                  value={billingaddressInput}
                  onChangeText={setBillingaddressInput}
                />
              </View>
            </>
          )}

          {!loading && items.length > 0 && (
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          )}

          {!loading && !paymentInfo && items.length === 0 && (
            <Text style={styles.noInfoText}>
              No pets in your cart to purchase.
            </Text>
          )}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
            disabled={items.length === 0}
          >
            <Text style={styles.confirmText}>Confirm Purchase</Text>
          </TouchableOpacity>
        </View>

        <BottomNav active="cart" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },
  screen: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: TEXT,
  },
  subHeader: {
    marginTop: 4,
    color: TEXT,
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  cardBox: {
    backgroundColor: '#00343A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  label: {
    fontSize: 14,
    color: '#A7D6D3',
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    color: TEXT,
    fontWeight: '600',
  },
  noInfoText: {
    marginTop: 24,
    color: TEXT,
    fontSize: 16,
  },
  input: {
    marginTop: 4,
    backgroundColor: '#004A4A',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: TEXT,
    fontSize: 14,
  },
  multiline: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  rowHalf: {
    flexDirection: 'row',
    marginTop: 8,
  },
  totalBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#003A3A',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    color: '#A7D6D3',
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  confirmButton: {
    backgroundColor: TEAL,
     borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  confirmText: {
    color: TEXT,
    fontSize: 18,
    fontWeight: '700',
  },
});
