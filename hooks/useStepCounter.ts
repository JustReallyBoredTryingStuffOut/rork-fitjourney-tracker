import { useState, useEffect, useRef } from "react";
import { Platform, Alert } from "react-native";
import { Pedometer } from "expo-sensors";
import { useHealthStore } from "@/store/healthStore";
import * as ExpoDevice from "expo-device";

// Import the CoreBluetooth module for iOS
import CoreBluetooth from "../src/NativeModules/CoreBluetooth";

export default function useStepCounter() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isUsingConnectedDevice, setIsUsingConnectedDevice] = useState(false);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [useMockData, setUseMockData] = useState(false);
  const [bluetoothState, setBluetoothState] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<"unknown" | "granted" | "denied">("unknown");
  
  const { 
    isTrackingSteps, 
    setIsTrackingSteps, 
    addStepLog, 
    getStepsForDate,
    connectedDevices,
    isAppleWatchConnected,
    getConnectedDeviceByType,
    importDataFromDevice
  } = useHealthStore();
  
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mockDataTimerRef = useRef<NodeJS.Timeout | null>(null);
  const bluetoothListenerRef = useRef<(() => void) | null>(null);
  
  // Initialize Bluetooth state and permissions
  useEffect(() => {
    if (Platform.OS === "web") {
      setError("Step counting is not available on web");
      return;
    }
    
    const initializeBluetooth = async () => {
      if (Platform.OS === 'ios') {
        try {
          // Check Bluetooth state
          const stateResult = await CoreBluetooth.getBluetoothState();
          setBluetoothState(stateResult.state);
          
          // Request permissions
          const permissionResult = await CoreBluetooth.requestPermissions();
          setPermissionStatus(permissionResult.granted ? "granted" : "denied");
          
          if (stateResult.state !== "poweredOn") {
            setError("Bluetooth is not powered on. Please enable Bluetooth in your device settings.");
          } else if (!permissionResult.granted) {
            setError("Bluetooth permissions are required to connect to devices.");
          } else {
            setError(null);
          }
          
          // Set up Bluetooth state change listener
          if (bluetoothListenerRef.current) {
            bluetoothListenerRef.current();
          }
          
          bluetoothListenerRef.current = CoreBluetooth.addListener(
            'bluetoothStateChanged',
            (event) => {
              setBluetoothState(event.state);
              
              if (event.state !== 'poweredOn') {
                setError("Bluetooth is not powered on. Please enable Bluetooth in your device settings.");
              } else {
                setError(null);
              }
            }
          );
        } catch (error: any) {
          console.error("Error initializing Bluetooth:", error);
          setError(`Error initializing Bluetooth: ${error.message}`);
        }
      }
    };
    
    initializeBluetooth();
    
    return () => {
      if (bluetoothListenerRef.current) {
        bluetoothListenerRef.current();
        bluetoothListenerRef.current = null;
      }
    };
  }, []);
  
  // Check if pedometer is available and if we have connected devices
  useEffect(() => {
    if (Platform.OS === "web") {
      setError("Step counting is not available on web");
      return;
    }
    
    const checkAvailability = async () => {
      try {
        // Check for connected devices first
        const appleWatch = getConnectedDeviceByType("appleWatch");
        const fitbit = getConnectedDeviceByType("fitbit");
        const garmin = getConnectedDeviceByType("garmin");
        
        const connectedDevice = appleWatch || fitbit || garmin;
        
        if (connectedDevice && connectedDevice.connected) {
          setIsUsingConnectedDevice(true);
          setDeviceName(connectedDevice.name);
          
          // If we have a connected device, we don't need the pedometer
          setIsPedometerAvailable(true);
          return;
        }
        
        // Fall back to device pedometer if no connected devices
        if (Platform.OS === 'ios') {
          // On iOS, check if the Apple Watch is paired and available
          if (bluetoothState === "poweredOn" && permissionStatus === "granted") {
            // In a real app, we would check for paired Apple Watch here
            // For now, we'll check if the Pedometer is available as a fallback
            const isAvailable = await Pedometer.isAvailableAsync();
            setIsPedometerAvailable(isAvailable);
            
            if (!isAvailable) {
              setError("Pedometer is not available on this device");
              requestHealthKitPermissions();
            }
          } else {
            // If Bluetooth is not available or permissions not granted
            const isAvailable = await Pedometer.isAvailableAsync();
            setIsPedometerAvailable(isAvailable);
            
            if (!isAvailable) {
              setError("Pedometer is not available on this device");
              requestHealthKitPermissions();
            }
          }
        } else {
          const isAvailable = await Pedometer.isAvailableAsync();
          setIsPedometerAvailable(isAvailable);
          
          if (!isAvailable) {
            setError("Pedometer is not available on this device");
            setUseMockData(true);
          }
        }
      } catch (e) {
        console.error("Error checking pedometer availability:", e);
        setError("Error checking pedometer availability");
        
        // On iOS, we might need to request HealthKit permissions
        if (Platform.OS === "ios") {
          requestHealthKitPermissions();
        } else {
          setUseMockData(true);
        }
      }
    };
    
    checkAvailability();
    
    // Set up periodic sync for connected devices
    if (isUsingConnectedDevice && isTrackingSteps) {
      syncTimerRef.current = setInterval(() => {
        syncWithConnectedDevice();
      }, 15 * 60 * 1000); // Sync every 15 minutes
    }
    
    return () => {
      if (syncTimerRef.current) {
        clearInterval(syncTimerRef.current);
      }
      if (mockDataTimerRef.current) {
        clearInterval(mockDataTimerRef.current);
      }
    };
  }, [isTrackingSteps, isUsingConnectedDevice, connectedDevices, bluetoothState, permissionStatus]);
  
  // Request HealthKit permissions on iOS
  const requestHealthKitPermissions = () => {
    if (Platform.OS !== "ios") return;
    
    // In a real app, this would use the HealthKit framework
    // For now, we'll simulate the permission request
    Alert.alert(
      "Health Access",
      "This app would like to access your health data to track your steps and activity.",
      [
        {
          text: "Don't Allow",
          style: "cancel",
          onPress: () => {
            setError("Health data access denied. Using mock data for testing.");
            setUseMockData(true);
          }
        },
        {
          text: "OK",
          onPress: () => {
            // Simulate checking if the permission fixed the CMErrorDomain 105 issue
            setTimeout(() => {
              // There's still a 50% chance the error persists (simulating real-world behavior)
              if (Math.random() > 0.5) {
                setError("Step counting is still unavailable due to device restrictions (CMErrorDomain 105). Using sample data instead.");
                setUseMockData(true);
              } else {
                setError(null);
                setIsPedometerAvailable(true);
                setUseMockData(false);
              }
            }, 1000);
          }
        }
      ]
    );
  };
  
  // Start/stop step tracking
  useEffect(() => {
    if (!isPedometerAvailable || Platform.OS === "web") return;
    
    let subscription: { remove: () => void } | null = null;
    let pollInterval: NodeJS.Timeout | null = null;
    
    const startTracking = async () => {
      try {
        // Get today's date at midnight
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Get yesterday's date at midnight
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // If using a connected device, sync with it
        if (isUsingConnectedDevice) {
          await syncWithConnectedDevice();
          
          // Get today's existing log if any
          const todayLog = getStepsForDate(today.toISOString());
          if (todayLog) {
            setCurrentStepCount(todayLog.steps);
          } else {
            setCurrentStepCount(0);
          }
          
          // Set up polling to periodically sync with the device
          pollInterval = setInterval(() => {
            syncWithConnectedDevice();
          }, 5 * 60 * 1000); // Sync every 5 minutes
          
          return;
        }
        
        // If we're using mock data, set up mock data generation
        if (useMockData) {
          setupMockDataTracking();
          return;
        }
        
        // Otherwise use the device's pedometer
        let initialSteps = 0;
        
        try {
          const result = await Pedometer.getStepCountAsync(yesterday, new Date());
          initialSteps = result.steps;
        } catch (pedometerError: any) {
          console.error("Pedometer error:", pedometerError);
          
          // Handle specific Core Motion error 105 (often occurs on iOS)
          if (pedometerError.message && 
              (pedometerError.message.includes("cmerrordomain error 105") || 
               pedometerError.message.includes("CMErrorDomain"))) {
            
            setError("Pedometer data is temporarily unavailable (CMErrorDomain 105). This is likely due to missing Health permissions.");
            
            // On iOS, we need to request HealthKit permissions
            if (Platform.OS === "ios") {
              requestHealthKitPermissions();
            } else {
              setUseMockData(true);
              setupMockDataTracking();
            }
            return;
          } else {
            setError("Error getting step count. Using fallback method.");
          }
          
          // Use a fallback method - start from 0 or last saved count
          const todayLog = getStepsForDate(today.toISOString());
          if (todayLog) {
            initialSteps = todayLog.steps;
          }
        }
        
        // Get today's existing log if any
        const todayLog = getStepsForDate(today.toISOString());
        if (todayLog) {
          setCurrentStepCount(todayLog.steps);
        } else {
          setCurrentStepCount(initialSteps);
        }
        
        // Subscribe to pedometer updates
        try {
          subscription = Pedometer.watchStepCount(result => {
            setCurrentStepCount(prevCount => {
              const newCount = prevCount + result.steps;
              
              // Log steps every time they change
              const newStepLog = {
                id: today.toISOString(),
                date: today.toISOString(),
                steps: newCount,
                distance: calculateDistance(newCount),
                calories: calculateCaloriesBurned(newCount),
              };
              
              addStepLog(newStepLog);
              
              return newCount;
            });
          });
        } catch (watchError: any) {
          console.error("Error watching steps:", watchError);
          
          // Handle specific Core Motion error 105 (often occurs on iOS)
          if (watchError.message && 
              (watchError.message.includes("cmerrordomain error 105") || 
               watchError.message.includes("CMErrorDomain"))) {
            
            setError("Unable to track steps in real-time due to device restrictions (CMErrorDomain 105). This is likely due to missing Health permissions.");
            
            // On iOS, we need to request HealthKit permissions
            if (Platform.OS === "ios") {
              requestHealthKitPermissions();
            } else {
              setUseMockData(true);
              setupMockDataTracking();
            }
          } else {
            setError("Could not track steps in real-time. Using mock data for testing.");
            setUseMockData(true);
            setupMockDataTracking();
          }
        }
      } catch (e: any) {
        console.error("General error in step counter:", e);
        
        // Handle specific Core Motion error 105 (often occurs on iOS)
        if (e.message && 
            (e.message.includes("cmerrordomain error 105") || 
             e.message.includes("CMErrorDomain"))) {
          
          setError("Step counting is currently unavailable due to device restrictions (CMErrorDomain 105). This is likely due to missing Health permissions.");
          
          // On iOS, we need to request HealthKit permissions
          if (Platform.OS === "ios") {
            requestHealthKitPermissions();
          } else {
            setUseMockData(true);
            setupMockDataTracking();
          }
        } else {
          setError("Error starting step counter. Using mock data for testing.");
          setUseMockData(true);
          setupMockDataTracking();
        }
      }
    };
    
    if (isTrackingSteps) {
      startTracking();
    }
    
    return () => {
      if (subscription) {
        subscription.remove();
      }
      if (pollInterval) {
        clearInterval(pollInterval);
      }
      if (mockDataTimerRef.current) {
        clearInterval(mockDataTimerRef.current);
      }
    };
  }, [isTrackingSteps, isPedometerAvailable, isUsingConnectedDevice, useMockData]);
  
  // Setup mock data tracking
  const setupMockDataTracking = () => {
    // Clear any existing mock data timer
    if (mockDataTimerRef.current) {
      clearInterval(mockDataTimerRef.current);
    }
    
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get existing step count or start with a reasonable base
    const todayLog = getStepsForDate(today.toISOString());
    const initialSteps = todayLog ? todayLog.steps : 1000 + Math.floor(Math.random() * 2000);
    
    setCurrentStepCount(initialSteps);
    
    // Log initial mock steps
    const newStepLog = {
      id: today.toISOString(),
      date: today.toISOString(),
      steps: initialSteps,
      distance: calculateDistance(initialSteps),
      calories: calculateCaloriesBurned(initialSteps),
    };
    
    addStepLog(newStepLog);
    
    // Simulate step increases with a timer
    mockDataTimerRef.current = setInterval(() => {
      // Generate more steps during active hours (8am-10pm)
      const hour = new Date().getHours();
      const isActiveHour = hour >= 8 && hour <= 22;
      
      // Generate more steps if it's an active hour
      const additionalSteps = Math.floor(Math.random() * (isActiveHour ? 100 : 20));
      
      setCurrentStepCount(prevCount => {
        const newCount = prevCount + additionalSteps;
        
        // Log steps
        const updatedStepLog = {
          id: today.toISOString(),
          date: today.toISOString(),
          steps: newCount,
          distance: calculateDistance(newCount),
          calories: calculateCaloriesBurned(newCount),
        };
        
        addStepLog(updatedStepLog);
        
        return newCount;
      });
    }, isTrackingSteps ? 30000 : 60000); // Update more frequently if actively tracking
  };
  
  // Helper functions
  const calculateDistance = (steps: number): number => {
    // Average stride length is about 0.762 meters
    // 1 step ≈ 0.762 meters
    const distanceInMeters = steps * 0.762;
    return parseFloat((distanceInMeters / 1000).toFixed(2)); // Convert to km
  };
  
  const calculateCaloriesBurned = (steps: number): number => {
    // Very rough estimate: 1 step ≈ 0.04 calories
    return Math.round(steps * 0.04);
  };
  
  const syncWithConnectedDevice = async () => {
    try {
      // Find connected device
      const appleWatch = getConnectedDeviceByType("appleWatch");
      const fitbit = getConnectedDeviceByType("fitbit");
      const garmin = getConnectedDeviceByType("garmin");
      
      const connectedDevice = appleWatch || fitbit || garmin;
      
      if (!connectedDevice || !connectedDevice.connected) {
        setIsUsingConnectedDevice(false);
        setDeviceName(null);
        return;
      }
      
      // Get today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Get yesterday's date
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // Import step data from the device
      const success = await importDataFromDevice(
        connectedDevice.id,
        "steps",
        yesterday.toISOString(),
        new Date().toISOString()
      );
      
      if (success) {
        // Update current step count from the latest log
        const todayLog = getStepsForDate(today.toISOString());
        if (todayLog) {
          setCurrentStepCount(todayLog.steps);
        }
      }
    } catch (error) {
      console.error("Error syncing with connected device:", error);
    }
  };
  
  const retryPedometerConnection = async () => {
    if (retryCount >= 3 || isUsingConnectedDevice) return false;
    
    setRetryCount(prev => prev + 1);
    
    try {
      // On iOS, check Bluetooth state and permissions first
      if (Platform.OS === "ios") {
        const stateResult = await CoreBluetooth.getBluetoothState();
        setBluetoothState(stateResult.state);
        
        if (stateResult.state !== "poweredOn") {
          setError("Bluetooth is not powered on. Please enable Bluetooth in your device settings.");
          return false;
        }
        
        const permissionResult = await CoreBluetooth.requestPermissions();
        setPermissionStatus(permissionResult.granted ? "granted" : "denied");
        
        if (!permissionResult.granted) {
          setError("Bluetooth permissions are required to connect to devices.");
          return false;
        }
        
        // Also request HealthKit permissions
        requestHealthKitPermissions();
        return true;
      }
      
      // Check if pedometer is available
      const isAvailable = await Pedometer.isAvailableAsync();
      
      if (!isAvailable) {
        setError("Pedometer is still not available on this device. Using mock data.");
        setUseMockData(true);
        return false;
      }
      
      // Try to get step count to test if it works
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      await Pedometer.getStepCountAsync(yesterday, today);
      
      // If we get here, pedometer is working
      setIsPedometerAvailable(true);
      setError(null);
      setUseMockData(false);
      return true;
    } catch (e: any) {
      console.error("Error retrying pedometer connection:", e);
      
      // Handle specific Core Motion error 105
      if (e.message && 
          (e.message.includes("cmerrordomain error 105") || 
           e.message.includes("CMErrorDomain"))) {
        
        setError("Step counting is still unavailable due to device restrictions (CMErrorDomain 105). This is likely due to missing Health permissions.");
        
        // On iOS, we need to request HealthKit permissions
        if (Platform.OS === "ios") {
          requestHealthKitPermissions();
          return true;
        } else {
          setUseMockData(true);
          return false;
        }
      } else {
        setError("Pedometer is still not working properly. Using mock data.");
        setUseMockData(true);
        return false;
      }
    }
  };
  
  const startTracking = async () => {
    if (!isPedometerAvailable && Platform.OS !== "web") {
      // Try to retry pedometer connection first
      const pedometerConnected = await retryPedometerConnection();
      
      if (!pedometerConnected) {
        setError("Pedometer is not available on this device. Using mock data for testing.");
        setUseMockData(true);
        setupMockDataTracking();
      }
    }
    
    setIsTrackingSteps(true);
    
    // If using a connected device, sync immediately
    if (isUsingConnectedDevice) {
      syncWithConnectedDevice();
    }
  };
  
  const stopTracking = () => {
    setIsTrackingSteps(false);
    
    // Clear sync timer if it exists
    if (syncTimerRef.current) {
      clearInterval(syncTimerRef.current);
      syncTimerRef.current = null;
    }
    
    // Clear mock data timer if it exists
    if (mockDataTimerRef.current) {
      clearInterval(mockDataTimerRef.current);
      mockDataTimerRef.current = null;
    }
  };
  
  const manualSync = async () => {
    if (isUsingConnectedDevice) {
      return syncWithConnectedDevice();
    }
    
    // If not using a connected device, try to retry pedometer connection
    if (!isPedometerAvailable && !useMockData) {
      return retryPedometerConnection();
    }
    
    return false;
  };
  
  return {
    currentStepCount,
    isPedometerAvailable,
    isTracking: isTrackingSteps,
    error,
    startTracking,
    stopTracking,
    manualSync,
    isUsingConnectedDevice,
    deviceName,
    useMockData,
    retryPedometerConnection,
    bluetoothState,
    permissionStatus
  };
}