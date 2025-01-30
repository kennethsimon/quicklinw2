/* eslint-disable react/no-unstable-nested-components */
import {useNavigation} from '@react-navigation/native';
import {Divider, Menu} from 'native-base';
import React from 'react';
import {Dimensions, Pressable, StyleSheet, Text, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const {width} = Dimensions.get('window');
const Cardcomponent = ({data, onCheckBalance, listacardctivities}) => {
  const navigation = useNavigation();

  function addSpacesToNumber(number) {
    // Convert the number to a string
    const numberString = String(number);

    // Split the number string into groups of 4 digits
    const groups = numberString.match(/.{1,4}/g);

    // Join the groups with a space in between
    const result = groups.join('  ');

    return result;
  }
  return (
    <Pressable
      onPress={() => {
        listacardctivities({card_id: data.id, limit: 20, offset: 0});
        navigation.navigate('Managecard', {carddata: data});
      }}
      style={styles.maincontainer}>
      <View style={styles.cardcontent}>
        <View style={styles.cardheadercontainer}>
          <Text style={styles.cardheader}>{data?.cardholder}</Text>
          <Text style={styles.cardminiheader}>{data?.partner}</Text>
        </View>

        <Menu
          w="190"
          placement="left top"
          trigger={triggerProps => {
            return (
              <Pressable accessibilityLabel="More options" {...triggerProps}>
                <Icon name="dots-horizontal-circle" size={30} color="#fff" />
              </Pressable>
            );
          }}>
          <Menu.Item
            onPress={() => {
              onCheckBalance(data);
            }}>
            Check Balance
          </Menu.Item>
          <Divider w="100%" />
          <Menu.Item
            onPress={() => {
              navigation.navigate('Managecard', {carddata: data});
            }}>
            View Details
          </Menu.Item>
        </Menu>
        {/* <Pressable
          onPress={() => {
            navigation.navigate('Carddetails');
          }}>
          <Icon name="dots-horizontal-circle" size={30} color="#fff" />
        </Pressable> */}
      </View>
      <View style={styles.cardcontent}>
        <Text style={styles.cardnumber}>
          {addSpacesToNumber(data.card_number)}
        </Text>
        <Text style={styles.expnumber}>Exp {data.expires_at}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardheadercontainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  cardheader: {
    color: '#fff',
    fontSize: RFValue(16),
    fontWeight: 500,
  },
  cardminiheader: {
    color: '#fff',
    fontSize: RFValue(14),
    fontWeight: 500,
    marginTop: RFValue(10),
  },
  cardnumber: {
    color: '#fff',
    fontSize: RFValue(13),
    fontWeight: 500,
  },
  expnumber: {
    color: '#fff',
    fontSize: RFValue(13),
    fontWeight: 500,
  },
  cardcontent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  maincontainer: {
    width: width - RFValue(60),
    height: RFValue(170),
    borderRadius: RFValue(10),
    backgroundColor: '#539D8B',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: RFValue(20),
    paddingHorizontal: RFValue(20),
    marginTop: RFValue(20),
    marginRight: RFValue(10),
  },
});

export default Cardcomponent;
