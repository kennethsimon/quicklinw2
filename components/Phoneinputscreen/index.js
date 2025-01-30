import {ScrollView, Button} from 'native-base';
import React, {useContext, useState} from 'react';
import {Dimensions, Keyboard, StyleSheet, Text, View} from 'react-native';
import Regularinput from '../inputs/regularinput';
import {Context as AuthContext} from '../../context/AppContext';
import phone from 'phone';
import {RFValue} from 'react-native-responsive-fontsize';
const {width} = Dimensions.get('window');

const Phoneauthscreen = ({navigation}) => {
  const {state, verifyphone} = useContext(AuthContext);
  const [error, setError] = useState('');
  const [phoneno, setPhoneno] = useState('');

  const onSubmit = () => {
    Keyboard.dismiss();
    setError('');
    const phonenumber = phone(phoneno, 'TZ');
    if (phonenumber[0]) {
      const trimmedstring = phonenumber[0].substring(1);
      const completephone = trimmedstring;
      verifyphone({phone_number: completephone, from: 'mobile'});
    } else {
      setError('Please enter a valid phone number');
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View style={styles.contentcontainer}>
          <Text style={styles.headertext}>Create an account</Text>
          <Text style={styles.headerminitext}>
            Enter your phone number to receive a verification code
          </Text>
          <View style={styles.form}>
            <Regularinput
              value={phoneno}
              onChangeText={val => setPhoneno(val)}
              placeholder={'Phone number'}
              password={false}
              isInvalid={error}
              errorMessage={error}
              keyboardType="phone-pad"
              helperText={'Starts with 255xxx'}
            />
            <Button
              onPress={() => {
                onSubmit();
              }}
              isLoading={state.loading === 'verifyphone'}
              disabled={state.loading === 'verifyphone'}
              size={'lg'}
              bgColor={'#539D8B'}
              mt={'3'}>
              Send code
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
    fontWeight: 600,
    fontSize: RFValue(18),
    textDecorationLine: 'underline',
  },
  forgottext: {
    textAlign: 'right',
    color: '#000',
    fontWeight: 600,
  },
  signup: {
    textAlign: 'center',
    color: '#000',
    fontWeight: 400,
    paddingVertical: RFValue(30),
    fontSize: RFValue(18),
  },
  form: {
    paddingVertical: RFValue(20),
  },
  headertext: {
    fontSize: RFValue(28),
    color: '#000',
    fontWeight: 600,
    paddingTop: RFValue(30),
  },
  headerminitext: {
    fontSize: RFValue(18),
    color: 'grey',
    fontWeight: 400,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  contentcontainer: {
    width: width - RFValue(40),
  },
});

export default Phoneauthscreen;
