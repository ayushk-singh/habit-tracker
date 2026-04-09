import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { GoogleGenAI } from "@google/genai";
import { storage } from "@/utils/storage";

// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.EXPO_PUBLIC_GEMINI_KEY,
});

// helper functions
function getDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

function calculateStreak(
  habitId: string,
  completionMap: Record<string, string[]>
): number {
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const key = getDateKey(d);
    const completed = completionMap[key]?.includes(habitId);

    if (completed) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export default function AIScreen() {
  const [messages, setMessages] = useState([
    { id: "1", text: "Hello! Ask me about your habits 👀", sender: "ai" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // get correct data
      const rawHabits = storage.get<any[]>("habits", []);
      const completionMap = storage.get<Record<string, string[]>>(
        "completions",
        {}
      );

      // build enriched habit data
      const habits = rawHabits.map((h) => {
        const streak = calculateStreak(h.id, completionMap);

        const totalCompleted = Object.values(completionMap).filter((ids) =>
          ids.includes(h.id)
        ).length;

        return {
          id: h.id,
          name: h.name,
          streak,
          totalCompleted,
        };
      });

      console.log("AI HABITS:", habits);

      //  format for AI
      const formattedHabits =
        habits.length > 0
          ? habits
              .map(
                (h) =>
                  `- ${h.name}: ${h.totalCompleted} days completed, current streak ${h.streak} days`
              )
              .join("\n")
          : "No habits found.";

      const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const key = getDateKey(d);
        const count = completionMap[key]?.length || 0;
        return `${key}: ${count} habits done`;
      });

      const prompt = `
You are an AI assistant inside a habit tracker app.

STRICT RULES:
- Only answer questions related to habits, routines, productivity, or goals
- If unrelated, reply: "I'm here to help with your habits only 😊"
- Keep answers short and helpful
- Use streak + completion data for insights

USER HABITS:
${formattedHabits}

RECENT ACTIVITY (last 7 days):
${last7Days.join("\n")}

USER QUESTION:
${userMessage.text}
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
      });

      const aiMessage = {
        id: Date.now().toString() + "ai",
        text: response.text || "No response",
        sender: "ai",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI ERROR:", error);

      const errorMessage = {
        id: Date.now().toString() + "err",
        text: "Something went wrong. Please try again.",
        sender: "ai",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: any) => {
    const isUser = item.sender === "user";

    return (
      <View
        style={{
          alignSelf: isUser ? "flex-end" : "flex-start",
          backgroundColor: isUser ? "#FF6B35" : "#E5E5EA",
          padding: 10,
          borderRadius: 16,
          marginVertical: 4,
          maxWidth: "80%",
          marginHorizontal: 10,
        }}
      >
        <Text style={{ color: isUser ? "white" : "black" }}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F7F7F7" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{ paddingVertical: 10 }}
      />

      {loading && (
        <View style={{ padding: 10 }}>
          <ActivityIndicator size="small" />
        </View>
      )}

      <View
        style={{
          flexDirection: "row",
          padding: 10,
          borderTopWidth: 1,
          borderColor: "#ddd",
          backgroundColor: "white",
        }}
      >
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask about your habits..."
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 20,
            paddingHorizontal: 15,
            paddingVertical: 8,
            marginRight: 10,
          }}
        />

        <TouchableOpacity
          onPress={handleSend}
          style={{
            backgroundColor: "#FF6B35",
            borderRadius: 20,
            paddingHorizontal: 16,
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}