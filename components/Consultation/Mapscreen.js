import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import axios from "axios";
import MapViewDirections from "react-native-maps-directions";

const GOOGLE_MAPS_API_KEY = "AIzaSyD4eggCjR87W_jzEavBrCIBAe-BAL1z_Rc";

const HospitalMapScreen = () => {
  const [region, setRegion] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [nearestHospital, setNearestHospital] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        Alert.alert("Permission Denied", "Enable location permissions to use this feature.");
        setLoading(false);
      }
    } else {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        setRegion(userRegion);
        fetchNearbyHospitals(latitude, longitude);
      },
      (error) => {
        Alert.alert("Location Error", "Unable to get location. Using default.");
        const defaultRegion = {
          latitude: 37.7749, // San Francisco (Default)
          longitude: -122.4194,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        setRegion(defaultRegion);
        fetchNearbyHospitals(37.7749, -122.4194);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const fetchNearbyHospitals = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
        {
          params: {
            location: `${latitude},${longitude}`,
            radius: 500000,
            type: "hospital",
            key: GOOGLE_MAPS_API_KEY,
          },
        }
      );

      if (response.data.results.length > 0) {
        const sortedHospitals = response.data.results.sort((a, b) => {
          const distanceA = Math.hypot(
            a.geometry.location.lat - latitude,
            a.geometry.location.lng - longitude
          );
          const distanceB = Math.hypot(
            b.geometry.location.lat - latitude,
            b.geometry.location.lng - longitude
          );
          return distanceA - distanceB;
        });

        setHospitals(sortedHospitals);
        setNearestHospital(sortedHospitals[0]); // Select the closest hospital
      } else {
        Alert.alert("No Hospitals Found", "No nearby hospitals were found in your area.");
      }
    } catch (error) {
      Alert.alert("Error", "Could not fetch nearby hospitals.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loader} />
      ) : region ? (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={region}
          showsUserLocation
        >
          <Marker coordinate={region} title="You are here" pinColor="blue" />

          {hospitals.map((hospital, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: hospital.geometry.location.lat,
                longitude: hospital.geometry.location.lng,
              }}
              title={hospital.name}
              pinColor="red"
            />
          ))}

          {nearestHospital && (
            <MapViewDirections
              origin={region}
              destination={{
                latitude: nearestHospital.geometry.location.lat,
                longitude: nearestHospital.geometry.location.lng,
              }}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={4}
              strokeColor="blue"
            />
          )}
        </MapView>
      ) : (
        Alert.alert("Error", "Map cannot load. Please enable location services.")
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default HospitalMapScreen;
