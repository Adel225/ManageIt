import { SplashScreen, Stack } from "expo-router";
import "@/global.css";
import { useFonts } from "expo-font";
import { useEffect, useRef, type ReactNode } from "react";
import { View, Text } from 'react-native';
import { ClerkProvider, useUser } from '@clerk/expo';
import { tokenCache } from '@clerk/expo/token-cache';
import { PostHogErrorBoundary, PostHogProvider, usePostHog } from 'posthog-react-native';
import { posthog } from '@/lib/posthog';

void SplashScreen.preventAutoHideAsync();

// Read publishable key; do not throw at module init to avoid crashing the app.
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

function RootErrorFallback() {
  return <View style={{ flex: 1, backgroundColor: '#fff9e3' }} />;
}

function PostHogIdentity({ children }: { children: ReactNode }) {
  const posthogClient = usePostHog();
  const { isLoaded, user } = useUser();
  const previousUserId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const currentUserId = user?.id ?? null;
    if (previousUserId.current === currentUserId) {
      return;
    }

    // Prevent identity merging after sign-out or an account switch.
    if (previousUserId.current) {
      posthogClient.reset();
    }

    if (user) {
      posthogClient.identify(user.id, {
        $set: {
          ...(user.primaryEmailAddress?.emailAddress && {
            email: user.primaryEmailAddress.emailAddress,
          }),
          ...(user.firstName && { first_name: user.firstName }),
          ...(user.lastName && { last_name: user.lastName }),
        },
      });
    }

    previousUserId.current = currentUserId;
  }, [isLoaded, posthogClient, user]);

  return <>{children}</>;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'sans-regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf')
  });

  // Hide splash once font loading has either succeeded or failed.
  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff9e3' }} />
    );
  }

  if (!publishableKey) {
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

  const content = <Stack screenOptions={{ headerShown: false }} />;

  const posthogContent = posthog ? (
    <PostHogProvider client={posthog}>
      <PostHogIdentity>
        <PostHogErrorBoundary fallback={RootErrorFallback}>
          {content}
        </PostHogErrorBoundary>
      </PostHogIdentity>
    </PostHogProvider>
  ) : (
    content
  );

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      {posthogContent}
    </ClerkProvider>
  );
}
