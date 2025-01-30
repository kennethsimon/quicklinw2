import {ScrollView, Button} from 'native-base';
import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Context as AuthContext} from '../../context/AppContext';
import {RFValue} from 'react-native-responsive-fontsize';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import { useTranslation } from 'react-i18next';
import Header from '../header';
const {width} = Dimensions.get('window');

const Timeslots = ({navigation, route}) => {
  const {state, bookAppointment, updateAppointment} = useContext(AuthContext);
  const params = route.params;
  const [slots, setSlots] =useState([]);
  const [loading, setLoading] = useState(true)
  const {t, i18n} = useTranslation();
  const language = i18n.language === 'sw' ? 'kiswahili' : i18n.language === 'en' ? 'english' : 'kiswahili';

  useEffect(() => {
     setSlots(state.timeslots);
     setLoading(false)
  }, [])

  // const timeslots = () => {
  //   const startTime = moment('07:00 am', 'HH:mm a');
  //   const endTime = moment('10:00 pm', 'HH:mm a');
  
  //   const timeSlots = [];
  
  //   let currentTime = moment(startTime);
  
  //   let slot_id = 1; // Initialize slot_id
  
  //   while (currentTime.isBefore(endTime)) {
  //     const from = currentTime.format('HH:mm a');
  //     const to = currentTime.add(15, 'minutes').format('HH:mm a');
  
  //     timeSlots.push({ slot_id, from, to });
  //     slot_id++; // Increment slot_id for the next slot
  //   }
  
  //   return timeSlots;
  // };

 const combineDateAndTimeToISOString = (dateStr, timeStr) => {
  // Parse the date and time
  const dateMoment = moment(dateStr, 'YYYY-MM-DD');
  const timeMoment = moment(timeStr, 'h:mma');

  // Combine the date and time
  const combinedMoment = dateMoment.set({
    hour: timeMoment.hour(),
    minute: timeMoment.minute(),
  });

  // Format to ISO string
  const isoString = combinedMoment.toISOString();

  return isoString;
};
 
 const bookappointment = (time) => {
  const fromtimeiso = combineDateAndTimeToISOString(params.date, time?.from);
  const totimeiso = combineDateAndTimeToISOString(params.date, time?.to);
   if(params?.from === 'recent'){
    updateAppointment({from: fromtimeiso, to: totimeiso}, time.slot_id, params.appointment, state.user.auth_token, language);
   }else{
    if(params.clienttype === 'insurance'){
      bookAppointment(route.params.service, state.organization.officephonenumber, {from: fromtimeiso, to: totimeiso}, time.slot_id, state.user.user.telephone_number, state.user.user.full_name, state.organization._id, state?.user?.user?._id, params.clienttype, '', state.doctor, state.user.auth_token, language, route.params.insurance);
     }else{
      console.log('checknot insurance', route.params.service, state.organization.officephonenumber, {from: fromtimeiso, to: totimeiso}, time.slot_id, state.user.user.telephone_number, state.user.user.full_name, state.organization._id, state.user?.user?._id, " ", '', state.doctor, state.user.auth_token, language, '')
      bookAppointment(route.params.service, state.organization.officephonenumber, {from: fromtimeiso, to: totimeiso}, time.slot_id, state.user.user.telephone_number, state.user.user.full_name, state.organization._id, state.user?.user?._id, params.clienttype, '', state.doctor, state.user.auth_token, language, '');
     }
   }
 }
//  const filteredTimeSlots = timeslots().filter(slot => {
//   return !state.appointments.some(existingSlot => parseInt(existingSlot.slot_id) === slot.slot_id);
// });

const currentHour = new Date().getHours(); // Get the current hour
const currentDate = new Date();

// Function to extract the date part (yyyy-mm-dd) from a Date object
const getDateOnly = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View style={styles.contentcontainer}>
          <Header title={"Choose your time slot"}/>
          {/* <Image
            source={require('../../assets/quick.png')}
            style={styles.logoimage}
          /> */}
          {/* <Text style={styles.headertext}>Sign in</Text> */}
          {/* <Text style={styles.headerminitext}>{t('Choose your time slot')}</Text> */}
          <View style={styles.form}>        
          {
  slots
    ?.filter((time) => {
      const fromHour = parseInt(time?.from?.split(':')[0], 10); // Extract the hour from 'from' time
      const slotDate = new Date(params?.date); // Get the slot date as a string
      
      // Skip the filter if the slot date is different from the current date
      if (getDateOnly(new Date(slotDate)) !== getDateOnly(currentDate)) {
        console.log('yes')
        return true; // Return true to include the time slot in the result
      }

      // Filter out slots that start before the current hour
      return fromHour >= currentHour;
    })
    .map((time) => (
      <TouchableOpacity style={styles.button} marginBottom={5} onPress={() => bookappointment(time)}>
        <Text style={styles.buttontext}>{time.from} - {time.to}</Text>
      </TouchableOpacity>
    ))
    // If the conditions are not met, return all the data without filtering
    ?? slots.map((time) => (
      <TouchableOpacity style={styles.button} marginBottom={5} onPress={() => bookappointment(time)}>
      <Text style={styles.buttontext}>{time.from} - {time.to}</Text>
    </TouchableOpacity>
    ))
}
            <Spinner
      visible={(['appointment', 'appointments'].includes(state.loading) || loading) ? true : false}
      textContent={state.loading === 'appointment' ? `${t("Submitting appointment")}...` : null}
      textStyle={styles.spinnerTextStyle}
    />

          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  buttontext: {
    color: '#000',
  },
  button: {
    width: '45%',
    height: RFValue(100),
    borderWidth: 1,
    borderColor: '#bebebe',
    borderRadius: RFValue(5),
    marginBottom: RFValue(20),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
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

export default Timeslots;
