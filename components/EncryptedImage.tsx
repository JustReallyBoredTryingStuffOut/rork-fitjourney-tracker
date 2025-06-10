import React, { useState, useEffect } from 'react';
import { Image, ImageProps, ActivityIndicator, View, StyleSheet, Platform } from 'react-native';
import { decryptPhoto, isEncryptedFile } from '@/utils/fileEncryption';
import { colors } from '@/constants/colors';

interface EncryptedImageProps extends Omit<ImageProps, 'source'> {
  uri: string;
  fallbackUri?: string;
}

export default function EncryptedImage({ 
  uri, 
  fallbackUri, 
  style, 
  ...props 
}: EncryptedImageProps) {
  const [decryptedUri, setDecryptedUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const loadImage = async () => {
      // Skip decryption for web or if the file is not encrypted
      if (Platform.OS === 'web' || !isEncryptedFile(uri)) {
        if (isMounted) setDecryptedUri(uri);
        return;
      }
      
      setIsLoading(true);
      setHasError(false);
      
      try {
        const decrypted = await decryptPhoto(uri);
        if (isMounted) {
          setDecryptedUri(decrypted);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading encrypted image:', error);
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
          // Use original URI as fallback if decryption fails
          setDecryptedUri(uri);
        }
      }
    };
    
    loadImage();
    
    // Cleanup function to handle component unmounting
    return () => {
      isMounted = false;
    };
  }, [uri]);
  
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, style]}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }
  
  if (hasError && fallbackUri) {
    return <Image source={{ uri: fallbackUri }} style={style} {...props} />;
  }
  
  return decryptedUri ? (
    <Image source={{ uri: decryptedUri }} style={style} {...props} />
  ) : (
    <View style={[styles.errorContainer, style]} />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    backgroundColor: colors.border,
  },
});