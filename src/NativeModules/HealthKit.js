import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

// Create a mock module for HealthKit
const mockHealthKitModule = {
  isHealthDataAvailable: () => Promise.resolve(true),
  requestAuthorization: (dataTypes) => Promise.resolve({ authorized: true, dataTypes }),
  getStepCount: (startDate, endDate) => {
    // Generate realistic step count based on time of day
    const now = new Date();
    const hour = now.getHours();
    
    // Base steps that increase throughout the day
    let baseSteps = 0;
    
    // Calculate steps based on time of day (more steps as day progresses)
    if (hour >= 6 && hour < 9) {
      // Morning routine (6am-9am): 1000-2000 steps
      baseSteps = 1000 + Math.floor(Math.random() * 1000);
    } else if (hour >= 9 && hour < 12) {
      // Morning work (9am-12pm): 2000-4000 steps
      baseSteps = 2000 + Math.floor(Math.random() * 2000);
    } else if (hour >= 12 && hour < 14) {
      // Lunch time (12pm-2pm): 4000-5000 steps
      baseSteps = 4000 + Math.floor(Math.random() * 1000);
    } else if (hour >= 14 && hour < 17) {
      // Afternoon (2pm-5pm): 5000-7000 steps
      baseSteps = 5000 + Math.floor(Math.random() * 2000);
    } else if (hour >= 17 && hour < 20) {
      // Evening (5pm-8pm): 7000-9000 steps
      baseSteps = 7000 + Math.floor(Math.random() * 2000);
    } else if (hour >= 20 && hour < 23) {
      // Night (8pm-11pm): 9000-10000 steps
      baseSteps = 9000 + Math.floor(Math.random() * 1000);
    } else {
      // Late night/early morning (11pm-6am): 9500-10500 steps
      baseSteps = 9500 + Math.floor(Math.random() * 1000);
    }
    
    // Add some randomness
    const randomFactor = 0.9 + (Math.random() * 0.2); // 0.9 to 1.1
    const steps = Math.floor(baseSteps * randomFactor);
    
    return Promise.resolve({ success: true, steps });
  },
  observeStepCount: (callback) => {
    // Set up an interval to simulate step count updates
    const intervalId = setInterval(() => {
      // Get current steps
      mockHealthKitModule.getStepCount(
        new Date().toISOString(),
        new Date().toISOString()
      ).then(result => {
        callback(result);
      });
    }, 60000); // Update every minute
    
    // Return a function to clear the interval
    return () => clearInterval(intervalId);
  },
  getDistanceWalking: (startDate, endDate) => {
    // Generate realistic distance based on step count
    return mockHealthKitModule.getStepCount(startDate, endDate)
      .then(result => {
        if (result.success) {
          // Average stride length is about 0.762 meters
          const distanceInKm = (result.steps * 0.762) / 1000;
          return { success: true, distance: parseFloat(distanceInKm.toFixed(2)) };
        }
        return { success: false, error: "Failed to get step count" };
      });
  },
  getActiveEnergyBurned: (startDate, endDate) => {
    // Generate realistic calories based on step count
    return mockHealthKitModule.getStepCount(startDate, endDate)
      .then(result => {
        if (result.success) {
          // Rough estimate: 1 step ≈ 0.04 calories
          const calories = Math.round(result.steps * 0.04);
          return { success: true, calories };
        }
        return { success: false, error: "Failed to get step count" };
      });
  },
  getHeartRateSamples: (startDate, endDate) => {
    // Generate realistic heart rate samples
    const samples = [];
    const startTime = new Date(startDate).getTime();
    const endTime = new Date(endDate).getTime();
    const interval = 10 * 60 * 1000; // 10 minutes
    
    for (let time = startTime; time <= endTime; time += interval) {
      // Generate heart rate between 60-100 bpm
      const heartRate = 60 + Math.floor(Math.random() * 40);
      samples.push({
        value: heartRate,
        startDate: new Date(time).toISOString(),
        endDate: new Date(time + interval).toISOString()
      });
    }
    
    return Promise.resolve({ success: true, samples });
  },
  getSleepAnalysis: (startDate, endDate) => {
    // Generate realistic sleep data
    const sleepData = {
      inBed: 0,
      asleep: 0,
      awake: 0,
      deep: 0,
      rem: 0,
      light: 0
    };
    
    // Simulate 7-9 hours of sleep
    const sleepDuration = (7 + Math.random() * 2) * 60 * 60 * 1000; // in ms
    
    // Calculate sleep metrics
    sleepData.inBed = Math.round(sleepDuration / (60 * 1000)); // in minutes
    sleepData.asleep = Math.round(sleepData.inBed * 0.9); // 90% of in bed time
    sleepData.awake = sleepData.inBed - sleepData.asleep;
    
    // Sleep stages
    sleepData.deep = Math.round(sleepData.asleep * 0.2); // 20% deep sleep
    sleepData.rem = Math.round(sleepData.asleep * 0.25); // 25% REM sleep
    sleepData.light = sleepData.asleep - sleepData.deep - sleepData.rem; // Remaining is light sleep
    
    return Promise.resolve({ success: true, sleepData });
  },
  getWorkouts: (startDate, endDate) => {
    // Generate sample workouts
    const workouts = [];
    const workoutTypes = ['walking', 'running', 'cycling', 'swimming', 'strength_training'];
    
    // Generate 0-3 workouts for the period
    const numWorkouts = Math.floor(Math.random() * 4);
    
    for (let i = 0; i < numWorkouts; i++) {
      const startTime = new Date(startDate).getTime() + Math.random() * (new Date(endDate).getTime() - new Date(startDate).getTime());
      const duration = (20 + Math.random() * 70) * 60 * 1000; // 20-90 minutes in ms
      const workoutType = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
      
      workouts.push({
        type: workoutType,
        startDate: new Date(startTime).toISOString(),
        endDate: new Date(startTime + duration).toISOString(),
        duration: Math.round(duration / (60 * 1000)), // in minutes
        calories: Math.round((duration / (60 * 1000)) * (workoutType === 'running' ? 10 : workoutType === 'cycling' ? 8 : 5)),
        distance: workoutType === 'strength_training' ? 0 : parseFloat((1 + Math.random() * 9).toFixed(2)) // 1-10 km
      });
    }
    
    return Promise.resolve({ success: true, workouts });
  }
};

