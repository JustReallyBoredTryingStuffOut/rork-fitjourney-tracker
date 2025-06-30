import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform, NativeModules } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function HealthKitTest() {
  const router = useRouter();
  const [status, setStatus] = useState<string>('Not initialized');
  const [logs, setLogs] = useState<string[]>([]);
  const [nativeModulesList, setNativeModulesList] = useState<string[]>([]);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[HealthKitTest] ${message}`);
  };

  useEffect(() => {
    addLog('HealthKit Direct Test Screen loaded');
    addLog('This test uses multiple approaches to find react-native-health');
    
    // List all available native modules
    const modules = Object.keys(NativeModules);
    setNativeModulesList(modules);
    addLog(`Found ${modules.length} native modules`);
    
    // Look for health-related modules
    const healthModules = modules.filter(name => 
      name.toLowerCase().includes('health') || 
      name.toLowerCase().includes('apple') ||
      name.toLowerCase().includes('rn')
    );
    
    if (healthModules.length > 0) {
      addLog(`Health-related modules found: ${healthModules.join(', ')}`);
    } else {
      addLog('No health-related modules found');
    }
    
    // Check specific module names
    const moduleChecks = [
      'RNAppleHealthKit',
      'AppleHealthKit', 
      'HealthKit',
      'RNCAppleHealthKit',
      'ReactNativeAppleHealthKit'
    ];
    
    moduleChecks.forEach(moduleName => {
      if (NativeModules[moduleName]) {
        addLog(`✅ Found module: ${moduleName}`);
        addLog(`Module methods: ${Object.keys(NativeModules[moduleName]).join(', ')}`);
      } else {
        addLog(`❌ Module not found: ${moduleName}`);
      }
    });

    testHealthKitAvailability();
  }, []);

  const testHealthKitAvailability = async () => {
    try {
      addLog('Testing HealthKit availability...');
      
      if (Platform.OS !== 'ios') {
        addLog('❌ HealthKit only available on iOS');
        setIsAvailable(false);
        return;
      }

      addLog('🔍 Debugging react-native-health import...');
      
      // Test 1: Check if module exists in require cache
      try {
        const moduleInfo = require.resolve('react-native-health');
        addLog(`✅ Module resolved: ${moduleInfo}`);
      } catch (e: any) {
        addLog(`❌ Module resolution failed: ${e.message}`);
      }

      // Test 2: Direct require
      let healthModule;
      try {
        healthModule = require('react-native-health');
        addLog(`✅ Direct require successful`);
        addLog(`Module keys: ${Object.keys(healthModule).join(', ')}`);
        
        if (healthModule.default) {
          addLog(`Default export keys: ${Object.keys(healthModule.default).join(', ')}`);
        }
      } catch (e: any) {
        addLog(`❌ Direct require failed: ${e.message}`);
        setIsAvailable(false);
        return;
      }

      // Test 3: Try dynamic import
      try {
        const { default: AppleHealthKit } = await import('react-native-health');
        addLog(`✅ Dynamic import successful`);
        
        if (!AppleHealthKit) {
          addLog('❌ AppleHealthKit is null/undefined after import');
          setIsAvailable(false);
          return;
        }

        addLog(`AppleHealthKit type: ${typeof AppleHealthKit}`);
        
        if (typeof AppleHealthKit === 'object') {
          const methods = Object.keys(AppleHealthKit);
          addLog(`AppleHealthKit methods (${methods.length}): ${methods.join(', ')}`);
          
          // Check specific methods
          const requiredMethods = ['isAvailable', 'initHealthKit', 'getStepCount'];
          const missingMethods = requiredMethods.filter(method => !(AppleHealthKit as any)[method]);
          
          if (missingMethods.length > 0) {
            addLog(`❌ Missing methods: ${missingMethods.join(', ')}`);
          } else {
            addLog(`✅ All required methods present`);
          }

          // Test isAvailable method
          if (AppleHealthKit.isAvailable && typeof AppleHealthKit.isAvailable === 'function') {
            addLog('🧪 Testing isAvailable method...');
            
            try {
              AppleHealthKit.isAvailable((error: any, result: any) => {
                if (error) {
                  addLog(`❌ isAvailable callback error: ${error.message || error}`);
                  setIsAvailable(false);
                } else {
                  addLog(`✅ isAvailable callback result: ${JSON.stringify(result)}`);
                  setIsAvailable(result);
                }
              });
            } catch (e: any) {
              addLog(`❌ isAvailable method call failed: ${e.message}`);
              setIsAvailable(false);
            }
          } else {
            addLog(`❌ isAvailable is not a function: ${typeof AppleHealthKit.isAvailable}`);
            setIsAvailable(false);
          }
        } else {
          addLog(`❌ AppleHealthKit is not an object: ${typeof AppleHealthKit}`);
          setIsAvailable(false);
        }

      } catch (error: any) {
        addLog(`❌ Dynamic import failed: ${error.message}`);
        addLog(`❌ Error stack: ${error.stack}`);
        setIsAvailable(false);
      }

    } catch (error: any) {
      addLog(`❌ HealthKit availability test failed: ${error.message}`);
      setIsAvailable(false);
    }
  };

  const testHealthKitPermissions = async () => {
    try {
      addLog('🚨 CRITICAL TEST: Requesting HealthKit permissions...');
      
      if (!isAvailable) {
        addLog('❌ HealthKit not available - cannot request permissions');
        return;
      }

      // Try to import react-native-health
      const { default: AppleHealthKit } = await import('react-native-health');

      if (!AppleHealthKit) {
        addLog('❌ AppleHealthKit module not found');
        return;
      }

      const permissions: any = {
        permissions: {
          read: [
            'Steps',
            'DistanceWalkingRunning',
            'ActiveEnergyBurned',
            'HeartRate',
          ],
          write: [
            'Steps',
            'ActiveEnergyBurned',
          ],
        },
      };

      addLog('Requesting HealthKit authorization...');
      
      AppleHealthKit.initHealthKit(permissions, (error: any) => {
        if (error) {
          addLog(`❌ HealthKit authorization failed: ${error.message || error}`);
          setIsAuthorized(false);
        } else {
          addLog('✅ HealthKit authorization successful!');
          addLog('✅ Check iPhone Settings → Privacy & Security → Health');
          addLog('✅ Your app should now appear in the list!');
          setIsAuthorized(true);
        }
      });

    } catch (error: any) {
      addLog(`❌ Permission request failed: ${error.message}`);
      setIsAuthorized(false);
    }
  };

  const testStepCount = async () => {
    try {
      addLog('Testing step count retrieval...');
      
      if (!isAuthorized) {
        addLog('❌ HealthKit not authorized - cannot get step count');
        return;
      }

      const { default: AppleHealthKit } = await import('react-native-health');

      const options = {
        date: new Date().toISOString(),
        includeManuallyAdded: false,
      };

      AppleHealthKit.getStepCount(options, (error: any, result: any) => {
        if (error) {
          addLog(`❌ Step count error: ${error.message || error}`);
        } else {
          addLog(`✅ Step count: ${JSON.stringify(result)}`);
        }
      });

    } catch (error: any) {
      addLog(`❌ Step count test failed: ${error.message}`);
    }
  };

  const testDirectModuleAccess = () => {
    addLog('Testing direct native module access...');
    
    try {
      // Try different module names
      const possibleModules = [
        'RNAppleHealthKit',
        'AppleHealthKit', 
        'HealthKit',
        'RNCAppleHealthKit'
      ];
      
      let foundModule = null;
      for (const moduleName of possibleModules) {
        if (NativeModules[moduleName]) {
          foundModule = NativeModules[moduleName];
          addLog(`✅ Using module: ${moduleName}`);
          break;
        }
      }
      
      if (!foundModule) {
        addLog('❌ No HealthKit native module found');
        return;
      }
      
      // Test if the module has the expected methods
      const expectedMethods = ['isAvailable', 'initHealthKit', 'getStepCount'];
      const availableMethods = Object.keys(foundModule);
      
      addLog(`Available methods: ${availableMethods.join(', ')}`);
      
      expectedMethods.forEach(method => {
        if (availableMethods.includes(method)) {
          addLog(`✅ Method available: ${method}`);
        } else {
          addLog(`❌ Method missing: ${method}`);
        }
      });
      
      // Try calling isAvailable if it exists
      if (foundModule.isAvailable) {
        addLog('Calling isAvailable...');
        foundModule.isAvailable((error: any, result: any) => {
          if (error) {
            addLog(`❌ isAvailable error: ${error.message || error}`);
          } else {
            addLog(`✅ isAvailable result: ${JSON.stringify(result)}`);
          }
        });
      }
      
    } catch (error: any) {
      addLog(`❌ Direct module access error: ${error.message}`);
    }
  };

  const testImportApproach = async () => {
    addLog('Testing dynamic import approach...');
    
    try {
      // Try dynamic import
      const { default: AppleHealthKit } = await import('react-native-health');
      addLog('✅ Dynamic import successful');
      
      if (AppleHealthKit && typeof AppleHealthKit === 'object') {
        addLog(`AppleHealthKit object methods: ${Object.keys(AppleHealthKit).join(', ')}`);
        
        // Test isAvailable
        if (AppleHealthKit.isAvailable) {
          AppleHealthKit.isAvailable((error: any, result: any) => {
            if (error) {
              addLog(`❌ isAvailable error: ${error.message || error}`);
            } else {
              addLog(`✅ isAvailable result: ${JSON.stringify(result)}`);
            }
          });
        }
      } else {
        addLog('❌ AppleHealthKit is not a valid object');
      }
      
    } catch (error: any) {
      addLog(`❌ Dynamic import failed: ${error.message}`);
    }
  };

  const testRequireApproach = () => {
    addLog('Testing require approach...');
    
    try {
      const RNHealth = require('react-native-health');
      addLog('✅ Require successful');
      
      if (RNHealth) {
        if (RNHealth.default) {
          addLog(`RNHealth.default methods: ${Object.keys(RNHealth.default).join(', ')}`);
        }
        if (RNHealth.AppleHealthKit) {
          addLog(`RNHealth.AppleHealthKit methods: ${Object.keys(RNHealth.AppleHealthKit).join(', ')}`);
        }
        addLog(`RNHealth root methods: ${Object.keys(RNHealth).join(', ')}`);
      }
      
    } catch (error: any) {
      addLog(`❌ Require failed: ${error.message}`);
    }
  };

  const testNativeModulesDebug = () => {
    addLog('🔍 DEBUGGING NATIVE MODULES...');
    
    try {
      // Get all native modules
      const modules = Object.keys(NativeModules);
      addLog(`📊 Total native modules found: ${modules.length}`);
      
      if (modules.length === 0) {
        addLog('❌ NO NATIVE MODULES FOUND - This indicates a serious React Native bridge issue');
        addLog('🔧 Possible causes:');
        addLog('   • Build configuration issue');
        addLog('   • React Native bridge not initialized');
        addLog('   • Production build stripping modules');
        return;
      }
      
      // Log first 10 modules
      addLog(`📝 First 10 modules: ${modules.slice(0, 10).join(', ')}`);
      
      // Look for health-related modules
      const healthModules = modules.filter(name => 
        name.toLowerCase().includes('health') || 
        name.toLowerCase().includes('apple') ||
        name.toLowerCase().includes('rn') ||
        name.toLowerCase().includes('kit')
      );
      
      if (healthModules.length > 0) {
        addLog(`🏥 Health-related modules: ${healthModules.join(', ')}`);
        
        // Inspect each health module
        healthModules.forEach(moduleName => {
          const module = NativeModules[moduleName];
          if (module && typeof module === 'object') {
            const methods = Object.keys(module);
            addLog(`📋 ${moduleName} methods (${methods.length}): ${methods.join(', ')}`);
          }
        });
      } else {
        addLog('❌ No health-related modules found');
      }
      
      // Check for specific module names
      const targetModules = [
        'RNAppleHealthKit',
        'AppleHealthKit', 
        'HealthKit',
        'RNCAppleHealthKit',
        'ReactNativeAppleHealthKit'
      ];
      
      addLog('🎯 Checking for specific HealthKit modules:');
      targetModules.forEach(moduleName => {
        if (NativeModules[moduleName]) {
          const module = NativeModules[moduleName];
          addLog(`✅ Found ${moduleName}`);
          if (typeof module === 'object') {
            const methods = Object.keys(module);
            addLog(`   Methods: ${methods.join(', ')}`);
          }
        } else {
          addLog(`❌ Missing ${moduleName}`);
        }
      });
      
      // Check React Native version info
      addLog('📱 React Native Info:');
      if (NativeModules.DeviceInfo) {
        addLog('✅ DeviceInfo module available');
      }
      if (NativeModules.PlatformConstants) {
        addLog('✅ PlatformConstants module available');
      }
      
    } catch (error: any) {
      addLog(`❌ Native modules debug failed: ${error.message}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Back Button */}
        <TouchableOpacity 
          style={{ backgroundColor: '#666', padding: 8, borderRadius: 6, marginBottom: 16, alignSelf: 'flex-start' }}
          onPress={() => router.back()}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>← Back to Health</Text>
        </TouchableOpacity>

        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
          🔬 HealthKit Native Module Debug
        </Text>
        
        {/* Status Indicators */}
        <View style={{ backgroundColor: '#1A1A1A', padding: 12, borderRadius: 8, marginBottom: 16 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>Status:</Text>
          <Text style={{ color: isAvailable === null ? '#FFA500' : isAvailable ? '#00FF00' : '#FF0000' }}>
            HealthKit Available: {isAvailable === null ? 'Testing...' : isAvailable ? 'Yes ✅' : 'No ❌'}
          </Text>
          <Text style={{ color: isAuthorized === null ? '#FFA500' : isAuthorized ? '#00FF00' : '#FF0000' }}>
            HealthKit Authorized: {isAuthorized === null ? 'Not tested' : isAuthorized ? 'Yes ✅' : 'No ❌'}
          </Text>
          <Text style={{ color: '#CCCCCC' }}>
            Available Native Modules: {nativeModulesList.length}
          </Text>
        </View>

        {/* Critical Test Button */}
        <View style={{ marginBottom: 20 }}>
          <TouchableOpacity 
            style={{ backgroundColor: '#FF3B30', padding: 16, borderRadius: 8, marginBottom: 12 }}
            onPress={testHealthKitPermissions}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
              🚨 Request Permissions (CRITICAL TEST)
            </Text>
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 12, marginTop: 4 }}>
              This should trigger iOS HealthKit permission dialog
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ backgroundColor: '#007AFF', padding: 12, borderRadius: 8, marginBottom: 8 }}
            onPress={testStepCount}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
              📊 Test Step Count Retrieval
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={{ backgroundColor: '#34C759', padding: 12, borderRadius: 8, marginBottom: 8 }}
            onPress={testDirectModuleAccess}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
              🔍 Test Direct Module Access
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={{ backgroundColor: '#FF9500', padding: 12, borderRadius: 8, marginBottom: 8 }}
            onPress={testImportApproach}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
              📦 Test Dynamic Import
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={{ backgroundColor: '#5856D6', padding: 12, borderRadius: 8, marginBottom: 8 }}
            onPress={testRequireApproach}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
              🔧 Test Require Approach
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={{ backgroundColor: '#8A2BE2', padding: 12, borderRadius: 8, marginBottom: 8 }}
            onPress={testNativeModulesDebug}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
              🔍 Debug Native Modules
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={{ backgroundColor: '#8E8E93', padding: 12, borderRadius: 8 }}
            onPress={clearLogs}
          >
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
              🗑️ Clear Logs
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Logs Section */}
        <View style={{ backgroundColor: '#1A1A1A', padding: 12, borderRadius: 8 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
            Debug Logs:
          </Text>
          {logs.map((log, index) => (
            <Text key={index} style={{ 
              color: log.includes('❌') ? '#FF453A' : log.includes('✅') ? '#30D158' : '#FFFFFF',
              fontSize: 12,
              marginBottom: 4,
              fontFamily: 'monospace'
            }}>
              {log}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 