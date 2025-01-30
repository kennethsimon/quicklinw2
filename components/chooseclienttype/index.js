import {ScrollView, Button, Divider} from 'native-base';
import React, {useContext, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import Regularinput from '../inputs/regularinput';
import {Context as AuthContext} from '../../context/AppContext';
import phone from 'phone';
import {RFValue} from 'react-native-responsive-fontsize';
import Spinner from 'react-native-loading-spinner-overlay';
import { useTranslation } from 'react-i18next';
import { usePostHog } from 'posthog-react-native';
const {width} = Dimensions.get('window');

const Clienttype = ({navigation, route}) => {
  const {state, insurance} = useContext(AuthContext);
  const params = route.params;
  const {t} = useTranslation();
  const posthog = usePostHog();


  const submitForm = (type) => {
  if(params.from === 'ticket'){
    if(type === 'insurance'){
      posthog.capture('choose_insurance_option_from_ticket_choice');
      insurance({service: params.service, orgainzation: state.organization, from: params.from})
       }else {
        posthog.capture('choose_non_insurance_option_from_ticket_choice');
        navigation.navigate('qrcode', {service: params.service, orgainzation: state.organization, clienttype: 'cash'})
       }
  }else{
    if(type === 'insurance'){
      posthog.capture('choose_insurance_option_from_appointment_choice');
      insurance({doctor: route.params.doc, service: params.service, orgainzation: state.organization, from: params.from, doctor: params.doctor})
       }else {
        posthog.capture('choose_non_insurance_option_from_appointment_choice');
        navigation.navigate('HomeStack', { screen: 'Appointment', params: {doctor: route.params.doc, service: params.service, orgainzation: state.organization, clienttype: 'cash', doctor: params.doctor} });
        // navigation.navigate('Appointment', {doctor: route.params.doc, service: params.service, orgainzation: state.organization, clienttype: 'cash', doctor: params.doctor})
       }
  }
  //  doctors(state.organization, params.service);
  };
  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View style={styles.contentcontainer}>
          <Image
            source={require('../../assets/quick.png')}
            style={styles.logoimage}
          />
          {/* <Text style={styles.headertext}>Sign in</Text> */}
          <View style={styles.form}>
          <Button size="lg" color={'#539D8B'} marginBottom={5} onPress={() =>  submitForm('noninsurance')}>
            {t('Non insurance client')}
          </Button>

           <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 30, marginBottom: 30}}>
           <Divider my="2" _light={{
        bg: "muted.800"
      }} _dark={{
        bg: "muted.50"
      }} width={"40%"} /><Text style={{color: '#000', fontSize: 20}}>{t('or')}</Text><Divider width={"40%"}  my="2" _light={{ bg: "muted.800"}} _dark={{bg: "muted.50"}} />
           </View>
           <Button
              onPress={() => {
                submitForm('insurance')
              }}
              size={'lg'}
              color={'#539D8B'}
              mt={'3'}>
             {t('Insurance client')}
            </Button>
            <Spinner
          visible={state.loading === 'insurance' ? true : false}
          textContent={`${t("Fetching insurance")}...`}
          textStyle={styles.spinnerTextStyle}
        />
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

export default Clienttype;
