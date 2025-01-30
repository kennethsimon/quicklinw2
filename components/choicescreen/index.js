import {ScrollView, Button, Divider} from 'native-base';
import React, {useContext} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Context as AuthContext} from '../../context/AppContext';
import {RFValue} from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import { usePostHog } from 'posthog-react-native';
import Header from '../header';
const {width} = Dimensions.get('window');


const Choicescreen = ({navigation, route}) => {
  const {state, doctors} = useContext(AuthContext);
  const params = route.params;
  const {t} = useTranslation();
  const posthog = usePostHog();
  


  const submitForm = () => {
    // navigation.navigate('Clienttype', {service: params.service, from: 'appointment'})
    // navigation.navigate('Doctors')
    posthog.capture('choose_appointment_option');
   doctors(state.organization, params.service, 'appointment');
  };
  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View style={styles.contentcontainer}>
        <Header title={"Get a Ticket"}/>
          {/* <Image
            source={require('../../assets/quick.png')}
            style={styles.logoimage}
          /> */}
          {/* <Text style={styles.headertext}>Sign in</Text> */}
          {/* <Text style={styles.headerminitext}>{t('Get a Ticket')}</Text> */}
          <View style={styles.form}>
          <Button size="lg" color={'#539D8B'} marginBottom={5} onPress={() => {posthog.capture('choose_qrcode_option');navigation.navigate('Clienttype', {service: params.service, from: 'ticket'})}}>
            {t('Scan Qr Code to get Ticket')}
          </Button>

           <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 30, marginBottom: 30}}>
           <Divider my="2" _light={{
        bg: "muted.800"
      }} _dark={{
        bg: "muted.50"
      }} width={"40%"} /><Text style={{color: '#000', fontSize: 20}}>{t('or')}</Text><Divider width={"40%"}  my="2" _light={{ bg: "muted.800"}} _dark={{bg: "muted.50"}} />
           </View>
           <Text style={styles.headerminitext}>{t('Book an Appointment')}</Text>
           <Button
              onPress={() => {
                submitForm();
              }}
              size={'lg'}
              color={'#539D8B'}
              mt={'3'}>
              {t('Book an Appointment')}
            </Button>
            {/* <Spinner
          visible={state.loading === 'doctors' ? true : false}
          textContent={'Fetching doctors...'}
          textStyle={styles.spinnerTextStyle}
        /> */}
          </View>
        </View>
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

export default Choicescreen;
