import { SplashScreen, Stack } from "expo-router";
import "@/global.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { View, Text } from 'react-native';
import { ClerkProvider } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';

// Read publishable key; do not throw at module init to avoid crashing the app.
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}


export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'sans-regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf')
  });

  // Prevent auto-hide when component mounts and hide when fonts are ready
  useEffect(() => {
    let mounted = true;
    (async () => {
      await SplashScreen.preventAutoHideAsync();

      if (mounted && fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    })();

    return () => {
      mounted = false;
    };
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff9e3' }} />
    );
  }

  if (!publishableKey) {
    // Render a helpful error screen instead of crashing to white screen
    return (
      <View className="auth-safe-area">
        <View className="auth-content">
          <View className="auth-card">
            <Text className="auth-title">Configuration error</Text>
            <Text className="auth-subtitle">Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add it to your .env or app config and restart the bundler.</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Stack screenOptions={{ headerShown: false }} />
    </ClerkProvider>
  );
}
