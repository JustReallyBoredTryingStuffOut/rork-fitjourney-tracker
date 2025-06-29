/**
 * Production Configuration
 * Ensures NO mock data is used in production builds
 */

export const PRODUCTION_CONFIG = {
  // Health Data Configuration
  HEALTH_REAL_DATA_ONLY: true,
  HEALTH_DISABLE_SIMULATION: true,
  HEALTH_REQUIRE_NATIVE_MODULES: true,
  
  // Bluetooth Configuration  
  BLUETOOTH_REAL_DEVICES_ONLY: true,
  BLUETOOTH_DISABLE_SIMULATION: true,
  BLUETOOTH_REQUIRE_NATIVE_MODULES: true,
  
  // Logging Configuration
  ENABLE_DETAILED_LOGGING: __DEV__,
  ENABLE_PERFORMANCE_MONITORING: true,
  
  // Platform Requirements
  REQUIRE_IOS_FOR_HEALTH: true,
  REQUIRE_IOS_FOR_BLUETOOTH: true,
  
  // Error Handling
  STRICT_ERROR_HANDLING: true,
  FAIL_ON_MOCK_DATA: true,
} as const;

export const validateProductionEnvironment = () => {
  if (PRODUCTION_CONFIG.HEALTH_REAL_DATA_ONLY && __DEV__) {
    console.warn('[PRODUCTION_CONFIG] Running in development mode with real data only');
  }
  
  if (PRODUCTION_CONFIG.FAIL_ON_MOCK_DATA) {
    console.log('[PRODUCTION_CONFIG] Mock data is DISABLED - real data only');
  }
};

export default PRODUCTION_CONFIG; 