import { Stack } from 'expo-router';
import { UserProvider } from './context/userContext';
import { CartProvider } from './context/cartContext';

const BG = '#001F22';

export default function RootLayout() {
  return (
    <UserProvider>
      <CartProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: BG },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="login" />
          <Stack.Screen name="home" />
          <Stack.Screen name="cart" />
          <Stack.Screen name="payment" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="pet/[id]" />
          <Stack.Screen name="change-password" />
        </Stack>
      </CartProvider>
    </UserProvider>
  );
}
