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
} from 'react-native';
import Regularinput from '../inputs/regularinput';
import {Context as AuthContext} from '../../context/AppContext';
import phone from 'phone';
import {RFValue} from 'react-native-responsive-fontsize';
import Doctorcard from './card';
import { useTranslation } from 'react-i18next';
import Header from '../header';
const {width} = Dimensions.get('window');

const Recentappointments = ({navigation, route}) => {
  const {state, savedoctor} = useContext(AuthContext);
  const params = route.params;
  const {t} = useTranslation();

  const onChooseDoctor = (doc) => {
    savedoctor(doc._id);
    
    // navigation.navigate('Clienttype', {doctor: doc._id, service: params.service, from: params.from});
  }



  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View style={styles.contentcontainer}>
        {/* <Header title={"Choose your doctor"}/> */}
          {/* <Image
            source={require('../../assets/quick.png')}
            style={styles.logoimage}
          /> */}
          {/* <Text style={styles.headertext}>Sign in</Text> */}
          {/* <Text style={styles.headerminitext}>{t('Choose your doctor')}</Text> */}
          <View style={styles.form}>
           {state.doctors?.map((doc) => {
            return (
                <Doctorcard doc={doc} onPress={() => onChooseDoctor(doc)} />
            )
           })}
          {/* <Button size="lg" color={'#539D8B'} marginBottom={5}>
            Scan Qr Code to get ticket
          </Button> */}
           
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

export default Recentappointments;
