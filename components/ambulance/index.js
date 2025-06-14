// AmbulanceScreen.js

import React, { useContext, useRef, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { Context as AuthContext } from '../../context/AppContext';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import axios from 'axios';
import { getDistance } from 'geolib';
import { Box, VStack, HStack, Avatar, Icon, Button } from 'native-base';
import { MaterialIcons } from 'react-native-vector-icons';
import io from 'socket.io-client';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('window');
const socket = io('https://api.quickline.tech');

const AmbulanceScreen = () => {
  const { state } = useContext(AuthContext);
  const mapRef = useRef(null);
  const fromRef = useRef();
  const toRef = useRef();
  const { t } = useTranslation();
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [fromText, setFromText] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [nearbyRiders, setNearbyRiders] = useState([]);
  const [selectedRider, setSelectedRider] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  const [routeCoords, setRouteCoords] = useState([]);
  const [tripStatus, setTripStatus] = useState('');
  const [tripId, setTripId] = useState('');

  useEffect(() => {
    const requestLocationPermission = async () => {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    };

    const fetchCurrentLocation = async () => {
      if (!(await requestLocationPermission())) return;

      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const location = { latitude, longitude };
          setFromLocation(location);
          mapRef.current?.animateToRegion({
            ...location,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });

          const res = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyD4eggCjR87W_jzEavBrCIBAe-BAL1z_Rc`
          );
          const address = res.data.results[0]?.formatted_address;
          setFromText(address);
          fromRef.current?.setAddressText(address);
        },
        () => Alert.alert('Error', 'Failed to fetch location.'),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    fetchCurrentLocation();
  }, []);

  const fetchNearbyRiders = async () => {
    try {
      const res = await axios.get('https://api.quickline.tech/trips/nearby-riders', {
        headers: { 'auth-token': state?.user?.auth_token },
        params: {
          latitude: fromLocation.latitude,
          longitude: fromLocation.longitude,
          radius: 1000000000,
        },
      });
      const riders = res.data.data;
      setNearbyRiders(riders);
      if (riders.length) autoSelectRider(riders[0]);
      else Alert.alert('No Riders', 'No nearby ambulance drivers found.');
    } catch {
      Alert.alert('Error', 'Could not load riders');
    }
  };

  const autoSelectRider = (rider) => setSelectedRider(rider);

  const onConfirm = () => {
    if (fromLocation && toLocation) {
      setConfirmed(true);
      fetchNearbyRiders();
    }
  };

  const distanceInMeters = selectedRider && fromLocation
    ? getDistance(
        { latitude: fromLocation.latitude, longitude: fromLocation.longitude },
        {
          latitude: selectedRider.location.coordinates[1],
          longitude: selectedRider.location.coordinates[0],
        }
      )
    : null;

  const estimateArrivalTime = (distance) => Math.ceil((distance / 11.11) / 60);

  const sendRideRequestViaSocket = () => {
    const payload = {
      pickup: fromText || 'Custom pickup',
      dropoff: 'Custom dropoff',
      coordinates: {
        origin: [fromLocation.longitude, fromLocation.latitude],
        destination: [toLocation.longitude, toLocation.latitude],
      },
      rider: selectedRider._id,
      auth_token: state?.user?.auth_token,
    };

    socket.emit('tripRequest', payload);
    setRequestSent(true);
  };

  const fetchRoute = async () => {
    try {
      const origin = `${selectedRider.location.coordinates[1]},${selectedRider.location.coordinates[0]}`;
      const destination = `${fromLocation.latitude},${fromLocation.longitude}`;
      const apiKey = 'AIzaSyD4eggCjR87W_jzEavBrCIBAe-BAL1z_Rc';

      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`
      );
      const points = decodePolyline(res.data.routes[0].overview_polyline.points);
      setRouteCoords(points);
    } catch (err) {
      console.error(err);
    }
  };

  const decodePolyline = (t) => {
    let points = [], index = 0, lat = 0, lng = 0;
    while (index < t.length) {
      let b, shift = 0, result = 0;
      do { b = t.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
      lat += (result & 1 ? ~(result >> 1) : result >> 1);
      shift = result = 0;
      do { b = t.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
      lng += (result & 1 ? ~(result >> 1) : result >> 1);
      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  };

  useEffect(() => {
    if (selectedRider && confirmed && !requestSent) sendRideRequestViaSocket();
  }, [selectedRider, confirmed]);

  useEffect(() => {
    socket.on('tripCreated', (data) => {
      if (data?.trip?._id) {
        setTripId(data.trip._id);
        Alert.alert('Ride Requested');
        fetchRoute();
      } else {
        Alert.alert('Error', 'Trip creation failed.');
      }
    });

    return () => socket.off('tripCreated');
  }, []);

  useEffect(() => {
    if (!tripId) return;

    socket.emit('joinTrip', tripId);

    const handleTripStatusUpdate = ({ status }) => {
      console.log('trip status --->', status);
      setTripStatus(status);
      if (status === 'en_route' || status === 'arrived') fetchRoute();
      if (status === 'completed') Alert.alert('Trip Completed');
    };

    const handleLocationUpdate = ({ userModel, coords }) => {
      if (userModel === 'AmbulanceRider') {
        mapRef.current?.animateToRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    };

    socket.on('tripStatusUpdate', handleTripStatusUpdate);
    socket.on('locationUpdate', handleLocationUpdate);

    return () => {
      socket.off('tripStatusUpdate', handleTripStatusUpdate);
      socket.off('locationUpdate', handleLocationUpdate);
    };
  }, [tripId]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{ latitude: 31.2001, longitude: 29.9187, latitudeDelta: 0.015, longitudeDelta: 0.0121 }}
      >
        {fromLocation && <Marker coordinate={fromLocation} title="You" pinColor="red" />}
        {toLocation && <Marker coordinate={toLocation} title="Destination" pinColor="purple" />}
        {selectedRider && (
          <Marker
            coordinate={{
              latitude: selectedRider.location.coordinates[1],
              longitude: selectedRider.location.coordinates[0],
            }}
            title="Ambulance"
            pinColor="blue"
          />
        )}
        {routeCoords.length > 0 && (
          <Polyline coordinates={routeCoords} strokeColor="#1e90ff" strokeWidth={4} />
        )}
      </MapView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.autocompleteContainer}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <GooglePlacesAutocomplete
            ref={fromRef}
            placeholder={t("Where from?")}
            textInputProps={{ placeholderTextColor: '#000' }}
            onPress={(data, details = null) => {
              const loc = details.geometry.location;
              setFromLocation({ latitude: loc.lat, longitude: loc.lng });
              setConfirmed(false); setRequestSent(false); setRouteCoords([]);
              setFromText(data.description);
            }}
            fetchDetails
            query={{ key: 'AIzaSyD4eggCjR87W_jzEavBrCIBAe-BAL1z_Rc', language: 'en' }}
            styles={inputStyle}
          />
          <GooglePlacesAutocomplete
            ref={toRef}
            placeholder={t("Where to?")}
            textInputProps={{ placeholderTextColor: '#000' }}
            onPress={(data, details = null) => {
              const loc = details.geometry.location;
              setToLocation({ latitude: loc.lat, longitude: loc.lng });
              setConfirmed(false); setRequestSent(false); setRouteCoords([]);
            }}
            fetchDetails
            query={{ key: 'AIzaSyD4eggCjR87W_jzEavBrCIBAe-BAL1z_Rc', language: 'en' }}
            styles={inputStyle}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {!confirmed && fromLocation && toLocation && (
        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
          <Text style={styles.confirmText}>Confirm & Find Nearby Riders</Text>
        </TouchableOpacity>
      )}

      {confirmed && (
        <Box position="absolute" bottom={130} left={10} right={10} bg="white" p={4} borderRadius="md" shadow={2}>
          <Text style={{ color: 'black' }}>Status: {tripStatus || 'Waiting for rider'}</Text>
        </Box>
      )}

      {selectedRider && fromLocation && (
        <Box position="absolute" bottom={0} left={0} right={0} bg="white" p={4} borderTopRadius="2xl" shadow={6}>
          <HStack alignItems="center" space={4}>
            <Avatar bg="blue.600">
              <Icon as={MaterialIcons} name="local-hospital" color="white" />
            </Avatar>
            <VStack flex={1}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'black' }}>
                {selectedRider.name || 'Ambulance Driver'}
              </Text>
              <Text style={{ color: 'gray' }}>ETA: {estimateArrivalTime(distanceInMeters)} min</Text>
              <Text style={{ color: 'gray' }}>
                Distance: {(distanceInMeters / 1000).toFixed(2)} km
              </Text>
            </VStack>
            <Button size="sm" onPress={() => Alert.alert('Calling driver...')}>Call</Button>
          </HStack>
        </Box>
      )}
    </View>
  );
};

const inputStyle = {
  container: { flex: 0, marginBottom: 10 },
  textInput: {
    height: 45,
    fontSize: 16,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 10,
    color: '#000',
  },
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width, height },
  autocompleteContainer: {
    position: 'absolute', top: 10, left: 10, right: 10,
    backgroundColor: 'white', borderRadius: 8, padding: 10, zIndex: 10,
  },
  confirmButton: {
    position: 'absolute', bottom: 30, left: 40, right: 40,
    backgroundColor: '#1e90ff', padding: 15, borderRadius: 8,
    alignItems: 'center', zIndex: 5,
  },
  confirmText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

export default AmbulanceScreen;
