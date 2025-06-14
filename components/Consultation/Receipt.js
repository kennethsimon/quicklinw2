import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

const AppointmentReceiptScreen = ({ navigation, route }) => {
  const { appointment } = route.params;
const {t} = useTranslation();
  // Format the date and time for display
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Adjust the format as needed
  };

  const paymentMethods = [
    { name: 'Tigo', number: '0753909090', icon: require('../../assets/tigopesa.jpeg') },
    { name: 'Vodacom', number: '0753909090', icon: require('../../assets/mpesa.png') },
    { name: 'Airtel', number: '0753909090', icon: require('../../assets/airtelmoney.jpeg') },
    { name: 'Halotel', number: '0753909090', icon: require('../../assets/halopesa.png') },
  ];

  const appointmentDetails = {
    bookingDate: formatDateTime(appointment.createdAt),
    startTime: formatDateTime(appointment.start_time),
    endTime: formatDateTime(appointment.end_time),
    department: appointment.category.name,
    appointmentType: appointment.appointmentType,
    price: appointment.appointmentType === 'video' ? `TZS ${appointment.doctor.video_call_price}` : `TZS ${appointment.doctor.audio_call_price}`,
    status: appointment.paymentstatus === 'not_paid' ? 'Unpaid' : 'Paid',
    transactionID: appointment.number,
    date: formatDateTime(appointment.appointmentdate),
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{t("Receipt")}</Text>

      <View style={styles.detailsContainer}>
        {Object.entries({
          'Booking Date': appointmentDetails.bookingDate,
          'Start Time': appointmentDetails.startTime,
          'End Time': appointmentDetails.endTime,
          'Department': appointmentDetails.department,
          'Appointment Type': appointmentDetails.appointmentType,
          'Price': appointmentDetails.price,
          'Status': appointmentDetails.status,
          'Transaction ID': appointmentDetails.transactionID,
          'Date': appointmentDetails.date,
        }).map(([label, value]) => (
          <View style={styles.detailRow} key={label}>
            <Text style={styles.label}>{t(`${label}`)}</Text>
            <Text style={[styles.value, label === 'Status' ? { color: value === 'Paid' ? 'green' : 'red' } : {}]}>
              {value}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.subHeader}>{t("Payment Methods")}</Text>
      {paymentMethods.map((method) => (
        <View style={styles.paymentSection} key={method.name}>
          <Image source={method.icon} style={styles.icon} />
          <Text style={styles.paymentText}>{t(`${method.name}`)}: {method.number}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>{t("Go Back")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#000',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#000',
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailRow: {
    width: '48%',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#000',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 3,
    color: '#000',
  },
  paymentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  paymentText: {
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AppointmentReceiptScreen;
