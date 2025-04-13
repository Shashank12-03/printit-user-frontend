import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CameraView, BarcodeScanningResult, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    // Camera permissions are still loading
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need your permission to use the camera</Text>
        <Text style={styles.button} onPress={requestPermission}>
          Grant Permission
        </Text>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    if (scanned) return; 
    setScanned(true);

    try {
      const parsedData = JSON.parse(data); 
      router.replace({
        pathname: `/shops/[id]`,
        params: {
          id: parsedData.id,
          shopName: parsedData.shopName,
          shopImage: parsedData.shopImage,
        },
      });
    } catch (error) {
      console.error('Invalid QR Code', error);
      // Show error message in UI instead of Alert
      setScanned(false); // Allow scanning again
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea} />
          {scanned && (
            <Text style={styles.scanAgainText} onPress={() => setScanned(false)}>
              Tap to scan again
            </Text>
          )}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center',
    padding: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  scanAgainText: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: 15,
    borderRadius: 8,
    overflow: 'hidden',
    fontSize: 16,
  },
});