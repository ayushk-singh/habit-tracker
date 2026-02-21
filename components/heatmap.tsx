import { Text, View, useWindowDimensions } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { getLast49Days, getDateKey, type CompletionMap } from "@/utils/habits";

type Props = {
  completions: CompletionMap;
  totalHabits: number;
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getIntensity(
  completedCount: number,
  totalHabits: number
): { bg: string; border: string } {
  if (totalHabits === 0 || completedCount === 0) {
    return { bg: "#F0F0F0", border: "#E0E0E0" };
  }
  const ratio = completedCount / totalHabits;
  if (ratio >= 1) return { bg: "#22C55E", border: "#16A34A" };
  if (ratio >= 0.75) return { bg: "#4ADE80", border: "#22C55E" };
  if (ratio >= 0.5) return { bg: "#86EFAC", border: "#4ADE80" };
  if (ratio >= 0.25) return { bg: "#BBF7D0", border: "#86EFAC" };
  return { bg: "#DCFCE7", border: "#BBF7D0" };
}

export function Heatmap({ completions, totalHabits }: Props) {
  const { width } = useWindowDimensions();
  const days = getLast49Days();

  // Group into weeks (columns)
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const labelWidth = 32;
  // 20px screen padding each side (40) + 16px card padding each side (32) = 72
  const horizontalPadding = 72;
  const availableWidth = width - horizontalPadding - labelWidth;
  const gap = 3;
  const cellSize = Math.floor((availableWidth - gap * (weeks.length - 1)) / weeks.length);

  return (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: "row", gap }}>
        {/* Weekday labels */}
        <View style={{ width: labelWidth, gap, justifyContent: "flex-start" }}>
          {WEEKDAYS.map((day, i) => (
            <View
              key={day}
              style={{
                height: cellSize,
                justifyContent: "center",
              }}
            >
              {i % 2 === 0 ? (
                <Text
                  style={{
                    fontSize: 11,
                    color: "#999",
                    fontWeight: "500",
                  }}
                >
                  {day}
                </Text>
              ) : null}
            </View>
          ))}
        </View>

        {/* Grid */}
        {weeks.map((week, weekIdx) => (
          <View key={weekIdx} style={{ gap }}>
            {week.map((day, dayIdx) => {
              const dateKey = getDateKey(day);
              const count = completions[dateKey]?.length ?? 0;
              const { bg, border } = getIntensity(count, totalHabits);
              const isToday =
                getDateKey(new Date()) === dateKey;

              return (
                <Animated.View
                  key={dateKey}
                  entering={FadeIn.delay((weekIdx * 7 + dayIdx) * 15)}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    borderRadius: 4,
                    borderCurve: "continuous",
                    backgroundColor: bg,
                    borderWidth: isToday ? 2 : 1,
                    borderColor: isToday ? "#3B82F6" : border,
                  }}
                />
              );
            })}
          </View>
        ))}
      </View>

      {/* Legend */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <Text style={{ fontSize: 12, color: "#999" }}>Less</Text>
        {[
          "#F0F0F0",
          "#DCFCE7",
          "#BBF7D0",
          "#86EFAC",
          "#4ADE80",
          "#22C55E",
        ].map((color) => (
          <View
            key={color}
            style={{
              width: 14,
              height: 14,
              borderRadius: 3,
              borderCurve: "continuous",
              backgroundColor: color,
            }}
          />
        ))}
        <Text style={{ fontSize: 12, color: "#999" }}>More</Text>
      </View>
    </View>
  );
}
