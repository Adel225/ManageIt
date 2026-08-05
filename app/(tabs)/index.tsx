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

      <Text className="text-5xl font-sans-extrabold">Home</Text>

      <Link href="/onboarding" className="mt-4 font-sans-bold rounded bg-primary text-white p-4">Go to OnBoarding</Link>
      <Link href="/(auth)/sign-in" className="mt-4 font-sans-bold rounded bg-primary text-white p-4">Go to sign in</Link>
      <Link href="/(auth)/sign-up" className="mt-4 font-sans-bold rounded bg-primary text-white p-4">Go to sign up</Link>
      
    </SafeAreaView>
  );
}