import { Label } from "@/.expo/types/router";
import {
  NativeTabs
} from "expo-router/unstable-native-tabs";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

export const unstable_settings = {
  anchor: "(home)",
};

export default function RootLayout() {
  return (
    <>
      <NativeTabs>
        <NativeTabs.Trigger name="(home)">
          <NativeTabs.Trigger.Label>Today</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon md="calendar_today" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="(streaks)">
          <NativeTabs.Trigger.Label>Streaks</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon md="mode_heat" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="(ai)">
          <NativeTabs.Trigger.Label>AI Insight</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon md="smart_toy" />
        </NativeTabs.Trigger>
      </NativeTabs>
      <StatusBar style="auto" />
    </>
  );
}
