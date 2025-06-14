import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Actionsheet, useDisclose, Button, Box } from 'native-base';
import moment from 'moment';
import axios from 'axios'; // Import axios for HTTP requests
import {Context as AuthContext} from '../../context/AppContext';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const DoctorDetails = ({ navigation, route }) => {
  const { state } = useContext(AuthContext);
    const {t} = useTranslation();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('Afternoon');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { doctor, department } = route.params;
  const { isOpen, onOpen, onClose } = useDisclose();

  const errorMessages = {
    'auth.auth-token_header_is_required': 'Authentication token is required.',
    'appointment.doctor_is_required': 'Doctor information is required.',
    'appointment.end_time_is_required': 'End time is required.',
    'appointment.invalid_end_time': 'Invalid end time format.',
    'appointment.start_time_is_required': 'Start time is required.',
    'appointment.invalid_start_time': 'Invalid start time format.',
    'appointment.appointment_type_is_required': 'Appointment type is required.',
    'appointment.invalid_appointment_type': 'Invalid appointment type. Choose either "video" or "chat".',
    'appointment.category_is_required': 'Category is required.',
    'appointment.appointment_time_has_passed': 'The selected appointment time has already passed.',
    'appointment.appointment_slot_already_booked': 'The selected time slot is already booked, please choose another slot. Thank you!',
    default: 'Something went wrong. Please try again later.',
  };

  // Format currency function
  function formatCurrency(amount) {
    const number = parseFloat(amount);
    if (isNaN(number)) {
      console.error("Input must be a valid number or numeric string.");
      return null;
    }
    return number.toLocaleString('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // Categorize schedules
  const categorizeSchedules = (schedules) => {
    const categorized = {
      Morning: [],
      Afternoon: [],
      Evening: [],
    };

    schedules.forEach((schedule) => {
      const hour = moment(schedule.from).hour();
      if (hour >= 6 && hour < 12) {
        categorized.Morning.push(schedule);
      } else if (hour >= 12 && hour < 18) {
        categorized.Afternoon.push(schedule);
      } else {
        categorized.Evening.push(schedule);
      }
    });

    return categorized;
  };

  const categorizedSchedules = categorizeSchedules(doctor.schedules);

  // Handle date change
  const handleDateChange = (event, date) => {
    if (date) {
      setSelectedDate(moment(date).format('MMMM D, YYYY'));
    }
    setShowDatePicker(false);
  };

  // Handle time select
  const handleTimeSelect = (schedule) => {
    const selected = moment(schedule.from).format('h:mm A');
    setSelectedTime(selected);
  };

  // Validate and open action sheet
  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert(
        'Incomplete Selection',
        'Please select both date and time slot to book your appointment.',
        [{ text: 'OK' }]
      );
      return;
    }
    onOpen(); // Open the action sheet if validation passes
  };

  // Handle action sheet option
  const handleActionSheetOption = async (appointmentType) => {
    const startTime = moment(selectedDate + ' ' + selectedTime, 'MMMM D, YYYY h:mm A').toISOString();
    const endTime = moment(startTime).add(30, 'minutes').toISOString();
    const data = {
      doctor: doctor._id,
      start_time: startTime,
      end_time: endTime,
      category: department,
      appointmentType: appointmentType,
      client_name: state?.user?.user?.full_name,
      client_phone: state?.user?.user?.telephone_number,
      officephonenumber: '255755696140',
      language: state?.language || 'english',
    };
  
    try {
      const response = await axios.post('https://api.quickline.tech/doctor/appointments/create', data, {
        headers: {
          'auth-token': state?.user?.auth_token,
        },
      });
  
      if (response.status === 200) {
        Alert.alert(
          'Appointment Booked',
          'Your appointment has been successfully booked!',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('Receipt', { appointment: response.data.appointment });
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', response.data.message || 'Something went wrong');
      }
    } catch (error) {
      // Extract the error message from the backend
      const backendErrorMessage = error?.response?.data?.message;
  
      // Map the backend error message to a user-friendly message
      const userFriendlyMessage = errorMessages[backendErrorMessage] || errorMessages.default;
  
      // Display the error message
      Alert.alert('Error', userFriendlyMessage);
    }
    onClose();
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} horizontal={false}>
      <View style={styles.container}>
        {/* Doctor Profile */}
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: 'https://placehold.jp/3d4070/ffffff/150x150.png?text=s' }}
            style={styles.avatar}
          />
          <View style={styles.details}>
            <Text numberOfLines={1} style={styles.name}>
              Dr {doctor.full_name}
            </Text>
            <Text style={styles.rating}>
              {doctor.rating} ⭐ ({doctor.reviews} {t("reviews")})
            </Text>
            <View style={styles.tagsContainer}>
              {doctor?.categories?.map((tag, index) => (
                <Text key={index} style={styles.tag}>
                  {state.language === 'english' ? tag?.name : tag?.nameswahili}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* Doctor Biography */}
        <Text style={styles.sectionTitle}>{t("Doctor Biography")}</Text>
        <Text style={styles.biography}>{doctor.description}</Text>

        {/* Select Date */}
        <Text style={styles.sectionTitle}>{t("Select Date")}</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {selectedDate ? selectedDate : state.language === 'english' ? 'Select Date' : "Chagua Tarehe"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="calendar"
            onChange={handleDateChange}
          />
        )}

        {/* Time Period Selector */}
        <Text style={styles.sectionTitle}>{t("Choose Times")}</Text>
        <View style={styles.timePeriods}>
          {Object.keys(categorizedSchedules).map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.selectedPeriodButton,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={styles.periodText}>{t(`${period}`)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Time Slot Selector */}
        <View style={styles.timeSlots}>
          {categorizedSchedules[selectedPeriod].map((schedule) => (
            <TouchableOpacity
              key={schedule._id}
              style={[
                styles.timeSlot,
                selectedTime === moment(schedule.from).format('h:mm A') &&
                  styles.selectedTimeSlot,
              ]}
              onPress={() => handleTimeSelect(schedule)}
            >
              <Text style={styles.timeText}>
                {moment(schedule.from).format('h:mm A')} -{' '}
                {moment(schedule.to).format('h:mm A')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Book Appointment Button */}
        <TouchableOpacity style={styles.bookButton} onPress={handleBookAppointment}>
          <Text style={styles.bookButtonText}>{t("Book Appointment")}</Text>
        </TouchableOpacity>

        {/* Native Base Action Sheet */}
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content>
            <Box w="100%" px={4} justifyContent="center">
              <Text style={styles.actionSheetTitle}>{t("Choose Appointment Type")}</Text>
            </Box>
            <Actionsheet.Item onPress={() => handleActionSheetOption('video')}>
              Video - TZS {formatCurrency(doctor?.video_call_price.toFixed(2))}
            </Actionsheet.Item>
            <Actionsheet.Item onPress={() => handleActionSheetOption('chat')}>
              Chat - TZS {formatCurrency(doctor?.audio_call_price.toFixed(2))}
            </Actionsheet.Item>
            <Actionsheet.Item onPress={() => {navigation.navigate('MapScreen')}}>
             {t("Nearby Hospital")}
            </Actionsheet.Item>
            <Actionsheet.Item onPress={onClose} _text={{ color: 'red.500' }}>
              {t("Cancel")}
            </Actionsheet.Item>
          </Actionsheet.Content>
        </Actionsheet>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  details: {
    marginLeft: 15,
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  rating: {
    fontSize: 12,
    color: '#888',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  tag: {
    backgroundColor: '#E3F2FD',
    color: '#1976D2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  biography: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  dateButton: {
    backgroundColor: '#1976D2',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  timePeriods: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  periodButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
  },
  selectedPeriodButton: {
    backgroundColor: '#1976D2',
  },
  periodText: {
    color: '#333',
    fontWeight: 'bold',
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  timeSlot: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 10,
    width: '40%',
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  timeText: {
    color: '#333',
  },
  bookButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  actionSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default DoctorDetails;
