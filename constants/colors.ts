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
};

// Extend with theme-specific colors
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

// Function to get colors based on theme and color scheme
export const getColors = (theme: "light" | "dark", colorScheme?: string) => {
  // Return the appropriate theme colors
  const baseTheme = theme === "dark" ? darkTheme : lightTheme;
  
  // If a specific color scheme is provided, we could modify colors here
  // For now, just return the base theme
  return baseTheme;
};