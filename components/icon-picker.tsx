import { HABIT_ICONS } from "@/utils/habits";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";

type Props = {
  selected: string;
  color: string;
  onSelect: (icon: string) => void;
};

export function IconPicker({ selected, color, onSelect }: Props) {
  return (
    <View style={{ gap: 10 }}>
      <Text style={{ fontSize: 15, fontWeight: "600", color: "#666" }}>
        Icon
      </Text>
      <Animated.View
        layout={LinearTransition}
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        {HABIT_ICONS.map((icon, idx) => {
          const isSelected = selected === icon;
          return (
            <Animated.View key={icon} entering={FadeIn.delay(idx * 30)}>
              <Pressable
                onPress={() => {
                  if (process.env.EXPO_OS === "ios") {
                    Haptics.selectionAsync();
                  }
                  onSelect(icon);
                }}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  borderCurve: "continuous",
                  backgroundColor: isSelected ? color + "20" : "#F5F5F5",
                  borderWidth: isSelected ? 2 : 1,
                  borderColor: isSelected ? color : "#E8E8E8",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FontAwesome5
                  name={icon}
                  color={isSelected ? color : "#888"}
                  size={24}
                />
              </Pressable>
            </Animated.View>
          );
        })}
      </Animated.View>
    </View>
  );
}
