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

type Habit = {
  id: string;
  name: string;
  completedDates: string[];
};

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
      // ✅ Get & normalize habits (CRASH-PROOF)
      const rawHabits = storage.get<any[]>("habits", []);

      const habits: Habit[] = rawHabits.map((h) => ({
        id: h?.id ?? Date.now().toString(),
        name: h?.name ?? "Unnamed habit",
        completedDates: Array.isArray(h?.completedDates)
          ? h.completedDates
          : [],
      }));

      console.log(habits)

      // ✅ Format habits safely
      const formattedHabits =
        habits.length > 0
          ? habits
              .map((h) => {
                const completed = h.completedDates.length;
                return `- ${h.name}: ${completed} days completed`;
              })
              .join("\n")
          : "No habits found.";

      // ✅ AI prompt
      const prompt = `
You are an AI assistant inside a habit tracker app.

STRICT RULES:
- Only answer questions related to habits, routines, productivity, or goals
- If the question is unrelated, reply: "I'm here to help with your habits only 😊"
- Use the user's habit data to give personalized insights
- Keep answers short and helpful

USER HABITS:
${formattedHabits}

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