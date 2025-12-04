import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

type PetRow = {
  petid: number;
  name: string | null;
  species: string | null;
  breed: string | null;
  age: string | null;         
  gender: string | null;
  isfixed: boolean | string | null;
  generaldescription: string | null;
  healthinfo: string | null;
  adoptionfee: number | null;
};

const getImageForSpecies = (species: string | null): string => {
  const s = (species ?? '').toLowerCase();

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

  return 'https://images.pexels.com/photos/5731866/pexels-photo-5731866.jpeg?auto=compress&cs=tinysrgb&w=800';
};

export default function PetDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [pet, setPet] = useState<PetRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const loadPet = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('pet')
          .select(
            'petid, name, species, breed, age, gender, isfixed, generaldescription, healthinfo, adoptionfee'
          )
          .eq('petid', Number(id))
          .maybeSingle();

        if (error) {
          console.error('Error loading pet details:', error);
          return;
        }

        setPet(data as PetRow | null);
      } catch (err) {
        console.error('Unexpected error loading pet details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPet();
  }, [id]);

  const name = pet?.name ?? 'Animal Name';
  const species = pet?.species ?? 'Unknown Species';
  const breed = pet?.breed ?? 'Unknown';
  const ageText = pet?.age ?? 'Unknown';
  const genderText = pet?.gender ?? 'Unknown';
  const fixedRaw = pet?.isfixed;
  const fixedText =
    fixedRaw === true || fixedRaw === 'true'
      ? 'Yes (spayed / neutered)'
      : fixedRaw === false || fixedRaw === 'false'
      ? 'No'
      : 'Unknown';
  const description =
    pet?.generaldescription ?? 'No description available for this pet yet.';
  const healthInfo =
    pet?.healthinfo ?? 'No health information has been recorded yet.';
  const price =
    pet?.adoptionfee !== null && pet?.adoptionfee !== undefined
      ? pet.adoptionfee
      : undefined;

  const imageUrl = getImageForSpecies(pet?.species ?? null);

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pet Details</Text>
        <View style={{ width: 32 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading pet...</Text>
        </View>
      ) : !pet ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Pet not found.</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageCard}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
          </View>

          <View style={styles.titleRow}>
            <View>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.species}>{species}</Text>
            </View>
            {price !== undefined && (
              <Text style={styles.price}>${price.toFixed(2)}</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Breed</Text>
              <Text style={styles.detailValue}>{breed}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Age</Text>
              <Text style={styles.detailValue}>{ageText}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Gender</Text>
              <Text style={styles.detailValue}>{genderText}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fixed</Text>
              <Text style={styles.detailValue}>{fixedText}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.sectionText}>{description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health Info</Text>
            <Text style={styles.sectionText}>{healthInfo}</Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const BG = '#001F22';
const CARD = '#00343A';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },
  headerRow: {
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  imageCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    padding: 8,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  species: {
    fontSize: 14,
    color: '#A7D6D3',
    marginTop: 2,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 16,
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 14,
    color: '#E0F4F3',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#A7D6D3',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
