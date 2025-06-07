import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { Home, Dumbbell, Calendar, Utensils, Heart, User } from "lucide-react-native";
import { colors } from "@/constants/colors";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colorScheme === "dark" ? "#1A1A1A" : "#FFFFFF",
          borderTopColor: colorScheme === "dark" ? "#333333" : "#E5E5E5",
        },
        headerStyle: {
          backgroundColor: colorScheme === "dark" ? "#1A1A1A" : "#FFFFFF",
        },
        headerTintColor: colorScheme === "dark" ? "#FFFFFF" : "#000000",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: "Workouts",
          tabBarIcon: ({ color }) => <Dumbbell size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Schedule",
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="nutrition"
        options={{
          title: "Nutrition",
          tabBarIcon: ({ color }) => <Utensils size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="health"
        options={{
          title: "Health",
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}