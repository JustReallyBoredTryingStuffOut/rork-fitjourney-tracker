import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

interface ThemeState {
  darkMode: boolean;
  systemTheme: boolean;
  accentColor: string;
  toggleDarkMode: () => void;
  setSystemTheme: (useSystem: boolean) => void;
  setAccentColor: (color: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      darkMode: false,
      systemTheme: true,
      accentColor: "#5D5FEF", // Default accent color
      
      toggleDarkMode: () => set(state => ({ 
        darkMode: !state.darkMode,
        systemTheme: false 
      })),
      
      setSystemTheme: (useSystem) => {
        const colorScheme = useColorScheme();
        set({ 
          systemTheme: useSystem,
          // If using system theme, set darkMode based on system preference
          darkMode: useSystem ? colorScheme === "dark" : get().darkMode
        });
      },
      
      setAccentColor: (color) => set({ accentColor: color }),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);