import {Actionsheet, Box, Text, Button, Badge} from 'native-base';
import React, {useState, useEffect} from 'react';
import {Keyboard, Platform} from 'react-native';
import Regularinput from '../inputs/regularinput';
import phone from 'phone';

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

const Topupcomponent = ({isOpen, onClose, state, onSubmit, chosencard}) => {
  const bottomInset = useKeyboardBottomInset();
  const [amount, setAmount] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [error, setError] = useState('');
  const [cardnumber, setCardnumber] = useState('');

  const submitForm = () => {
    setError('');
    const phoneno = phone(phonenumber, 'TZ');
    if (phoneno[0] && amount) {
      const trimmedstring = phoneno[0].substring(1);
      const completephone = trimmedstring;
      onSubmit({phone_number: completephone, amount});
    } else if (!amount) {
      setError({amount: 'Please enter a valid amount'});
    } else if (!phoneno[0]) {
      setError({phonenumber: 'Please enter a valid phone number'});
    }
  };

  useEffect(() => {
    if (chosencard) {
      setCardnumber(chosencard);
    }
  }, [chosencard]);

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
    <Actionsheet isOpen={isOpen} onClose={onClose} bottom={bottomInset}>
      <Actionsheet.Content>
        <Box
          w="100%"
          px={4}
          pb={4}
          justifyContent="flex-start"
          flexDirection={'row'}>
          <Text fontSize="20" color="black" fontWeight={'bold'}>
            Top up card
          </Text>
          <Badge colorScheme="success" ml={3}>
            <Text>{addSpacesToNumber(cardnumber?.card_number)}</Text>
          </Badge>
        </Box>
        <Box w="100%" px={4} pb={4} justifyContent="flex-start">
          <Regularinput
            placeholder={'Amount'}
            value={amount}
            onChangeText={val => setAmount(val)}
            keyboardType="number-pad"
            isInvalid={error?.amount}
            errorMessage={error?.amount}
          />
          <Regularinput
            placeholder={'Phone number'}
            value={phonenumber}
            onChangeText={val => setPhonenumber(val)}
            keyboardType="number-pad"
            isInvalid={error?.phonenumber}
            errorMessage={error?.phonenumber}
          />
          <Button
            onPress={() => submitForm()}
            isLoading={state.loading === 'topup'}
            isDisabled={state.loading === 'topup'}
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

export default Topupcomponent;
