import {Actionsheet, Box, Text, Button, Badge} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Keyboard, Platform} from 'react-native';
import Regularinput from '../inputs/regularinput';

const useKeyboardBottomInset = () => {
  const [bottom, setBottom] = React.useState(0);
  const subscriptions = React.useRef([]);

  React.useEffect(() => {
    subscriptions.current = [
      Keyboard.addListener('keyboardDidHide', e => setBottom(0)),
      Keyboard.addListener('keyboardDidShow', e => {
        if (Platform.OS === 'android') {
          setBottom(e.endCoordinates.height);
        } else {
          setBottom(
            Math.max(e.startCoordinates.height, e.endCoordinates.height),
          );
        }
      }),
    ];

    return () => {
      subscriptions.current.forEach(subscription => {
        subscription.remove();
      });
    };
  }, [setBottom, subscriptions]);

  return bottom;
};

const SpendingLimit = ({
  isOpen,
  onClose,
  state,
  onSubmit,
  onChangeText,
  value,
  chosencard,
}) => {
  const bottomInset = useKeyboardBottomInset();
  const [cardnumber, setCardnumber] = useState('');

  function addSpacesToNumber(number) {
    // Convert the number to a string
    const numberString = String(number);

    // Split the number string into groups of 4 digits
    const groups = numberString.match(/.{1,4}/g);

    // Join the groups with a space in between
    const result = groups.join('  ');

    return result;
  }

  useEffect(() => {
    if (chosencard) {
      setCardnumber(chosencard);
    }
  }, [chosencard]);

  function formatCurrency(number) {
    // Format the number to currency format
    const formattedNumber = number.toLocaleString('en-US', {
      style: 'currency',
      currency: 'TZS',
    });

    return formattedNumber;
  }

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} bottom={bottomInset}>
      <Actionsheet.Content>
        <Box
          w="100%"
          px={4}
          pb={4}
          justifyContent="flex-start"
          flexDirection={'row'}>
          <Text fontSize="20" color="black" fontWeight={'bold'}>
            Limit spending
          </Text>
          <Badge colorScheme="success" ml={3}>
            <Text>
              Current: {formatCurrency(parseInt(cardnumber?.spend_limit))}
            </Text>
          </Badge>
        </Box>
        <Box w="100%" px={4} pb={4} justifyContent="flex-start">
          <Regularinput
            placeholder={'Amount'}
            value={value}
            onChangeText={onChangeText}
            keyboardType="number-pad"
          />
          <Button
            onPress={onSubmit}
            isLoading={state.loading === 'spendinglimit'}
            isDisabled={state.loading === 'spendinglimit'}
            size={'lg'}
            full
            bgColor={'#539D8B'}
            mt={'3'}>
            Submit
          </Button>
        </Box>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default SpendingLimit;
