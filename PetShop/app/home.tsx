import React, { useEffect, useMemo, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import BottomNav from './components/BottomNav';
import { supabase } from '../lib/supabase';
import { useCart } from './context/cartContext';

type Pet = {
  id: string;
  name: string;
  species: string;
  price: number;
  imageUrl: string;
  
};

type SortOption = 'none' | 'priceLowHigh' | 'priceHighLow' | 'name';

const getImageForSpecies = (species: string): string => {
  const s = species.toLowerCase();

  if (s.includes('fish')) {
    return 'https://images.pexels.com/photos/128756/pexels-photo-128756.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  if (s.includes('dog')) {
    return 'https://images.pexels.com/photos/257540/pexels-photo-257540.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  if (s.includes('cat')) {
    return 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=800';
  }
  if (s.includes('bird')) {
    return 'https://images.pexels.com/photos/45851/bird-blue-cristata-cyanocitta-45851.jpeg?auto=compress&cs=tinysrgb&w=800';
  }

  // default
  return 'https://images.pexels.com/photos/5731866/pexels-photo-5731866.jpeg?auto=compress&cs=tinysrgb&w=800';
};

const BG = '#001F22';
const TEAL = '#00756F';
const CARD = '#00343A';

export default function HomeScreen() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [searchText, setSearchText] = useState('');
  const [filterSpecies, setFilterSpecies] = useState<
    'All' | 'Dog' | 'Cat' | 'Fish' | 'Bird'
  >('All');
  const [sortOption, setSortOption] = useState<SortOption>('none');
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { addItem } = useCart();

  useEffect(() => {
    const loadPets = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('pet')
           .select('petid, name, species, adoptionfee, adoptionstatus')
           .eq('adoptionstatus', 'adopted');

        if (error) {
          console.error('Error loading pets:', error);
          return;
        }
        if (!data) return;

        const mapped: Pet[] = data.map((row: any) => ({
          id: String(row.petid),
          name: row.name ?? 'Unnamed Pet',
          species: row.species ?? 'Unknown',
          price: row.adoptionfee ?? 0,
          imageUrl: getImageForSpecies(row.species ?? ''),
        }));

        setPets(mapped);
        console.log('Loaded pets:', mapped);
      } catch (err) {
        console.error('Unexpected error loading pets:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPets();
  }, []);

 const handleAddToCart = (pet: Pet) => {
  addItem({
    id: pet.id,
    name: pet.name,
    species: pet.species,  
    price: pet.price,
    imageUrl: pet.imageUrl,
  });

  setPets(prev => prev.filter(p => p.id !== pet.id));
};

  const filteredPets = useMemo(() => {
    let result = [...pets];

    if (searchText.trim().length > 0) {
      const q = searchText.trim().toLowerCase();
      result = result.filter(p =>
        p.species.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q)
      );
    }

    if (filterSpecies !== 'All') {
      result = result.filter(
        p => p.species.toLowerCase() === filterSpecies.toLowerCase()
      );
    }

    if (sortOption === 'priceLowHigh') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'priceHighLow') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [pets, searchText, filterSpecies, sortOption]);

  const renderPetCard = ({ item }: { item: Pet }) => {
    return (
      <TouchableOpacity
        style={styles.cardContainer}
        activeOpacity={0.9}
        onPress={() =>
          router.push({
            pathname: '/pet/id',
            params: {
              id: item.id,
            },
          })
        }
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
        </View>

        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleAddToCart(item)}
        >
          <Ionicons name="add" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.headerTitle}>Pet Search</Text>

        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={18}
            color="#A7D6D3"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by species or name..."
            placeholderTextColor="#A7D6D3"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.chipButton}
            onPress={() => setFilterVisible(true)}
          >
            <Text style={styles.chipText}>Filter By</Text>
            <Ionicons name="chevron-down" size={16} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.chipButton}
            onPress={() => setSortVisible(true)}
          >
            <Text style={styles.chipText}>Sort By</Text>
            <Ionicons name="chevron-down" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredPets}
          keyExtractor={item => item.id}
          renderItem={renderPetCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            !loading ? (
              <Text style={{ color: '#FFFFFF', marginTop: 20 }}>
                No pets found.
              </Text>
            ) : null
          }
        />
      </View>

      <BottomNav active="home" />

      <Modal
        visible={filterVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Filter By Species</Text>

            {(['All', 'Dog', 'Cat', 'Fish', 'Bird'] as const).map(option => (
              <Pressable
                key={option}
                style={[
                  styles.modalOption,
                  filterSpecies === option && styles.modalOptionSelected,
                ]}
                onPress={() => {
                  setFilterSpecies(option);
                  setFilterVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    filterSpecies === option && styles.modalOptionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}

            <Pressable
              style={styles.modalClose}
              onPress={() => setFilterVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={sortVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSortVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Sort By</Text>

            <Pressable
              style={[
                styles.modalOption,
                sortOption === 'priceLowHigh' && styles.modalOptionSelected,
              ]}
              onPress={() => {
                setSortOption('priceLowHigh');
                setSortVisible(false);
              }}
            >
              <Text
                style={[
                  styles.modalOptionText,
                  sortOption === 'priceLowHigh' &&
                    styles.modalOptionTextSelected,
                ]}
              >
                Price: Low to High
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.modalOption,
                sortOption === 'priceHighLow' && styles.modalOptionSelected,
              ]}
              onPress={() => {
                setSortOption('priceHighLow');
                setSortVisible(false);
              }}
            >
              <Text
                style={[
                  styles.modalOptionText,
                  sortOption === 'priceHighLow' &&
                    styles.modalOptionTextSelected,
                ]}
              >
                Price: High to Low
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.modalOption,
                sortOption === 'name' && styles.modalOptionSelected,
              ]}
              onPress={() => {
                setSortOption('name');
                setSortVisible(false);
              }}
            >
              <Text
                style={[
                  styles.modalOptionText,
                  sortOption === 'name' && styles.modalOptionTextSelected,
                ]}
              >
                Name (A–Z)
              </Text>
            </Pressable>

            <Pressable
              style={styles.modalClose}
              onPress={() => setSortVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TEAL,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
    marginBottom: 16,
  },
  chipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TEAL,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 4,
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 140, 
  },
  cardContainer: {
    backgroundColor: CARD,
    borderRadius: 12,
    marginBottom: 16,
    padding: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 17,
  },
  cardImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
  },
  addButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: TEAL,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCard: {
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 16,
    width: '80%',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  modalOption: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  modalOptionSelected: {
    backgroundColor: TEAL,
  },
  modalOptionText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  modalOptionTextSelected: {
    fontWeight: '700',
  },
  modalClose: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
