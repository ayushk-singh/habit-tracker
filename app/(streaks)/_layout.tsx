import { Stack } from "expo-router/stack";

export default function StreaksLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Streaks",
          headerLargeTitle: true,
        }}
      />
    </Stack>
  );
}
