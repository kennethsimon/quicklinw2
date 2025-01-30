import {Actionsheet, Box, Text, Button, Badge} from 'native-base';
import React from 'react';
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

const AlarmThreshold = ({
  isOpen,
  onClose,
  state,
  onSubmit,
  onChangeText,
  value,
  cardnumber,
}) => {
  const bottomInset = useKeyboardBottomInset();
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
            Set credit alarm
          </Text>
          <Badge colorScheme="success" ml={3}>
            <Text>
              Current: {formatCurrency(parseInt(cardnumber?.alarm_limit))}
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
            isLoading={state.loading === 'alarm'}
            isDisabled={state.loading === 'alarm'}
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

export default AlarmThreshold;
