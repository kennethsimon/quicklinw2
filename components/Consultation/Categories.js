import React, { useContext, useEffect, useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import Icon library
import api from '../../api';
import { Context as AuthContext } from '../../context/AppContext';

const CategoriesList = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { state } = useContext(AuthContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        
        if (token) {
          const response = await api.get('/categories/get', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setCategories(response.data);
        } else {
          Alert.alert('Error', 'No token found. Please log in again.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('Doctorslist', { department: item?._id })}
    >
      <Image 
        source={{ uri: 'https://placehold.jp/3d4070/ffffff/150x150.png?text=s' }} 
        style={styles.avatar} 
      />
      <View style={styles.info}>
        <Text style={styles.title}>
          {state.language === 'english' ? item.name : item?.nameswahili}
        </Text>
        <Text style={styles.description}>
          {'Test description for category'}
        </Text>
      </View>
      <Icon name="chevron-right" size={20} color="#888" style={styles.chevron} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <FlatList
        data={categories}
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
    width: 50,
    height: 50,
    borderRadius: 25, // Make it circular
    marginRight: 15,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5, // Add spacing between title and description
  },
  description: {
    fontSize: 14,
    color: '#888',
  },
  chevron: {
    marginLeft: 10, // Add spacing between info and chevron
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

export default CategoriesList;