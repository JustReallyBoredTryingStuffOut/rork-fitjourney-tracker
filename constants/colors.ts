import { ColorScheme } from "@/store/themeStore";

// Color schemes
const colorSchemes = {
  blue: {
    primary: "#4A90E2",
    secondary: "#50C878",
  },
  green: {
    primary: "#50C878",
    secondary: "#4A90E2",
  },
  purple: {
    primary: "#8A2BE2",
    secondary: "#FF6B6B",
  },
  orange: {
    primary: "#FF9500",
    secondary: "#4A90E2",
  },
  pink: {
    primary: "#FF6B6B",
    secondary: "#50C878",
  },
};

// Light theme colors
const lightColors = {
  background: "#F8F9FA",
  card: "#FFFFFF",
  text: "#333333",
  textSecondary: "#666666",
  textLight: "#999999",
  border: "#E1E4E8",
  success: "#4CD964",
  error: "#FF3B30",
  warning: "#FFCC00",
  inactive: "#C7C7CC",
  highlight: "#E8F0FE",
  timerBackground: "#F0F7FF",
  macroProtein: "#FF6B6B",
  macroCarbs: "#48DBFB",
  macroFat: "#FFA502"
};

// Dark theme colors
const darkColors = {
  background: "#121212",
  card: "#1E1E1E",
  text: "#FFFFFF",
  textSecondary: "#AAAAAA",
  textLight: "#777777",
  border: "#333333",
  success: "#4CD964",
  error: "#FF453A",
  warning: "#FFD60A",
  inactive: "#444444",
  highlight: "#1A2A40",
  timerBackground: "#1A2A40",
  macroProtein: "#FF6B6B",
  macroCarbs: "#48DBFB",
  macroFat: "#FFA502"
};

// Function to get colors based on theme and color scheme
export const getColors = (theme: "light" | "dark", colorScheme: ColorScheme = "blue") => {
  const baseColors = theme === "dark" ? darkColors : lightColors;
  const schemeColors = colorSchemes[colorScheme];
  
  return {
    ...baseColors,
    primary: schemeColors.primary,
    secondary: schemeColors.secondary,
  };
};

// Default colors (for backward compatibility)
export const colors = {
  primary: "#4A90E2", // Pastel blue
  secondary: "#50C878", // Pastel green
  background: "#F8F9FA",
  card: "#FFFFFF",
  text: "#333333",
  textSecondary: "#666666",
  textLight: "#999999",
  border: "#E1E4E8",
  success: "#4CD964",
  error: "#FF3B30",
  warning: "#FFCC00",
  inactive: "#C7C7CC",
  highlight: "#E8F0FE",
  timerBackground: "#F0F7FF",
  macroProtein: "#FF6B6B",
  macroCarbs: "#48DBFB",
  macroFat: "#FFA502"
};