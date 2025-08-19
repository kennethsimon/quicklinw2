import React, { useContext, useRef, useState, useEffect, useCallback } from 'react';
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
  RefreshControl,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { Context as AuthContext } from '../../context/AppContext';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import axios from 'axios';
import { getDistance } from 'geolib';
import { Box, VStack, HStack, Avatar, Icon, Button, Spinner, Center, useToast } from 'native-base';
import { MaterialIcons } from 'react-native-vector-icons';
import io from 'socket.io-client';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const GOOGLE_MAPS_API_KEY = 'AIzaSyCITjhP3x18ppVz8M7ld-mgaFv8LhE2McU';
const API_BASE = 'https://api.quickline.tech';

const AmbulanceScreen = () => {
  const { state } = useContext(AuthContext);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const toast = useToast();
  const mapRef = useRef(null);
  const fromRef = useRef(null);
  const toRef = useRef(null);
  const socketRef = useRef(null);
  const locationWatchId = useRef(null);
  const completionAlertShownRef = useRef(false);

  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(null);
  const [fromText, setFromText] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [nearbyRiders, setNearbyRiders] = useState([]);
  const [selectedRider, setSelectedRider] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [tripStatus, setTripStatus] = useState('requested');
  const [tripId, setTripId] = useState('');
  const [riderLocation, setRiderLocation] = useState(null);
  const [currentRouteStage, setCurrentRouteStage] = useState('toPickup');
  const [loading, setLoading] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const validateCoordinates = (coords) => {
    if (!coords) return false;
    const { latitude, longitude } = coords;
    return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
  };

  const initializeSocket = useCallback(() => {
    const socket = io(API_BASE, {
      transports: ['websocket'],
      auth: { token: state?.user?.auth_token },
    });
    socketRef.current = socket;

    socket.on('connect', () => console.log('✅ Connected to socket:', socket.id));
    socket.on('connect_error', (err) => {
      console.error('Socket connect error:', err);
      toast.show({ title: t('Socket connection failed'), status: 'error' });
    });

    return () => socket.disconnect();
  }, [state?.user?.auth_token, t, toast]);

  const requestLocationPermission = useCallback(async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: t('Location Permission'),
            message: t('This app needs access to your location to find nearby riders.'),
            buttonNeutral: t('Ask Me Later'),
            buttonNegative: t('Cancel'),
            buttonPositive: t('OK'),
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Permission error:', err);
        setLocationError(t('Failed to request location permission.'));
        return false;
      }
    } else if (Platform.OS === 'ios') {
      try {
        const status = await Geolocation.requestAuthorization('whenInUse');
        return status === 'granted';
      } catch (err) {
        console.error('iOS permission error:', err);
        setLocationError(t('Failed to request location permission.'));
        return false;
      }
    }
    return true;
  }, [t]);

  const fetchCurrentLocation = useCallback(async () => {
    if (!(await requestLocationPermission())) {
      setLocationError(t('Location permission denied. Please enable in settings.'));
      return;
    }

    setLoading(true);
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        if (!validateCoordinates({ latitude, longitude })) {
          setLocationError(t('Invalid location coordinates received.'));
          setLoading(false);
          return;
        }
        const location = { latitude, longitude };
        setFromLocation(location);
        mapRef.current?.animateToRegion({
          ...location,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01 * (width / height),
        });

        try {
          const res = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
          );
          const address = res.data.results[0]?.formatted_address || t('Unknown location');
          setFromText(address);
          fromRef.current?.setAddressText(address);
        } catch (err) {
          console.error('Geocode error:', err);
          toast.show({ title: t('Failed to fetch address'), status: 'error' });
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Location error:', error);
        setLocationError(t('Failed to get location. Please ensure location services are enabled.'));
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, [t, toast]);

  const debouncedFetchRiders = useCallback(
    debounce((latitude, longitude) => {
      fetchNearbyRiders(latitude, longitude);
    }, 5000),
    []
  );

  const watchLocation = useCallback(() => {
    if (!(fromLocation && validateCoordinates(fromLocation))) return;
    debouncedFetchRiders(fromLocation.latitude, fromLocation.longitude);
  }, [fromLocation, debouncedFetchRiders]);

  const fetchNearbyRiders = useCallback(async (latitude, longitude) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/trips/nearby-riders`, {
        headers: { 'auth-token': state?.user?.auth_token },
        params: { latitude, longitude, radius: 1000000000 },
      });
      const riders = res.data.data || [];
      setNearbyRiders(riders);
      if (riders.length) {
        setSelectedRider(riders[0]);
        setRiderLocation({
          latitude: riders[0].location.coordinates[1],
          longitude: riders[0].location.coordinates[0],
        });
      } else {
        toast.show({ title: t('No nearby ambulance drivers found'), status: 'warning' });
        setConfirmed(false);
      }
      return riders.length > 0;
    } catch (err) {
      console.error('Fetch riders error:', err);
      toast.show({ title: t('Could not load riders'), status: 'error' });
      setConfirmed(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, [state?.user?.auth_token, t, toast]);

  const sendRideRequestREST = useCallback(async () => {
    if (!fromLocation || !toLocation || !selectedRider) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE}/trips/request`,
        {
          pickup: fromText || t('Custom pickup'),
          dropoff: toLocation ? t('Custom dropoff') : t('Unknown destination'),
          coordinates: {
            origin: [fromLocation.longitude, fromLocation.latitude],
            destination: [toLocation.longitude, toLocation.latitude],
          },
          rider: selectedRider._id,
        },
        { headers: { 'auth-token': state?.user?.auth_token } }
      );
      const { trip } = res.data;
      setTripId(trip._id);
      socketRef.current?.emit('joinTrip', trip._id);
      toast.show({ title: t('Trip requested successfully'), status: 'success' });
      fetchRoute('toPickup');
    } catch (err) {
      console.error('Request error:', err);
      toast.show({ title: t('Trip request failed'), status: 'error' });
      setConfirmed(false);
    } finally {
      setLoading(false);
    }
  }, [fromLocation, toLocation, selectedRider, fromText, state?.user?.auth_token, t, toast]);

  const fetchRoute = useCallback(async (stage = 'toPickup') => {
    if (!fromLocation || !selectedRider || (stage === 'toDropoff' && !toLocation)) return;
    setRouteLoading(true);
    try {
      let origin, destination;
      if (stage === 'toPickup') {
        origin = {
          latitude: selectedRider.location.coordinates[1],
          longitude: selectedRider.location.coordinates[0],
        };
        destination = fromLocation;
      } else {
        origin = fromLocation;
        destination = toLocation;
      }
      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );
      if (res.data.routes.length > 0) {
        const points = decodePolyline(res.data.routes[0].overview_polyline.points);
        setRouteCoords(points);
        setCurrentRouteStage(stage);
        mapRef.current?.fitToCoordinates([origin, destination], {
          edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
          animated: true,
        });
      } else {
        setRouteCoords([]);
        toast.show({ title: t('No route found'), status: 'warning' });
      }
    } catch (err) {
      console.error('Route error:', err);
      toast.show({ title: t('Failed to fetch route'), status: 'error' });
    } finally {
      setRouteLoading(false);
    }
  }, [fromLocation, toLocation, selectedRider, t, toast]);

  const decodePolyline = (encoded) => {
    let points = [];
    let index = 0, lat = 0, lng = 0;
    while (index < encoded.length) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const deltaLat = (result & 1) ? ~(result >> 1) : (result >> 1);
      lat += deltaLat;
      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const deltaLng = (result & 1) ? ~(result >> 1) : (result >> 1);
      lng += deltaLng;
      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  };

  const showCompletionAlert = useCallback(() => {
    if (!completionAlertShownRef.current) {
      completionAlertShownRef.current = true;
      Alert.alert(t('Trip Completed'), t('You have successfully completed the trip'), [
        { text: t('OK'), onPress: () => navigation.navigate('Home') },
      ]);
    }
  }, [t, navigation]);

  const handleTripStatusUpdate = useCallback(
    ({ status }) => {
      console.log('🛰️ Trip status update:', status);
      setTripStatus(status);
      if (status === 'accepted' || status === 'en_route') {
        fetchRoute('toPickup');
      } else if (status === 'arrived' || status === 'to_destination') {
        fetchRoute('toDropoff');
      } else if (status === 'completed') {
        setRouteCoords([]);
        showCompletionAlert();
      } else if (status === 'cancelled') {
        setRouteCoords([]);
        Alert.alert(t('Trip Cancelled'), t('The trip was cancelled.'), [
          { text: t('OK'), onPress: () => navigation.navigate('Home') },
        ]);
      }
    },
    [fetchRoute, showCompletionAlert, t, navigation]
  );

  const handleLocationUpdate = useCallback(
    ({ userModel, coords }) => {
      if (userModel === 'AmbulanceRider' && validateCoordinates(coords)) {
        setRiderLocation(coords);
        if (tripStatus === 'en_route' || tripStatus === 'accepted') {
          mapRef.current?.fitToCoordinates([coords, fromLocation], {
            edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
            animated: true,
          });
        } else if (tripStatus === 'arrived' || tripStatus === 'to_destination') {
          mapRef.current?.fitToCoordinates([coords, toLocation], {
            edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
            animated: true,
          });
        }
      }
    },
    [tripStatus, fromLocation, toLocation]
  );

  const onConfirm = useCallback(async () => {
    if (!fromLocation || !toLocation || !validateCoordinates(fromLocation) || !validateCoordinates(toLocation)) {
      toast.show({ title: t('Please select valid pickup and dropoff locations'), status: 'error' });
      return;
    }
    setLoading(true);
    setConfirmed(true);
    const hasRiders = await fetchNearbyRiders(fromLocation.latitude, fromLocation.longitude);
    if (hasRiders && selectedRider) {
      await sendRideRequestREST();
    } else {
      setConfirmed(false);
    }
  }, [fromLocation, toLocation, fetchNearbyRiders, sendRideRequestREST, t, toast]);

  useEffect(() => {
    initializeSocket();
    fetchCurrentLocation();
    return () => {
      if (locationWatchId.current) {
        Geolocation.clearWatch(locationWatchId.current);
      }
      socketRef.current?.disconnect();
      debouncedFetchRiders.cancel();
    };
  }, [initializeSocket, fetchCurrentLocation]);

  useEffect(() => {
    if (!tripId || !socketRef.current) return;
    const socket = socketRef.current;
    socket.emit('joinTrip', tripId);
    socket.on('tripStatusUpdate', handleTripStatusUpdate);
    socket.on('locationUpdate', handleLocationUpdate);
    return () => {
      socket.off('tripStatusUpdate', handleTripStatusUpdate);
      socket.off('locationUpdate', handleLocationUpdate);
    };
  }, [tripId, handleTripStatusUpdate, handleLocationUpdate]);

  const distanceInMeters = riderLocation && fromLocation && validateCoordinates(riderLocation) && validateCoordinates(fromLocation)
    ? getDistance(fromLocation, riderLocation)
    : null;

  const estimateArrivalTime = (distance) => (distance ? Math.ceil((distance / 11.11) / 60) : '--');

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: fromLocation?.latitude || 31.2001,
          longitude: fromLocation?.longitude || 29.9187,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121 * (width / height),
        }}
        showsUserLocation
      >
        {fromLocation && validateCoordinates(fromLocation) && (
          <Marker coordinate={fromLocation} title={t('You')}>
            <Icon as={MaterialIcons} name="person-pin" size={6} color="#FF0000" />
          </Marker>
        )}
        {toLocation && validateCoordinates(toLocation) && (
          <Marker coordinate={toLocation} title={t('Destination')}>
            <Icon as={MaterialIcons} name="place" size={6} color="#800080" />
          </Marker>
        )}
        {riderLocation && validateCoordinates(riderLocation) && (
          <Marker coordinate={riderLocation} title={t('Ambulance')}>
            <Icon as={MaterialIcons} name="local-hospital" size={6} color="#0000FF" />
          </Marker>
        )}
        {routeCoords.length > 0 && (
          <Polyline coordinates={routeCoords} strokeColor="#1e90ff" strokeWidth={4} />
        )}
      </MapView>

      {locationError && (
        <Box position="absolute" top={10} left={10} right={10} bg="red.500" p={2} borderRadius="md" zIndex={11}>
          <Text color="white" textAlign="center">{locationError}</Text>
          <Button mt={2} onPress={fetchCurrentLocation} colorScheme="white" variant="outline" size="sm">
            {t('Retry')}
          </Button>
        </Box>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.autocompleteContainer}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 10 }}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={confirmed ? watchLocation : fetchCurrentLocation}
            />
          }
        >
          <GooglePlacesAutocomplete
            ref={fromRef}
            placeholder={t('Where from?')}
            textInputProps={{ placeholderTextColor: '#000' }}
            onPress={(data, details = null) => {
              const loc = details?.geometry.location;
              if (loc && validateCoordinates({ latitude: loc.lat, longitude: loc.lng })) {
                setFromLocation({ latitude: loc.lat, longitude: loc.lng });
                setFromText(data.description);
                setConfirmed(false);
                setRouteCoords([]);
              }
            }}
            fetchDetails
            query={{ key: GOOGLE_MAPS_API_KEY, language: 'en' }}
            styles={inputStyle}
          />
          <GooglePlacesAutocomplete
            ref={toRef}
            placeholder={t('Where to?')}
            textInputProps={{ placeholderTextColor: '#000' }}
            onPress={(data, details = null) => {
              const loc = details?.geometry.location;
              if (loc && validateCoordinates({ latitude: loc.lat, longitude: loc.lng })) {
                setToLocation({ latitude: loc.lat, longitude: loc.lng });
                setConfirmed(false);
                setRouteCoords([]);
              }
            }}
            fetchDetails
            query={{ key: GOOGLE_MAPS_API_KEY, language: 'en' }}
            styles={inputStyle}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {(loading || routeLoading) && (
        <Center position="absolute" top={0} left={0} right={0} bottom={0} bg="rgba(0,0,0,0.3)" zIndex={10}>
          <Spinner color="primary.500" size="lg" />
          <Text mt={3} color="white">{t(loading ? 'Loading...' : 'Fetching route...')}</Text>
        </Center>
      )}

      {!confirmed && fromLocation && toLocation && (
        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
          <Text style={styles.confirmText}>{t('Confirm & Find Nearby Riders')}</Text>
        </TouchableOpacity>
      )}

      {confirmed && (
        <Box position="absolute" bottom={130} left={10} right={10} bg="white" p={4} borderRadius="md" shadow={2}>
          <Text style={{ color: 'black' }}>{t('Status')}: {t(tripStatus || 'Waiting for rider')}</Text>
        </Box>
      )}

      {riderLocation && fromLocation && selectedRider && (
        <Box position="absolute" bottom={0} left={0} right={0} bg="white" p={4} borderTopRadius="2xl" shadow={6}>
          <HStack alignItems="center" space={4}>
            <Avatar bg="blue.600">
              <Icon as={MaterialIcons} name="local-hospital" color="white" />
            </Avatar>
            <VStack flex={1}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'black' }}>
                {selectedRider.name || t('Ambulance Driver')}
              </Text>
              <Text style={{ color: 'gray' }}>{t('ETA')}: {estimateArrivalTime(distanceInMeters)} min</Text>
              <Text style={{ color: 'gray' }}>
                {t('Distance')}: {distanceInMeters ? (distanceInMeters / 1000).toFixed(2) : '--'} km
              </Text>
            </VStack>
            <Button size="sm" onPress={() => Linking.openURL(`tel:${selectedRider.telephone_number}`)}>
              {t('Call')}
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
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    zIndex: 10,
  },
  confirmButton: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    zIndex: 5,
  },
  confirmText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AmbulanceScreen;