import {Box, IconButton, Input, Text} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import Materialicons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {useTranslation} from 'react-i18next';

const Datepicker = ({
  placeholder,
  onChangeText,
  value,
  isInvalid = false,
  errorMessage = '',
}) => {
  const [date, setDate] = useState(value || new Date());
  const [showPicker, setShowPicker] = useState(false);
  const {t} = useTranslation();

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === 'ios'); // Hide the picker for iOS after selecting a date
    onChangeText(currentDate);
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  useEffect(() => {
    setDate(value);
  }, [value]);
  return (
    <Box alignItems="center">
      <Input
        w={'100%'}
        placeholder={t(`${placeholder}`)}
        onChangeText={onChangeText}
        value={date ? moment(date).format('YYYY-MM-DD') : ''}
        onFocus={() => {
          setShowPicker(true);
        }}
        InputRightElement={
          <IconButton
            onPress={() => showDatePicker()}
            size={10}
            variant="ghost"
            _icon={{
              as: Materialicons,
              name: 'calendar',
              size: 7,
            }}
          />
        }
        variant={'filled'}
        size="lg"
        my={3}
        style={styles.input}
      />
      {showPicker && (
        <DateTimePicker
          value={date ? date : new Date()}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
        />
      )}
      {isInvalid && (
        <View style={styles.errorcontainer}>
          <Text textAlign={'left'} color="#FF0000">
            {t('errorMessage')}
          </Text>
        </View>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  errorcontainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {height: 50, backgroundColor: '#f1f4f9'},
  icon: {paddingRight: 10},
  leftelement: {
    alignContent: 'center',
    paddingLeft: 10,
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: 'grey',
  },
});

export default Datepicker;
