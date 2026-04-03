import { Stack } from "expo-router/stack";

export default function AIScreenLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "AI Insights",
          headerLargeTitle: true,
        }}
      />
    </Stack>
  );
}
