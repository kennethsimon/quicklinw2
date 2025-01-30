import {ScrollView, Button, HStack, Checkbox} from 'native-base';
import React, {useContext, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Keyboard,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Regularinput from '../inputs/regularinput';
import {Context as AuthContext} from '../../context/AppContext';
import Materialicons from 'react-native-vector-icons/Feather';
import phone from 'phone';
import {RFValue} from 'react-native-responsive-fontsize';
import Spinner from 'react-native-loading-spinner-overlay';
import Datepicker from '../inputs/datepicker';
import {useTranslation} from 'react-i18next';
const {width} = Dimensions.get('window');

const Registerscreen = ({navigation, route}) => {
  const {state, signup} = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [lastname, setLastname] = useState('');
  const [privacy, setPrivacy] = useState(false);
  const {t} = useTranslation();

  const handlePress = async () => {
    const url = 'https://www.quickline.tech/privacy-policy.html'; // Replace with the actual URL of your privacy policy
    const supported = await Linking.openURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Don't know how to open URI: " + url);
    }
  };

  const submit = () => {
    setError('')
    if(username && address && age && privacy){
     signup({user_id: route?.params?.user_id, user_type: 'client', full_name: `${username} ${lastname}`, password, birthdate: age, local_address: address} );
    }else if(!username){
      setError({name: 'username', value: 'Enter a valid username'})
    }else if(!lastname){
      setError({name: 'lastname', value: 'Enter a valid lastname'})
    }else if(!address){
      setError({name: 'address', value: 'Enter a valid address'})
    }else if(!age){
      setError({name: 'age', value: 'Enter a valid age'})
    }else if(!password){
        setError({name: 'password', value: 'Enter a valid password'})
      }else if(!privacy){
        Alert.alert(
          'Privacy Policy Agreement Required',
          'To continue with registration, please accept the privacy policy.',
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') } // Button configuration
          ],
          { cancelable: false } // Optional configuration for cancelable behavior
        );
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
          <Text style={styles.headerminitext}>{t('Enter client details to continue')}</Text>
          <View style={styles.form}>
            <Regularinput
              value={username}
              onChangeText={val => setUsername(val)}
              placeholder={'Name'}
              password={false}
              isInvalid={error?.name === 'username'}
              errorMessage={error?.name === 'username' && error?.value}
              keyboardType="default"
              helperText={''}
            />
             <Regularinput
              value={lastname}
              onChangeText={val => setLastname(val)}
              placeholder={'Last name'}
              password={false}
              isInvalid={error?.name === 'lastname'}
              errorMessage={error?.name === 'lastname' && error?.value}
              keyboardType="default"
              helperText={''}
            />
             <Regularinput
              value={address}
              onChangeText={val => setAddress(val)}
              placeholder={'address'}
              password={false}
              isInvalid={error?.name === 'address'}
              errorMessage={error?.name === 'address' && error?.value}
              keyboardType="default"
              helperText={''}
            />
              <Datepicker
              value={age}
              onChangeText={val => setAge(val)}
              placeholder={'age'}
              password={false}
              isInvalid={error?.name === 'age'}
              errorMessage={error?.name === 'age' && error?.value}
              keyboardType="number-pad"
              helperText={''}
            />
             <Regularinput
              value={password}
              onChangeText={val => setPassword(val)}
              placeholder={'password'}
              password={false}
              isInvalid={error?.name === 'password'}
              errorMessage={error?.name === 'password' && error?.value}
              keyboardType="default"
              helperText={''}
            />
            <View style={{width: width - RFValue(20), display: 'flex', flexDirection: 'row'}}>
            <Checkbox value={privacy} onChange={setPrivacy} my={2}>
            <TouchableOpacity onPress={handlePress}>
      <Text>I have read and agree to the privacy policy of {'\n'} quickline.tech</Text>
    </TouchableOpacity>
      </Checkbox>
            </View>
            <Button
              onPress={() => {
                submit();
              }}
              isLoading={state.loading === 'register'}
              disabled={state.loading === 'register'}
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
          visible={state.loading === 'organizations' ? true : false}
          textContent={`${t("Fetching organizations")}...`}
          textStyle={styles.spinnerTextStyle}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  customCheckbox: {
    color: 'red', // Change this to your desired color
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

export default Registerscreen;
