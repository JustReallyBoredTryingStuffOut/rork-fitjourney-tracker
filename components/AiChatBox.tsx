import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  ScrollView
} from "react-native";
import { Send, HelpCircle } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { ChatMessage } from "@/store/aiStore";
import { appKnowledge } from "@/constants/appKnowledge";

interface AiChatBoxProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  showSuggestions?: boolean;
  onSuggestionToggle?: () => void;
}

export default function AiChatBox({ 
  messages, 
  onSendMessage, 
  isLoading, 
  showSuggestions = true,
  onSuggestionToggle
}: AiChatBoxProps) {
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);
  
  const handleSend = () => {
    if (inputText.trim() === "" || isLoading) return;
    
    onSendMessage(inputText.trim());
    setInputText("");
  };
  
  const handleSuggestionPress = (suggestion: string) => {
    onSendMessage(suggestion);
  };
  
  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === "user";
    
    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.assistantMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          isUser ? styles.userMessageBubble : styles.assistantMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.assistantMessageText
          ]}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  };
  
  const renderSuggestions = () => {
    if (!showSuggestions) return null;
    
    return (
      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsTitle}>Ask me about:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsScrollContent}>
          {appKnowledge.suggestions.map((suggestion, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.suggestionButton}
              onPress={() => handleSuggestionPress(suggestion)}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {renderSuggestions()}
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={true}
      />
      
      <View style={styles.inputContainer}>
        {onSuggestionToggle && (
          <TouchableOpacity
            style={styles.helpButton}
            onPress={onSuggestionToggle}
          >
            <HelpCircle size={20} color={colors.primary} />
          </TouchableOpacity>
        )}
        
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask about app features, goals, workouts..."
          placeholderTextColor={colors.textSecondary}
          multiline
          maxLength={500}
          onSubmitEditing={handleSend}
          editable={!isLoading}
        />
        
        <TouchableOpacity
          style={[
            styles.sendButton,
            (inputText.trim() === "" || isLoading) && styles.disabledSendButton
          ]}
          onPress={handleSend}
          disabled={inputText.trim() === "" || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Send size={20} color={colors.white} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  messageContainer: {
    marginBottom: 16,
    flexDirection: "row",
  },
  userMessageContainer: {
    justifyContent: "flex-end",
  },
  assistantMessageContainer: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: "80%",
  },
  userMessageBubble: {
    backgroundColor: colors.primary,
  },
  assistantMessageBubble: {
    backgroundColor: colors.card,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: colors.white,
  },
  assistantMessageText: {
    color: colors.text,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
    alignItems: "center",
  },
  helpButton: {
    padding: 8,
    marginRight: 4,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    maxHeight: 120,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  disabledSendButton: {
    backgroundColor: colors.primaryLight,
    opacity: 0.7,
  },
  suggestionsContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  suggestionsScrollContent: {
    paddingBottom: 8,
  },
  suggestionButton: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  suggestionText: {
    color: colors.primary,
    fontWeight: "500",
  },
});