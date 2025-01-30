import {ScrollView, Button} from 'native-base';
import React, {useContext, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Keyboard,
} from 'react-native';
import Regularinput from '../inputs/regularinput';
import {Context as AuthContext} from '../../context/AppContext';
import Materialicons from 'react-native-vector-icons/Feather';
import phone from 'phone';
import {RFValue} from 'react-native-responsive-fontsize';
import Spinner from 'react-native-loading-spinner-overlay';
import {useTranslation} from 'react-i18next';
const {width} = Dimensions.get('window');

const Verificationscreen = ({navigation}) => {
  const {state, verifyphone} = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [phonenumber, setPhonenumber] = useState(false);
  const {t} = useTranslation();

  const submit = () => {
    setError('')
    const phoneno = phone(phonenumber, 'TZ');
    if(phoneno[0]){
      const phoneNumberWithoutPlus = phoneno[0].substring(4)
      console.log(phoneNumberWithoutPlus)
     verifyphone({country_code: '255', mobile_number: phoneNumberWithoutPlus});
    }else if(!phoneno[0]){
      setError({name: 'phonenumber', value: 'Enter a valid phone number'})
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View style={styles.contentcontainer}>
          <Image
            source={require('../../assets/quick.png')}
            style={styles.logoimage}
          />
          {/* <Text style={styles.headertext}>Sign in</Text> */}
          <Text style={styles.headerminitext}>{t('Enter mobile phone to verify')}</Text>
          <View style={styles.form}>
             <Regularinput
              value={phonenumber}
              onChangeText={val => setPhonenumber(val)}
              placeholder={'Phone number'}
              password={false}
              isInvalid={error?.name === 'phonenumber'}
              errorMessage={error?.name === 'phonenumber' && error?.value}
              keyboardType="phone-pad"
              // helperText={'Starts with 255xxx'}
            />
            <Button
              onPress={() => {
                submit();
              }}
              isLoading={state.loading === 'login'}
              disabled={state.loading === 'login'}
              size={'lg'}
              bgColor={'#25A18E'}
              mt={'3'}>
              {t('Continue')}
            </Button>
            {/* <Pressable
              onPress={() => {
                navigation.navigate('Phoneauthscreen');
              }}
              style={styles.bottom}> */}
              {/* <Text style={styles.signup}>Don't have an account?</Text>
              <Text style={styles.bold}>Sign up</Text> */}
            {/* </Pressable> */}
          </View>
        </View>
        <Spinner
          visible={state.loading === 'verifyphone' ? true : false}
          textContent={''}
          textStyle={styles.spinnerTextStyle}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: RFValue(10),
  },
  bottom: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoimage: {
    width: RFValue(220),
    height: RFValue(100),
    objectFit: 'contain',
    alignSelf: 'center'
  },
  bold: {
    color: '#000',
    fontFamily: 'Helvetica-Bold',
    fontSize: RFValue(18),
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
    paddingVertical: RFValue(30),
    fontSize: RFValue(18),
  },
  form: {
    paddingVertical: RFValue(20),
  },
  headertext: {
    fontSize: RFValue(32),
    color: '#000',
    fontFamily: 'Helvetica-Bold',
    // fontWeight: 600,
    paddingTop: RFValue(20),
  },
  headerminitext: {
    fontSize: RFValue(18),
    color: 'grey',
    fontWeight: 400,
    fontFamily: 'Helvetica',
    alignSelf: 'center'
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

export default Verificationscreen;
