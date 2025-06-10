// This file provides information about the encryption implementation
// for documentation purposes

/**
 * Encryption Implementation Details
 * 
 * Our app uses industry-standard encryption techniques to protect sensitive data:
 * 
 * 1. Encryption Algorithm: AES-GCM (Galois/Counter Mode)
 *    - Provides both confidentiality and authenticity
 *    - Uses a 256-bit key length
 *    - Includes authentication tag to verify data integrity
 * 
 * 2. Key Derivation: PBKDF2 (Password-Based Key Derivation Function 2)
 *    - Derives encryption keys from master keys
 *    - Uses 100,000 iterations for computational security
 *    - Incorporates unique salt for each encryption operation
 * 
 * 3. Secure Random Number Generation:
 *    - Uses cryptographically secure random number generators
 *    - Generates unique IVs (Initialization Vectors) for each encryption
 *    - Creates random salts to prevent pre-computation attacks
 * 
 * 4. Key Storage:
 *    - Native: Uses SecureStore for secure key storage
 *    - Web: Uses a combination of localStorage with additional protections
 * 
 * 5. File Encryption:
 *    - Encrypts both file content and metadata
 *    - Uses unique filenames based on content hashes
 *    - Stores encrypted files in a dedicated directory
 * 
 * 6. Fallback Mechanisms:
 *    - Implements progressive fallbacks for different platforms
 *    - Ensures functionality across web and native environments
 *    - Maintains security even in limited environments
 * 
 * Security Considerations:
 * - All encryption operations are performed locally on the device
 * - No encryption keys are transmitted over the network
 * - Temporary decrypted files are cleaned up after use
 * - Version tracking allows for future encryption upgrades
 */

export const encryptionInfo = {
  algorithm: 'AES-GCM',
  keyLength: 256, // bits
  keyDerivation: 'PBKDF2',
  iterations: 100000,
  saltLength: 16, // bytes
  ivLength: 12, // bytes
  tagLength: 128, // bits
  version: 2, // Current encryption version
  
  // For documentation purposes only
  getDescription: () => `
    This app uses AES-GCM 256-bit encryption with PBKDF2 key derivation
    to protect your sensitive data. All encryption is performed locally
    on your device, and encryption keys are never transmitted over the network.
    
    For photos and media, both the content and metadata are encrypted
    separately to ensure maximum privacy.
  `
};