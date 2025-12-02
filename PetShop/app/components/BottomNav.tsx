import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

type Props = {
  active: 'profile' | 'home' | 'cart';
};

export default function BottomNav({ active }: Props) {
  const insets = useSafeAreaInsets();

  const iconColor = (key: Props['active']) =>
    active === key ? '#FFFFFF' : '#003A3A';

  const bottomPadding = (insets.bottom || 0) + 8;

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: bottomPadding,
          height: 60 + bottomPadding,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.iconWrapper}
        activeOpacity={0.7}
        onPress={() => router.push('/profile')}
      >
        <Ionicons name="person-outline" size={30} color={iconColor('profile')} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconWrapper}
        activeOpacity={0.7}
        onPress={() => router.push('/home')}
      >
        <Ionicons name="home" size={32} color={iconColor('home')} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconWrapper}
        activeOpacity={0.7}
        onPress={() => router.push('/cart')}
      >
        <Ionicons name="cart-outline" size={30} color={iconColor('cart')} />
      </TouchableOpacity>
    </View>
  );
}

const TEAL = '#00756F';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: TEAL,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#003A3A',
    zIndex: 10,
    elevation: 10,
  },
  iconWrapper: {
    padding: 9,
  },
});
