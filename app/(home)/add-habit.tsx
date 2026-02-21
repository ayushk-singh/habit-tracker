import { ColorPicker } from "@/components/color-picker";
import { IconPicker } from "@/components/icon-picker";
import { useStorage } from "@/hooks/use-storage";
import {
  HABIT_COLORS,
  HABIT_ICONS,
  generateId,
  type Habit,
} from "@/utils/habits";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function AddHabitScreen() {
  const [habits, setHabits] = useStorage<Habit[]>("habits", []);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<string>(HABIT_ICONS[0]);
  const [color, setColor] = useState<string>(HABIT_COLORS[0]);

  const canSave = name.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;

    if (process.env.EXPO_OS === "ios") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    const newHabit: Habit = {
      id: generateId(),
      name: name.trim(),
      icon,
      color,
      createdAt: new Date().toISOString(),
    };

    setHabits((prev) => [...prev, newHabit]);
    router.back();
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
      contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 100 }}
    >
      {/* Name Input */}
      <Animated.View entering={FadeInDown.duration(300)} style={{ gap: 10 }}>
        <Text style={{ fontSize: 15, fontWeight: "600", color: "#666" }}>
          Habit Name
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Morning Run, Read 30 min..."
          placeholderTextColor="#BBB"
          autoFocus
          style={{
            fontSize: 17,
            padding: 16,
            borderRadius: 14,
            borderCurve: "continuous",
            backgroundColor: "#FFFFFF",
            borderWidth: 1,
            borderColor: "#E8E8E8",
            color: "#1a1a1a",
          }}
        />
      </Animated.View>

      {/* Icon Picker */}
      <Animated.View entering={FadeInDown.duration(300).delay(100)}>
        <IconPicker selected={icon} color={color} onSelect={setIcon} />
      </Animated.View>

      {/* Color Picker */}
      <Animated.View entering={FadeInDown.duration(300).delay(200)}>
        <ColorPicker selected={color} onSelect={setColor} />
      </Animated.View>

      {/* Preview */}
      <Animated.View
        entering={FadeInDown.duration(300).delay(300)}
        style={{ gap: 10 }}
      >
        <Text style={{ fontSize: 15, fontWeight: "600", color: "#666" }}>
          Preview
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            borderRadius: 16,
            borderCurve: "continuous",
            backgroundColor: color + "12",
            borderWidth: 1.5,
            borderColor: color + "40",
            gap: 14,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              borderCurve: "continuous",
              backgroundColor: color + "25",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesome5 name={icon as any} color={color} size={22} />
          </View>
          <Text
            style={{
              flex: 1,
              fontSize: 17,
              fontWeight: "600",
              color: "#1a1a1a",
            }}
          >
            {name || "Habit Name"}
          </Text>
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              borderWidth: 2,
              borderColor: color,
            }}
          />
        </View>
      </Animated.View>

      {/* Save Button */}
      <Animated.View entering={FadeInDown.duration(300).delay(400)}>
        <Pressable
          onPress={handleSave}
          disabled={!canSave}
          style={{
            paddingVertical: 16,
            borderRadius: 14,
            borderCurve: "continuous",
            backgroundColor: canSave ? color : "#E0E0E0",
            alignItems: "center",
            boxShadow: canSave ? `0 4px 12px ${color}40` : "none",
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: "700",
              color: canSave ? "#FFFFFF" : "#AAA",
            }}
          >
            Add Habit
          </Text>
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}
