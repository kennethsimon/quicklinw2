import {Actionsheet, Box, Text, Icon} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {RFValue} from 'react-native-responsive-fontsize';

const Moreoptions = ({
  isOpen,
  onClose,
  blockcard,
  unblockcard,
  setthreshold,
  carddata,
}) => {
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        <Box w="100%" px={4} pb={4} justifyContent="flex-start">
          <Text fontSize="20" color="black" fontWeight={'bold'}>
            More options
          </Text>
        </Box>
        <Box w="100%" px={4} pb={4} justifyContent="flex-start">
          <Actionsheet.Item
            startIcon={
              <Icon
                as={FeatherIcon}
                size="6"
                name={
                  carddata.status === 'Blocked'
                    ? 'check-circle'
                    : 'minus-circle'
                }
              />
            }
            style={styles.cardnumber}
            onPress={() => {
              carddata.status === 'Blocked' ? unblockcard() : blockcard();
            }}>
            {carddata.status === 'Blocked' ? 'Unblock card' : 'Block card'}
          </Actionsheet.Item>
          <Actionsheet.Item
            startIcon={<Icon as={FeatherIcon} size="6" name="bell" />}
            style={styles.cardnumber}
            onPress={() => setthreshold()}>
            Set credit alarm
          </Actionsheet.Item>
        </Box>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

const styles = StyleSheet.create({
  cardnumber: {
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

export default Moreoptions;
