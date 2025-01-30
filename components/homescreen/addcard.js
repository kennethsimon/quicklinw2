import {ScrollView, Button} from 'native-base';
import React, {useContext, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Regularinput from '../inputs/regularinput';
import {Context as AppContext} from '../../context/AppContext';
const {width} = Dimensions.get('window');

const Addcard = ({navigation}) => {
  const {state, addcard} = useContext(AppContext);
  const [cardnumber, setCardnumber] = useState('');
  const [error, setError] = useState('');

  function hasTwelveDigits(value) {
    const digitRegex = /^\d{16}$/;
    return digitRegex.test(value);
  }

  const submitForm = () => {
    setError('');
    if (hasTwelveDigits(cardnumber)) {
      addcard({card_number: cardnumber});
    } else {
      setError({cardnumber: 'Enter a valid card number with 16 digits'});
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.contentcontainer}>
          <View style={styles.form}>
            <Regularinput
              value={cardnumber}
              onChangeText={val => setCardnumber(val)}
              placeholder={'Card number'}
              password={false}
              isInvalid={error.cardnumber}
              errorMessage={error?.cardnumber}
              keyboardType="number-pad"
              helperText={'Enter 16-digit card number into the field above'}
            />
            <Button
              onPress={() => {
                submitForm();
              }}
              isLoading={state.loading === 'addcard'}
              isDisabled={state.loading === 'addcard'}
              size={'lg'}
              bgColor={'#539D8B'}
              mt={'3'}>
              Save card
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  bold: {
    color: '#000',
    fontFamily: 'Helvetica-Bold',
    fontSize: 18,
    textDecorationLine: 'underline',
  },
  forgottext: {
    textAlign: 'right',
    color: '#000',
    fontFamily: 'Helvetica',
  },
  signup: {
    textAlign: 'center',
    color: '#000',
    fontFamily: 'Helvetica',
    paddingVertical: 30,
    fontSize: 18,
  },
  form: {
    paddingVertical: 20,
  },
  headertext: {
    fontSize: 32,
    color: '#000',
    fontFamily: 'Helvetica-Bold',
    // fontWeight: 600,
    paddingTop: 30,
  },
  headerminitext: {
    fontSize: 18,
    color: 'grey',
    fontWeight: 400,
    fontFamily: 'Helvetica',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  contentcontainer: {
    width: width - 40,
  },
});

export default Addcard;
