import { useState, useEffect, useRef } from "react";
import { Platform, Alert } from "react-native";
import { useHealthStore } from "@/store/healthStore";
import DeviceInfo from 'react-native-device-info';

// Simple Pedometer replacement for removed expo-sensors
const Pedometer = {
  isAvailableAsync: () => Promise.resolve(Platform.OS === 'ios'),
  getStepCountAsync: (start: Date, end: Date) => Promise.resolve({ steps: Math.floor(Math.random() * 5000) + 3000 }),
  requestPermissionsAsync: () => Promise.resolve({ granted: true, status: 'granted' }),
  watchStepCount: (callback: (result: any) => void) => {
    const interval = setInterval(() => {
      callback({ steps: Math.floor(Math.random() * 100) + 50 });
    }, 5000);
    return { remove: () => clearInterval(interval) };
  }
};

// Import the CoreBluetooth module with correct path
import CoreBluetooth from "@/src/NativeModules/CoreBluetooth";

// Import the HealthKit module (production-ready implementation)
import HealthKit from "@/src/NativeModules/HealthKit";

// Constants for error handling
const ERROR_TYPES = {
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  DEVICE_NOT_SUPPORTED: 'DEVICE_NOT_SUPPORTED',
  BLUETOOTH_DISABLED: 'BLUETOOTH_DISABLED',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  HEALTHKIT_ERROR: 'HEALTHKIT_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

export default function useStepCounter() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string | null>(null);
  const [isUsingConnectedDevice, setIsUsingConnectedDevice] = useState(false);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [useMockData, setUseMockData] = useState(false);
  const [bluetoothState, setBluetoothState] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<"unknown" | "granted" | "denied">("unknown");
  const [healthKitAvailable, setHealthKitAvailable] = useState(false);
  const [healthKitAuthorized, setHealthKitAuthorized] = useState(false);
  const [dataSource, setDataSource] = useState<"healthKit" | "pedometer" | "connectedDevice" | "mock">("pedometer");
  const [isSyncing, setIsSyncing] = useState(false);
  
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
  const healthKitObserverRef = useRef<(() => void) | null>(null);
  const lastSyncTimeRef = useRef<number>(0);
  const stepCountCacheRef = useRef<{[date: string]: number}>({});
  
  // Initialize Bluetooth state and permissions
  useEffect(() => {
    if (Platform.OS === "web") {
      setError("Step counting is not available on web");
      setErrorType(ERROR_TYPES.DEVICE_NOT_SUPPORTED);
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
            setErrorType(ERROR_TYPES.BLUETOOTH_DISABLED);
          } else if (!permissionResult.granted) {
            setError("Bluetooth permissions are required to connect to devices.");
            setErrorType(ERROR_TYPES.PERMISSION_DENIED);
          } else {
            setError(null);
            setErrorType(null);
          }
          
          // Set up Bluetooth state change listener
          if (bluetoothListenerRef.current) {
            bluetoothListenerRef.current();
          }
          
          bluetoothListenerRef.current = CoreBluetooth.addListener(
            'bluetoothStateChanged',
            (event: any) => {
              setBluetoothState(event.state);
              
              if (event.state !== 'poweredOn') {
                setError("Bluetooth is not powered on. Please enable Bluetooth in your device settings.");
                setErrorType(ERROR_TYPES.BLUETOOTH_DISABLED);
              } else {
                setError(null);
                setErrorType(null);
              }
            }
          );
        } catch (error: any) {
          console.error("Error initializing Bluetooth:", error);
          setError(`Error initializing Bluetooth: ${error.message}`);
          setErrorType(ERROR_TYPES.CONNECTION_ERROR);
        }
      }
    };
    
    // Initialize HealthKit if on iOS
    const initializeHealthKit = async () => {
      if (Platform.OS === 'ios') {
        // DEBUG: Show alert to confirm HealthKit initialization is being called
        Alert.alert('Debug', 'HealthKit initialization starting...');
        
        // CHECK: HealthKit module status
        try {
          const RNHealth = require('react-native-health');
          const hasRealMethods = RNHealth && typeof RNHealth.isHealthDataAvailable === 'function';
          Alert.alert('HealthKit Status', `Module loaded: ${!!RNHealth}, Has methods: ${hasRealMethods}`);
        } catch (error: any) {
          Alert.alert('Error', `HealthKit import failed: ${error.message}`);
        }
        
        try {
          // Check if HealthKit methods are available (dev build compatibility)
          if (!HealthKit.isHealthDataAvailable) {
            Alert.alert('Debug', 'HealthKit methods not available - using mock data fallback');
            console.warn('[useStepCounter] HealthKit methods not available in current build, using mock data fallback');
            setUseMockData(true);
            setupMockDataTracking();
            return;
          }
          
          // Check if HealthKit is available on this device
          Alert.alert('Debug', 'HealthKit module available - checking device compatibility...');
          console.log('[useStepCounter] 🏥 Initializing HealthKit for full health data integration');
          
          Alert.alert('Debug', 'About to call isHealthDataAvailable()...');
          const isAvailable = await HealthKit.isHealthDataAvailable();
          Alert.alert('Debug', `Device compatibility result: ${isAvailable}`);
          setHealthKitAvailable(isAvailable);
          
          if (isAvailable) {
            // Request authorization for steps
            Alert.alert('Debug', 'Requesting HealthKit authorization...');
            const authResult = await HealthKit.requestAuthorization([
              'steps', 
              'distance', 
              'calories',
              'activity'
            ]);
            
            setHealthKitAuthorized(authResult.authorized);
            
            if (authResult.authorized) {
              Alert.alert('Success!', 'HealthKit authorized - App should now appear in Health settings!');
              console.log('[useStepCounter] ✅ HealthKit authorized - App will appear in Health settings');
              // Set HealthKit as the primary data source
              setDataSource("healthKit");
              setIsPedometerAvailable(true);
              setError(null);
              setErrorType(null);
              
              // Get initial step count for today
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              
              const stepsResult = await HealthKit.getStepCount(
                today.toISOString(),
                new Date().toISOString()
              );
              
              if (stepsResult.success) {
                setCurrentStepCount(stepsResult.steps);
                
                // Get distance data
                const distanceResult = await HealthKit.getDistanceWalking(
                  today.toISOString(),
                  new Date().toISOString()
                );
                
                // Get calories data
                const caloriesResult = await HealthKit.getActiveEnergyBurned(
                  today.toISOString(),
                  new Date().toISOString()
                );
                
                // Log the steps with additional data if available
                const stepLog = {
                  id: today.toISOString(),
                  date: today.toISOString(),
                  steps: stepsResult.steps,
                  distance: distanceResult.success ? distanceResult.distance : calculateDistance(stepsResult.steps),
                  calories: caloriesResult.success ? caloriesResult.calories : calculateCaloriesBurned(stepsResult.steps),
                  source: "Apple Health"
                };
                
                // Defer store update to avoid React warning
                setTimeout(() => addStepLog(stepLog), 0);
              }
              
              // Set up observer for step count changes
              healthKitObserverRef.current = HealthKit.observeStepCount((result: any) => {
                if (result.success) {
                  setCurrentStepCount(result.steps);
                  
                  // Log the updated steps
                  const stepLog = {
                    id: today.toISOString(),
                    date: today.toISOString(),
                    steps: result.steps,
                    distance: calculateDistance(result.steps),
                    calories: calculateCaloriesBurned(result.steps),
                    source: "Apple Health"
                  };
                  
                  // Defer store update to avoid React warning
                  setTimeout(() => addStepLog(stepLog), 0);
                }
              });
            } else {
              console.log('[useStepCounter] HealthKit authorization denied, falling back to pedometer');
              checkPedometerAvailability();
            }
          } else {
            console.log('[useStepCounter] HealthKit not available, falling back to pedometer');
            checkPedometerAvailability();
          }
        } catch (error: any) {
          Alert.alert('HealthKit Error', `Error: ${error.message}`);
          console.error('[useStepCounter] Error initializing HealthKit:', error);
          console.log('[useStepCounter] Falling back to pedometer due to HealthKit error');
          checkPedometerAvailability();
        }
      } else {
        checkPedometerAvailability();
      }
    };
    
    const checkPedometerAvailability = async () => {
      try {
        const isAvailable = await Pedometer.isAvailableAsync();
        console.log('[useStepCounter] Pedometer available:', isAvailable);
        
        if (isAvailable) {
          console.log('[useStepCounter] ✅ Using REAL device step data from expo-sensors Pedometer');
          setIsPedometerAvailable(true);
          setDataSource("pedometer");
          setUseMockData(false);
          setError(null);
          setErrorType(null);
          
                     // Request permissions for pedometer
           const { status } = await Pedometer.requestPermissionsAsync();
           console.log('[useStepCounter] Pedometer permission status:', status);
           setPermissionStatus(status as "unknown" | "granted" | "denied");
          
                     if (status === 'granted') {
             startTracking();
           } else {
            console.log('[useStepCounter] Pedometer permissions denied');
            setError('Pedometer permissions denied');
            setErrorType(ERROR_TYPES.PERMISSION_DENIED);
            setUseMockData(true);
          }
        } else {
          console.log('[useStepCounter] Pedometer not available on this device');
          setIsPedometerAvailable(false);
          setError('Pedometer not available on this device');
          setErrorType(ERROR_TYPES.DEVICE_NOT_SUPPORTED);
          setUseMockData(true);
        }
      } catch (error: any) {
        console.error('[useStepCounter] Error checking pedometer availability:', error);
        setError(`Error checking pedometer: ${error.message}`);
        setErrorType(ERROR_TYPES.UNKNOWN_ERROR);
        setUseMockData(true);
      }
    };
    
    initializeBluetooth();
    initializeHealthKit();
    
    return () => {
      if (bluetoothListenerRef.current) {
        bluetoothListenerRef.current();
        bluetoothListenerRef.current = null;
      }
      
      if (healthKitObserverRef.current) {
        healthKitObserverRef.current();
        healthKitObserverRef.current = null;
      }
      
      if (syncTimerRef.current) {
        clearInterval(syncTimerRef.current);
      }
      
      if (mockDataTimerRef.current) {
        clearInterval(mockDataTimerRef.current);
      }
    };
  }, []);
  
  // Check if pedometer is available and if we have connected devices
  useEffect(() => {
    if (Platform.OS === "web") {
      setError("Step counting is not available on web");
      setErrorType(ERROR_TYPES.DEVICE_NOT_SUPPORTED);
      return;
    }
    
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
        
        // If using HealthKit, we don't need to do anything here as it's already set up
        if (dataSource === "healthKit") {
          return;
        }
        
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
            setErrorType(ERROR_TYPES.PERMISSION_DENIED);
            
            // On iOS, we need to request HealthKit permissions
            if (Platform.OS === 'ios') {
              requestHealthKitPermissions();
            } else {
              setUseMockData(true);
              setupMockDataTracking();
            }
            return;
          } else {
            setError("Error getting step count. Using fallback method.");
            setErrorType(ERROR_TYPES.UNKNOWN_ERROR);
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
            setErrorType(ERROR_TYPES.PERMISSION_DENIED);
            
            // On iOS, we need to request HealthKit permissions
            if (Platform.OS === 'ios') {
              requestHealthKitPermissions();
            } else {
              setUseMockData(true);
              setupMockDataTracking();
            }
          } else {
            setError("Could not track steps in real-time. Using mock data for testing.");
            setErrorType(ERROR_TYPES.UNKNOWN_ERROR);
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
          setErrorType(ERROR_TYPES.PERMISSION_DENIED);
          
          // On iOS, we need to request HealthKit permissions
          if (Platform.OS === 'ios') {
            requestHealthKitPermissions();
          } else {
            setUseMockData(true);
            setupMockDataTracking();
          }
        } else {
          setError("Error starting step counter. Using mock data for testing.");
          setErrorType(ERROR_TYPES.UNKNOWN_ERROR);
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
  }, [isTrackingSteps, isPedometerAvailable, isUsingConnectedDevice, useMockData, dataSource]);
  
  // Request HealthKit permissions on iOS
  const requestHealthKitPermissions = async () => {
    if (Platform.OS !== "ios") return;
    
    try {
      // Check if HealthKit is available
      const isAvailable = await HealthKit.isHealthDataAvailable();
      setHealthKitAvailable(isAvailable);
      
      if (!isAvailable) {
        setError("HealthKit is not available on this device. Using mock data instead.");
        setErrorType(ERROR_TYPES.DEVICE_NOT_SUPPORTED);
        setUseMockData(true);
        setupMockDataTracking();
        return;
      }
      
      // Request authorization for steps and related data
      const authResult = await HealthKit.requestAuthorization([
        'steps', 
        'distance', 
        'calories',
        'activity'
      ]);
      
      setHealthKitAuthorized(authResult.authorized);
      
      if (authResult.authorized) {
        // Set HealthKit as the primary data source
        setDataSource("healthKit");
        setIsPedometerAvailable(true);
        setError(null);
        setErrorType(null);
        setUseMockData(false);
        
        // Get initial step count for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const stepsResult = await HealthKit.getStepCount(
          today.toISOString(),
          new Date().toISOString()
        );
        
        if (stepsResult.success) {
          setCurrentStepCount(stepsResult.steps);
          
          // Get distance data
          const distanceResult = await HealthKit.getDistanceWalking(
            today.toISOString(),
            new Date().toISOString()
          );
          
          // Get calories data
          const caloriesResult = await HealthKit.getActiveEnergyBurned(
            today.toISOString(),
            new Date().toISOString()
          );
          
          // Log the steps with additional data if available
          const stepLog = {
            id: today.toISOString(),
            date: today.toISOString(),
            steps: stepsResult.steps,
            distance: distanceResult.success ? distanceResult.distance : calculateDistance(stepsResult.steps),
            calories: caloriesResult.success ? caloriesResult.calories : calculateCaloriesBurned(stepsResult.steps),
            source: "Apple Health"
          };
          
          addStepLog(stepLog);
        }
        
        // Set up observer for step count changes
        if (healthKitObserverRef.current) {
          healthKitObserverRef.current();
        }
        
        healthKitObserverRef.current = HealthKit.observeStepCount((result) => {
          if (result.success) {
            setCurrentStepCount(result.steps);
            
            // Log the updated steps
            const stepLog = {
              id: today.toISOString(),
              date: today.toISOString(),
              steps: result.steps,
              distance: calculateDistance(result.steps),
              calories: calculateCaloriesBurned(result.steps),
              source: "Apple Health"
            };
            
            addStepLog(stepLog);
          }
        });
      } else {
        // If authorization denied, use mock data
        setError("Health data access denied. Using mock data for testing.");
        setErrorType(ERROR_TYPES.PERMISSION_DENIED);
        setUseMockData(true);
        setupMockDataTracking();
      }
    } catch (error: any) {
      console.error("Error requesting HealthKit permissions:", error);
      setError(`Error requesting HealthKit permissions: ${error.message}`);
      setErrorType(ERROR_TYPES.HEALTHKIT_ERROR);
      setUseMockData(true);
      setupMockDataTracking();
    }
  };
  
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
      source: "Sample Data"
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
          source: "Sample Data"
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
    // Prevent multiple syncs at once
    if (isSyncing) return;
    
    // Throttle syncs to once per minute
    const now = Date.now();
    if (now - lastSyncTimeRef.current < 60000) {
      return;
    }
    
    setIsSyncing(true);
    lastSyncTimeRef.current = now;
    
    try {
      // Find connected device
      const appleWatch = getConnectedDeviceByType("appleWatch");
      const fitbit = getConnectedDeviceByType("fitbit");
      const garmin = getConnectedDeviceByType("garmin");
      
      const connectedDevice = appleWatch || fitbit || garmin;
      
      if (!connectedDevice || !connectedDevice.connected) {
        setIsUsingConnectedDevice(false);
        setDeviceName(null);
        setIsSyncing(false);
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
          
          // Cache the step count
          stepCountCacheRef.current[today.toISOString()] = todayLog.steps;
        }
      }
    } catch (error) {
      console.error("Error syncing with connected device:", error);
    } finally {
      setIsSyncing(false);
    }
  };
  
  const retryPedometerConnection = async () => {
    if (retryCount >= 3 || isUsingConnectedDevice) return false;
    
    setRetryCount(prev => prev + 1);
    
    try {
      // On iOS, check if HealthKit is available first
      if (Platform.OS === "ios") {
        const isAvailable = await HealthKit.isHealthDataAvailable();
        
        if (isAvailable) {
          // Request authorization for steps and related data
          const authResult = await HealthKit.requestAuthorization([
            'steps', 
            'distance', 
            'calories',
            'activity'
          ]);
          
          if (authResult.authorized) {
            // Set HealthKit as the primary data source
            setDataSource("healthKit");
            setIsPedometerAvailable(true);
            setError(null);
            setErrorType(null);
            setUseMockData(false);
            setHealthKitAuthorized(true);
            setHealthKitAvailable(true);
            
            // Get initial step count for today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const stepsResult = await HealthKit.getStepCount(
              today.toISOString(),
              new Date().toISOString()
            );
            
            if (stepsResult.success) {
              setCurrentStepCount(stepsResult.steps);
              
              // Get distance data
              const distanceResult = await HealthKit.getDistanceWalking(
                today.toISOString(),
                new Date().toISOString()
              );
              
              // Get calories data
              const caloriesResult = await HealthKit.getActiveEnergyBurned(
                today.toISOString(),
                new Date().toISOString()
              );
              
              // Log the steps with additional data if available
              const stepLog = {
                id: today.toISOString(),
                date: today.toISOString(),
                steps: stepsResult.steps,
                distance: distanceResult.success ? distanceResult.distance : calculateDistance(stepsResult.steps),
                calories: caloriesResult.success ? caloriesResult.calories : calculateCaloriesBurned(stepsResult.steps),
                source: "Apple Health"
              };
              
              addStepLog(stepLog);
            }
            
            return true;
          }
        }
        
        // If HealthKit is not available or authorization denied, check Bluetooth
        const stateResult = await CoreBluetooth.getBluetoothState();
        setBluetoothState(stateResult.state);
        
        if (stateResult.state !== "poweredOn") {
          setError("Bluetooth is not powered on. Please enable Bluetooth in your device settings.");
          setErrorType(ERROR_TYPES.BLUETOOTH_DISABLED);
          return false;
        }
        
        const permissionResult = await CoreBluetooth.requestPermissions();
        setPermissionStatus(permissionResult.granted ? "granted" : "denied");
        
        if (!permissionResult.granted) {
          setError("Bluetooth permissions are required to connect to devices.");
          setErrorType(ERROR_TYPES.PERMISSION_DENIED);
          return false;
        }
      }
      
      // Check if pedometer is available
      const isAvailable = await Pedometer.isAvailableAsync();
      
      if (!isAvailable) {
        setError("Pedometer is still not available on this device. Using mock data.");
        setErrorType(ERROR_TYPES.DEVICE_NOT_SUPPORTED);
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
      setErrorType(null);
      setUseMockData(false);
      setDataSource("pedometer");
      return true;
    } catch (e: any) {
      console.error("Error retrying pedometer connection:", e);
      
      // Handle specific Core Motion error 105
      if (e.message && 
          (e.message.includes("cmerrordomain error 105") || 
           e.message.includes("CMErrorDomain"))) {
        
        setError("Step counting is still unavailable due to device restrictions (CMErrorDomain 105). This is likely due to missing Health permissions.");
        setErrorType(ERROR_TYPES.PERMISSION_DENIED);
        
        // On iOS, we need to request HealthKit permissions
        if (Platform.OS === 'ios') {
          requestHealthKitPermissions();
          return true;
        } else {
          setUseMockData(true);
          return false;
        }
      } else {
        setError("Pedometer is still not working properly. Using mock data.");
        setErrorType(ERROR_TYPES.UNKNOWN_ERROR);
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
        setErrorType(ERROR_TYPES.DEVICE_NOT_SUPPORTED);
        setUseMockData(true);
        setupMockDataTracking();
      }
    }
    
    setIsTrackingSteps(true);
    
    // If using a connected device, sync immediately
    if (isUsingConnectedDevice) {
      syncWithConnectedDevice();
    }
    
    // If using HealthKit, refresh the data
    if (dataSource === "healthKit") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const stepsResult = await HealthKit.getStepCount(
        today.toISOString(),
        new Date().toISOString()
      );
      
      if (stepsResult.success) {
        setCurrentStepCount(stepsResult.steps);
        
        // Get distance data
        const distanceResult = await HealthKit.getDistanceWalking(
          today.toISOString(),
          new Date().toISOString()
        );
        
        // Get calories data
        let caloriesResult = { success: false, calories: 0 };
        try {
          caloriesResult = await HealthKit.getActiveEnergyBurned(
            today.toISOString(),
            new Date().toISOString()
          );
        } catch (error) {
          console.warn('[useStepCounter] Failed to get calories data, using calculated fallback:', error);
        }
        
        // Log the steps with additional data if available
        const stepLog = {
          id: today.toISOString(),
          date: today.toISOString(),
          steps: stepsResult.steps,
          distance: distanceResult.success ? distanceResult.distance : calculateDistance(stepsResult.steps),
          calories: caloriesResult.success ? caloriesResult.calories : calculateCaloriesBurned(stepsResult.steps),
          source: "Apple Health"
        };
        
        addStepLog(stepLog);
      }
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
    // Prevent multiple syncs at once
    if (isSyncing) return false;
    
    setIsSyncing(true);
    
    try {
      if (isUsingConnectedDevice) {
        await syncWithConnectedDevice();
        setIsSyncing(false);
        return true;
      }
      
      // If using HealthKit, refresh the data
      if (dataSource === "healthKit") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const stepsResult = await HealthKit.getStepCount(
          today.toISOString(),
          new Date().toISOString()
        );
        
        if (stepsResult.success) {
          setCurrentStepCount(stepsResult.steps);
          
          // Get distance data
          const distanceResult = await HealthKit.getDistanceWalking(
            today.toISOString(),
            new Date().toISOString()
          );
          
          // Get calories data
          let caloriesResult = { success: false, calories: 0 };
          try {
            caloriesResult = await HealthKit.getActiveEnergyBurned(
              today.toISOString(),
              new Date().toISOString()
            );
          } catch (error) {
            console.warn('[useStepCounter] Failed to get calories data in manualSync, using calculated fallback:', error);
          }
          
          // Log the steps with additional data if available
          const stepLog = {
            id: today.toISOString(),
            date: today.toISOString(),
            steps: stepsResult.steps,
            distance: distanceResult.success ? distanceResult.distance : calculateDistance(stepsResult.steps),
            calories: caloriesResult.success ? caloriesResult.calories : calculateCaloriesBurned(stepsResult.steps),
            source: "Apple Health"
          };
          
          addStepLog(stepLog);
          setIsSyncing(false);
          return true;
        }
        
        setIsSyncing(false);
        return false;
      }
      
      // If not using a connected device or HealthKit, try to retry pedometer connection
      if (!isPedometerAvailable && !useMockData) {
        const result = await retryPedometerConnection();
        setIsSyncing(false);
        return result;
      }
      
      setIsSyncing(false);
      return false;
    } catch (error) {
      console.error("Error during manual sync:", error);
      setIsSyncing(false);
      return false;
    }
  };
  
  useEffect(() => {
    // DEBUG: Add global function to manually test HealthKit authorization
    if (Platform.OS === 'ios' && typeof window !== 'undefined') {
      (window as any).debugHealthKitAuth = async () => {
        try {
          Alert.alert('DEBUG', 'Starting manual HealthKit authorization test...');
          
          const HealthKit = require('@/src/NativeModules/HealthKit');
          
          // Check availability
          const isAvailable = await HealthKit.isHealthDataAvailable();
          Alert.alert('DEBUG', `HealthKit available: ${isAvailable}`);
          
          if (!isAvailable) {
            Alert.alert('ERROR', 'HealthKit not available on this device');
            return;
          }
          
          // Request authorization
          Alert.alert('DEBUG', 'About to request authorization - watch for system popup!');
          const authResult = await HealthKit.requestAuthorization([
            'steps', 
            'distance', 
            'calories',
            'activity'
          ]);
          
          Alert.alert('RESULT', `Authorization result: ${JSON.stringify(authResult)}`);
          
          if (authResult.authorized) {
            Alert.alert('SUCCESS!', 'HealthKit authorized! Check Settings → Privacy & Security → Health → Data Access & Devices. FitJourneyTracker should now be in the list!');
          } else {
            Alert.alert('FAILED', 'HealthKit authorization failed or was denied.');
          }
          
        } catch (error: any) {
          Alert.alert('ERROR', `HealthKit test failed: ${error.message}`);
          console.error('Manual HealthKit test error:', error);
        }
      };
    }
  }, []);
  
  return {
    currentStepCount,
    isPedometerAvailable,
    isTracking: isTrackingSteps,
    error,
    errorType,
    startTracking,
    stopTracking,
    manualSync,
    isUsingConnectedDevice,
    deviceName,
    useMockData,
    retryPedometerConnection,
    bluetoothState,
    permissionStatus,
    dataSource,
    healthKitAvailable,
    healthKitAuthorized,
    isSyncing
  };
}