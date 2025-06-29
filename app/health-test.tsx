import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import healthKitService from '../src/services/HealthKitService';

export default function HealthKitTest() {
  const [status, setStatus] = useState<string>('Not initialized');
  const [logs, setLogs] = useState<string[]>([]);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[HealthKitTest] ${message}`);
  };

  const testHealthKitAvailability = async () => {
    try {
      addLog('Testing HealthKit availability...');
      
      if (Platform.OS !== 'ios') {
        addLog('❌ Not on iOS - HealthKit unavailable');
        setIsAvailable(false);
        return;
      }

      const available = await healthKitService.initialize();
      
      setIsAvailable(available);
      addLog(available ? '✅ HealthKit is available!' : '❌ HealthKit is not available');
      
    } catch (error) {
      addLog(`❌ Error checking availability: ${error}`);
      setIsAvailable(false);
    }
  };

  const testHealthKitPermissions = async () => {
    try {
      addLog('Testing HealthKit permissions...');
      
      await healthKitService.initialize();
      
      const authorized = await healthKitService.requestAllAuthorizations();
      
      setIsAuthorized(authorized);
      addLog(authorized ? '✅ HealthKit permissions granted!' : '❌ HealthKit permissions denied');
      
    } catch (error) {
      addLog(`❌ Error requesting permissions: ${error}`);
      setIsAuthorized(false);
    }
  };

  const testStepCount = async () => {
    try {
      addLog('Testing step count retrieval...');
      
      await healthKitService.initialize();
      
      const steps = await healthKitService.getTodayStepCount();
      addLog(`✅ Today's steps: ${steps}`);
      
    } catch (error) {
      addLog(`❌ Error getting step count: ${error}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  useEffect(() => {
    addLog('HealthKit Test Screen loaded');
    testHealthKitAvailability();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView style={{ flex: 1, padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
          HealthKit Integration Test
        </Text>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>Status:</Text>
          <Text style={{ color: isAvailable === true ? 'green' : isAvailable === false ? 'red' : 'orange' }}>
            Available: {isAvailable === null ? 'Testing...' : isAvailable ? 'Yes' : 'No'}
          </Text>
          <Text style={{ color: isAuthorized === true ? 'green' : isAuthorized === false ? 'red' : 'orange' }}>
            Authorized: {isAuthorized === null ? 'Not tested' : isAuthorized ? 'Yes' : 'No'}
          </Text>
        </View>

        <View style={{ gap: 10, marginBottom: 20 }}>
          <TouchableOpacity
            style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 8 }}
            onPress={testHealthKitAvailability}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
              Test Availability
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ backgroundColor: '#34C759', padding: 15, borderRadius: 8 }}
            onPress={testHealthKitPermissions}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
              Request Permissions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ backgroundColor: '#FF9500', padding: 15, borderRadius: 8 }}
            onPress={testStepCount}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
              Test Step Count
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ backgroundColor: '#FF3B30', padding: 15, borderRadius: 8 }}
            onPress={clearLogs}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
              Clear Logs
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 10 }}>Logs:</Text>
          <ScrollView style={{ maxHeight: 300 }}>
            {logs.map((log, index) => (
              <Text key={index} style={{ fontSize: 12, fontFamily: 'monospace', marginBottom: 2 }}>
                {log}
              </Text>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 