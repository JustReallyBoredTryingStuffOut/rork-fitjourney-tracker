import React, { useEffect } from 'react';
import { StatusBar, NativeModules, Platform, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import your existing screens
import TabLayout from './app/(tabs)/_layout';

// Placeholder screens for now
const HealthTest = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Health Test Screen</Text>
  </View>
);

const ActiveWorkout = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Active Workout Screen</Text>
  </View>
);

const CreateWorkout = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Create Workout Screen</Text>
  </View>
);

const Achievements = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Achievements Screen</Text>
  </View>
);

const ActivityHistory = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Activity History Screen</Text>
  </View>
);

const AiChat = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>AI Chat Screen</Text>
  </View>
);

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    // Critical: Force native module bridge initialization
    if (Platform.OS === 'ios') {
      console.log('[App] Forcing native module bridge initialization...');
      
      // Force bridge to register modules
      const moduleNames = Object.keys(NativeModules);
      console.log(`[App] Native modules available: ${moduleNames.length}`);
      
      if (moduleNames.length === 0) {
        console.error('[App] CRITICAL: No native modules found!');
      } else {
        console.log('[App] ✅ Native modules working');
        
        // Look for HealthKit module specifically
        const healthModules = moduleNames.filter(name => 
          name.includes('Health') || 
          name.includes('Apple') ||
          name.includes('RNApple')
        );
        
        if (healthModules.length > 0) {
          console.log('[App] ✅ HealthKit modules found:', healthModules);
        } else {
          console.log('[App] ❌ HealthKit modules missing');
        }
      }
    }
  }, []);

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