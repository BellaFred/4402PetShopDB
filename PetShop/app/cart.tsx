import React, { useState } from 'react';
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

type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

const INITIAL_ITEMS: CartItem[] = [
  {
    id: '1',
    name: 'Goldie',
    price: 17.38,
    imageUrl:
      'https://images.pexels.com/photos/161173/goldfish-fish-aquarium-fish-fauna-161173.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '2',
    name: 'Buddy',
    price: 67.41,
    imageUrl:
      'https://images.pexels.com/photos/257540/pexels-photo-257540.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function CartScreen() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS);
  const [page, setPage] = useState(1);

  const handleRemove = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    const extra = INITIAL_ITEMS.map(item => ({
      ...item,
      id: `${item.id}-p${nextPage}`,
    }));
    setPage(nextPage);
    setItems(prev => [...prev, ...extra]);
  };

  const handleContinue = () => {
    router.push('/payment');
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
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
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
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
    paddingBottom: 90,
  },
  continueButton: {
    backgroundColor: '#00756F',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
