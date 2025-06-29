import { Platform } from 'react-native';
import CoreBluetooth from '../NativeModules/CoreBluetooth';
import type { 
  BluetoothDevice, 
  BluetoothConnection, 
  BluetoothDataReceived,
  CoreBluetoothEvents 
} from '../../types/health';

/**
 * Production Bluetooth Service
 * Provides real Bluetooth connectivity to health devices like Apple Watch
 * NO MOCK DATA - Production ready implementation
 */
class BluetoothService {
  private coreBluetooth: typeof CoreBluetooth;
  private isInitialized = false;
  private isScanning = false;
  private connectedDevices: Map<string, BluetoothDevice> = new Map();
  private eventListeners: Map<string, (() => void)[]> = new Map();

  constructor() {
    this.coreBluetooth = CoreBluetooth;
  }

  /**
   * Initialize Bluetooth service
   * Must be called before using any other methods
   */
  async initialize(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      throw new Error('CoreBluetooth is only available on iOS devices');
    }

    try {
      // Check Bluetooth state
      const stateResult = await this.coreBluetooth.getBluetoothState();
      
      if (stateResult.state !== 'poweredOn') {
        throw new Error(`Bluetooth is not powered on. Current state: ${stateResult.state}`);
      }

      // Request permissions
      const permissionResult = await this.coreBluetooth.requestPermissions();
      
      if (!permissionResult.granted) {
        const reason = (permissionResult as any).reason || 'Permission denied';
        throw new Error(`Bluetooth permission denied: ${reason}`);
      }

      this.isInitialized = true;
      console.log('[BluetoothService] Successfully initialized');
      return true;
    } catch (error) {
      console.error('[BluetoothService] Failed to initialize:', error);
      throw error;
    }
  }

  /**
   * Start scanning for health devices
   */
  async startScanning(): Promise<void> {
    this.ensureInitialized();

    if (this.isScanning) {
      console.warn('[BluetoothService] Already scanning');
      return;
    }

    try {
      await this.coreBluetooth.startScan();
      this.isScanning = true;
      console.log('[BluetoothService] Started scanning for devices');
    } catch (error) {
      console.error('[BluetoothService] Failed to start scanning:', error);
      throw error;
    }
  }

  /**
   * Stop scanning for devices
   */
  async stopScanning(): Promise<void> {
    this.ensureInitialized();

    if (!this.isScanning) {
      return;
    }

    try {
      await this.coreBluetooth.stopScan();
      this.isScanning = false;
      console.log('[BluetoothService] Stopped scanning for devices');
    } catch (error) {
      console.error('[BluetoothService] Failed to stop scanning:', error);
      throw error;
    }
  }

  /**
   * Connect to a specific device
   */
  async connectToDevice(deviceId: string): Promise<BluetoothConnection> {
    this.ensureInitialized();

    try {
      const result = await this.coreBluetooth.connect(deviceId);
      console.log(`[BluetoothService] Connected to device: ${deviceId}`);
      // Ensure the result has the required name property
      return {
        id: result.id,
        name: (result as any).name || 'Unknown Device'
      };
    } catch (error) {
      console.error(`[BluetoothService] Failed to connect to ${deviceId}:`, error);
      throw error;
    }
  }

  /**
   * Disconnect from a specific device
   */
  async disconnectFromDevice(deviceId: string): Promise<BluetoothConnection> {
    this.ensureInitialized();

    try {
      const result = await this.coreBluetooth.disconnect(deviceId);
      this.connectedDevices.delete(deviceId);
      console.log(`[BluetoothService] Disconnected from device: ${deviceId}`);
      // Ensure the result has the required name property
      return {
        id: result.id,
        name: (result as any).name || 'Unknown Device'
      };
    } catch (error) {
      console.error(`[BluetoothService] Failed to disconnect from ${deviceId}:`, error);
      throw error;
    }
  }

  /**
   * Read data from a device characteristic
   */
  async readCharacteristic(
    deviceId: string, 
    serviceUUID: string, 
    characteristicUUID: string
  ): Promise<void> {
    this.ensureInitialized();

    try {
      await this.coreBluetooth.readCharacteristic(deviceId, serviceUUID, characteristicUUID);
      console.log(`[BluetoothService] Reading characteristic ${characteristicUUID} from ${deviceId}`);
    } catch (error) {
      console.error(`[BluetoothService] Failed to read characteristic:`, error);
      throw error;
    }
  }

  /**
   * Write data to a device characteristic
   */
  async writeCharacteristic(
    deviceId: string, 
    serviceUUID: string, 
    characteristicUUID: string, 
    data: string
  ): Promise<void> {
    this.ensureInitialized();

    try {
      await this.coreBluetooth.writeCharacteristic(deviceId, serviceUUID, characteristicUUID, data);
      console.log(`[BluetoothService] Writing to characteristic ${characteristicUUID} on ${deviceId}`);
    } catch (error) {
      console.error(`[BluetoothService] Failed to write characteristic:`, error);
      throw error;
    }
  }

  /**
   * Get current Bluetooth state
   */
  async getBluetoothState(): Promise<string> {
    this.ensureInitialized();

    try {
      const result = await this.coreBluetooth.getBluetoothState();
      return result.state;
    } catch (error) {
      console.error('[BluetoothService] Failed to get Bluetooth state:', error);
      throw error;
    }
  }

  /**
   * Listen for device discovery events
   */
  onDeviceDiscovered(callback: (device: BluetoothDevice) => void): () => void {
    this.ensureInitialized();

    return this.addEventListener('onDeviceDiscovered', callback);
  }

  /**
   * Listen for device connection events
   */
  onDeviceConnected(callback: (connection: BluetoothConnection) => void): () => void {
    this.ensureInitialized();

    return this.addEventListener('onDeviceConnected', (connection: BluetoothConnection) => {
      // Store connected device info
      console.log(`[BluetoothService] Device connected: ${connection.name} (${connection.id})`);
      callback(connection);
    });
  }

  /**
   * Listen for device disconnection events
   */
  onDeviceDisconnected(callback: (connection: BluetoothConnection) => void): () => void {
    this.ensureInitialized();

    return this.addEventListener('onDeviceDisconnected', (connection: BluetoothConnection) => {
      // Remove from connected devices
      this.connectedDevices.delete(connection.id);
      console.log(`[BluetoothService] Device disconnected: ${connection.name} (${connection.id})`);
      callback(connection);
    });
  }

  /**
   * Listen for data received from devices
   */
  onDataReceived(callback: (data: BluetoothDataReceived) => void): () => void {
    this.ensureInitialized();

    return this.addEventListener('onDataReceived', (data: BluetoothDataReceived) => {
      console.log(`[BluetoothService] Data received from ${data.peripheralId}:`, data.value);
      callback(data);
    });
  }

  /**
   * Listen for Bluetooth state changes
   */
  onBluetoothStateChanged(callback: (state: string) => void): () => void {
    this.ensureInitialized();

    return this.addEventListener('onBluetoothStateChange', (stateData: { state: string }) => {
      console.log(`[BluetoothService] Bluetooth state changed: ${stateData.state}`);
      callback(stateData.state);
    });
  }

  /**
   * Listen for errors
   */
  onError(callback: (error: { error: string; id?: string; name?: string }) => void): () => void {
    this.ensureInitialized();

    return this.addEventListener('onError', (error) => {
      console.error('[BluetoothService] Bluetooth error:', error);
      callback(error);
    });
  }

  /**
   * Connect to Apple Watch specifically
   */
  async connectToAppleWatch(): Promise<BluetoothConnection | null> {
    // Start scanning if not already scanning
    if (!this.isScanning) {
      await this.startScanning();
    }

    return new Promise((resolve, reject) => {
      let deviceFoundTimeout: NodeJS.Timeout;
      
      // Listen for Apple Watch discovery
      const removeListener = this.onDeviceDiscovered((device) => {
        // Check if it's an Apple Watch
        if (device.name.toLowerCase().includes('apple watch') || 
            device.manufacturerData?.includes('Apple')) {
          
          clearTimeout(deviceFoundTimeout);
          removeListener();
          
          // Connect to the Apple Watch
          this.connectToDevice(device.id)
            .then(resolve)
            .catch(reject);
        }
      });

      // Timeout after 30 seconds
      deviceFoundTimeout = setTimeout(() => {
        removeListener();
        reject(new Error('Apple Watch not found within 30 seconds'));
      }, 30000) as any;
    });
  }

  /**
   * Get list of connected devices
   */
  getConnectedDevices(): BluetoothDevice[] {
    return Array.from(this.connectedDevices.values());
  }

  /**
   * Check if a specific device is connected
   */
  isDeviceConnected(deviceId: string): boolean {
    return this.connectedDevices.has(deviceId);
  }

  /**
   * Disconnect all connected devices
   */
  async disconnectAllDevices(): Promise<void> {
    const disconnectPromises = Array.from(this.connectedDevices.keys()).map(deviceId =>
      this.disconnectFromDevice(deviceId).catch(error => 
        console.error(`Failed to disconnect ${deviceId}:`, error)
      )
    );

    await Promise.all(disconnectPromises);
  }

  // Private helper methods
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('Bluetooth service not initialized. Call initialize() first.');
    }
  }

  private addEventListener<T extends keyof CoreBluetoothEvents>(
    eventType: T, 
    callback: CoreBluetoothEvents[T]
  ): () => void {
    const removeListener = this.coreBluetooth.addListener(eventType, callback);
    
    // Create a proper cleanup function
    const cleanup = () => {
      if (typeof removeListener === 'function') {
        removeListener();
      } else if (removeListener && typeof (removeListener as any).remove === 'function') {
        (removeListener as any).remove();
      }
    };
    
    // Store for cleanup  
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(cleanup);
    
    return cleanup;
  }

  /**
   * Clean up all event listeners
   */
  cleanup(): void {
    this.eventListeners.forEach((listeners) => {
      listeners.forEach(cleanup => {
        if (typeof cleanup === 'function') {
          cleanup();
        }
      });
    });
    this.eventListeners.clear();
    
    this.coreBluetooth.removeAllListeners('bluetoothStateChanged');
    console.log('[BluetoothService] Cleaned up all listeners');
  }

  // Static method to check if Bluetooth is supported
  static isSupported(): boolean {
    return Platform.OS === 'ios';
  }
}

// Export singleton instance
export default new BluetoothService(); 