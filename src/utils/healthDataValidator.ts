import { Platform } from 'react-native';
import PRODUCTION_CONFIG from '../config/production';

/**
 * Health Data Validator
 * Ensures only real health data is used in production
 */

export class HealthDataValidator {
  static validatePlatform(): void {
    if (PRODUCTION_CONFIG.REQUIRE_IOS_FOR_HEALTH && Platform.OS !== 'ios') {
      throw new Error('HealthKit requires iOS device - mock data is disabled');
    }
  }

  static validateNativeModule(module: any, moduleName: string): void {
    if (PRODUCTION_CONFIG.HEALTH_REQUIRE_NATIVE_MODULES && !module) {
      throw new Error(`${moduleName} native module is required - mock data is disabled`);
    }
  }

  static validateDataSource(data: any, source: string): void {
    if (PRODUCTION_CONFIG.HEALTH_REAL_DATA_ONLY) {
      // Check for mock data indicators
      if (typeof data === 'object' && data !== null) {
        if (data.isMockData || data.source === 'mock' || data.source === 'simulation') {
          throw new Error(`Mock data detected from ${source} - only real data allowed`);
        }
      }
    }
  }

  static validateStepCount(steps: number, source: string): number {
    this.validateDataSource({ steps, source }, 'step count');
    
    if (steps < 0) {
      throw new Error('Invalid step count: negative values not allowed');
    }
    
    if (steps > 100000) {
      console.warn(`[HealthDataValidator] Unusually high step count: ${steps} from ${source}`);
    }
    
    return steps;
  }

  static validateHeartRate(heartRate: number, source: string): number {
    this.validateDataSource({ heartRate, source }, 'heart rate');
    
    if (heartRate < 30 || heartRate > 220) {
      throw new Error(`Invalid heart rate: ${heartRate} BPM is outside normal range`);
    }
    
    return heartRate;
  }

  static validateDistance(distance: number, source: string): number {
    this.validateDataSource({ distance, source }, 'distance');
    
    if (distance < 0) {
      throw new Error('Invalid distance: negative values not allowed');
    }
    
    if (distance > 1000) {
      console.warn(`[HealthDataValidator] Unusually high distance: ${distance}km from ${source}`);
    }
    
    return distance;
  }

  static validateCalories(calories: number, source: string): number {
    this.validateDataSource({ calories, source }, 'calories');
    
    if (calories < 0) {
      throw new Error('Invalid calories: negative values not allowed');
    }
    
    if (calories > 10000) {
      console.warn(`[HealthDataValidator] Unusually high calories: ${calories} from ${source}`);
    }
    
    return calories;
  }

  static logDataSource(dataType: string, value: any, source: string): void {
    if (PRODUCTION_CONFIG.ENABLE_DETAILED_LOGGING) {
      console.log(`[HealthDataValidator] ${dataType}: ${value} from ${source} (validated)`);
    }
  }
}

export default HealthDataValidator; 