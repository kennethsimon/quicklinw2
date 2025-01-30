import {ScrollView, Button} from 'native-base';
import React, {useContext, useState} from 'react';
import {Dimensions, Keyboard, StyleSheet, Text, View} from 'react-native';
import Regularinput from '../inputs/regularinput';
import {Context as AuthContext} from '../../context/AppContext';
import {RFValue} from 'react-native-responsive-fontsize';
const {width} = Dimensions.get('window');

const Changepassword = ({navigation}) => {
  const {state, changepasswordrequest} = useContext(AuthContext);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  function isValidEmail(email) {
    // Regular expression pattern to match valid email addresses
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Test the email against the pattern and return true if it matches, false otherwise
    return emailPattern.test(email);
  }

  const onSubmit = () => {
    Keyboard.dismiss();
    setError('');
    if (isValidEmail(email)) {
      changepasswordrequest({email_address: email, from: 'email'});
    } else {
      setError('Please enter a valid email');
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View style={styles.contentcontainer}>
          <Text style={styles.headertext}>Reset password</Text>
          <Text style={styles.headerminitext}>
            Enter your valid email address
          </Text>
          <View style={styles.form}>
            <Regularinput
              value={email}
              onChangeText={val => setEmail(val)}
              placeholder={'Email address'}
              isInvalid={error}
              errorMessage={error}
              keyboardType="default"
              helperText={'Email address'}
            />
            <Button
              onPress={() => {
                onSubmit();
              }}
              isLoading={state.loading === 'changepasswordrequest'}
              disabled={state.loading === 'changepasswordrequest'}
              size={'lg'}
              bgColor={'#539D8B'}
              mt={'3'}>
              Submit
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

export default Changepassword;
