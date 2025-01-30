import React, {useContext, useState} from 'react';
import {ScrollView, Button} from 'native-base';
import {
  Dimensions,
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import {Context as AuthContext} from '../../context/AppContext';
import {RFValue} from 'react-native-responsive-fontsize';
const {width} = Dimensions.get('window');
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import Header from '../header';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from '@react-navigation/native';
import { usePostHog } from 'posthog-react-native';

const Calenderscreen = ({route}) => {
  const {state, appointments} = useContext(AuthContext);
  const [selected, setSelected] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const params = route.params;
  const navigation = useNavigation();
  const {t} = useTranslation();
  const posthog = usePostHog();



  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelected(date);
    hideDatePicker();
  };

console.log(params)

  const onChooseDoctor = () => {
    // navigation.navigate('timeslots', {date: selected, service: params.service});
   if(route?.params?.from === 'recent' && selected){
    posthog.capture('select_appointment_date', {date: selected});
    appointments(selected, params.service, params.organization,  params.clienttype,  params.doctor,  'recent',  route.params.appointment,  '', navigation)
   }else if(selected){
    posthog.capture('select_appointment_date', {date: selected});
    appointments(selected, params.service, state.organization._id,  params.clienttype,  params.doctor,  'other',  '',  route.params.insurance, navigation)
   }else{
    Alert.alert('Error', `${t('Please choose a valid date')}`, [
      {text: 'OK'},
    ]);
   }
  }

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <View style={styles.contentcontainer}>
          <Header title={"Choose your date of appointment"}/>
          <View style={styles.form}>
          <Button size="lg" color={'#539D8B'} marginBottom={5} onPress={showDatePicker} >
            {t('Click to choose date')}{selected ? `- ${moment(selected).format('DD/MM/YYYY')}` : null}
          </Button>
          <Button size="lg" color={'#539D8B'} marginBottom={5} onPress={() => onChooseDoctor()} >
            {t('Get time slots for this date')}
          </Button>
           
          </View>
        </View>
        <Spinner
          visible={state.loading === 'lazyloading' ? true : false}
          textContent={`${t("Getting active slots")}...`}
          textStyle={styles.spinnerTextStyle}
        />
      </ScrollView>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        minimumDate={new Date()}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
 
  form: {
    paddingVertical: RFValue(20),
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

export default Calenderscreen;
