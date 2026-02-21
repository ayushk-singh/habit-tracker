import { Stack } from "expo-router/stack";

export default function TodayLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Today",
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="add-habit"
        options={{
          presentation: "formSheet",
          title: "New Habit",
          sheetGrabberVisible: true,
          sheetAllowedDetents: [0.75, 1.0],
        }}
      />
    </Stack>
  );
}