// Use the native module if available, otherwise use the mock
const HealthKitModule = Platform.OS === 'ios' && NativeModules.HealthKitModule 
  ? NativeModules.HealthKitModule 
  : mockHealthKitModule;

// Create an event emitter for the module
const healthKitEmitter = new NativeEventEmitter(HealthKitModule);

/**
 * HealthKit class provides an interface to the iOS HealthKit framework
 * This implementation includes both real device communication (when native module is available)
 * and a simulation mode for development and testing
 */
class HealthKit {
  constructor() {
    this.listeners = {};
    this.simulationMode = !NativeModules.HealthKitModule || Platform.OS !== 'ios';
  }

  /**
   * Check if HealthKit is available on this device
   * @returns {Promise<boolean>} Promise resolving to whether HealthKit is available
   */
  async isHealthDataAvailable() {
    try {
      if (this.simulationMode) {
        return true;
      }
      
      return await HealthKitModule.isHealthDataAvailable();
    } catch (error) {
      console.error("Error checking HealthKit availability:", error);
      return false;
    }
  }

  /**
   * Request authorization for HealthKit data types
   * @param {string[]} dataTypes Array of data types to request access to
   * @returns {Promise<{authorized: boolean, dataTypes: string[]}>} Promise resolving to authorization result
   */
  async requestAuthorization(dataTypes) {
    try {
      if (this.simulationMode) {
        return { authorized: true, dataTypes };
      }
      
      return await HealthKitModule.requestAuthorization(dataTypes);
    } catch (error) {
      console.error("Error requesting HealthKit authorization:", error);
      return { authorized: false, dataTypes, error: error.message };
    }
  }

