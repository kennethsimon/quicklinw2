import {ScrollView, Button} from 'native-base';
import React, {useState} from 'react';
import {Dimensions, Keyboard, StyleSheet, Text, View} from 'react-native';
import Regularinput from '../inputs/regularinput';
import Datepicker from '../inputs/datepicker';
import moment from 'moment';
import {RFValue} from 'react-native-responsive-fontsize';
const {width} = Dimensions.get('window');

const Basicdetailsscreen = ({navigation, route}) => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [dateofbirth, setDateofbirth] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const params = route.params;
  const onSubmit = () => {
    Keyboard.dismiss();
    setError('');
    if (!firstname) {
      setError({firstname: 'Please enter the required field'});
    } else if (!lastname) {
      setError({lastname: 'Please enter the required field'});
    } else if (!dateofbirth) {
      setError({dateofbirth: 'Please enter the required field'});
    } else if (!email) {
      setError({email: 'Please enter the required field'});
    } else {
      navigation.navigate('Passwordscreen', {
        first_name: firstname,
        last_name: lastname,
        dob: moment(dateofbirth).format('YYYY-MM-DD'),
        email_address: email,
        phone_number: params?.data?.phone_number,
        role: 'Customer',
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View style={styles.contentcontainer}>
          <Text style={styles.headertext}>Personal Information</Text>
          <Text style={styles.headerminitext}>
            Enter your basic details to complete registration
          </Text>
          <View style={styles.form}>
            <Regularinput
              value={firstname}
              onChangeText={val => {
                setFirstname(val);
              }}
              placeholder={'First name'}
              password={false}
              isInvalid={error?.firstname}
              errorMessage={error?.firstname}
            />
            <Regularinput
              value={lastname}
              onChangeText={val => {
                setLastname(val);
              }}
              placeholder={'Last name'}
              isInvalid={error?.lastname}
              errorMessage={error?.lastname}
              password={false}
            />
            <Datepicker
              value={dateofbirth}
              onChangeText={val => {
                setDateofbirth(val);
              }}
              placeholder={'Date of birth'}
              isInvalid={error?.dateofbirth}
              errorMessage={error?.dateofbirth}
              password={false}
            />
            <Regularinput
              value={email}
              onChangeText={val => {
                setEmail(val);
              }}
              placeholder={'Email address'}
              isInvalid={error?.email}
              errorMessage={error?.email}
              password={false}
            />
            <Button
              onPress={() => {
                onSubmit();
              }}
              size={'lg'}
              bgColor={'#539D8B'}
              mt={'3'}>
              Continue
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
    fontSize: RFValue(32),
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

export default Basicdetailsscreen;
