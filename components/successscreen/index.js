import {ScrollView, Button,   Text} from 'native-base';
import React, {useContext, useState, useEffect} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  Alert,
} from 'react-native';
import {Context as AuthContext} from '../../context/AppContext';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {RFValue} from 'react-native-responsive-fontsize';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
const {width} = Dimensions.get('window');
import Share from 'react-native-share';
import { useTranslation } from 'react-i18next';
import {moment as momentTime} from "moment-timezone";
import { usePostHog } from 'posthog-react-native';

const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const getLocalTime = (timeStamp) => {
    const utcTime = momentTime.utc(timeStamp).tz(tz);
    return utcTime;
}

export const getUTCTime = (timeStamp) => {
    const localTime = momentTime.tz(timeStamp, tz);
    return localTime.utc().format();
}

export const makeUTCTime = (timeStamp) => {
    const utcMoment = momentTime.utc(timeStamp);
    return utcMoment;
}

const Successscreen = ({navigation, route}) => {
  const {state} = useContext(AuthContext);
  const [loading, setIsLoading] = useState('');
  const {t} = useTranslation();
  const posthog = usePostHog();

  const generatePDF = async () => {
    setIsLoading(true);
    try {
      const html = `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            text-align: center;
        }
        .text-wrapper {
            text-align: center;
            justify-content: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .text {
            font-size: 25px;
            text-align: center;
            margin-bottom: 10px;
        }
        .subtitle1 {
            font-size: 25px;
            font-weight: normal;
        }
        .bold {
            font-weight: bold;
        }
        .queue-text {
            font-size: 22px;
            font-weight: normal;
        }
        .date-text {
            font-size: 18px;
        }
        img {
          width: 100px;
      }
    </style>
</head>
<body>
    <div class="text-wrapper">
    <img src='https://res.cloudinary.com/dedfrilse/image/upload/v1700154718/quickline/dxiyyecgjittbj8yzrwl.png' alt="Image" class="image">
    <div class="text subtitle1">
    <span>${t('Organization')}: ${state?.organization?.name}</span>
     </div>
        <div class="text queue-text">
            <span>${t("Ticket No.")}</span>
        </div>
        <div class="text subtitle1 bold">
            <span>${state?.appointment?.number}</span>
        </div>
    <div class="text subtitle1 bold">
        <span>${state?.appointment?.language === 'kiswahili' ? state?.appointment?.service?.nameswahili : state?.appointment?.service?.name}</span>
    </div>
        <div class="text queue-text">
        <span>${t("Slot")}</span>
    </div>
    <div class="text subtitle1 bold">
        <span>${moment(state?.appointment?.start_time).format('HH:mm:ss')} - ${moment(state?.appointment?.end_time).format('HH:mm:ss')}</span>
    </div>
    <div class="text queue-text">
    <span>Date</span>
</div>
        <div class="text">
            <span>${t("Arrived")} ${moment(state?.appointment?.start_time).format('DD/MM/YYYY HH:mm:ss')}</span>
        </div>
    </div>
</body>
</html>`;
const options = {
  html,
  fileName: `ticket_${state?.appointment?.number}`,
  directory: 'Tickets',
};
const file = await RNHTMLtoPDF.convert(options);
openPDFWithExternalApp(file.filePath)
// Alert.alert('Success', `PDF saved to ${file.filePath}`);
setIsLoading(false);
    }catch{

    }
  }

  const openPDFWithExternalApp = async (filePath) => {
    try {
      const options = {
        type: 'application/pdf',
        url: `file://${filePath}`, // Use the 'file://' prefix for local files
      };
  
      const result = await Share.open(options);
      
      if (result && result.message === 'OK') {
        console.log('PDF file opened successfully');
      } else {
        console.log('Error opening PDF file');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const payment_methods = typeof state.organization.payment_methods === "string" && state.organization.payment_methods.length > 0  ? JSON.parse(state.organization.payment_methods) : []

  useEffect(() => {
    posthog.capture('booked_appoinment', {appointment: state?.appointment})
   }, [])
  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View style={styles.contentcontainer}>
          <Image
            source={require('../../assets/quick.png')}
            style={styles.logoimage}
          />
          {/* <Text style={styles.headertext}>Sign in</Text> */}
          <Text style={styles.headerminitext}>{t('You have successfully created a ticket')}</Text>
          <View style={styles.form}>
            <View style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Text fontSize={25} textAlign={"center"} variant="subtitle1">{state?.appointment?.name}</Text>
              <Text fontSize={22}  textAlign={"center"}>{t('Appointment No')}.</Text>
              <Text fontSize={25} fontWeight={"bold"} variant="subtitle1" textAlign={"center"}>{state?.appointment?.number}</Text>
              <Text fontSize={18}  textAlign={"center"}>{t('You have created your ticket on:')} {moment(state?.appointment?.createdAt).format('DD/MM/YYYY')}</Text>
              <Text fontSize={18}  textAlign={"center"}>{t('Booked for')} {moment(state?.appointment?.end_time).format('DD/MM/YYYY')}</Text>
              <Text fontSize={18}  textAlign={"center"}>{t('Time')} {moment(state?.appointment?.start_time).format('HH:mm A')} - {moment(state?.appointment?.end_time).format('HH:mm A')}</Text>
              <Text fontSize={22} fontWeight={"bold"} textAlign={"center"}>{state?.appointment?.language === 'kiswahili' ? state?.appointment?.service?.nameswahili : state?.appointment?.service?.name }</Text>
              <Text fontSize={22} fontWeight={"bold"} textAlign={"center"}>{t('Payment status:')} {!state?.appointment?.insurance && t(`${state?.appointment?.paymentstatus}`) || t(`Insurance Verification is pending`)}</Text>
              {state?.appointment?.paymentstatus !== 'paid' && !state?.appointment?.insurance  && <Text fontSize={18}  textAlign={"center"} marginTop={5} marginBottom={20}>{t('Please pay for your appointment using the following payment methods')}</Text>}

              <View styles={styles.paymentcontainer}>
              {Array.isArray(payment_methods) && state?.appointment?.paymentstatus !== 'paid' && !state?.appointment?.insurance && payment_methods.map((pay) => {
                 if (pay.hasOwnProperty('mpesa')) {
                  // Render the "mpesa" value if it exists
                 return (
                  <View style={styles.numbercontainer}>
                  <Image
                source={require('../../assets/mpesa.png')}
                style={styles.logoimage2}
              />
               <Text fontSize={18}  textAlign={"center"} marginTop={5}  marginBottom={5}>Lipa number: {pay.mpesa}</Text>
                    </View>
                 )
                 
                }else if (pay.hasOwnProperty('tigopesa')) {
                  // Render the "mpesa" value if it exists
                 return (
                  <View style={styles.numbercontainer}>
                  <Image
                source={require('../../assets/tigopesa.jpeg')}
                style={styles.logoimage2}
              />
               <Text fontSize={18}  textAlign={"center"} marginTop={5}  marginBottom={5}>Lipa number: {pay.tigopesa}</Text>
                    </View>
                 )
                 
                }else if (pay.hasOwnProperty('airtelmoney')) {
                  // Render the "mpesa" value if it exists
                 return (
                  <View style={styles.numbercontainer}>
                  <Image
                source={require('../../assets/airtelmoney.jpeg')}
                style={styles.logoimage2}
              />
               <Text fontSize={18}  textAlign={"center"} marginTop={5}  marginBottom={5}>Lipa number: {pay.airtelmoney}</Text>
                    </View>
                 )
                 
                }else if (pay.hasOwnProperty('halopesa')) {
                  // Render the "mpesa" value if it exists
                 return (
                  <View style={styles.numbercontainer}>
                  <Image
                source={require('../../assets/halopesa.png')}
                style={styles.logoimage2}
              />
               <Text fontSize={18}  textAlign={"center"} marginTop={5}  marginBottom={5}>Lipa number: {pay.halopesa}</Text>
                    </View>
                 )
                 
                }
               })}
             
             
              </View>
              
            </View>
            
            <Button
              onPress={() => {
               navigation.navigate('Organization')
              }}
              size={'lg'}
              bgColor={'#25A18E'}
              mt={'3'}>
             {t('Go back')}
            </Button>
            <Button
              onPress={() => generatePDF()}
              size={'lg'}
              bgColor={'#25A18E'}
              mt={'3'}>
              {t('Download ticket')}
            </Button>
          </View>
        </View>
      </ScrollView>
      <Spinner
      visible={loading ? true : false}
      textContent={`${t("Downloading pdf")}...`}
      textStyle={styles.spinnerTextStyle}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  logoimage2: {
    width: RFValue(70),
    height: RFValue(70),
    objectFit: 'cover',
    alignSelf: 'center'
  },
  paymentcontainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    alignSelf: 'center',
    textAlign: 'center'
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

export default Successscreen;
