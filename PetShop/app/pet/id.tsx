import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PetDetailsScreen() {
  const params = useLocalSearchParams<{
    id: string;
    name?: string;
    species?: string;
    price?: string;
    imageUrl?: string;
  }>();

  const name = params.name ?? 'Animal Name';
  const species = params.species ?? 'Unknown Species';
  const price = params.price ? Number(params.price) : undefined;
  const imageUrl =
    params.imageUrl ??
    'https://images.pexels.com/photos/257540/pexels-photo-257540.jpeg?auto=compress&cs=tinysrgb&w=800';

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
        <View style={{ width: 32 }} />{/* spacer */}
      </View>

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

        <View style={styles.infoRow}>
          <View style={styles.infoChip}>
            <Text style={styles.infoLabel}>Age</Text>
            <Text style={styles.infoValue}>2 years</Text>
          </View>
          <View style={styles.infoChip}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>Female</Text>
          </View>
          <View style={styles.infoChip}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={styles.infoValue}>Available</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.sectionText}>
            {name} is a friendly {species.toLowerCase()} looking for a loving
            home. This is placeholder text—you can connect this screen to your
            database later to show real health info, temperament, and other
            details from your Pet table.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Info</Text>
          <Text style={styles.sectionText}>
            Vaccinations up to date. Spayed / neutered status and any special
            needs can be displayed here.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Adoption Fee</Text>
          <Text style={styles.sectionText}>
            {price !== undefined
              ? `This pet's adoption fee is $${price.toFixed(
                  2
                )}. Fees help cover care, food, and medical costs.`
              : 'Adoption fee will be listed here.'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const BG = '#001F22';
const CARD = '#00343A';
const TEAL = '#00756F';

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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
  },
  infoChip: {
    flex: 1,
    backgroundColor: CARD,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  infoLabel: {
    fontSize: 12,
    color: '#A7D6D3',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
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
});
