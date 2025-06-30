import {AppRegistry, NativeModules} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Initialize native modules bridge
console.log('[Bridge] Initializing React Native bridge...');

// Debug native modules on startup
setTimeout(() => {
  const moduleNames = Object.keys(NativeModules);
  console.log(`[Bridge] Total native modules found: ${moduleNames.length}`);
  
  if (moduleNames.length > 0) {
    console.log('[Bridge] Available modules:', moduleNames.slice(0, 10).join(', '));
    
    // Look for HealthKit specifically
    const healthModules = moduleNames.filter(name => 
      name.toLowerCase().includes('health') || 
      name.toLowerCase().includes('apple') ||
      name.includes('RNApple')
    );
    
    if (healthModules.length > 0) {
      console.log('[Bridge] ✅ HealthKit modules found:', healthModules.join(', '));
    } else {
      console.log('[Bridge] ❌ No HealthKit modules found');
    }
  } else {
    console.log('[Bridge] ❌ CRITICAL: No native modules found. This indicates a serious React Native bridge issue.');
  }
}, 1000);

AppRegistry.registerComponent(appName, () => App); 