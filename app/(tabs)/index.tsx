import "@/global.css"
import { Text, StatusBar, View, Image, FlatList, ScrollView, Pressable } from "react-native";
import { SafeAreaView as FuckMeHard } from "react-native-safe-area-context";
import { styled } from "nativewind"
import images from "@/constants/images";
import { HOME_BALANCE, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import ListHeading from "@/components/listheading";
import UpcommingSubCard from "@/components/upCommingSubCard";
import SubCard from "@/components/SubCard";
import { useState } from "react";
import { useUser } from '@clerk/expo';
import { usePostHog } from 'posthog-react-native';
import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import { useSubscriptionStore } from "@/lib/subscriptionStore";
const SafeAreaView = styled(FuckMeHard);


export default function App() {
  const { user } = useUser();
  const posthog = usePostHog();
  const [expandedSubId, setExpandedSubId] = useState<string | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const { subscriptions, addSubscription } = useSubscriptionStore();

  const displayName = user?.firstName || user?.fullName || user?.primaryEmailAddress?.emailAddress || 'User';

  const handleSubscriptionDetailsToggle = (subscriptionId: string) => {
    const isExpanded = expandedSubId !== subscriptionId;
    posthog.capture('subscription_details_toggled', {
      is_expanded: isExpanded,
    });
    setExpandedSubId(isExpanded ? subscriptionId : null);
  };

  const handleCreateSubscription = (newSubscription: Subscription) => {
    addSubscription(newSubscription);
    setExpandedSubId(newSubscription.id);
  };

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

          <Pressable onPress={() => setIsCreateModalVisible(true)}>
            <Image className="home-add-icon" source={icons.add} />
          </Pressable>
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
          {subscriptions.length === 0 ? (
            <Text className="home-empty-state">No existing subscriptions</Text>
          ) : (
            <FlatList
              data={subscriptions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <SubCard
                  {...item}
                  expanded={expandedSubId === item.id}
                  onPress={() => handleSubscriptionDetailsToggle(item.id)}
                />
              )}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View className="h-4" />}
            />
          )}
        </View>

      </ScrollView>

      <CreateSubscriptionModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onCreate={handleCreateSubscription}
      />

    </SafeAreaView>
  );
}