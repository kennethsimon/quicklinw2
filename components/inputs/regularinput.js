import {Box, Input, Text} from 'native-base';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

const Regularinput = ({
  placeholder,
  password,
  onChangeText,
  value,
  secureTextEntry = false,
  isInvalid = false,
  errorMessage = '',
  keyboardType = 'default',
  InputRightElement = null,
  helperText = null,
}) => {
  const {t} = useTranslation();
  return (
    <Box alignItems="center">
      <Input
        w={'100%'}
        // InputLeftElement={<Text style={styles.leftelement}>{placeholder}</Text>}
        placeholder={t(`${placeholder}`)}
        onChangeText={onChangeText}
        value={value}
        secureTextEntry={secureTextEntry}
        isInvalid={isInvalid}
        keyboardType={keyboardType}
        InputRightElement={InputRightElement}
        autoCapitalize='none'
        variant={'filled'}
        size="lg"
        my={2}
        style={styles.input}
      />
      {helperText && !isInvalid && (
        <View style={styles.errorcontainer}>
          <Text textAlign={'left'} color="#888">
          {t(`${helperText}`)}
          </Text>
        </View>
      )}
      {isInvalid && (
        <View style={styles.errorcontainer}>
          <Text textAlign={'left'} color="#FF0000">
          {t(`${errorMessage}`)}
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

export default Regularinput;
