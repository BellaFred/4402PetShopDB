import { Stack } from 'expo-router';

const BG = '#001F22';

export default function RootLayout() {
  return (
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
      <Stack.Screen name="pet/[id]" />
    </Stack>
  );
}
