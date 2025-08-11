import React, { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Clipboard,
  View,
  PermissionsAndroid,
  Platform
} from 'react-native';
import {
  Box, HStack, VStack, Text, Spinner, Center, Avatar, Modal,
  Button, useDisclose, Divider, IconButton, useToast
} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTranslation } from 'react-i18next';
import { Context as AuthContext } from '../../context/AppContext';
import Geolocation from 'react-native-geolocation-service';

const API_URL = 'https://api.quickline.tech/traffic-officers';
const PAYMENT_API = 'http://api.quickline.tech/traffic-payments';

export default function TrafficPoliceListScreen() {
  const [loading, setLoading] = useState(true);
  const [officers, setOfficers] = useState([]);
  const [paidOfficerIds, setPaidOfficerIds] = useState([]);
  const [selectedOfficerId, setSelectedOfficerId] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const [locationError, setLocationError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclose();
  const { t } = useTranslation();
  const { state } = useContext(AuthContext);
  const toast = useToast();

  const fetchOfficers = async (lat, lng) => {
    setLoading(true);
    setLocationError(null);
    try {
      const url = `${API_URL}/nearby?lat=${lat}&lng=${lng}&radius=2000`;
      const res = await fetch(url, {
        headers: { 'auth-token': state?.user?.auth_token }
      });
      const json = await res.json();
      if (res.status === 200) {
        setOfficers(json.data || []);
      } else {
        throw new Error(json.message || 'Failed to fetch officers');
      }
    } catch (err) {
      console.error('Fetch officers error:', err);
      setLocationError('Failed to fetch nearby officers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaidOfficers = async () => {
    try {
      const res = await fetch(`${PAYMENT_API}/user/${state?.user?.user?._id}`, {
        headers: { 'auth-token': state?.user?.auth_token }
      });
      const json = await res.json();

      // MAP OFFICER IDS (convert to string for safe comparison)
      const ids = json.data.map(p => p.officer_id._id.toString());
      setPaidOfficerIds(ids);
    } catch (err) {
      console.error('Fetch paid officers error:', err);
    }
  };

  const initializePayment = async (officerId) => {
    try {
      const payload = {
        user_id: state?.user?.user?._id,
        officer_id: officerId,
        amount: 9.99,
        payment_method: 'mobile_money'
      };

      await fetch(PAYMENT_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': state?.user?.auth_token
        },
        body: JSON.stringify(payload)
      });

      setSelectedOfficerId(officerId);
      onOpen();
    } catch (err) {
      console.error('Payment init failed', err);
      toast.show({
        title: 'Failed to initialize payment',
        status: 'error'
      });
    }
  };

  const confirmPayment = () => {
    onClose();
    fetchPaidOfficers();
  };

  const handlePhonePress = (id) => {
    // convert to string for safe compare
    const isPaid = paidOfficerIds.includes(id.toString());

    if (selectedTab === 'completed' && isPaid) {
      // Already paid and in "Completed" tab — just reveal number
      setSelectedOfficerId(id);
      return;
    }

    if (isPaid) {
      // In 'Nearby Officers' tab but already paid — reveal number
      setSelectedOfficerId(id);
      return;
    }

    // Otherwise initiate payment
    initializePayment(id);
  };

  const handleCopy = (value) => {
    Clipboard.setString(value);
    toast.show({
      title: 'Copied to clipboard',
      status: 'success',
      placement: 'top',
      duration: 1500,
    });
  };

  const getUserLocation = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to find nearby officers.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          setLocationError('Location permission denied. Please enable location services.');
          setLoading(false);
          return;
        }
      }

      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchOfficers(latitude, longitude);
        },
        (error) => {
          console.error('Location error:', error);
          setLocationError('Unable to get your location. Please try again.');
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } catch (err) {
      console.error('Location error:', err);
      setLocationError('Unable to get your location. Please try again.');
      setLoading(false);
    }
  };

  const renderPaymentRow = (label, value) => (
    <HStack alignItems="center" justifyContent="space-between">
      <Text>{label}: <Text bold>{value}</Text></Text>
      <IconButton
        icon={<Icon name="content-copy" size={18} color="#4A5568" />}
        onPress={() => handleCopy(value)}
        variant="ghost"
        _pressed={{ bg: 'coolGray.200' }}
      />
    </HStack>
  );

  const isWithinTimeWindow = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const after18 = hours > 18 || (hours === 18 && minutes >= 0);
    const before0730 = hours < 7 || (hours === 7 && minutes <= 30);
    return after18 || before0730;
  };

  const filteredOfficers =
    selectedTab === 'completed'
      ? officers.filter(o => paidOfficerIds.includes(o._id.toString()))
      : officers;

  const renderItem = ({ item }) => {
    const isPaid = paidOfficerIds.includes(item._id.toString());
    const showStationPhone = isWithinTimeWindow();
    const shouldShowPhone = selectedOfficerId === item._id && isPaid;

    return (
      <Box
        bg="white"
        borderRadius="lg"
        p={4}
        mb={3}
        shadow={2}
        borderColor="coolGray.200"
        borderWidth={1}
      >
        <HStack space={4} alignItems="center">
          <Avatar
            source={{
              uri:
                item?.avatar ||
                'https://png.pngtree.com/png-vector/20240910/ourlarge/pngtree-policeman-avatar-png-image_13805775.png'
            }}
            size="md"
          />
          <VStack flex={1}>
            <Text bold fontSize="md" color="coolGray.800">
              {item.full_name}
            </Text>
            <Text fontSize="sm" color="coolGray.500">
              {item.station}
            </Text>
            <Text fontSize="xs" color="coolGray.400">
              {item.location.address}
            </Text>
          </VStack>
          <TouchableOpacity onPress={() => handlePhonePress(item._id)} style={styles.iconButton}>
            <Icon name="phone" size={24} color="#007AFF" />
            {shouldShowPhone && (
              <Text style={styles.phoneText}>
                {showStationPhone ? item.station_phone : item.phone}
              </Text>
            )}
          </TouchableOpacity>
        </HStack>
      </Box>
    );
  };

  useEffect(() => {
    getUserLocation();
    fetchPaidOfficers();
  }, []);

  useEffect(() => {
    if (selectedTab === 'completed') {
      fetchPaidOfficers();
    } else {
      getUserLocation();
    }
  }, [selectedTab]);

  return (
    <Box flex={1} bg="coolGray.100" pt={6} px={4}>
      <HStack space={4} mb={4} justifyContent="center">
        <TouchableOpacity
          onPress={() => setSelectedTab('all')}
          style={[styles.tab, selectedTab === 'all' && styles.activeTab]}
        >
          <Text style={[styles.tabText, selectedTab === 'all' && styles.activeTabText]}>
            {t("Nearby Officers")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelectedTab('completed')}
          style={[styles.tab, selectedTab === 'completed' && styles.activeTab]}
        >
          <Text style={[styles.tabText, selectedTab === 'completed' && styles.activeTabText]}>
            {t("Paid Officers")}
          </Text>
        </TouchableOpacity>
      </HStack>

      {loading ? (
        <Center flex={1}>
          <Spinner color="primary.500" size="lg" />
          <Text mt={3} color="coolGray.600">
            {t('Loading officers near your location')}...
          </Text>
        </Center>
      ) : locationError ? (
        <Center flex={1}>
          <Text color="red.500">{locationError}</Text>
          <Button mt={4} colorScheme="primary" onPress={getUserLocation}>
            Retry
          </Button>
        </Center>
      ) : (
        <FlatList
          data={filteredOfficers}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Center mt={10}>
              <Text>{t('No officers found near your location')}</Text>
            </Center>
          }
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>{t('Pay to View Phone Number')}</Modal.Header>
          <Modal.Body>
            <VStack space={3}>
              <Text fontSize="sm">{t('To access the phone number, please pay using one of the following services')}:</Text>
              <Divider />
              {renderPaymentRow('📱 M-Pesa', '123456')}
              {renderPaymentRow('📱 Airtel Money', '123456')}
              {renderPaymentRow('📱 HaloPesa', '654321')}
              {renderPaymentRow('📱 Mix by YAS', '5436546')}
              <Divider mt={2} />
              <Text color="gray.500" fontSize="xs">
                {t('After payment, tap the button below to proceed.')}
              </Text>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button flex="1" onPress={confirmPayment} colorScheme="primary">
              {t("I've Paid")}
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    alignItems: 'center',
  },
  phoneText: {
    marginTop: 4,
    fontSize: 12,
    color: '#007AFF',
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    color: '#4A5568',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: 'white',
  },
});
