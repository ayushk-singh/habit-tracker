import { HabitCard } from "@/components/habit-card";
import { useStorage } from "@/hooks/use-storage";
import { getTodayKey, type CompletionMap, type Habit } from "@/utils/habits";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Link } from "expo-router";
import { Stack } from "expo-router/stack";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  LinearTransition,
} from "react-native-reanimated";

export default function TodayScreen() {
  const [habits, setHabits] = useStorage<Habit[]>("habits", []);
  const [completions, setCompletions] = useStorage<CompletionMap>(
    "completions",
    {},
  );

  const todayKey = getTodayKey();
  const todayCompletions = completions[todayKey] ?? [];
  const completedCount = todayCompletions.length;
  const totalCount = habits.length;

  const toggleHabit = (habitId: string) => {
    setCompletions((prev) => {
      const dayCompletions = prev[todayKey] ?? [];
      const isCompleted = dayCompletions.includes(habitId);
      return {
        ...prev,
        [todayKey]: isCompleted
          ? dayCompletions.filter((id) => id !== habitId)
          : [...dayCompletions, habitId],
      };
    });
  };

  const deleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== habitId));
    setCompletions((prev) => {
      const newCompletions: CompletionMap = {};
      for (const date in prev) {
        newCompletions[date] = prev[date].filter((id) => id !== habitId);
      }
      return newCompletions;
    });
  };

  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Link href="/add-habit" asChild>
              <Pressable style={{ paddingLeft: 8, paddingTop: 2 }}>
                <FontAwesome5 name="plus" size={18} color="#3B82F6" />
              </Pressable>
            </Link>
          ),
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 100 }}
      >
        {/* Progress Summary */}
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={{
            padding: 20,
            borderRadius: 20,
            borderCurve: "continuous",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            gap: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "600", color: "#666" }}>
              Today&apos;s Progress
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "700",
                color: progress === 1 ? "#22C55E" : "#3B82F6",
                fontVariant: ["tabular-nums"],
              }}
            >
              {completedCount}/{totalCount}
            </Text>
          </View>

          {/* Progress bar */}
          <View
            style={{
              height: 10,
              borderRadius: 5,
              backgroundColor: "#F0F0F0",
              overflow: "hidden",
            }}
          >
            <Animated.View
              layout={LinearTransition.springify().damping(25).stiffness(150)}
              style={{
                height: "100%",
                width: `${progress * 100}%`,
                borderRadius: 5,
                backgroundColor: progress === 1 ? "#22C55E" : "#3B82F6",
              }}
            />
          </View>

          {progress === 1 && totalCount > 0 && (
            <Text
              style={{
                textAlign: "center",
                fontSize: 14,
                color: "#22C55E",
                fontWeight: "600",
              }}
            >
              All habits completed! Great job!
            </Text>
          )}
        </Animated.View>

        {/* Habit List */}
        {habits.length === 0 ? (
          <Animated.View
            entering={FadeInDown.delay(200)}
            style={{
              alignItems: "center",
              paddingTop: 60,
              gap: 16,
            }}
          >
            <FontAwesome5 name="plus-circle" size={56} color="#CCC" />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#999",
                textAlign: "center",
              }}
            >
              No habits yet
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: "#BBB",
                textAlign: "center",
                maxWidth: 250,
              }}
            >
              Tap the + button to create your first habit
            </Text>
          </Animated.View>
        ) : (
          <View style={{ gap: 10 }}>
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                completed={todayCompletions.includes(habit.id)}
                onToggle={() => toggleHabit(habit.id)}
                onDelete={() => deleteHabit(habit.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
}
