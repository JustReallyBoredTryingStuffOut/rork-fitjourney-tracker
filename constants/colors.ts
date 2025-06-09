export const colors = {
  primary: "#4A90E2",
  secondary: "#50C878",
  background: "#F8F9FA",
  card: "#FFFFFF",
  text: "#212529",
  textSecondary: "#6C757D",
  textLight: "#ADB5BD",
  border: "#DEE2E6",
  error: "#DC3545",
  success: "#28A745",
  warning: "#FFC107",
  info: "#17A2B8",
  
  // Macro colors
  calorieColor: "#FF6B6B", // Red for calories
  macroProtein: "#4A90E2", // Blue
  macroCarbs: "#50C878",   // Green
  macroFat: "#FFA500",     // Orange
  
  // Workout intensity colors
  intensityLow: "#50C878",    // Green
  intensityMedium: "#FFC107", // Yellow
  intensityHigh: "#DC3545",   // Red
  
  // Dark mode colors (if needed)
  darkBackground: "#212529",
  darkCard: "#343A40",
  darkText: "#F8F9FA",
  darkTextSecondary: "#ADB5BD",
  darkBorder: "#495057",
  
  // Gradients
  gradientStart: "#4A90E2",
  gradientEnd: "#50C878",
  
  // UI colors
  highlight: "#F0F7FF",
  white: "#FFFFFF",
  black: "#000000",
  
  // Background variants
  backgroundLight: "#E9ECEF",
};

// Base theme colors
export const lightTheme = {
  ...colors,
  background: "#F8F9FA",
  card: "#FFFFFF",
  text: "#212529",
  textSecondary: "#6C757D",
  border: "#DEE2E6",
};

export const darkTheme = {
  ...colors,
  background: "#212529",
  card: "#343A40",
  text: "#F8F9FA",
  textSecondary: "#ADB5BD",
  border: "#495057",
  primary: "#5C9CE6",
  secondary: "#60D888",
};

// Color scheme definitions
const colorSchemes = {
  blue: {
    light: {
      primary: "#4A90E2",
      secondary: "#5FB0E5",
      gradientStart: "#4A90E2",
      gradientEnd: "#5FB0E5",
    },
    dark: {
      primary: "#5C9CE6",
      secondary: "#6FBAE9",
      gradientStart: "#5C9CE6",
      gradientEnd: "#6FBAE9",
    }
  },
  green: {
    light: {
      primary: "#50C878",
      secondary: "#4CD964",
      gradientStart: "#50C878",
      gradientEnd: "#4CD964",
    },
    dark: {
      primary: "#60D888",
      secondary: "#5CE974",
      gradientStart: "#60D888",
      gradientEnd: "#5CE974",
    }
  },
  purple: {
    light: {
      primary: "#8A2BE2",
      secondary: "#9B59B6",
      gradientStart: "#8A2BE2",
      gradientEnd: "#9B59B6",
    },
    dark: {
      primary: "#9A3BF2",
      secondary: "#AB69C6",
      gradientStart: "#9A3BF2",
      gradientEnd: "#AB69C6",
    }
  },
  orange: {
    light: {
      primary: "#FF9500",
      secondary: "#FF7F50",
      gradientStart: "#FF9500",
      gradientEnd: "#FF7F50",
    },
    dark: {
      primary: "#FFA520",
      secondary: "#FF8F60",
      gradientStart: "#FFA520",
      gradientEnd: "#FF8F60",
    }
  },
  pink: {
    light: {
      primary: "#FF6B6B",
      secondary: "#FF8787",
      gradientStart: "#FF6B6B",
      gradientEnd: "#FF8787",
    },
    dark: {
      primary: "#FF7B7B",
      secondary: "#FF9797",
      gradientStart: "#FF7B7B",
      gradientEnd: "#FF9797",
    }
  }
};

// Function to get colors based on theme and color scheme
export const getColors = (theme: "light" | "dark", colorScheme = "blue") => {
  // Get the base theme
  const baseTheme = theme === "dark" ? { ...darkTheme } : { ...lightTheme };
  
  // Apply color scheme if it exists
  if (colorSchemes[colorScheme]) {
    const schemeColors = colorSchemes[colorScheme][theme];
    return {
      ...baseTheme,
      ...schemeColors,
      // Update macro colors based on color scheme
      macroProtein: schemeColors.primary, // Use primary color for protein
    };
  }
  
  return baseTheme;
};