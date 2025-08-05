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
  Linking,
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

const AmbulanceScreen = () => {
  const { state } = useContext(AuthContext);
  const mapRef = useRef(null);
  const fromRef = useRef();
  const toRef = useRef();
  const socketRef = useRef(null);
  const { t } = useTranslation();

  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [fromText, setFromText] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [nearbyRiders, setNearbyRiders] = useState([]);
  const [selectedRider, setSelectedRider] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [tripStatus, setTripStatus] = useState('');
  const [tripId, setTripId] = useState('');
  const [riderLocation, setRiderLocation] = useState(null);
  const [currentRouteStage, setCurrentRouteStage] = useState('toPickup');

  useEffect(() => {
    const socket = io('https://api.quickline.tech', {
      transports: ['websocket'],
      auth: { token: state?.user?.auth_token },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Connected to socket:', socket.id);
    });

    return () => socket.disconnect();
  }, []);

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
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCITjhP3x18ppVz8M7ld-mgaFv8LhE2McU`
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
      if (riders.length) {
        setSelectedRider(riders[0]);
        setRiderLocation({
          latitude: riders[0].location.coordinates[1],
          longitude: riders[0].location.coordinates[0],
        });
      } else {
        Alert.alert('No Riders', 'No nearby ambulance drivers found.');
      }
    } catch {
      Alert.alert('Error', 'Could not load riders');
    }
  };

  const sendRideRequestREST = async () => {
    try {
      const res = await axios.post(
        'https://api.quickline.tech/trips/request',
        {
          pickup: fromText || 'Custom pickup',
          dropoff: 'Custom dropoff',
          coordinates: {
            origin: [fromLocation.longitude, fromLocation.latitude],
            destination: [toLocation.longitude, toLocation.latitude],
          },
          rider: selectedRider?._id,
        },
        {
          headers: { 'auth-token': state?.user?.auth_token },
        }
      );

      const { trip } = res.data;
      setTripId(trip._id);
      Alert.alert('🚑 Trip requested successfully');
      fetchRoute('toPickup');
    } catch (err) {
      console.error(err);
      Alert.alert('❌ Request Failed', 'Trip request could not be processed.');
    }
  };

  const fetchRoute = async (stage = 'toPickup') => {
    try {
      let origin, destination;
      const apiKey = 'AIzaSyCITjhP3x18ppVz8M7ld-mgaFv8LhE2McU';

      if (stage === 'toPickup') {
        origin = `${selectedRider.location.coordinates[1]},${selectedRider.location.coordinates[0]}`;
        destination = `${fromLocation.latitude},${fromLocation.longitude}`;
      } else {
        origin = `${fromLocation.latitude},${fromLocation.longitude}`;
        destination = `${toLocation.latitude},${toLocation.longitude}`;
      }

      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}`
      );
      const points = decodePolyline(res.data.routes[0].overview_polyline.points);
      setRouteCoords(points);
      setCurrentRouteStage(stage);
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

  const onConfirm = async () => {
    if (fromLocation && toLocation) {
      setConfirmed(true);
      await fetchNearbyRiders();
    }
  };

  useEffect(() => {
    if (confirmed && selectedRider && fromLocation && toLocation) {
      sendRideRequestREST();
    }
  }, [confirmed, selectedRider]);

  useEffect(() => {
    if (!tripId || !socketRef.current) return;

    socketRef.current.emit('joinTrip', tripId);

    const handleTripStatusUpdate = ({ status }) => {
      console.log('🛰️ Trip status update:', status);
      setTripStatus(status);

      if (status === 'en_route') {
        fetchRoute('toPickup');
      } else if (status === 'arrived') {
        fetchRoute('toDropoff');
      } else if (status === 'completed') {
        Alert.alert('Trip Completed');
        setRouteCoords([]);
      }
    };

    const handleLocationUpdate = ({ userModel, coords }) => {
      if (userModel === 'AmbulanceRider') {
        const loc = { latitude: coords.latitude, longitude: coords.longitude };
        setRiderLocation(loc);
        mapRef.current?.animateToRegion({ ...loc, latitudeDelta: 0.01, longitudeDelta: 0.01 });
      }
    };

    const socket = socketRef.current;
    socket.on('tripStatusUpdate', handleTripStatusUpdate);
    socket.on('locationUpdate', handleLocationUpdate);

    return () => {
      socket.off('tripStatusUpdate', handleTripStatusUpdate);
      socket.off('locationUpdate', handleLocationUpdate);
    };
  }, [tripId]);

  const distanceInMeters = riderLocation && fromLocation
    ? getDistance(fromLocation, riderLocation)
    : null;

  const estimateArrivalTime = (distance) => Math.ceil((distance / 11.11) / 60);

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
        {riderLocation && (
          <Marker coordinate={riderLocation} title="Ambulance" pinColor="blue" />
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
              setConfirmed(false); setRouteCoords([]);
              setFromText(data.description);
            }}
            fetchDetails
            query={{ key: 'AIzaSyCITjhP3x18ppVz8M7ld-mgaFv8LhE2McU', language: 'en' }}
            styles={inputStyle}
          />
          <GooglePlacesAutocomplete
            ref={toRef}
            placeholder={t("Where to?")}
            textInputProps={{ placeholderTextColor: '#000' }}
            onPress={(data, details = null) => {
              const loc = details.geometry.location;
              setToLocation({ latitude: loc.lat, longitude: loc.lng });
              setConfirmed(false); setRouteCoords([]);
            }}
            fetchDetails
            query={{ key: 'AIzaSyCITjhP3x18ppVz8M7ld-mgaFv8LhE2McU', language: 'en' }}
            styles={inputStyle}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {!confirmed && fromLocation && toLocation && (
        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
          <Text style={styles.confirmText}>{t("Confirm & Find Nearby Riders")}</Text>
        </TouchableOpacity>
      )}

      {confirmed && (
        <Box position="absolute" bottom={130} left={10} right={10} bg="white" p={4} borderRadius="md" shadow={2}>
          <Text style={{ color: 'black' }}>{t("Status")}: {t(`${tripStatus}`) || t('Waiting for rider')}</Text>
        </Box>
      )}

      {riderLocation && fromLocation && (
        <Box position="absolute" bottom={0} left={0} right={0} bg="white" p={4} borderTopRadius="2xl" shadow={6}>
          <HStack alignItems="center" space={4}>
            <Avatar bg="blue.600">
              <Icon as={MaterialIcons} name="local-hospital" color="white" />
            </Avatar>
            <VStack flex={1}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'black' }}>
                {selectedRider?.name || 'Ambulance Driver'}
              </Text>
              <Text style={{ color: 'gray' }}>ETA: {estimateArrivalTime(distanceInMeters)} min</Text>
              <Text style={{ color: 'gray' }}>
                {t("Distance")}: {(distanceInMeters / 1000).toFixed(2)} km
              </Text>
            </VStack>
            <Button size="sm" onPress={() => Linking.openURL(`tel:${selectedRider?.telephone_number}`)}>
              {t("Call")}
            </Button>
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
