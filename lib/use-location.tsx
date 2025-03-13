import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Alert, Linking } from 'react-native';

interface LocationHookReturn {
  location: Location.LocationObject | null;
  loading: boolean;
  error: string | null;
  getLocation: () => Promise<void>;
}

export const useLocation = (isIndexPage: boolean = false): LocationHookReturn => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        if (isIndexPage) {
          Alert.alert(
            "Location Required",
            "This app requires location access to show nearby shops. Please enable location services to continue.",
            [
              { 
                text: "Open Settings", 
                onPress: () => Linking.openSettings() 
              }
            ]
          );
        }
        setError('Location permission denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setError(null);
    } catch (err) {
      setError('Failed to get location');
      if (isIndexPage) {
        Alert.alert(
          "Error",
          "Failed to get your location. Please try again.",
          [
            { 
              text: "Retry", 
              onPress: getLocation 
            }
          ]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isIndexPage) {
      getLocation();
    }
  }, [isIndexPage]);

  return { location, loading, error, getLocation };
};