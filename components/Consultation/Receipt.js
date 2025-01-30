import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const AppointmentReceiptScreen = ({ navigation, route }) => {
  const { appointment } = route.params;

  // Format the date and time for display
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Adjust the format as needed
  };

  const appointmentDetails = {
    bookingDate: formatDateTime(appointment.createdAt),
    startTime: formatDateTime(appointment.start_time),
    endTime: formatDateTime(appointment.end_time),
    department: appointment.category.name, // Assuming the doctor's name represents the department
    appointmentType: appointment.appointmentType,
    price: appointment.appointmentType === 'video' ? `TZS ${appointment.doctor.video_call_price}` : `TZS ${appointment.doctor.audio_call_price}`,
    status: appointment.paymentstatus === 'not_paid' ? 'Unpaid' : 'Paid',
    transactionID: appointment.number,
    date: formatDateTime(appointment.appointmentdate),
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Receipt</Text>

      <View style={styles.detailSection}>
        <Text style={styles.label}>Booking Date</Text>
        <Text style={styles.value}>{appointmentDetails.bookingDate}</Text>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.label}>Start Time</Text>
        <Text style={styles.value}>{appointmentDetails.startTime}</Text>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.label}>End Time</Text>
        <Text style={styles.value}>{appointmentDetails.endTime}</Text>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.label}>Department</Text>
        <Text style={styles.value}>{appointmentDetails.department}</Text>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.label}>Appointment Type</Text>
        <Text style={styles.value}>{appointmentDetails.appointmentType}</Text>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.label}>Price</Text>
        <Text style={styles.value}>{appointmentDetails.price}</Text>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.label}>Status</Text>
        <Text style={[styles.value, { color: appointmentDetails.status === 'Paid' ? 'green' : 'red' }]}>
          {appointmentDetails.status}
        </Text>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.label}>Transaction ID</Text>
        <Text style={styles.value}>{appointmentDetails.transactionID}</Text>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.label}>Date</Text>
        <Text style={styles.value}>{appointmentDetails.date}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Go Back</Text>
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
    marginBottom: 20,
    textAlign: 'center',
    color: '#000'
  },
  detailSection: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#000',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#000'
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