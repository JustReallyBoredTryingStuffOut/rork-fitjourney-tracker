import React from "react";
import { View, StyleSheet, Text, Linking, TouchableOpacity, Platform } from "react-native";
import { ExternalLink, Play } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { WebView } from "react-native-webview";

type VideoEmbedProps = {
  url: string;
  height?: number;
};

export default function VideoEmbed({ url, height = 200 }: VideoEmbedProps) {
  // Function to extract YouTube video ID
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  
  // Function to extract TikTok video ID
  const getTikTokVideoId = (url: string) => {
    const regExp = /tiktok\.com\/@[^\/]+\/video\/(\d+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };
  
  // Determine video type and ID
  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
  const isTikTok = url.includes("tiktok.com");
  
  const youtubeId = isYouTube ? getYouTubeVideoId(url) : null;
  const tiktokId = isTikTok ? getTikTokVideoId(url) : null;
  
  // Generate embed URL
  let embedUrl = "";
  if (youtubeId) {
    embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
  } else if (tiktokId) {
    embedUrl = `https://www.tiktok.com/embed/v2/${tiktokId}`;
  }
  
  const handleOpenLink = () => {
    Linking.openURL(url);
  };
  
  // For web platform, we'll use a different approach
  if (Platform.OS === "web") {
    return (
      <View style={styles.videoContainer}>
        <View style={[styles.container, { height }]}>
          <iframe
            src={embedUrl}
            style={{ width: "100%", height: "100%", border: "none" }}
            allowFullScreen
          />
        </View>
        <Text style={styles.attributionText}>
          {isYouTube ? "Video content provided by YouTube. All rights belong to their respective owners." : 
           isTikTok ? "Video content provided by TikTok. All rights belong to their respective owners." :
           "Video content provided by third party. All rights belong to their respective owners."}
        </Text>
      </View>
    );
  }
  
  // For mobile platforms
  if (!embedUrl) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.errorText}>Invalid video URL</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.videoContainer}>
      <View style={[styles.container, { height }]}>
        <WebView
          source={{ uri: embedUrl }}
          style={styles.webview}
          allowsFullscreenVideo
          javaScriptEnabled
          domStorageEnabled
        />
        <TouchableOpacity 
          style={styles.openButton}
          onPress={handleOpenLink}
        >
          <ExternalLink size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <Text style={styles.attributionText}>
        {isYouTube ? "Video content provided by YouTube. All rights belong to their respective owners." : 
         isTikTok ? "Video content provided by TikTok. All rights belong to their respective owners." :
         "Video content provided by third party. All rights belong to their respective owners."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    width: "100%",
    marginBottom: 12,
  },
  container: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    backgroundColor: colors.background,
  },
  webview: {
    flex: 1,
  },
  errorText: {
    color: colors.error,
    textAlign: "center",
    marginTop: 20,
  },
  openButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  attributionText: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
    fontStyle: "italic",
  },
});