  /**
   * Get step count for a date range
   * @param {string} startDate ISO string start date
   * @param {string} endDate ISO string end date
   * @returns {Promise<{success: boolean, steps: number}>} Promise resolving to step count
   */
  async getStepCount(startDate, endDate) {
    try {
      if (this.simulationMode) {
        // Generate realistic step count based on time of day
        const now = new Date();
        const hour = now.getHours();
        
        // Base steps that increase throughout the day
        let baseSteps = 0;
        
        // Calculate steps based on time of day (more steps as day progresses)
        if (hour >= 6 && hour < 9) {
          // Morning routine (6am-9am): 1000-2000 steps
          baseSteps = 1000 + Math.floor(Math.random() * 1000);
        } else if (hour >= 9 && hour < 12) {
          // Morning work (9am-12pm): 2000-4000 steps
          baseSteps = 2000 + Math.floor(Math.random() * 2000);
        } else if (hour >= 12 && hour < 14) {
          // Lunch time (12pm-2pm): 4000-5000 steps
          baseSteps = 4000 + Math.floor(Math.random() * 1000);
        } else if (hour >= 14 && hour < 17) {
          // Afternoon (2pm-5pm): 5000-7000 steps
          baseSteps = 5000 + Math.floor(Math.random() * 2000);
        } else if (hour >= 17 && hour < 20) {
          // Evening (5pm-8pm): 7000-9000 steps
          baseSteps = 7000 + Math.floor(Math.random() * 2000);
        } else if (hour >= 20 && hour < 23) {
          // Night (8pm-11pm): 9000-10000 steps
          baseSteps = 9000 + Math.floor(Math.random() * 1000);
        } else {
          // Late night/early morning (11pm-6am): 9500-10500 steps
          baseSteps = 9500 + Math.floor(Math.random() * 1000);
        }
        
        // Add some randomness
        const randomFactor = 0.9 + (Math.random() * 0.2); // 0.9 to 1.1
        const steps = Math.floor(baseSteps * randomFactor);
        
        return { success: true, steps };
      }
      
      return await HealthKitModule.getStepCount(startDate, endDate);
    } catch (error) {
      console.error("Error getting step count:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Observe step count changes
   * @param {Function} callback Function to call when step count changes
   * @returns {Function} Function to remove the observer
   */
  observeStepCount(callback) {
    if (this.simulationMode) {
      // Set up an interval to simulate step count updates
      const intervalId = setInterval(() => {
        // Get current steps
        this.getStepCount(
          new Date().toISOString(),
          new Date().toISOString()
        ).then(result => {
          callback(result);
        });
      }, 60000); // Update every minute
      
      // Return a function to clear the interval
      return () => clearInterval(intervalId);
    }
    
    // Use the native event emitter
    const subscription = healthKitEmitter.addListener('stepCountDidChange', callback);
    return () => subscription.remove();
  }

  /**
   * Get distance walked/run for a date range
   * @param {string} startDate ISO string start date
   * @param {string} endDate ISO string end date
   * @returns {Promise<{success: boolean, distance: number}>} Promise resolving to distance in km
   */
  async getDistanceWalking(startDate, endDate) {
    try {
      if (this.simulationMode) {
        // Generate realistic distance based on step count
        const stepResult = await this.getStepCount(startDate, endDate);
        if (stepResult.success) {
          // Average stride length is about 0.762 meters
          const distanceInKm = (stepResult.steps * 0.762) / 1000;
          return { success: true, distance: parseFloat(distanceInKm.toFixed(2)) };
        }
        return { success: false, error: "Failed to get step count" };
      }
      
      return await HealthKitModule.getDistanceWalking(startDate, endDate);
    } catch (error) {
      console.error("Error getting walking distance:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get active energy burned for a date range
   * @param {string} startDate ISO string start date
   * @param {string} endDate ISO string end date
   * @returns {Promise<{success: boolean, calories: number}>} Promise resolving to calories burned
   */
  async getActiveEnergyBurned(startDate, endDate) {
    try {
      if (this.simulationMode) {
        // Generate realistic calories based on step count
        const stepResult = await this.getStepCount(startDate, endDate);
        if (stepResult.success) {
          // Rough estimate: 1 step ≈ 0.04 calories
          const calories = Math.round(stepResult.steps * 0.04);
          return { success: true, calories };
        }
        return { success: false, error: "Failed to get step count" };
      }
      
      return await HealthKitModule.getActiveEnergyBurned(startDate, endDate);
    } catch (error) {
      console.error("Error getting active energy burned:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get heart rate samples for a date range
   * @param {string} startDate ISO string start date
   * @param {string} endDate ISO string end date
   * @returns {Promise<{success: boolean, samples: Array}>} Promise resolving to heart rate samples
   */
  async getHeartRateSamples(startDate, endDate) {
    try {
      if (this.simulationMode) {
        // Generate realistic heart rate samples
        const samples = [];
        const startTime = new Date(startDate).getTime();
        const endTime = new Date(endDate).getTime();
        const interval = 10 * 60 * 1000; // 10 minutes
        
        for (let time = startTime; time <= endTime; time += interval) {
          // Generate heart rate between 60-100 bpm
          const heartRate = 60 + Math.floor(Math.random() * 40);
          samples.push({
            value: heartRate,
            startDate: new Date(time).toISOString(),
            endDate: new Date(time + interval).toISOString()
          });
        }
        
        return { success: true, samples };
      }
      
      return await HealthKitModule.getHeartRateSamples(startDate, endDate);
    } catch (error) {
      console.error("Error getting heart rate samples:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get sleep analysis for a date range
   * @param {string} startDate ISO string start date
   * @param {string} endDate ISO string end date
   * @returns {Promise<{success: boolean, sleepData: Object}>} Promise resolving to sleep data
   */
  async getSleepAnalysis(startDate, endDate) {
    try {
      if (this.simulationMode) {
        // Generate realistic sleep data
        const sleepData = {
          inBed: 0,
          asleep: 0,
          awake: 0,
          deep: 0,
          rem: 0,
          light: 0
        };
        
        // Simulate 7-9 hours of sleep
        const sleepDuration = (7 + Math.random() * 2) * 60 * 60 * 1000; // in ms
        
        // Calculate sleep metrics
        sleepData.inBed = Math.round(sleepDuration / (60 * 1000)); // in minutes
        sleepData.asleep = Math.round(sleepData.inBed * 0.9); // 90% of in bed time
        sleepData.awake = sleepData.inBed - sleepData.asleep;
        
        // Sleep stages
        sleepData.deep = Math.round(sleepData.asleep * 0.2); // 20% deep sleep
        sleepData.rem = Math.round(sleepData.asleep * 0.25); // 25% REM sleep
        sleepData.light = sleepData.asleep - sleepData.deep - sleepData.rem; // Remaining is light sleep
        
        return { success: true, sleepData };
      }
      
      return await HealthKitModule.getSleepAnalysis(startDate, endDate);
    } catch (error) {
      console.error("Error getting sleep analysis:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get workouts for a date range
   * @param {string} startDate ISO string start date
   * @param {string} endDate ISO string end date
   * @returns {Promise<{success: boolean, workouts: Array}>} Promise resolving to workouts
   */
  async getWorkouts(startDate, endDate) {
    try {
      if (this.simulationMode) {
        // Generate sample workouts
        const workouts = [];
        const workoutTypes = ['walking', 'running', 'cycling', 'swimming', 'strength_training'];
        
        // Generate 0-3 workouts for the period
        const numWorkouts = Math.floor(Math.random() * 4);
        
        for (let i = 0; i < numWorkouts; i++) {
          const startTime = new Date(startDate).getTime() + Math.random() * (new Date(endDate).getTime() - new Date(startDate).getTime());
          const duration = (20 + Math.random() * 70) * 60 * 1000; // 20-90 minutes in ms
          const workoutType = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
          
          workouts.push({
            type: workoutType,
            startDate: new Date(startTime).toISOString(),
            endDate: new Date(startTime + duration).toISOString(),
            duration: Math.round(duration / (60 * 1000)), // in minutes
            calories: Math.round((duration / (60 * 1000)) * (workoutType === 'running' ? 10 : workoutType === 'cycling' ? 8 : 5)),
            distance: workoutType === 'strength_training' ? 0 : parseFloat((1 + Math.random() * 9).toFixed(2)) // 1-10 km
          });
        }
        
        return { success: true, workouts };
      }
      
      return await HealthKitModule.getWorkouts(startDate, endDate);
    } catch (error) {
      console.error("Error getting workouts:", error);
      return { success: false, error: error.message };
    }
  }
}

export default new HealthKit();