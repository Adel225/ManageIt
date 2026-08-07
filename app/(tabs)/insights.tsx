import "@/global.css";
import React, { useMemo, useState } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import dayjs from "dayjs";
import clsx from "clsx";
import { useRouter } from "expo-router";
import SubCard from "@/components/SubCard";
import { formatCurrency } from "@/lib/utils";
import { useSubscriptionStore } from "@/lib/subscriptionStore";
import ListHeading from "@/components/listheading";

const SafeAreaView = styled(RNSafeAreaView);

const WEEK_DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Insights = () => {
  const [expandedSubId, setExpandedSubId] = useState<string | null>(null);
  const { subscriptions } = useSubscriptionStore();

  const startOfWeek = dayjs().startOf("week");
  const endOfWeek = dayjs().endOf("week");

  const weeklyData = useMemo(() => {
    const dayTotals = WEEK_DAY_LABELS.map((label, dayIndex) => {
      const total = subscriptions.reduce((sum, subscription) => {
        if (!subscription.renewalDate) return sum;
        const renewal = dayjs(subscription.renewalDate);
        if (!renewal.isValid()) return sum;
        return renewal.day() === dayIndex ? sum + subscription.price : sum;
      }, 0);

      return {
        label,
        total,
      };
    });

    const maxTotal = Math.max(...dayTotals.map((item) => item.total), 1);

    return dayTotals.map((item) => ({
      ...item,
      heightPercent: Math.max((item.total / maxTotal) * 100, item.total > 0 ? 12 : 4),
    }));
  }, [subscriptions]);

  const monthlyExpenses = useMemo(() => {
    const now = dayjs();
    const endOfMonth = now.endOf("month");

    return subscriptions.reduce((sum, subscription) => {
      const status = subscription.status?.toLowerCase();
      if (status === "cancelled" || status === "paused") return sum;

      const billingLabel = (subscription.billing || subscription.frequency || "").toLowerCase();
      const isYearly = billingLabel.includes("year");
      const isMonthly = billingLabel.includes("month");

      const anchorDateValue = subscription.startDate || subscription.renewalDate;
      const anchorDate = anchorDateValue ? dayjs(anchorDateValue) : null;

      if (anchorDate && (!anchorDate.isValid() || anchorDate.isAfter(endOfMonth))) return sum;

      if (isMonthly) return sum + subscription.price;
      if (isYearly && anchorDate && anchorDate.month() === now.month()) return sum + subscription.price;

      return sum;
    }, 0);
  }, [subscriptions]);

  return (
    <SafeAreaView className="auth-safe-area">
      <ScrollView className="auth-scroll" showsVerticalScrollIndicator={false}>
        <View className="auth-content">
          <View className="auth-card">
            <Text className="list-title">Upcoming</Text>
            <Text className="auth-helper mt-2">
              {startOfWeek.format("MMM D")} - {endOfWeek.format("MMM D, YYYY")}
            </Text>

            <View className="mt-5 h-60 flex-row items-end justify-between rounded-2xl border border-border bg-background px-3 pb-4 pt-14">
              {weeklyData.map((item) => (
                <View key={item.label} className="w-9 items-center justify-end">
                  <Text className="mb-1 text-xs font-sans-semibold text-primary">
                    {item.total > 0 ? formatCurrency(item.total, "USD") : "$0.00"}
                  </Text>
                  <View
                    className={clsx(
                      "w-7 rounded-t-xl",
                      item.total > 0 ? "bg-accent" : "bg-muted",
                    )}
                    style={{ height: `${item.heightPercent}%` }}
                  />
                  <Text className="mt-2 text-xs font-sans-semibold text-muted-foreground">
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="auth-card flex-row items-center justify-between">
            <View>
              <Text className="list-title">Expenses</Text>
              <Text className="auth-helper mt-2">{dayjs().format("MMMM YYYY")}</Text>
            </View>
            <Text className="text-4xl font-sans-extrabold text-primary">
              {formatCurrency(monthlyExpenses, "USD")}
            </Text>
          </View>

          <View className="pb-20">
            <ListHeading title="History" />

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
                    onPress={() =>
                      setExpandedSubId((current) => (current === item.id ? null : item.id))
                    }
                  />
                )}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View className="h-4" />}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Insights;