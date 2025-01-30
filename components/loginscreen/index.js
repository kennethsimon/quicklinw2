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
import phone from 'phone';
import {RFValue} from 'react-native-responsive-fontsize';
import Spinner from 'react-native-loading-spinner-overlay';
import {useTranslation} from 'react-i18next';
import Languageselect from './languageselect';
import { usePostHog } from 'posthog-react-native'
import Header from '../header';
const {width} = Dimensions.get('window');

const Loginscreen = ({navigation}) => {
  const {state, login} = useContext(AuthContext);
  const [phonenumber, setPhonenumber] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const {t} = useTranslation();
  const posthog = usePostHog()

  const submit = () => {
    setError('')
    const phoneno = phone(phonenumber, 'TZ');
    if(phoneno[0] && password){
      const phoneNumberWithoutPlus = phoneno[0].substring(4)
     login({country_code: '255', mobile_number: phoneNumberWithoutPlus ,password }, posthog);
    }else if(!phoneno[0]){
      setError({name: 'phonenumber', value: 'Enter a valid phone number'})
    }else if(!password){
      setError({name: 'password', value: 'Enter a valid password'})
    }
  }


  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View style={styles.contentcontainer}>
          <Header title={"Enter Client details to Log in"}/>
          <View style={styles.form}>
            <Regularinput
              value={phonenumber}
              onChangeText={val => setPhonenumber(val)}
              placeholder={'Phone number'}
              password={false}
              isInvalid={error?.name === 'phonenumber'}
              errorMessage={error?.name === 'phonenumber' && error?.value}
              keyboardType="number-pad"
              helperText={''}
            />
             <Regularinput
              value={password}
              onChangeText={val => setPassword(val)}
              placeholder={'Password'}
              password={true}
              isInvalid={error?.name === 'password'}
              errorMessage={error?.name === 'password' && error?.value}
              keyboardType="default"
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
              {t("Continue")}
            </Button>
            <Pressable
              onPress={() => {
                navigation.navigate('Verificationscreen');
              }}
              style={styles.bottom}>
             <Text style={styles.signup}>{t("Don't have an account?")}</Text>
              <Text style={styles.bold}>{t("Sign up")}</Text> 
             </Pressable>
             <View style={styles.languagecontainer}>
              <Languageselect/>
             </View>
          </View>
        </View>
        <Spinner
          visible={state.loading === 'organizations' ? true : false}
          textContent={`${t("Fetching organizations")}...`}
          textStyle={styles.spinnerTextStyle}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  languagecontainer: {
    width: '50%',
    alignSelf: 'center',
  },
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
    width: RFValue(70),
    height: RFValue(100),
    objectFit: 'contain',
    alignSelf: 'center'
  },
  bold: {
    color: 'grey',
    fontFamily: 'Helvetica',
    fontSize: RFValue(16),
    textDecorationLine: 'underline',
  },
  forgottext: {
    textAlign: 'right',
    color: '#000',
    fontFamily: 'Helvetica',
  },
  signup: {
    textAlign: 'center',
    color: 'grey',
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
    alignSelf: 'center',
    maxWidth: width - RFValue(120),
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

export default Loginscreen;
