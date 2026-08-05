import "@/global.css"
import { Link } from "expo-router";
import { Text, StatusBar } from "react-native";
import { SafeAreaView as FuckMeHard } from "react-native-safe-area-context";
import { styled } from "nativewind"
const SafeAreaView = styled(FuckMeHard);


export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <StatusBar barStyle="dark-content" /> 
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link href="/onboarding" className="mt-4 rounded bg-primary text-white p-4">Go to OnBoarding</Link>
      <Link href="/(auth)/sign-in" className="mt-4 rounded bg-primary text-white p-4">Go to sign in</Link>
      <Link href="/(auth)/sign-up" className="mt-4 rounded bg-primary text-white p-4">Go to sign up</Link>
      <Link href="/subscriptions/spotify" className="mt-4 rounded bg-primary text-white p-4">Spotify subscription</Link>
      <Link href={{
        pathname: "/subscriptions/[id]",
        params: { id: "claude" }
      }} className="mt-4 rounded bg-primary text-white p-4">
        Claude Max Subscription
      </Link>
    </SafeAreaView>
  );
}