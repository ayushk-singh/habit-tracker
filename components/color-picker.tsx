import { HABIT_COLORS } from "@/utils/habits";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

type Props = {
  selected: string;
  onSelect: (color: string) => void;
};

export function ColorPicker({ selected, onSelect }: Props) {
  return (
    <View style={{ gap: 10 }}>
      <Text style={{ fontSize: 15, fontWeight: "600", color: "#666" }}>
        Color
      </Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        {HABIT_COLORS.map((color, idx) => {
          const isSelected = selected === color;
          return (
            <Animated.View key={color} entering={FadeIn.delay(idx * 30)}>
              <Pressable
                onPress={() => {
                  if (process.env.EXPO_OS === "ios") {
                    Haptics.selectionAsync();
                  }
                  onSelect(color);
                }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: color,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: isSelected ? 3 : 0,
                  borderColor: "#FFFFFF",
                  boxShadow: isSelected
                    ? `0 0 0 2px ${color}`
                    : "0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                {isSelected && (
                  <Feather name="check" color="#FFFFFF" size={18} />
                )}
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}
