import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import api from '../../api'; // Import your API helper

const PriceTag = ({ videoPrice, chatPrice }) => (
  <View style={styles.priceTag}>
    <Text style={styles.priceText}>Video Call: {videoPrice}</Text>
    <Text style={styles.priceDivider}>|</Text>
    <Text style={styles.priceText}>Chat: {chatPrice}</Text>
  </View>
);

const DoctorsList = ({ navigation, route }) => {
  const { department } = route.params;
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // Get the token
        if (token) {
          const response = await api.get('/virtualdoctors/list', {
            headers: {
              Authorization: `Bearer ${token}`, // Use the token here
            },
          });
          setDoctors(response.data);
        } else {
          Alert.alert('Error', 'No token found. Please log in again.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch doctors. Please try again later.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  function formatCurrency(amount) {
    // Convert the input to a number using parseFloat
    const number = parseFloat(amount);

    // Check if the conversion resulted in a valid number
    if (isNaN(number)) {
        console.error("Input must be a valid number or numeric string.");
        return null;
    }

    // Format the number with commas as thousand separators and 2 decimal places
    return number.toLocaleString('en-US', {
        style: 'decimal', // Use 'decimal' for plain numbers
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('Doctorsdetails', { doctor: item, department })}
    >
      <Image source={{ uri: 'https://placehold.jp/3d4070/ffffff/150x150.png?text=s' }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.full_name}</Text>
        <Text numberOfLines={1} style={styles.description}>{item.description}</Text>
        <PriceTag videoPrice={`TZS ${formatCurrency(item.video_call_price)}`} chatPrice={`TZS ${formatCurrency(item.audio_call_price)}`} />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Loading doctors...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <FlatList
        data={doctors}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  priceTag: {
    flexDirection: 'row',
    marginTop: 5,
    alignItems: 'center',
  },
  priceText: {
    fontSize: 14,
    color: '#4CAF50',
    marginHorizontal: 5,
  },
  priceDivider: {
    fontSize: 14,
    color: '#888',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default DoctorsList;
