import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import BottomNav from './components/BottomNav';
import { useCart } from './context/cartContext'; 

export default function CartScreen() {
  const { items, removeItem } = useCart();

  const handleRemove = (id: string) => {
    removeItem(id);
  };

  const handleContinue = () => {
    router.push('/payment');
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.imageUrl }} 
        style={styles.cardImage}
      />
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemove(item.id)}
      >
        <Ionicons name="remove-circle-outline" size={22} color="#000000" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cart</Text>
      </View>

      <View style={styles.listContainer}>
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Your cart is empty.</Text>
              <Text style={styles.emptyTextSmall}>
                Add pets from the Pet Search page.
              </Text>
            </View>
          }
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>

      <BottomNav active="cart" />
    </View>
  );
}

const BG = '#001F22';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyContainer: {
    paddingTop: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptyTextSmall: {
    color: '#E0F4F3',
    fontSize: 14,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    marginBottom: 12,
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  removeButton: {
    padding: 6,
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  continueButton: {
    backgroundColor: '#00756F',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
});
