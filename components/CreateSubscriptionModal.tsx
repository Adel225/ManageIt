import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { clsx } from "clsx";
import dayjs from "dayjs";

import { icons } from "@/constants/icons";

const CATEGORY_OPTIONS = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
] as const;

type BillingFrequency = "Monthly" | "Yearly";
type CategoryOption = (typeof CATEGORY_OPTIONS)[number];

const CATEGORY_COLOR_MAP: Record<CategoryOption, string> = {
  Entertainment: "#ffd8a8",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#f5c542",
  Productivity: "#cdeac0",
  Cloud: "#cfe8ff",
  Music: "#d7f5d1",
  Other: "#e5e7eb",
};

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (subscription: Subscription) => void;
}

const CreateSubscriptionModal = ({
  visible,
  onClose,
  onCreate,
}: CreateSubscriptionModalProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<BillingFrequency>("Monthly");
  const [category, setCategory] = useState<CategoryOption>("Other");
  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");

  const parsedPrice = useMemo(() => Number(price), [price]);
  const isSubmitDisabled = !name.trim() || !Number.isFinite(parsedPrice) || parsedPrice <= 0;

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Other");
    setNameError("");
    setPriceError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    const trimmedName = name.trim();
    let hasError = false;

    if (!trimmedName) {
      setNameError("Name is required");
      hasError = true;
    } else {
      setNameError("");
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setPriceError("Price must be greater than 0");
      hasError = true;
    } else {
      setPriceError("");
    }

    if (hasError) return;

    const startDate = dayjs();
    const renewalDate =
      frequency === "Monthly"
        ? startDate.add(1, "month").toISOString()
        : startDate.add(1, "year").toISOString();

    onCreate({
      id: `${trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      name: trimmedName,
      price: parsedPrice,
      frequency,
      category,
      status: "active",
      startDate: startDate.toISOString(),
      renewalDate,
      icon: icons.wallet,
      billing: frequency,
      color: CATEGORY_COLOR_MAP[category],
      currency: "USD",
      plan: `${frequency} Plan`,
    });

    resetForm();
    onClose();
  };

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={handleClose}>
      <Pressable className="modal-overlay" onPress={handleClose}>
        <Pressable className="modal-container" onPress={(event) => event.stopPropagation()}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable className="modal-close" onPress={handleClose}>
                <Text className="modal-close-text">×</Text>
              </Pressable>
            </View>

            <View className="modal-body">
              <View className="auth-field">
                <Text className="auth-label">Name</Text>
                <TextInput
                  className={clsx("auth-input", nameError && "auth-input-error")}
                  placeholder="e.g. Notion"
                  placeholderTextColor="rgba(0,0,0,0.5)"
                  value={name}
                  onChangeText={setName}
                />
                {!!nameError && <Text className="auth-error">{nameError}</Text>}
              </View>

              <View className="auth-field">
                <Text className="auth-label">Price</Text>
                <TextInput
                  className={clsx("auth-input", priceError && "auth-input-error")}
                  placeholder="e.g. 9.99"
                  placeholderTextColor="rgba(0,0,0,0.5)"
                  keyboardType="decimal-pad"
                  value={price}
                  onChangeText={setPrice}
                />
                {!!priceError && <Text className="auth-error">{priceError}</Text>}
              </View>

              <View className="auth-field">
                <Text className="auth-label">Frequency</Text>
                <View className="picker-row">
                  {(["Monthly", "Yearly"] as const).map((option) => {
                    const isActive = frequency === option;
                    return (
                      <Pressable
                        key={option}
                        onPress={() => setFrequency(option)}
                        className={clsx("picker-option", isActive && "picker-option-active")}
                      >
                        <Text
                          className={clsx(
                            "picker-option-text",
                            isActive && "picker-option-text-active"
                          )}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Category</Text>
                <View className="category-scroll">
                  {CATEGORY_OPTIONS.map((option) => {
                    const isActive = category === option;
                    return (
                      <Pressable
                        key={option}
                        className={clsx("category-chip", isActive && "category-chip-active")}
                        onPress={() => setCategory(option)}
                      >
                        <Text
                          className={clsx(
                            "category-chip-text",
                            isActive && "category-chip-text-active"
                          )}
                        >
                          {option}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <Pressable
                className={clsx("auth-button", isSubmitDisabled && "auth-button-disabled")}
                disabled={isSubmitDisabled}
                onPress={handleSubmit}
              >
                <Text className="auth-button-text">Create Subscription</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default CreateSubscriptionModal;
