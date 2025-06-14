import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Box from '../box';
import { useNavigation } from '@react-navigation/native';
import { Context as AuthContext } from '../../context/AppContext';
import Helpdialog from '../Orgnanization/Helpdialog';
import { Actionsheet, useDisclose, Center, Text, Box as NBBox } from 'native-base';
import i18n from '../../utils/i18n';
import { useTranslation } from 'react-i18next';

const HomeComponent = () => {
  const navigation = useNavigation();
  const { logout, savefrom, language } = useContext(AuthContext);
  const [isOpen, setIsOpen] = React.useState(false);
  const { isOpen: isActionSheetOpen, onOpen: onActionSheetOpen, onClose: onActionSheetClose } = useDisclose();
  const { t } = useTranslation();

  // Function to handle language change
  const handleLanguageChange = (selectedLanguage) => {
    if (selectedLanguage === 'english') {
      i18n.changeLanguage('en');
    } else if (selectedLanguage === 'kiswahili') {
      i18n.changeLanguage('sw');
    }
    language(selectedLanguage); // Update the language in the context
    onActionSheetClose(); // Close the ActionSheet
  };

  return (
    <View style={styles.container}>
     <ScrollView showsVerticalScrollIndicator={false}>
     <View style={styles.row}>
        <Box
          onPress={() => {
            savefrom('checkin');
            navigation.navigate('Organization', { from: 'checkin' });
          }}
          iconName="account-multiple-check"
          text="Check-In"
        />
        <Box
          onPress={() => {
            savefrom('appointment');
            navigation.navigate('Organization', { from: 'appointment' });
          }}
          iconName="calendar"
          text="Book Appointment"
        />
      </View>
      <View style={styles.row}>
        <Box
          onPress={() => navigation.navigate('AppointmentStack', { screen: 'Recentappointments' })}
          iconName="history"
          text="Recent Appointments"
        />
        <Box
          onPress={() => navigation.navigate('VisitsStack', { screen: 'Visits' })}
          iconName="human-queue"
          text="Visits"
        />
      </View>
      <View style={styles.row}>
        <Box onPress={() => navigation.navigate('ConsultationStack', { screen: 'Cats' })} iconName="video" text="Virtual Consultation" />
        <Box onPress={() => setIsOpen(!isOpen)} iconName="help-circle-outline" text="Support" />
      </View>
      <View style={styles.row}>
  <Box onPress={() => navigation.navigate('Ambulance')} iconName="ambulance" text="Ambulance" />
  <Box onPress={onActionSheetOpen} iconName="translate" text="Language" />
</View>
      <View style={styles.row}>
        {/* <Box onPress={onActionSheetOpen} iconName="translate" text="Language" /> */}
        <Box onPress={() => {logout()}} iconName="power" text="Log Out" />
      </View>
     </ScrollView>

      <Helpdialog isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* ActionSheet for Language Selection */}
      <Actionsheet isOpen={isActionSheetOpen} onClose={onActionSheetClose}>
        <Actionsheet.Content>
          <NBBox w="100%" h={60} px={4} justifyContent="center">
            <Text fontSize="16" color="gray.500" _dark={{ color: 'gray.300' }}>
              {t('Choose Language')}
            </Text>
          </NBBox>
          <Actionsheet.Item onPress={() => handleLanguageChange('english')}>
            {t('English')}
          </Actionsheet.Item>
          <Actionsheet.Item onPress={() => handleLanguageChange('kiswahili')}>
            {t('Kiswahili')}
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});

export default HomeComponent;