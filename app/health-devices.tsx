import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Platform, ActivityIndicator } from "react-native";
import { useRouter, Stack } from "expo-router";
import { Smartphone, Watch, Bluetooth, RefreshCw, Plus, ChevronRight, ArrowLeft, Zap, Trash2, AlertTriangle, CheckCircle2 } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useHealthStore } from "@/store/healthStore";
import { HealthDevice } from "@/types";
import Button from "@/components/Button";
import * as ExpoDevice from "expo-device";

// Import the CoreBluetooth module
import CoreBluetooth from "../src/NativeModules/CoreBluetooth";

export default function HealthDevicesScreen() {
  const router = useRouter();
  const { 
    connectedDevices, 
    addDevice, 
    updateDevice, 
    removeDevice,
    importDataFromDevice,
    getLastSyncTimeForDevice,
    getDeviceSyncHistory
  } = useHealthStore();
  
  const [isScanning, setIsScanning] = useState(false);
  const [isSyncing, setIsSyncing] = useState<Record<string, boolean>>({});
  const [availableDevices, setAvailableDevices] = useState<any[]>([]);
  const [showAvailableDevices, setShowAvailableDevices] = useState(false);
  const [bluetoothError, setBluetoothError] = useState<string | null>(null);
  const [bluetoothState, setBluetoothState] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<"unknown" | "granted" | "denied">("unknown");
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Initialize Bluetooth and check permissions
  useEffect(() => {
    const initializeBluetooth = async () => {
      setIsInitializing(true);
      
      try {
        // Check Bluetooth state
        const stateResult = await CoreBluetooth.getBluetoothState();
        setBluetoothState(stateResult.state);
        
        if (stateResult.state !== "poweredOn") {
          setBluetoothError("Bluetooth is not powered on. Please enable Bluetooth in your device settings.");
        } else {
          setBluetoothError(null);
        }
        
        // Request permissions if on iOS
        if (Platform.OS === 'ios') {
          const permissionResult = await CoreBluetooth.requestPermissions();
          setPermissionStatus(permissionResult.granted ? "granted" : "denied");
          
          if (!permissionResult.granted) {
            setBluetoothError("Bluetooth permissions are required to scan for devices. Please enable them in your device settings.");
          }
        }
      } catch (error: any) {
        console.error("Error initializing Bluetooth:", error);
        setBluetoothError(`Error initializing Bluetooth: ${error.message}`);
      } finally {
        setIsInitializing(false);
      }
    };
    
    initializeBluetooth();
  }, []);
  
  // Set up Bluetooth event listeners
  useEffect(() => {
    if (Platform.OS !== 'ios') {
      setBluetoothState("unavailable");
      setBluetoothError("Core Bluetooth is only available on iOS");
      return;
    }

    // Listen for Bluetooth state changes
    const stateListener = CoreBluetooth.addListener(
      'bluetoothStateChanged',
      (event) => {
        setBluetoothState(event.state);
        
        if (event.state !== 'poweredOn') {
          setBluetoothError("Bluetooth is not powered on. Please enable Bluetooth in your device settings.");
        } else {
          setBluetoothError(null);
        }
      }
    );

    // Listen for discovered devices
    const discoveryListener = CoreBluetooth.addListener(
      'deviceDiscovered',
      (device) => {
        // Check if we already have this device in the list
        setAvailableDevices(prevDevices => {
          const exists = prevDevices.some(d => d.id === device.id);
          if (exists) return prevDevices;
          
          // Determine device type based on name
          const deviceType = getDeviceType(device.name);
          const deviceModel = getDeviceModel(device.name);
          
          const newDevice = {
            ...device,
            type: deviceType,
            model: deviceModel,
            batteryLevel: device.batteryLevel || (deviceType === 'appleWatch' ? 85 : undefined)
          };
          
          return [...prevDevices, newDevice];
        });
        
        setShowAvailableDevices(true);
      }
    );

    // Listen for device connection events
    const connectionListener = CoreBluetooth.addListener(
      'deviceConnected',
      (event) => {
        const device = availableDevices.find(d => d.id === event.id);
        if (device) {
          Alert.alert(
            "Device Connected",
            `${device.name} has been connected successfully. You can now sync your health data.`,
            [{ text: "OK" }]
          );
          
          // Add the device to the store
          const newDevice: HealthDevice = {
            id: device.id,
            name: device.name,
            type: device.type,
            model: device.model,
            connected: true,
            lastSynced: new Date().toISOString(),
            capabilities: getDeviceCapabilities(device.type),
            batteryLevel: device.batteryLevel || 100,
          };
          
          addDevice(newDevice);
          setShowAvailableDevices(false);
        }
      }
    );

    // Listen for device disconnection events
    const disconnectionListener = CoreBluetooth.addListener(
      'deviceDisconnected',
      (event) => {
        const device = connectedDevices.find(d => d.id === event.id);
        if (device) {
          updateDevice({
            ...device,
            connected: false,
          });
          
          Alert.alert(
            "Device Disconnected",
            `${device.name} has been disconnected.`,
            [{ text: "OK" }]
          );
        }
      }
    );
    
    // Listen for connection errors
    const errorListener = CoreBluetooth.addListener(
      'connectionError',
      (event) => {
        Alert.alert(
          "Connection Error",
          `Failed to connect to device: ${event.error}`,
          [{ text: "OK" }]
        );
      }
    );

    // Clean up listeners when component unmounts
    return () => {
      stateListener();
      discoveryListener();
      connectionListener();
      disconnectionListener();
      errorListener();
    };
  }, [availableDevices, connectedDevices, addDevice, updateDevice]);
  
  const handleScanDevices = async () => {
    setBluetoothError(null);
    setIsScanning(true);
    setShowAvailableDevices(false);
    setAvailableDevices([]);
    
    if (Platform.OS !== 'ios') {
      setIsScanning(false);
      setBluetoothError("Core Bluetooth is only available on iOS");
      return;
    }
    
    // Check Bluetooth state before scanning
    try {
      const stateResult = await CoreBluetooth.getBluetoothState();
      
      if (stateResult.state !== "poweredOn") {
        setBluetoothState(stateResult.state);
        setBluetoothError("Bluetooth is not powered on. Please enable Bluetooth in your device settings.");
        setIsScanning(false);
        return;
      }
      
      // Check permissions before scanning
      if (permissionStatus !== "granted") {
        const permissionResult = await CoreBluetooth.requestPermissions();
        setPermissionStatus(permissionResult.granted ? "granted" : "denied");
        
        if (!permissionResult.granted) {
          setBluetoothError("Bluetooth permissions are required to scan for devices. Please enable them in your device settings.");
          setIsScanning(false);
          return;
        }
      }
      
      // Start scanning for Bluetooth devices
      await CoreBluetooth.startScan();
      
      // Set a timeout to stop scanning after 10 seconds
      setTimeout(async () => {
        if (isScanning) {
          await CoreBluetooth.stopScan();
          setIsScanning(false);
          
          if (availableDevices.length === 0) {
            setBluetoothError("No compatible devices found nearby. Make sure your device is in pairing mode and try again.");
          }
        }
      }, 10000);
    } catch (error: any) {
      console.error("Error scanning for devices:", error);
      setBluetoothError(error.message || "An error occurred while scanning for devices");
      setIsScanning(false);
    }
  };
  
  const handleConnectDevice = async (device: any) => {
    try {
      // Show pairing request dialog
      Alert.alert(
        "Pairing Request",
        `"Fitness App" would like to pair with "${device.name}". ${
          device.type === "appleWatch" 
            ? "Check your Apple Watch to approve this connection."
            : "Check your device to approve this connection."
        }`,
        [
          { 
            text: "Cancel", 
            style: "cancel" 
          },
          { 
            text: "Pair", 
            onPress: async () => {
              try {
                // Connect to the device
                await CoreBluetooth.connect(device.id);
                
                // The connection result will be handled by the event listener
              } catch (error: any) {
                console.error("Error connecting to device:", error);
                Alert.alert(
                  "Connection Error",
                  error.message || "An error occurred while connecting to the device",
                  [{ text: "OK" }]
                );
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error("Error connecting to device:", error);
      Alert.alert(
        "Connection Error",
        "An unexpected error occurred while connecting to the device",
        [{ text: "OK" }]
      );
    }
  };
  
  const handleSyncDevice = async (deviceId: string) => {
    setIsSyncing(prev => ({ ...prev, [deviceId]: true }));
    
    try {
      // Get the device
      const device = connectedDevices.find(d => d.id === deviceId);
      
      if (!device) {
        throw new Error("Device not found");
      }
      
      // Show a syncing dialog
      Alert.alert(
        "Syncing",
        `Syncing data from ${device.name}...`,
        []
      );
      
      // In a real app, this would use HealthKit or Google Fit APIs
      // to import data from the connected device
      
      // Import all data types from the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const success = await importDataFromDevice(
        deviceId,
        "all",
        sevenDaysAgo.toISOString(),
        new Date().toISOString()
      );
      
      if (success) {
        Alert.alert(
          "Sync Complete",
          "Your health data has been successfully synced.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Sync Failed",
          "There was an error syncing your health data. Please try again.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error syncing device:", error);
      Alert.alert(
        "Sync Error",
        "An unexpected error occurred while syncing your device.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSyncing(prev => ({ ...prev, [deviceId]: false }));
    }
  };
  
  const toggleDeviceConnection = async (device: HealthDevice) => {
    if (!device.connected) {
      // If reconnecting, show a confirmation dialog
      Alert.alert(
        "Reconnect Device",
        `Would you like to reconnect to ${device.name}?`,
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Reconnect", 
            onPress: async () => {
              try {
                // Connect to the device using Core Bluetooth
                await CoreBluetooth.connect(device.id);
                
                // The connection result will be handled by the event listener
              } catch (error: any) {
                console.error("Error reconnecting to device:", error);
                Alert.alert(
                  "Reconnection Error",
                  error.message || "An error occurred while reconnecting to the device",
                  [{ text: "OK" }]
                );
              }
            }
          }
        ]
      );
    } else {
      // If disconnecting, show a confirmation dialog
      Alert.alert(
        "Disconnect Device",
        `Are you sure you want to disconnect from ${device.name}?`,
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Disconnect", 
            onPress: async () => {
              try {
                // Disconnect from the device using Core Bluetooth
                await CoreBluetooth.disconnect(device.id);
                
                // The disconnection result will be handled by the event listener
              } catch (error: any) {
                console.error("Error disconnecting from device:", error);
                Alert.alert(
                  "Disconnection Error",
                  error.message || "An error occurred while disconnecting from the device",
                  [{ text: "OK" }]
                );
              }
            }
          }
        ]
      );
    }
  };
  
  const handleRemoveDevice = (deviceId: string) => {
    Alert.alert(
      "Remove Device",
      "Are you sure you want to remove this device? Your synced data will remain, but you won't receive new data from this device.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: () => {
            // Disconnect from the device if it's connected
            const device = connectedDevices.find(d => d.id === deviceId);
            if (device && device.connected) {
              CoreBluetooth.disconnect(deviceId).catch(error => {
                console.error("Error disconnecting device:", error);
              });
            }
            
            // Remove the device from the store
            removeDevice(deviceId);
          },
          style: "destructive",
        },
      ]
    );
  };
  
  const handleGoBack = () => {
    router.navigate("/(tabs)");
  };
  
  const getDeviceCapabilities = (deviceType: string): string[] => {
    switch (deviceType) {
      case "appleWatch":
        return ["steps", "heartRate", "workouts", "sleep", "standHours", "bloodOxygen"];
      case "fitbit":
        return ["steps", "heartRate", "workouts", "sleep"];
      case "garmin":
        return ["steps", "heartRate", "workouts", "sleep", "stress"];
      case "samsung":
        return ["steps", "heartRate", "workouts", "sleep", "stress"];
      case "whoop":
        return ["heartRate", "sleep", "recovery", "strain"];
      case "xiaomi":
        return ["steps", "heartRate", "sleep"];
      default:
        return ["steps"];
    }
  };
  
  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "appleWatch":
        return <Watch size={24} color={colors.primary} />;
      case "fitbit":
        return <Watch size={24} color="#00B0B9" />;
      case "garmin":
        return <Watch size={24} color="#006CC1" />;
      case "samsung":
        return <Watch size={24} color="#1428A0" />;
      case "whoop":
        return <Watch size={24} color="#00A550" />;
      case "xiaomi":
        return <Watch size={24} color="#FF6700" />;
      default:
        return <Smartphone size={24} color={colors.primary} />;
    }
  };
  
  const getLastSyncText = (device: HealthDevice) => {
    if (!device.lastSynced) return "Never synced";
    
    const lastSyncTime = new Date(device.lastSynced);
    const now = new Date();
    const diffMs = now.getTime() - lastSyncTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  };
  
  // Helper function to determine device type from name
  const getDeviceType = (deviceName: string): string => {
    const name = deviceName.toLowerCase();
    if (name.includes("apple") || name.includes("watch")) return "appleWatch";
    if (name.includes("fitbit")) return "fitbit";
    if (name.includes("garmin")) return "garmin";
    if (name.includes("samsung") || name.includes("galaxy")) return "samsung";
    if (name.includes("whoop")) return "whoop";
    if (name.includes("xiaomi") || name.includes("mi band")) return "xiaomi";
    return "unknown";
  };
  
  // Helper function to determine device model from name
  const getDeviceModel = (deviceName: string): string => {
    const name = deviceName.toLowerCase();
    
    if (name.includes("apple") || name.includes("watch")) {
      if (name.includes("series 7")) return "Series 7";
      if (name.includes("series 8")) return "Series 8";
      if (name.includes("ultra")) return "Ultra";
      return "Apple Watch";
    }
    
    if (name.includes("fitbit")) {
      if (name.includes("versa")) return "Versa";
      if (name.includes("sense")) return "Sense";
      if (name.includes("charge")) return "Charge";
      return "Fitbit";
    }
    
    if (name.includes("garmin")) {
      if (name.includes("forerunner")) return "Forerunner";
      if (name.includes("fenix")) return "Fenix";
      if (name.includes("venu")) return "Venu";
      return "Garmin";
    }
    
    if (name.includes("samsung") || name.includes("galaxy")) {
      if (name.includes("watch 5")) return "Galaxy Watch 5";
      if (name.includes("watch 4")) return "Galaxy Watch 4";
      return "Galaxy Watch";
    }
    
    if (name.includes("whoop")) {
      if (name.includes("4.0")) return "4.0";
      return "WHOOP";
    }
    
    if (name.includes("xiaomi") || name.includes("mi band")) {
      if (name.includes("7")) return "Mi Band 7";
      if (name.includes("6")) return "Mi Band 6";
      return "Mi Band";
    }
    
    return "Unknown Model";
  };
  
  // Render loading state
  if (isInitializing) {
    return (
      <View style={[styles.mainContainer, styles.loadingContainer]}>
        <Stack.Screen 
          options={{
            title: "Health Devices",
            headerBackTitle: "Health",
            headerLeft: () => (
              <TouchableOpacity onPress={handleGoBack} style={styles.headerBackButton}>
                <ArrowLeft size={24} color={colors.primary} />
              </TouchableOpacity>
            ),
          }}
        />
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Initializing Bluetooth...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.mainContainer}>
      <Stack.Screen 
        options={{
          title: "Health Devices",
          headerBackTitle: "Health",
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.headerBackButton}>
              <ArrowLeft size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Connected Devices</Text>
          <Text style={styles.subtitle}>Manage your health tracking devices and sync data</Text>
        </View>
        
        {/* Bluetooth Status Banner */}
        <View style={[
          styles.bluetoothStatusBanner, 
          { 
            backgroundColor: bluetoothState === "poweredOn" 
              ? "rgba(76, 217, 100, 0.1)" 
              : "rgba(255, 59, 48, 0.1)" 
          }
        ]}>
          {bluetoothState === "poweredOn" ? (
            <View style={styles.bluetoothStatusContent}>
              <CheckCircle2 size={20} color="#4CD964" />
              <Text style={[styles.bluetoothStatusText, { color: "#4CD964" }]}>
                Bluetooth is enabled and ready
              </Text>
            </View>
          ) : (
            <View style={styles.bluetoothStatusContent}>
              <AlertTriangle size={20} color="#FF3B30" />
              <Text style={[styles.bluetoothStatusText, { color: "#FF3B30" }]}>
                {bluetoothError || "Bluetooth is not available or is turned off"}
              </Text>
            </View>
          )}
          
          {bluetoothState !== "poweredOn" && (
            <TouchableOpacity 
              style={styles.bluetoothSettingsButton}
              onPress={() => {
                Alert.alert(
                  "Enable Bluetooth",
                  "Please open your device settings and enable Bluetooth.",
                  [{ text: "OK" }]
                );
              }}
            >
              <Text style={styles.bluetoothSettingsText}>Open Settings</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Permission Status Banner (iOS only) */}
        {Platform.OS === 'ios' && permissionStatus !== "granted" && (
          <View style={[styles.bluetoothWarning, { backgroundColor: "rgba(255, 149, 0, 0.1)" }]}>
            <View style={styles.bluetoothStatusContent}>
              <AlertTriangle size={20} color="#FF9500" />
              <Text style={[styles.bluetoothWarningText, { color: "#FF9500" }]}>
                Bluetooth permissions are required to scan for devices
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.bluetoothSettingsButton, { backgroundColor: "#FF9500" }]}
              onPress={async () => {
                try {
                  const result = await CoreBluetooth.requestPermissions();
                  setPermissionStatus(result.granted ? "granted" : "denied");
                  
                  if (!result.granted) {
                    Alert.alert(
                      "Permissions Required",
                      "Please enable Bluetooth permissions in your device settings to scan for devices.",
                      [{ text: "OK" }]
                    );
                  }
                } catch (error) {
                  console.error("Error requesting permissions:", error);
                }
              }}
            >
              <Text style={styles.bluetoothSettingsText}>Request Permissions</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.scanContainer}>
          <Button
            title={isScanning ? "Scanning..." : "Scan for Devices"}
            onPress={handleScanDevices}
            loading={isScanning}
            icon={<Bluetooth size={18} color={colors.primary} />}
            variant="outline"
            style={styles.scanButton}
            disabled={bluetoothState !== "poweredOn" || (Platform.OS === 'ios' && permissionStatus !== "granted")}
          />
          
          {bluetoothError && bluetoothState === "poweredOn" && (
            <Text style={styles.errorText}>{bluetoothError}</Text>
          )}
        </View>
        
        {showAvailableDevices && availableDevices.length > 0 && (
          <View style={styles.availableDevicesContainer}>
            <Text style={styles.sectionTitle}>Available Devices</Text>
            
            {availableDevices.map((device) => (
              <View key={device.id} style={styles.deviceCard}>
                <View style={styles.deviceInfo}>
                  <View style={[
                    styles.deviceIconContainer, 
                    device.type === "fitbit" ? { backgroundColor: "rgba(0, 176, 185, 0.1)" } :
                    device.type === "garmin" ? { backgroundColor: "rgba(0, 108, 193, 0.1)" } :
                    device.type === "samsung" ? { backgroundColor: "rgba(20, 40, 160, 0.1)" } :
                    device.type === "whoop" ? { backgroundColor: "rgba(0, 165, 80, 0.1)" } :
                    device.type === "xiaomi" ? { backgroundColor: "rgba(255, 103, 0, 0.1)" } :
                    { backgroundColor: "rgba(74, 144, 226, 0.1)" }
                  ]}>
                    {getDeviceIcon(device.type)}
                  </View>
                  
                  <View style={styles.deviceDetails}>
                    <Text style={styles.deviceName}>{device.name}</Text>
                    <Text style={styles.deviceStatus}>
                      {device.model}
                      {device.batteryLevel && ` • Battery: ${device.batteryLevel}%`}
                    </Text>
                    {device.rssi && (
                      <View style={styles.signalContainer}>
                        <Text style={styles.signalText}>
                          Signal: {device.rssi > -60 ? "Strong" : device.rssi > -80 ? "Good" : "Weak"}
                        </Text>
                        <View style={styles.signalBars}>
                          <View style={[
                            styles.signalBar, 
                            { backgroundColor: device.rssi > -90 ? colors.primary : colors.border }
                          ]} />
                          <View style={[
                            styles.signalBar, 
                            { backgroundColor: device.rssi > -80 ? colors.primary : colors.border }
                          ]} />
                          <View style={[
                            styles.signalBar, 
                            { backgroundColor: device.rssi > -70 ? colors.primary : colors.border }
                          ]} />
                          <View style={[
                            styles.signalBar, 
                            { backgroundColor: device.rssi > -60 ? colors.primary : colors.border }
                          ]} />
                        </View>
                      </View>
                    )}
                  </View>
                </View>
                
                <Button
                  title="Connect"
                  onPress={() => handleConnectDevice(device)}
                  size="small"
                  style={styles.connectButton}
                />
              </View>
            ))}
          </View>
        )}
        
        {connectedDevices.length > 0 ? (
          <View style={styles.devicesContainer}>
            {connectedDevices.map((device) => (
              <View key={device.id} style={styles.deviceCard}>
                <View style={styles.deviceInfo}>
                  <View style={[
                    styles.deviceIconContainer, 
                    device.type === "fitbit" ? { backgroundColor: "rgba(0, 176, 185, 0.1)" } :
                    device.type === "garmin" ? { backgroundColor: "rgba(0, 108, 193, 0.1)" } :
                    device.type === "samsung" ? { backgroundColor: "rgba(20, 40, 160, 0.1)" } :
                    device.type === "whoop" ? { backgroundColor: "rgba(0, 165, 80, 0.1)" } :
                    device.type === "xiaomi" ? { backgroundColor: "rgba(255, 103, 0, 0.1)" } :
                    { backgroundColor: "rgba(74, 144, 226, 0.1)" }
                  ]}>
                    {getDeviceIcon(device.type)}
                  </View>
                  
                  <View style={styles.deviceDetails}>
                    <Text style={styles.deviceName}>{device.name}</Text>
                    <Text style={styles.deviceStatus}>
                      {device.connected ? "Connected" : "Disconnected"}
                      {device.connected && device.lastSynced && (
                        ` • Last synced: ${getLastSyncText(device)}`
                      )}
                    </Text>
                    
                    {device.batteryLevel !== undefined && (
                      <View style={styles.batteryContainer}>
                        <View style={styles.batteryBar}>
                          <View 
                            style={[
                              styles.batteryLevel, 
                              { 
                                width: `${device.batteryLevel}%`,
                                backgroundColor: device.batteryLevel > 20 ? "#4CD964" : "#FF3B30"
                              }
                            ]} 
                          />
                        </View>
                        <Text style={styles.batteryText}>{device.batteryLevel}%</Text>
                      </View>
                    )}
                  </View>
                </View>
                
                <View style={styles.deviceActions}>
                  <Switch
                    trackColor={{ false: colors.inactive, true: colors.primary }}
                    thumbColor="#FFFFFF"
                    value={device.connected}
                    onValueChange={() => toggleDeviceConnection(device)}
                  />
                  
                  {device.connected && (
                    <TouchableOpacity
                      style={styles.syncButton}
                      onPress={() => handleSyncDevice(device.id)}
                      disabled={isSyncing[device.id]}
                    >
                      {isSyncing[device.id] ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                      ) : (
                        <>
                          <RefreshCw size={16} color={colors.primary} />
                          <Text style={styles.syncText}>Sync</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveDevice(device.id)}
                  >
                    <Trash2 size={16} color={colors.error} />
                  </TouchableOpacity>
                </View>
                
                {device.capabilities && device.capabilities.length > 0 && (
                  <View style={styles.capabilitiesContainer}>
                    <Text style={styles.capabilitiesTitle}>Data Types</Text>
                    <View style={styles.capabilitiesList}>
                      {device.capabilities.map((capability: string) => (
                        <View key={capability} style={styles.capabilityTag}>
                          <Text style={styles.capabilityText}>{capability}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Watch size={40} color={colors.textLight} />
            </View>
            <Text style={styles.emptyTitle}>No Devices Connected</Text>
            <Text style={styles.emptyText}>
              Connect your smartwatch or fitness tracker to automatically sync your health data
            </Text>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Services</Text>
          
          <TouchableOpacity 
            style={styles.serviceItem}
            onPress={() => {
              Alert.alert(
                "Apple Health",
                "This will allow the app to read and write health data from Apple Health. Would you like to connect?",
                [
                  { text: "Cancel", style: "cancel" },
                  { 
                    text: "Connect", 
                    onPress: () => {
                      // On iOS, this would open the Health app permissions screen
                      // For this simulation, we'll just show a success message
                      Alert.alert(
                        "Health Access Requested",
                        "Please open the Health app and approve the requested permissions.",
                        [
                          { 
                            text: "OK",
                            onPress: () => {
                              // Simulate the user approving the permissions
                              setTimeout(() => {
                                Alert.alert(
                                  "Apple Health Connected",
                                  "Your app is now connected to Apple Health. Your health data will be synced automatically.",
                                  [{ text: "OK" }]
                                );
                              }, 1000);
                            }
                          }
                        ]
                      );
                    }
                  }
                ]
              );
            }}
          >
            <View style={styles.serviceInfo}>
              <View style={[styles.serviceIcon, { backgroundColor: "rgba(74, 144, 226, 0.1)" }]}>
                <Zap size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.serviceName}>Apple Health</Text>
                <Text style={styles.serviceDescription}>Sync data with Apple Health</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.serviceItem}
            onPress={() => {
              Alert.alert(
                "Google Fit",
                "This will allow the app to read and write health data from Google Fit. Would you like to connect?",
                [
                  { text: "Cancel", style: "cancel" },
                  { 
                    text: "Connect", 
                    onPress: () => {
                      // On Android, this would open the Google Fit permissions screen
                      // For this simulation, we'll just show a success message
                      Alert.alert(
                        "Google Fit Connected",
                        "Your app is now connected to Google Fit. Your health data will be synced automatically.",
                        [{ text: "OK" }]
                      );
                    }
                  }
                ]
              );
            }}
          >
            <View style={styles.serviceInfo}>
              <View style={[styles.serviceIcon, { backgroundColor: "rgba(80, 200, 120, 0.1)" }]}>
                <RefreshCw size={20} color={colors.secondary} />
              </View>
              <View>
                <Text style={styles.serviceName}>Google Fit</Text>
                <Text style={styles.serviceDescription}>Sync data with Google Fit</Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.textLight} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingName}>Auto-sync when connected</Text>
              <Text style={styles.settingDescription}>Automatically sync data when devices are connected</Text>
            </View>
            <Switch
              trackColor={{ false: colors.inactive, true: colors.primary }}
              thumbColor="#FFFFFF"
              value={true}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingName}>Background sync</Text>
              <Text style={styles.settingDescription}>Sync data in the background periodically</Text>
            </View>
            <Switch
              trackColor={{ false: colors.inactive, true: colors.primary }}
              thumbColor="#FFFFFF"
              value={true}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.settingButton}
            onPress={() => {
              Alert.alert(
                "Sync All Devices",
                "This will sync data from all connected devices. Continue?",
                [
                  { text: "Cancel", style: "cancel" },
                  { 
                    text: "Sync", 
                    onPress: () => {
                      // Sync all connected devices
                      connectedDevices.forEach(device => {
                        if (device.connected) {
                          handleSyncDevice(device.id);
                        }
                      });
                    }
                  }
                ]
              );
            }}
          >
            <Text style={styles.settingButtonText}>Sync All Devices</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpText}>
            If you're having trouble connecting your device, make sure Bluetooth is enabled and your device is nearby.
            For Apple Watch, ensure that Health sharing is enabled in the Watch app.
          </Text>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpButtonText}>View Troubleshooting Guide</Text>
          </TouchableOpacity>
        </View>
        
        {/* Implementation Notes Section */}
        <View style={styles.implementationNotesSection}>
          <Text style={styles.implementationNotesTitle}>Developer Notes</Text>
          <Text style={styles.implementationNotesText}>
            This screen is using a simulated Core Bluetooth implementation. In a production app, you would need to:
          </Text>
          <View style={styles.implementationNotesList}>
            <Text style={styles.implementationNotesItem}>
              • Create a native iOS module using Swift/Objective-C that interfaces with CoreBluetooth framework
            </Text>
            <Text style={styles.implementationNotesItem}>
              • Implement proper permission handling for Bluetooth usage
            </Text>
            <Text style={styles.implementationNotesItem}>
              • Handle device discovery, connection, and data transfer using the CoreBluetooth APIs
            </Text>
            <Text style={styles.implementationNotesItem}>
              • Integrate with HealthKit for syncing health data
            </Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Back button at the bottom */}
      <View style={styles.bottomBackButtonContainer}>
        <TouchableOpacity 
          style={styles.bottomBackButton}
          onPress={handleGoBack}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
          <Text style={styles.bottomBackButtonText}>Back to Health</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 80, // Add extra padding at the bottom for the back button
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  bluetoothStatusBanner: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  bluetoothStatusContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  bluetoothStatusText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  bluetoothWarning: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  bluetoothWarningText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  bluetoothSettingsButton: {
    backgroundColor: colors.error,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  bluetoothSettingsText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 14,
  },
  scanContainer: {
    marginBottom: 24,
  },
  scanButton: {
    width: "100%",
  },
  errorText: {
    color: colors.error,
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
  },
  devicesContainer: {
    marginBottom: 24,
  },
  availableDevicesContainer: {
    marginBottom: 24,
  },
  deviceCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  deviceInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  deviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  deviceStatus: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  batteryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  batteryBar: {
    height: 6,
    width: 50,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: "hidden",
    marginRight: 8,
  },
  batteryLevel: {
    height: "100%",
    backgroundColor: "#4CD964",
  },
  batteryText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  signalContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  signalText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 8,
  },
  signalBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 12,
  },
  signalBar: {
    width: 3,
    marginHorizontal: 1,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  deviceActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  syncButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  syncText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
  },
  removeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  capabilitiesContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  capabilitiesTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
  },
  capabilitiesList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  capabilityTag: {
    backgroundColor: colors.highlight,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  capabilityText: {
    fontSize: 12,
    color: colors.primary,
  },
  connectButton: {
    alignSelf: "flex-end",
  },
  emptyContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  serviceItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  serviceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  settingItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  settingButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  helpSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  helpButton: {
    backgroundColor: colors.highlight,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  helpButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
  },
  headerBackButton: {
    padding: 8,
    marginLeft: 8,
  },
  bottomBackButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  bottomBackButton: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  bottomBackButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  implementationNotesSection: {
    backgroundColor: "rgba(255, 149, 0, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  implementationNotesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF9500",
    marginBottom: 8,
  },
  implementationNotesText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  implementationNotesList: {
    marginLeft: 8,
  },
  implementationNotesItem: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
    lineHeight: 20,
  },
});