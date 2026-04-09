import type { Habit } from "@/utils/habits";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type Props = {
  habit: Habit;
  completed: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function HabitCard({ habit, completed, onToggle, onDelete }: Props) {
  const scale = useSharedValue(1);
  const checkScale = useSharedValue(completed ? 1 : 0);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  const handlePress = () => {
    if (process.env.EXPO_OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const smooth = Easing.out(Easing.cubic);

    scale.value = withSequence(
      withTiming(0.97, { duration: 120, easing: smooth }),
      withTiming(1, { duration: 200, easing: smooth }),
    );

    if (!completed) {
      checkScale.value = withSequence(
        withTiming(1.1, { duration: 150, easing: smooth }),
        withTiming(1, { duration: 150, easing: smooth }),
      );
    } else {
      checkScale.value = withTiming(0, { duration: 150, easing: smooth });
    }

    onToggle();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      entering={FadeIn.duration(300)}
      layout={LinearTransition}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          borderRadius: 16,
          borderCurve: "continuous",
          backgroundColor: completed ? habit.color + "15" : "#FFFFFF",
          borderWidth: 1.5,
          borderColor: completed ? habit.color : "#E8E8E8",
          gap: 14,
          boxShadow: completed
            ? `0 4px 12px ${habit.color}25`
            : "0 1px 3px rgba(0,0,0,0.06)",
        },
        containerStyle,
      ]}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          borderCurve: "continuous",
          backgroundColor: habit.color + "20",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FontAwesome5 name={habit.icon as any} color={habit.color} size={22} />
      </View>

      <Text
        style={{
          flex: 1,
          fontSize: 17,
          fontWeight: "600",
          color: completed ? habit.color : "#1a1a1a",
          textDecorationLine: completed ? "line-through" : "none",
        }}
      >
        {habit.name}
      </Text>

      <View
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          borderWidth: 2,
          borderColor: completed ? habit.color : "#D0D0D0",
          backgroundColor: completed ? habit.color : "transparent",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Animated.View style={checkStyle}>
          <FontAwesome5 name="check" color="#FFFFFF" size={14} />
        </Animated.View>
      </View>

      <Pressable
        onPress={onDelete}
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: "#FF6B6B",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FontAwesome5 name="trash" color="#FFFFFF" size={12} />
      </Pressable>
    </AnimatedPressable>
  );
}
