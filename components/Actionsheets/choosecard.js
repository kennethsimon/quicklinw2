import {Actionsheet, Box, Text} from 'native-base';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';

const Choosecard = ({isOpen, onClose, cards, onPressItem}) => {
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
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        <Box w="100%" px={4} pb={4} justifyContent="flex-start">
          <Text fontSize="20" color="black" fontWeight={'bold'}>
            Select card
          </Text>
        </Box>
        <Box w="100%" px={4} pb={4} justifyContent="flex-start">
          {Array.isArray(cards) && cards.length > 0 ? (
            cards.map(card => {
              return (
                <Actionsheet.Item
                  key={card.id}
                  style={styles.cardnumber}
                  onPress={() => onPressItem(card)}>
                  {`${addSpacesToNumber(card?.card_number)}   (${
                    card?.cardholder
                  })`}
                </Actionsheet.Item>
              );
            })
          ) : (
            <View style={styles.empty}>
              <Text>No cards found</Text>
            </View>
          )}
        </Box>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

const styles = StyleSheet.create({
  cardnumber: {
    borderWidth: 2,
    borderColor: '#539D8B',
    borderRadius: 4,
    marginBottom: 20,
  },
  empty: {
    width: '100%',
    height: RFValue(60),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Choosecard;
