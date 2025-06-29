import { Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

/**
 * CoreBluetooth class provides an interface to Bluetooth Low Energy devices
 * PRODUCTION VERSION - Using react-native-ble-plx for real device communication
 */
class CoreBluetooth {
  constructor() {
    this.manager = new BleManager();
    this.listeners = {};
    this.isScanning = false;
    this.connectedDevices = new Set();
    this.discoveredDevices = new Map();
    this.bluetoothState = "unknown";
    
    console.log('[CoreBluetooth] Initialized with react-native-ble-plx');
    
    // Subscribe to state changes
    this.manager.onStateChange((state) => {
      this.bluetoothState = state;
      console.log('[CoreBluetooth] State changed to:', state);
      this.emit('onBluetoothStateChange', { state });
    });
  }

  /**
   * Get the current Bluetooth state
   * @returns {Promise<{state: string}>} Promise resolving to the Bluetooth state
   */
  async getBluetoothState() {
    try {
      const state = await this.manager.state();
      this.bluetoothState = state;
      
      if (__DEV__) {
        console.log('[CoreBluetooth] Bluetooth state:', this.bluetoothState);
      }
      
      return { state: this.bluetoothState };
    } catch (error) {
      console.error("Error getting Bluetooth state:", error);
      return { state: 'unknown' };
    }
  }

  /**
   * Request Bluetooth permissions
   * @returns {Promise<{granted: boolean}>} Promise resolving to whether permissions were granted
   */
  async requestPermissions() {
    if (Platform.OS !== 'ios') {
      console.warn('[CoreBluetooth] Not running on iOS platform');
      return { granted: false, reason: 'Not iOS platform' };
    }

    try {
      const state = await this.manager.state();
      
      const result = {
        granted: state === 'PoweredOn',
        state: state
      };
      
      if (__DEV__) {
        console.log('[CoreBluetooth] Permission result:', result);
      }
      
      return result;
    } catch (error) {
      console.error("Error requesting Bluetooth permissions:", error);
      return { granted: false, reason: error.message };
    }
  }

  /**
   * Start scanning for Bluetooth devices
   * @returns {Promise<void>} Promise resolving when scan starts
   */
  async startScan() {
    if (this.isScanning) {
      return;
    }
    
    this.isScanning = true;
    
    try {
      // Service UUIDs for health devices
      const serviceUUIDs = [
        '180D', // Heart Rate Service
        '180F', // Battery Service
        '1826', // Fitness Machine Service
      ];
      
      this.manager.startDeviceScan(serviceUUIDs, null, (error, device) => {
        if (error) {
          console.error('[CoreBluetooth] Scan error:', error);
          this.emit('onError', { error: error.message });
          return;
        }
        
        if (device && device.name) {
          if (!this.discoveredDevices.has(device.id)) {
            this.discoveredDevices.set(device.id, device);
            
            const deviceInfo = {
              id: device.id,
              name: device.name,
              rssi: device.rssi,
              services: device.serviceUUIDs || [],
              manufacturerData: device.manufacturerData || ''
            };
            
            console.log('[CoreBluetooth] Device discovered:', deviceInfo.name);
            this.emit('onDeviceDiscovered', deviceInfo);
          }
        }
      });
      
      if (__DEV__) {
        console.log('[CoreBluetooth] Started scanning for devices');
      }
    } catch (error) {
      console.error("Error starting scan:", error);
      this.isScanning = false;
      throw error;
    }
  }

  /**
   * Stop scanning for Bluetooth devices
   * @returns {Promise<void>} Promise resolving when scan stops
   */
  async stopScan() {
    if (!this.isScanning) {
      return;
    }
    
    this.isScanning = false;
    
    try {
      this.manager.stopDeviceScan();
      
      if (__DEV__) {
        console.log('[CoreBluetooth] Stopped scanning for devices');
      }
    } catch (error) {
      console.error("Error stopping scan:", error);
      throw error;
    }
  }

  /**
   * Connect to a Bluetooth device
   * @param {string} peripheralId The ID of the device to connect to
   * @returns {Promise<{id: string}>} Promise resolving when connected
   */
  async connect(peripheralId) {
    try {
      const device = await this.manager.connectToDevice(peripheralId);
      this.connectedDevices.add(peripheralId);
      
      const deviceInfo = {
        id: device.id,
        name: device.name || 'Unknown Device'
      };
      
      console.log('[CoreBluetooth] Connected to device:', deviceInfo.name);
      this.emit('onDeviceConnected', deviceInfo);
      
      return deviceInfo;
    } catch (error) {
      console.error(`Error connecting to device ${peripheralId}:`, error);
      throw error;
    }
  }

  /**
   * Disconnect from a Bluetooth device
   * @param {string} peripheralId The ID of the device to disconnect from
   * @returns {Promise<{id: string}>} Promise resolving when disconnected
   */
  async disconnect(peripheralId) {
    try {
      await this.manager.cancelDeviceConnection(peripheralId);
      this.connectedDevices.delete(peripheralId);
      
      const deviceInfo = { id: peripheralId };
      
      console.log('[CoreBluetooth] Disconnected from device:', peripheralId);
      this.emit('onDeviceDisconnected', deviceInfo);
      
      return deviceInfo;
    } catch (error) {
      console.error(`Error disconnecting from device ${peripheralId}:`, error);
      throw error;
    }
  }

  /**
   * Add a listener for Bluetooth events
   * @param {string} eventType The event type to listen for
   * @param {Function} listener The callback function
   * @returns {Function} Function to remove the listener
   */
  addListener(eventType, listener) {
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    
    this.listeners[eventType].push(listener);
    
    // Return unsubscribe function
    return () => {
      this.removeListener(eventType, listener);
    };
  }

  /**
   * Remove a specific listener
   * @param {string} eventType The event type
   * @param {Function} listener The listener to remove
   */
  removeListener(eventType, listener) {
    if (this.listeners[eventType]) {
      const index = this.listeners[eventType].indexOf(listener);
      if (index > -1) {
        this.listeners[eventType].splice(index, 1);
      }
    }
  }

  /**
   * Remove all listeners for an event type
   * @param {string} eventType The event type
   */
  removeAllListeners(eventType) {
    if (eventType) {
      this.listeners[eventType] = [];
    } else {
      this.listeners = {};
    }
  }

  /**
   * Emit an event to all listeners
   * @param {string} eventType The event type
   * @param {Object} data The event data
   */
  emit(eventType, data) {
    if (this.listeners[eventType]) {
      this.listeners[eventType].forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in ${eventType} listener:`, error);
        }
      });
    }
  }

  /**
   * Read characteristic from a connected device
   * @param {string} peripheralId The device ID
   * @param {string} serviceUUID The service UUID
   * @param {string} characteristicUUID The characteristic UUID
   * @returns {Promise<string>} The characteristic value
   */
  async readCharacteristic(peripheralId, serviceUUID, characteristicUUID) {
    try {
      const device = await this.manager.connectToDevice(peripheralId);
      await device.discoverAllServicesAndCharacteristics();
      
      const characteristic = await device.readCharacteristicForService(
        serviceUUID,
        characteristicUUID
      );
      
      return characteristic.value;
    } catch (error) {
      console.error("Error reading characteristic:", error);
      throw error;
    }
  }

  /**
   * Write characteristic to a connected device
   * @param {string} peripheralId The device ID
   * @param {string} serviceUUID The service UUID
   * @param {string} characteristicUUID The characteristic UUID
   * @param {string} data The data to write
   * @returns {Promise<void>}
   */
  async writeCharacteristic(peripheralId, serviceUUID, characteristicUUID, data) {
    try {
      const device = await this.manager.connectToDevice(peripheralId);
      await device.discoverAllServicesAndCharacteristics();
      
      await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicUUID,
        data
      );
    } catch (error) {
      console.error("Error writing characteristic:", error);
      throw error;
    }
  }

  /**
   * Destroy the manager and clean up resources
   */
  destroy() {
    if (this.manager) {
      this.manager.destroy();
    }
    this.listeners = {};
    this.discoveredDevices.clear();
    this.connectedDevices.clear();
  }
}

// Export singleton instance
const CoreBluetoothInstance = new CoreBluetooth();
export default CoreBluetoothInstance;