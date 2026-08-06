import "@/global.css"
import { Text, StatusBar, View, Image, FlatList, ScrollView } from "react-native";
import { SafeAreaView as FuckMeHard } from "react-native-safe-area-context";
import { styled } from "nativewind"
import images from "@/constants/images";
import { HOME_BALANCE, HOME_SUBSCRIPTIONS, HOME_USER, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import ListHeading from "@/components/listheading";
import UpcommingSubCard from "@/components/upCommingSubCard";
import SubCard from "@/components/SubCard";
import { useState } from "react";
import { useUser } from '@clerk/expo';
const SafeAreaView = styled(FuckMeHard);


export default function App() {
  const { user } = useUser();
  const [expandedSubId, setExpandedSubId] = useState<string | null>(null);

  const displayName = user?.firstName || user?.fullName || user?.emailAddresses[0]?.emailAddress || 'User';

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <StatusBar barStyle="dark-content" /> 

      <ScrollView className="flex-1"showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View className="home-header" >
          <View className="home-user" >
            <Image source={images.avatar} className="home-avatar" />
            <Text className="home-user-name">{displayName.split('@')[0]}</Text>
          </View>

          <Image className="home-add-icon" source={icons.add} />
        </View>

        {/* Balance Card */}
        <View className="home-balance-card">
          <Text className="home-balance-label">Balance</Text>
          <View className="home-balance-row">
            <Text className="home-balance-amount">{formatCurrency(HOME_BALANCE.amount)}</Text>
            <Text className="home-balance-date"> {dayjs(HOME_BALANCE.nextRenewalDate).format('MM/DD')} </Text>
          </View>
        </View>

        {/* Horizontal Upcoming Subscriptions List */}
        <View>
          <ListHeading title="Upcoming" />
          <FlatList 
            data={UPCOMING_SUBSCRIPTIONS} 
            renderItem={({ item })  => (<UpcommingSubCard {...item} />)}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={<Text className="home-empty-state">No Upcoming subscriptions</Text>}
            />
        </View>

        {/* All Subscriptions List mapped directly inside ScrollView */}
        <View className="pb-20">
          <ListHeading title="All Subscriptions" />
          {HOME_SUBSCRIPTIONS.length === 0 ? (
            <Text className="home-empty-state">No existing subscriptions</Text>
          ) : (
            <View className="gap-y-4">
              {HOME_SUBSCRIPTIONS.map((item) => (
                <SubCard 
                  key={item.id}
                  {...item} 
                  expanded={expandedSubId === item.id} 
                  onPress={() => setExpandedSubId((currentId) => (currentId === item.id ? null : item.id))} 
                />
              ))}
            </View>
          )}
        </View>

      </ScrollView>

    </SafeAreaView>
  );
}