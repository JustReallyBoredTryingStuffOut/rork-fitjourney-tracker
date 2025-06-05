import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useAiStore, AiChat } from "@/store/aiStore";
import AiChatBox from "@/components/AiChatBox";

export default function AiChatScreen() {
  const router = useRouter();
  const { chats, addChat, addMessageToChat } = useAiStore();
  
  const [currentChat, setCurrentChat] = useState<AiChat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Create a new chat if none exists
    if (!chats || chats.length === 0) {
      const newChat: AiChat = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        messages: [
          {
            id: "welcome",
            role: "assistant",
            content: "Hi there! I'm your fitness assistant. How can I help you today?",
            timestamp: new Date().toISOString()
          }
        ]
      };
      
      addChat(newChat);
      setCurrentChat(newChat);
    } else {
      // Use the most recent chat
      const mostRecentChat = [...chats].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];
      
      setCurrentChat(mostRecentChat);
    }
  }, [chats, addChat]);
  
  const handleSendMessage = async (message: string) => {
    if (!currentChat) return;
    
    // Add user message to chat
    addMessageToChat(currentChat.id, {
      role: "user",
      content: message
    });
    
    setIsLoading(true);
    
    try {
      // Send message to AI API
      const response = await fetch("https://toolkit.rork.com/text/llm/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are a helpful fitness assistant. Provide concise, accurate advice about workouts, nutrition, and general fitness. Be encouraging and motivational."
            },
            ...currentChat.messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: "user",
              content: message
            }
          ]
        })
      });
      
      const data = await response.json();
      
      if (data.completion) {
        // Add AI response to chat
        addMessageToChat(currentChat.id, {
          role: "assistant",
          content: data.completion
        });
      } else {
        throw new Error("Failed to get AI response");
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      Alert.alert(
        "Error",
        "Failed to get a response. Please try again later."
      );
      
      // Add error message to chat
      addMessageToChat(currentChat.id, {
        role: "assistant",
        content: "Sorry, I'm having trouble responding right now. Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoBack = () => {
    router.back();
  };
  
  if (!currentChat) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: "Fitness Assistant",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={handleGoBack} 
              style={styles.backButton}
              accessibilityLabel="Go back"
              accessibilityHint="Returns to the previous screen"
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <AiChatBox
        messages={currentChat.messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 8,
  },
});