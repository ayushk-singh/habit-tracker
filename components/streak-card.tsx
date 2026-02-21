import type { CompletionMap, Habit } from "@/utils/habits";
import { getDateKey } from "@/utils/habits";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

type Props = {
  habit: Habit;
  completions: CompletionMap;
  index: number;
};

function calculateStreak(habitId: string, completions: CompletionMap): number {
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = getDateKey(d);
    if (completions[key]?.includes(habitId)) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

export function StreakCard({ habit, completions, index }: Props) {
  const streak = calculateStreak(habit.id, completions);

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80).springify()}
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        borderRadius: 14,
        borderCurve: "continuous",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#EEEEEE",
        gap: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          borderCurve: "continuous",
          backgroundColor: habit.color + "18",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FontAwesome5 name={habit.icon as any} color={habit.color} size={20} />
      </View>

      <Text
        style={{
          flex: 1,
          fontSize: 16,
          fontWeight: "500",
          color: "#1a1a1a",
        }}
      >
        {habit.name}
      </Text>

      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "700",
            color: streak > 0 ? habit.color : "#CCC",
            fontVariant: ["tabular-nums"],
          }}
        >
          {streak}
        </Text>
        <Text style={{ fontSize: 11, color: "#999", fontWeight: "500" }}>
          {streak === 1 ? "day" : "days"}
        </Text>
      </View>

      {streak >= 7 && <FontAwesome5 name="fire" color="#FF6B35" size={20} />}
    </Animated.View>
  );
}
