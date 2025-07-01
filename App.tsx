import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import your existing screens
import TabLayout from './app/(tabs)/_layout';
import HealthTest from './app/health-test';
import ActiveWorkout from './app/active-workout';
import CreateWorkout from './app/create-workout';
import Achievements from './app/achievements';
import ActivityHistory from './app/activity-history';
import AiChat from './app/ai-chat';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Tabs"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Tabs" component={TabLayout} />
            <Stack.Screen name="health-test" component={HealthTest} />
            <Stack.Screen name="active-workout" component={ActiveWorkout} />
            <Stack.Screen name="create-workout" component={CreateWorkout} />
            <Stack.Screen name="achievements" component={Achievements} />
            <Stack.Screen name="activity-history" component={ActivityHistory} />
            <Stack.Screen name="ai-chat" component={AiChat} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
} 