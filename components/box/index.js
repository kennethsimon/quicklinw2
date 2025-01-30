import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';

const Box = ({ iconName, text, onPress }) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity onPress={onPress} style={styles.box}>
      <Icon name={iconName} size={40} color="#fff" />
      <Text style={styles.text}>{t(text)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    width: '45%',
    padding: 10,
    height: 150,
    backgroundColor: '#25A18E',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#fff'
  },
});

export default Box;