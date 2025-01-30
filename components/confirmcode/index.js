import {ScrollView, Button} from 'native-base';
import React, {useContext, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import Regularinput from '../inputs/regularinput';
import {Context as AuthContext} from '../../context/AppContext';
import {RFValue} from 'react-native-responsive-fontsize';
import Spinner from 'react-native-loading-spinner-overlay';
const {width} = Dimensions.get('window');
import {useTranslation} from 'react-i18next';

const Confirmcode = ({route}) => {
  const {state, verifyotp} = useContext(AuthContext);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const {t} = useTranslation();

  const submit = () => {
    setError('')
    if(code){
     verifyotp({verification_code: code, telephone_number: route.params.phonenumber});
    }else if(!code){
      setError({name: 'code', value: 'Enter a valid verification code'})
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
          <Text style={styles.headerminitext}>{t('Enter verification code to verify')}</Text>
          <View style={styles.form}>
             <Regularinput
              value={code}
              onChangeText={val => setCode(val)}
              placeholder={'Verification code'}
              password={false}
              isInvalid={error?.name === 'code'}
              errorMessage={error?.name === 'code' && error?.value}
              keyboardType="phone-pad"
              // helperText={'Starts with 255xxx'}
            />
            <Button
              onPress={() => {
                submit();
              }}
              isLoading={state.loading === 'verifyotp'}
              disabled={state.loading === 'verifyotp'}
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
          visible={state.loading === 'verifyotp' ? true : false}
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

export default Confirmcode;
